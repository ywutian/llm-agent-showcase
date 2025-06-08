// LLMSelfPlaySystemV3.jsx - AI vs AI Self-Play System
import React, { useState } from 'react';
import { Play, RotateCcw, Brain, AlertCircle } from 'lucide-react';
import { useLLMAPIEnhanced } from '../../hooks/useLLMAPIEnhanced';
import GameConfiguration from '../shared/GameConfiguration';
import ConversationLog from '../shared/ConversationLog';
import { AIThinkingIndicator } from '../LoadingSpinner';
import { createDefaultAPIConfig } from '../../utils/gameConfig';
import { 
  generateSecretNumber,
  compareGuess,
  calculateBinarySearchGuess,
  updateGuessingRange,
} from '../../utils/gameLogic';
import { GAME_CONFIG } from '../../utils/gameConfig';

const LLMSelfPlaySystemV3 = () => {
  const [apiConfig, setApiConfig] = useState(createDefaultAPIConfig());
  const [gameState, setGameState] = useState('idle');
  const [conversation, setConversation] = useState([]);
  const [gameData, setGameData] = useState({
    secretNumber: null,
    totalGuesses: 0,
    currentRange: { min: 1, max: 100 },
    gameResult: null
  });
  const [isThinking, setIsThinking] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('setup');
  
  const api = useLLMAPIEnhanced(apiConfig);

  const handleConfigChange = (key, value) => {
    setApiConfig(prev => ({ ...prev, [key]: value }));
  };

  const addToConversation = (sender, message, metadata = {}) => {
    const entry = {
      sender: sender === 'hider' ? 'ai' : sender === 'guesser' ? 'user' : sender,
      message,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        aiRole: sender === 'hider' ? '🎯 AI Hider' : sender === 'guesser' ? '🔍 AI Guesser' : undefined
      }
    };
    setConversation(prev => [...prev, entry]);
  };

  const generateAIMessage = async (role, gameContext = {}) => {
    if (!apiConfig.useRealAPI) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      if (role === 'hider-setup') {
        return `I've chosen a secret number between 1 and 100. Start guessing!`;
      } else if (role === 'guesser') {
        if (!gameContext.currentRange || typeof gameContext.currentRange.min === 'undefined') {
          console.error('gameContext.currentRange is undefined or invalid:', gameContext);
          return 'Error: Game range not properly initialized.';
        }
        
        if (gameContext.calculatedGuess) {
          return `${gameContext.calculatedGuess}`;
        }
        
        const { min, max } = gameContext.currentRange;
        const guessValue = calculateBinarySearchGuess(min, max);
        return `${guessValue}`;
      } else if (role === 'hider-feedback') {
        if (!gameContext.guess || !gameContext.secret) {
          console.error('gameContext missing guess or secret:', gameContext);
          return 'Error: Missing game information.';
        }
        
        const { guess: guessValue, secret } = gameContext;
        const result = compareGuess(guessValue, secret);
        
        if (result === GAME_CONFIG.FEEDBACK.CORRECT) {
          return `Correct!`;
        } else if (result === GAME_CONFIG.FEEDBACK.HIGHER) {
          return `Higher!`;
        } else if (result === GAME_CONFIG.FEEDBACK.LOWER) {
          return `Lower!`;
        } else {
          return `Error: Invalid comparison result`;
        }
      }
    } else {
      const systemPrompts = {
        'hider-setup': `You are the HIDER. Say: "I've chosen a secret number between 1 and 100. Start guessing!" Keep it brief.`,
        'guesser': `You are the GUESSER. Current range: ${gameContext?.currentRange?.min || 1} to ${gameContext?.currentRange?.max || 100}. Respond with ONLY the number you want to guess. No explanation needed.`,
        'hider-feedback': `You are the HIDER. Secret: ${gameContext?.secret}. Guess: ${gameContext?.guess}. 
        
        Respond with ONLY one word:
        - If guess < secret: respond "Higher!"
        - If guess > secret: respond "Lower!"  
        - If guess = secret: respond "Correct!"
        
        Keep it simple - just one word.`
      };
      
      try {
        const messages = [{ role: 'user', content: 'Please respond according to your role.' }];
        const result = await api.callRealLLMAPI(messages, systemPrompts[role]);
        let content = result.content.trim();
        
        if (role === 'guesser') {
          const numberMatch = content.match(/\b(\d{1,3})\b/);
          if (numberMatch) {
            content = numberMatch[1];
          }
        } else if (role === 'hider-feedback') {
          const guess = gameContext?.guess;
          const secret = gameContext?.secret;
          
          if (content.toLowerCase().includes('correct')) {
            content = 'Correct!';
          } else if (content.toLowerCase().includes('higher') || content.toLowerCase().includes('bigger') || content.toLowerCase().includes('more')) {
            content = `Higher!`;
          } else if (content.toLowerCase().includes('lower') || content.toLowerCase().includes('smaller') || content.toLowerCase().includes('less')) {
            content = `Lower!`;
          } else {
            // Fallback to logical comparison if API response is unclear
            const result = compareGuess(guess, secret);
            if (result === GAME_CONFIG.FEEDBACK.HIGHER) {
              content = `Higher!`;
            } else if (result === GAME_CONFIG.FEEDBACK.LOWER) {
              content = `Lower!`;
            } else {
              content = 'Correct!';
            }
          }
        }
        
        return content;
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }
  };

  const startSelfPlayGame = async () => {
    setGameState('playing');
    setConversation([]);
    setIsThinking(false);
    setCurrentPlayer('setup');
    
    const secret = generateSecretNumber();
    const initialGameData = {
      secretNumber: secret,
      totalGuesses: 0,
      currentRange: { min: 1, max: 100 },
      gameResult: null
    };
    setGameData(initialGameData);

    setTimeout(() => {
      playGameTurn('hider-setup', initialGameData);
    }, 500);
  };

  const playGameTurn = async (playerRole, currentGameData) => {
    setIsThinking(true);
    setCurrentPlayer(playerRole);

    try {
      if (!currentGameData) {
        throw new Error('Game data is missing');
      }

      if (playerRole === 'hider-setup') {
        const message = await generateAIMessage('hider-setup', { 
          secretNumber: currentGameData.secretNumber 
        });
        addToConversation('hider', message, { phase: 'setup' });
        
        setIsThinking(false);
        setTimeout(() => {
          playGameTurn('guesser', currentGameData);
        }, 1500);

      } else if (playerRole === 'guesser') {
        const currentRange = currentGameData.currentRange || { min: 1, max: 100 };
        const guessValue = calculateBinarySearchGuess(currentRange.min, currentRange.max);
        
        const message = await generateAIMessage('guesser', { currentRange, calculatedGuess: guessValue });
        addToConversation('guesser', message, { guess: guessValue, phase: 'guess' });
        
        const updatedGameData = {
          ...currentGameData,
          totalGuesses: currentGameData.totalGuesses + 1,
          lastGuess: guessValue,
          currentRange
        };
        setGameData(updatedGameData);
        
        const result = compareGuess(guessValue, currentGameData.secretNumber);
        
        setIsThinking(false);
        setTimeout(() => {
          playGameTurn('hider-feedback', { 
            ...updatedGameData, 
            lastGuess: guessValue, 
            guessResult: result 
          });
        }, 1500);

      } else if (playerRole === 'hider-feedback') {
        const { lastGuess, guessResult } = currentGameData;
        
        if (!lastGuess || !guessResult) {
          throw new Error('Missing guess or result data');
        }
        
        const message = await generateAIMessage('hider-feedback', { 
          guess: lastGuess, 
          secret: currentGameData.secretNumber 
        });
        
        addToConversation('hider', message, { 
          feedback: guessResult,
          phase: 'feedback' 
        });

        if (guessResult === GAME_CONFIG.FEEDBACK.CORRECT) {
          const finalGameData = { ...currentGameData, gameResult: 'success' };
          setGameData(finalGameData);
          setGameState('finished');
          setIsThinking(false);
          return;
        }

        const newRange = updateGuessingRange(
          currentGameData.currentRange || { min: 1, max: 100 }, 
          lastGuess, 
          guessResult
        );

        if (newRange.isError) {
          throw new Error(newRange.errorMessage);
        }

        const updatedGameData = { ...currentGameData, currentRange: newRange };
        setGameData(updatedGameData);

        setIsThinking(false);
        setTimeout(() => {
          playGameTurn('guesser', updatedGameData);
        }, 1500);
      }

    } catch (error) {
      console.error('Game turn failed:', error);
      setIsThinking(false);
      addToConversation('system', `Error: ${error.message}`, { error: true });
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setConversation([]);
    setGameData({
      secretNumber: null,
      totalGuesses: 0,
      currentRange: { min: 1, max: 100 },
      gameResult: null
    });
    setIsThinking(false);
    setCurrentPlayer('setup');
    
    if (api.clearError) {
      api.clearError();
    }
  };

  const getThinkingMessage = () => {
    switch (currentPlayer) {
      case 'hider-setup':
        return "🎯 AI Hider is setting up the game...";
      case 'guesser':
        return "🔍 AI Guesser is thinking of a number...";
      case 'hider-feedback':
        return "🎯 AI Hider is evaluating the guess...";
      default:
        return apiConfig.useRealAPI 
          ? `Real ${apiConfig.model} is thinking...` 
          : "AI is thinking...";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🧠 AI vs AI Self-Play System
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Watch Two AI Agents Play the Number Game Autonomously
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={startSelfPlayGame}
              disabled={api.isProcessing || gameState === 'playing'}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              {gameState === 'playing' ? 'AI Game Running...' : 'Start AI vs AI Game'}
            </button>
            
            <button
              onClick={resetGame}
              disabled={api.isProcessing || isThinking}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        <GameConfiguration 
          config={apiConfig}
          onConfigChange={handleConfigChange}
          apiStatus={api.getAPIStatus()}
          showAdvancedSettings={true}
          variant="v3"
          gameData={{
            ...gameData,
            useRealAPI: apiConfig.useRealAPI,
            guessCount: gameData.totalGuesses,
            currentRole: 'self-play'
          }}
          conversation={conversation}
          gameState={gameState}
        />

        {gameState === 'idle' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
              <Brain className="w-7 h-7 text-indigo-600" />
              How AI Self-Play Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Hider</h4>
                <p className="text-sm text-gray-600">Chooses a secret number and provides feedback</p>
              </div>

              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔍</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Guesser</h4>
                <p className="text-sm text-gray-600">Uses binary search strategy to find the number</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <p className="text-center text-emerald-800 font-medium text-sm">
                <strong>Intelligent Communication:</strong> Two AI agents interact naturally using optimized strategies and clear feedback mechanisms to solve the number guessing challenge efficiently.
              </p>
            </div>
          </div>
        )}

        {(isThinking || api.isProcessing) && (
          <div className="mb-6">
            <AIThinkingIndicator message={getThinkingMessage()} />
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

        {gameState === 'playing' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <h4 className="font-semibold mb-2 text-cyan-800 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              🎮 Live Game Status
            </h4>
            <div className="text-sm text-cyan-700 space-y-1">
              <p>Secret Number: <strong className="text-red-600">#{gameData.secretNumber}</strong> (Debug Info)</p>
              <p>Current Turn: <strong>{
                currentPlayer === 'hider-setup' ? '🎯 AI Hider (Setup)' :
                currentPlayer === 'guesser' ? '🔍 AI Guesser (Guessing)' :
                currentPlayer === 'hider-feedback' ? '🎯 AI Hider (Feedback)' :
                'Processing...'
              }</strong></p>
              <p>Search Range: <strong>[{gameData.currentRange.min}, {gameData.currentRange.max}]</strong></p>
              <p>Guesses Made: <strong>{gameData.totalGuesses}</strong></p>
              <p className="text-xs mt-1 text-green-600 font-medium">
                Mode: {apiConfig.useRealAPI ? `Real ${apiConfig.model} API` : 'Enhanced Simulation'}
              </p>
            </div>
          </div>
        )}

        {conversation.length > 0 && (
          <ConversationLog 
            conversation={conversation}
            variant="v3"
            title="🤖 AI vs AI Live Conversation"
            isThinking={isThinking || api.isProcessing}
            thinkingMessage={getThinkingMessage()}
            currentPlayer={currentPlayer}
            showTimestamps={true}
            maxHeight={480}
          />
        )}

{gameState === 'finished' && (
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-lg mb-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">🎉 AI Self-Play Complete!</h3>
            <p className="text-lg text-gray-600">
              Secret number was <strong>{gameData.secretNumber}</strong>, found in <strong>{gameData.totalGuesses}</strong> guesses
            </p>
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 shadow-xl">
          <h4 className="font-bold text-indigo-800 mb-5 text-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            System Features
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Autonomous AI Communication</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Natural Language Processing</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Binary Search Algorithm</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Real API Integration</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Enhanced Simulation Mode</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Dynamic State Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMSelfPlaySystemV3;