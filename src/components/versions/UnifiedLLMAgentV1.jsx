import React, { useState } from 'react';
import { RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { useLLMAPIEnhanced } from '../../hooks/useLLMAPIEnhanced';
import GameConfiguration from '../shared/GameConfiguration';
import ConversationLog from '../shared/ConversationLog';
import { TextInput } from '../shared/GameInput';
import { AIThinkingIndicator } from '../LoadingSpinner';
import { createDefaultAPIConfig } from '../../utils/gameConfig';
import { 
  getUnifiedPrompt, 
  parseUserFeedback
} from '../../utils/promptEngineering';
import { 
  compareGuess, 
  updateGuessingRange,
  calculateBinarySearchGuess
} from '../../utils/gameLogic';
import { extractSecretNumber } from '../../utils/aiHelpers';

const UnifiedLLMAgentV1 = () => {
  const [apiConfig, setApiConfig] = useState(createDefaultAPIConfig());
  
  const {
    gameState,
    conversation,
    isThinking,
    gameData,
    startGame,
    resetGame,
    addToConversation,
    updateGuesserState,
    incrementGuessCount,
    endGame,
    setAIThinking
  } = useGameState();

  const api = useLLMAPIEnhanced(apiConfig);

  const handleConfigChange = (key, value) => {
    setApiConfig(prev => ({ ...prev, [key]: value }));
  };

  // Unified response generation for all four modes
  const generateResponse = async (userMessage, role, gameData) => {
    try {
      if (apiConfig.useRealAPI) {
        return await callRealAPI(userMessage, role, gameData);
      } else {
        return simulateResponse(userMessage, role, gameData);
      }
    } catch (error) {
      console.error('generateResponse error:', error);
      return "Sorry, I encountered an error. Please try again.";
    }
  };

  // Real API call handler
  const callRealAPI = async (userMessage, role, gameData) => {
    const systemPrompt = getUnifiedPrompt(role);
    let contextMessage = userMessage;

    if (role === 'hider') {
      const guessMatch = userMessage.match(/(\d+)/);
      if (guessMatch) {
        const userGuess = parseInt(guessMatch[1]);
        const secretNumber = gameData.secretNumber;
        
        console.log(`Hider API Context - Secret: ${secretNumber}, User Guess: ${userGuess}`);
        
        contextMessage = `You are the HIDER in a number guessing game. 

CRITICAL GAME STATE:
- Your secret number is: ${secretNumber}
- User just guessed: ${userGuess}

RULES - You MUST respond with EXACTLY one of these:
- If ${userGuess} < ${secretNumber}: Respond "Higher!"
- If ${userGuess} > ${secretNumber}: Respond "Lower!" 
- If ${userGuess} = ${secretNumber}: Respond "Correct! Congratulations, you got it!"

Current comparison:
- User guess ${userGuess} compared to secret ${secretNumber}
- Mathematical result: ${userGuess < secretNumber ? `${userGuess} < ${secretNumber}, so respond "Higher!"` : userGuess > secretNumber ? `${userGuess} > ${secretNumber}, so respond "Lower!"` : `${userGuess} = ${secretNumber}, so respond "Correct!"`}

Respond with ONLY the appropriate feedback, nothing else.`;
      } else {
        contextMessage = `You are the HIDER. Your secret number is ${gameData.secretNumber}. The user hasn't made a numeric guess yet. Encourage them to start guessing a number between 1-100.`;
      }
    } else if (role === 'guesser') {
      const { currentRange, lastGuess } = gameData.guesserState;
      
      contextMessage = `I am the GUESSER in this game. I need to guess the user's secret number using binary search.
      
Current situation:
- My search range: [${currentRange.min}, ${currentRange.max}]
- My last guess: ${lastGuess || 'None yet'}
- User's feedback to my guess: "${userMessage}"

I must:
1. Interpret the user's feedback ("${userMessage}")
2. Update my search range accordingly
3. Make my next guess using binary search strategy
4. Respond in format: "My current range is [min, max]. I guess [number]."

Do NOT provide feedback like "Higher!" or "Lower!" - I am the one making guesses, not giving feedback.`;
    }

    const messages = [{ role: 'user', content: contextMessage }];
    const result = await api.callRealLLMAPI(messages, systemPrompt);
    
    return result.content || "I couldn't generate a response. Please try again.";
  };

  // Simulation response handler
  const simulateResponse = (userMessage, role, gameData) => {
    if (role === 'hider') {
      return simulateHiderResponse(userMessage, gameData);
    } else if (role === 'guesser') {
      return simulateGuesserResponse(userMessage, gameData);
    }
    return "I'm not sure how to respond to that. Please try again.";
  };

  // Hider simulation
  const simulateHiderResponse = (userMessage, gameData) => {
    const guessMatch = userMessage.match(/(\d+)/);
    if (guessMatch) {
      const guess = parseInt(guessMatch[1]);
      const secret = gameData.secretNumber;
      const result = compareGuess(guess, secret);
      
      switch (result) {
        case 'correct':
          return 'Correct! Congratulations, you got it!';
        case 'higher':
          return 'Higher!';
        case 'lower':
          return 'Lower!';
        default:
          return 'Please guess a number between 1 and 100.';
      }
    }
    return "I've chosen a secret number between 1-100. Start guessing!";
  };

  // Guesser simulation
  const simulateGuesserResponse = (userMessage, gameData) => {
    const feedbackResult = parseUserFeedback(userMessage);
    
    if (feedbackResult.type === 'success') {
      return 'Awesome! I guessed it right! Game over.';
    }
    
    if (feedbackResult.type === 'unclear') {
      return "I didn't quite understand your feedback. Please tell me: should I guess higher, lower, or is it correct?";
    }
    
    const { currentRange, lastGuess } = gameData.guesserState;
    const newRange = updateGuessingRange(currentRange, lastGuess, feedbackResult.feedback);
    
    if (newRange.min > newRange.max) {
      return "Seems like there's a logic error, please restart the game.";
    }
    
    const nextGuess = calculateBinarySearchGuess(newRange.min, newRange.max);
    return `Okay, need to go ${feedbackResult.feedback}. My current guessing range is [${newRange.min}, ${newRange.max}]. I guess ${nextGuess}.`;
  };

  // User input handler
  const handleUserInput = async (userMessage) => {
    if (isThinking || gameState === 'finished' || api.isProcessing) return;
    
    console.log('User input:', userMessage);
    addToConversation('user', userMessage);
    setAIThinking(true);
    
    try {
      const response = await generateResponse(userMessage, gameData.currentRole, gameData);
      
      console.log('AI response:', response);
      setAIThinking(false);
      
      if (response && typeof response === 'string') {
        addToConversation('ai', response);
        
        await handleStateUpdates(userMessage, response, gameData.currentRole);
        
        // Check if game ended
        if (response.includes('Correct! Congratulations') || 
            response.includes('Awesome! I guessed it right!')) {
          setTimeout(() => endGame(), 1000);
        }
      } else {
        console.error('Invalid response:', response);
        addToConversation('ai', 'Sorry, I encountered an issue generating a response. Please try again.');
      }
      
    } catch (error) {
      console.error('AI response failed:', error);
      setAIThinking(false);
      addToConversation('ai', 'Sorry, I encountered some issues. Please restart the game.');
    }
  };

  // State update handler
  const handleStateUpdates = async (userMessage, aiResponse, role) => {
    try {
      if (role === 'hider') {
        const guessMatch = userMessage.match(/(\d+)/);
        if (guessMatch) {
          incrementGuessCount();
        }
      } else if (role === 'guesser') {
        const feedbackResult = parseUserFeedback(userMessage);
        
        if (feedbackResult.type === 'feedback') {
          let nextGuess = null;
          
          if (apiConfig.useRealAPI) {
            nextGuess = extractSecretNumber(aiResponse);
          }
          
          if (!nextGuess) {
            const { currentRange, lastGuess } = gameData.guesserState;
            const newRange = updateGuessingRange(currentRange, lastGuess, feedbackResult.feedback);
            nextGuess = calculateBinarySearchGuess(newRange.min, newRange.max);
            
            updateGuesserState(newRange, nextGuess);
          } else {
            const { currentRange, lastGuess } = gameData.guesserState;
            const newRange = updateGuessingRange(currentRange, lastGuess, feedbackResult.feedback);
            updateGuesserState(newRange, nextGuess);
          }
          
          incrementGuessCount();
        }
      }
    } catch (error) {
      console.error('State update error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🧠 Unified AI Agent System V1
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Advanced number guessing game with dual AI modes and real API integration
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              disabled={isThinking || api.isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </button>
          </div>
        </div>

        <GameConfiguration 
          config={apiConfig}
          onConfigChange={handleConfigChange}
          apiStatus={api.getAPIStatus()}
          showAdvancedSettings={true}
          variant="v1"
          gameData={{
            ...gameData,
            useRealAPI: apiConfig.useRealAPI
          }}
          conversation={conversation}
          gameState={gameState}
        />

        {gameState === 'idle' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" />
              Choose Game Mode
            </h3>
            <p className="text-center text-gray-600 mb-6">Select how you want to interact with the AI agent:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300 group"
                onClick={() => startGame('hider')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-all">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">AI Hides Number</h4>
                  <p className="text-gray-600 text-sm mb-4">AI will think of a number between 1-100, and you guess it using natural language</p>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-700">
                      {apiConfig.useRealAPI ? `Real ${apiConfig.model} responses` : 'Enhanced simulation'} with "Higher!" or "Lower!" hints
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-300 group"
                onClick={() => startGame('guesser')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">AI Guesses Number</h4>
                  <p className="text-gray-600 text-sm mb-4">You think of a number, AI uses binary search with natural language feedback</p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      Tell AI "higher", "lower", "correct", etc. - {apiConfig.useRealAPI ? `Real ${apiConfig.model}` : 'Smart simulation'} with improved accuracy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(isThinking || api.isProcessing) && (
          <div className="mb-6">
            <AIThinkingIndicator 
              message={apiConfig.useRealAPI 
                ? `Real ${apiConfig.model} is analyzing natural language...` 
                : "Enhanced AI is analyzing natural language and formulating response..."
              } 
            />
          </div>
        )}

        {api.apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">API Error:</span>
              <span>{api.apiError}</span>
            </div>
          </div>
        )}

        {gameData.currentRole === 'guesser' && gameData.guesserState?.currentRange && (
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <h4 className="font-semibold mb-2 text-cyan-800">🔍 AI Guesser Status (Binary Search with NLP)</h4>
            <div className="text-sm text-cyan-700">
              <p>Current Search Range: [{gameData.guesserState.currentRange.min}, {gameData.guesserState.currentRange.max}]</p>
              {gameData.guesserState.lastGuess && (
                <p>Last Guess: {gameData.guesserState.lastGuess}</p>
              )}
              <p className="text-xs mt-1 text-green-600 font-medium">
                Mode: {apiConfig.useRealAPI ? `Real ${apiConfig.model} API` : 'Enhanced Simulation'} - All 4 modes working
              </p>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            {gameData.currentRole === 'guesser' && conversation.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">
                  🎯 Give feedback using natural language:
                  <span className="block mt-1">
                    <strong>Examples:</strong> "higher", "lower", "go higher", "go lower", "you got it!", "correct!", "right!", etc.
                  </span>
                </p>
              </div>
            )}
            
            {gameData.currentRole === 'hider' && conversation.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-700 text-sm font-medium">
                  🎯 Type your number guess below. AI will respond with "Higher!", "Lower!", or "Correct!"
                </p>
              </div>
            )}

            <ConversationLog 
              conversation={conversation}
              variant="v1"
              title="AI Conversation"
              isThinking={isThinking || api.isProcessing}
            />

            <TextInput
              onSubmit={handleUserInput}
              disabled={isThinking || api.isProcessing || gameState === 'finished'}
              placeholder={gameData.currentRole === 'hider' ? "Enter your guess..." : "Enter feedback (e.g., 'higher', 'correct', 'lower')..."}
              variant="v1"
            />
          </div>
        )}

        {gameState === 'finished' && (
          <div className="mt-8 text-center p-8 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 Game Complete!</h3>
            <p className="text-xl text-gray-700 mb-2">
              The AI agent as <strong>{gameData.currentRole === 'hider' ? 'Hider' : 'Guesser'}</strong> successfully completed the game!
            </p>
            <p className="text-lg text-gray-600">
              Total of <strong>{gameData.guessCount}</strong> guesses made
            </p>
          </div>
        )}

<div className="mt-8 p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200 shadow-xl">
          <h4 className="font-bold text-purple-800 mb-5 text-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            System Features
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-purple-800 font-medium">Unified Architecture</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-purple-800 font-medium">Natural Language Processing</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-purple-800 font-medium">Binary Search Algorithm</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-purple-800 font-medium">Real API Integration</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-purple-800 font-medium">Enhanced Simulation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-purple-800 font-medium">State Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLLMAgentV1;