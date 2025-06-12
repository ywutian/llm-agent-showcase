// import React, { useState, useCallback, useRef } from 'react';
// import { RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
// import { useGameState } from '../../hooks/useGameState';
// import { useLLMAPIEnhanced } from '../../hooks/useLLMAPIEnhanced';
// import GameConfiguration from '../shared/GameConfiguration';
// import ConversationLog from '../shared/ConversationLog';
// import { TextInput } from '../shared/GameInput';
// import { AIThinkingIndicator } from '../LoadingSpinner';
// import { createDefaultAPIConfig } from '../../utils/gameConfig';
// import { 
//   getButtonPrompt, 
//   getUnifiedPrompt 
// } from '../../utils/promptEngineering';
// import { compareGuess, validateGameState } from '../../utils/gameLogic';

// const UnifiedLLMAgentV2 = () => {
//   const [apiConfig, setApiConfig] = useState(createDefaultAPIConfig());
  
//   // 🔧 修复：使用 useRef 防止状态更新竞态
//   const processingRef = useRef(false);
  
//   const {
//     gameState,
//     conversation,
//     isThinking,
//     gameData,
//     startGame,
//     resetGame,
//     addToConversation,
//     updateGuesserState,
//     incrementGuessCount,
//     endGame,
//     setAIThinking,
//     processGuesserFeedback
//   } = useGameState();

//   const api = useLLMAPIEnhanced(apiConfig);

//   const handleConfigChange = useCallback((key, value) => {
//     setApiConfig(prev => ({ ...prev, [key]: value }));
//   }, []);

//   // Enhanced number extraction function
//   const enhancedExtractSecretNumber = (content) => {
//     if (!content || typeof content !== 'string') {
//       console.log("❌ Invalid content for extraction:", typeof content, content);
//       return null;
//     }
    
//     console.log("🔍 Analyzing API response for number extraction:");
//     console.log("📄 Content preview:", content.substring(0, 200) + (content.length > 200 ? '...' : ''));
    
//     // Pattern 1: "I guess [number]" or "My guess is [number]"
//     let match = content.match(/(?:I guess|my guess is|我猜|猜测?)\s*(\d+)/i);
//     if (match) {
//       const num = parseInt(match[1]);
//       if (num >= 1 && num <= 100) {
//         console.log("✅ Pattern 1 match (guess statement):", num);
//         return num;
//       }
//     }
    
//     // Pattern 2: "guess [number]" or "guessing [number]"
//     match = content.match(/(?:guess|guessing)\s*(\d+)/i);
//     if (match) {
//       const num = parseInt(match[1]);
//       if (num >= 1 && num <= 100) {
//         console.log("✅ Pattern 2 match (guess verb):", num);
//         return num;
//       }
//     }
    
//     // Pattern 3: Range format [xx, yy]. xxx or [xx, yy], xxx
//     match = content.match(/\[(\d+)[,\s]+(\d+)\][.,\s]*(\d+)/);
//     if (match) {
//       const num = parseInt(match[3]);
//       if (num >= 1 && num <= 100) {
//         console.log("✅ Pattern 3 match (after range):", num);
//         return num;
//       }
//     }
    
//     // Pattern 4: "next guess" related
//     match = content.match(/(?:next guess|下一个?猜测?)[\s:-]*(\d+)/i);
//     if (match) {
//       const num = parseInt(match[1]);
//       if (num >= 1 && num <= 100) {
//         console.log("✅ Pattern 4 match (next guess):", num);
//         return num;
//       }
//     }
    
//     // Pattern 5: Number at end of sentence
//     match = content.match(/(\d+)[.!]*\s*$/);
//     if (match) {
//       const num = parseInt(match[1]);
//       if (num >= 1 && num <= 100) {
//         console.log("✅ Pattern 5 match (end of sentence):", num);
//         return num;
//       }
//     }
    
//     // Pattern 6: All 1-100 numbers, take the last one
//     const numbers = content.match(/\b(\d{1,2})\b/g);
//     if (numbers) {
//       console.log("🔍 All numbers found:", numbers);
//       // Find the last valid number in 1-100 range
//       for (let i = numbers.length - 1; i >= 0; i--) {
//         const num = parseInt(numbers[i]);
//         if (num >= 1 && num <= 100) {
//           console.log("✅ Pattern 6 match (last valid number):", num);
//           return num;
//         }
//       }
//     }
    
//     console.log("❌ No valid number extracted from API response");
//     return null;
//   };

//   // Hider response generation with full API support
//   const generateHiderResponse = async (userMessage, gameData) => {
//     if (!apiConfig.useRealAPI) {
//       // Simulation mode
//       await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
//       const guessMatch = userMessage.match(/(\d+)/);
//       if (guessMatch) {
//         const guess = parseInt(guessMatch[1]);
//         const secret = gameData.secretNumber;
//         const result = compareGuess(guess, secret);
        
//         switch (result) {
//           case 'correct':
//             return 'Correct! Congratulations, you got it!';
//           case 'higher':
//             return 'Higher!';
//           case 'lower':
//             return 'Lower!';
//           default:
//             return 'Please guess a number between 1 and 100.';
//         }
//       }
//       return 'Please guess a number between 1 and 100.';
//     } else {
//       // Real API mode
//       try {
//         const guessMatch = userMessage.match(/(\d+)/);
//         if (guessMatch) {
//           const userGuess = parseInt(guessMatch[1]);
//           const secretNumber = gameData.secretNumber;
          
//           console.log(`🎯 V2 Hider API Context - Secret: ${secretNumber}, User Guess: ${userGuess}`);
          
//           const systemPrompt = getUnifiedPrompt('hider');
//           const contextMessage = `You are the HIDER in a number guessing game. 

// CRITICAL GAME STATE:
// - Your secret number is: ${secretNumber}
// - User just guessed: ${userGuess}

// RULES - You MUST respond with EXACTLY one of these:
// - If ${userGuess} < ${secretNumber}: Respond "Higher!"
// - If ${userGuess} > ${secretNumber}: Respond "Lower!" 
// - If ${userGuess} = ${secretNumber}: Respond "Correct! Congratulations, you got it!"

// Current comparison:
// - User guess ${userGuess} compared to secret ${secretNumber}
// - Mathematical result: ${userGuess < secretNumber ? `${userGuess} < ${secretNumber}, so respond "Higher!"` : userGuess > secretNumber ? `${userGuess} > ${secretNumber}, so respond "Lower!"` : `${userGuess} = ${secretNumber}, so respond "Correct!"`}

// Respond with ONLY the appropriate feedback, nothing else.`;

//           const messages = [{ role: 'user', content: contextMessage }];
//           const result = await api.callRealLLMAPI(messages, systemPrompt);
          
//           return result.content || "I couldn't generate a response. Please try again.";
//         } else {
//           const systemPrompt = getUnifiedPrompt('hider');
//           const contextMessage = `You are the HIDER. Your secret number is ${gameData.secretNumber}. The user hasn't made a numeric guess yet. Encourage them to start guessing a number between 1-100.`;
          
//           const messages = [{ role: 'user', content: contextMessage }];
//           const result = await api.callRealLLMAPI(messages, systemPrompt);
          
//           return result.content || "Please guess a number between 1 and 100.";
//         }
//       } catch (error) {
//         console.error('V2 Hider API error:', error);
//         return 'Sorry, I encountered an API error. Please try again.';
//       }
//     }
//   };

//   // Guesser response generation with full API support
//   const generateGuesserResponse = async (buttonFeedback, gameData) => {
//     if (!apiConfig.useRealAPI) {
//       // Simulation mode - use processGuesserFeedback hook
//       const result = processGuesserFeedback(gameData, buttonFeedback);
      
//       if (result.error) {
//         return { error: true, response: result.response };
//       }
      
//       if (result.shouldEndGame) {
//         return { shouldEndGame: true, response: 'Awesome! I guessed it right! Game over.' };
//       }
      
//       if (result.newRange && result.nextGuess) {
//         return {
//           newRange: result.newRange,
//           nextGuess: result.nextGuess,
//           response: `Got it, need to go ${buttonFeedback.toLowerCase()}. My current range is [${result.newRange.min}, ${result.newRange.max}]. I guess ${result.nextGuess}.`
//         };
//       }
      
//       return { error: true, response: 'Something went wrong with my calculation. Please restart the game.' };
//     } else {
//       // Real API mode
//       try {
//         const { currentRange, lastGuess } = gameData.guesserState;
        
//         const systemPrompt = getButtonPrompt('guesser');
//         const contextMessage = `I am the GUESSER in this game using binary search strategy.

// Current situation:
// - My search range: [${currentRange.min}, ${currentRange.max}]
// - My last guess: ${lastGuess || 'None yet'}
// - User clicked button: "${buttonFeedback}"

// Button meanings:
// - "Higher" means: The secret number is HIGHER than my last guess
// - "Lower" means: The secret number is LOWER than my last guess  
// - "Correct" means: My last guess was exactly right

// I must:
// 1. Update my search range based on the button feedback
// 2. Calculate my next guess using binary search (middle of new range)
// 3. Respond in format: "Got it, need to go [direction]. My current range is [min, max]. I guess [number]."

// Process the "${buttonFeedback}" button click and give me your next guess.`;

//         const messages = [{ role: 'user', content: contextMessage }];
//         const result = await api.callRealLLMAPI(messages, systemPrompt);
        
//         console.log('🔍 Full API Result Object:', {
//           success: result.success,
//           content: result.content,
//           contentLength: result.content?.length,
//           contentType: typeof result.content,
//           metadata: result.metadata
//         });
        
//         if (!result.content) {
//           return { error: true, response: "I couldn't generate a response. Please try again." };
//         }

//         // Extract next guess from API response
//         const extractedNumber = enhancedExtractSecretNumber(result.content);
        
//         if (extractedNumber && buttonFeedback !== 'Correct') {
//           // Use local logic to calculate correct range, but use API's guess
//           const localResult = processGuesserFeedback(gameData, buttonFeedback);
          
//           if (localResult.error) {
//             return { error: true, response: localResult.response };
//           }
          
//           return {
//             newRange: localResult.newRange,
//             nextGuess: extractedNumber,
//             response: result.content
//           };
//         } else if (buttonFeedback === 'Correct') {
//           return { shouldEndGame: true, response: result.content };
//         } else {
//           // If can't extract number, fallback to local logic
//           console.warn('⚠️  Could not extract number from API response, using local logic as fallback');
//           console.log('📄 Full API Response was:', JSON.stringify(result, null, 2));
          
//           // Use local logic directly, avoid infinite recursion
//           const localResult = processGuesserFeedback(gameData, buttonFeedback);
          
//           if (localResult.error) {
//             return { error: true, response: localResult.response };
//           }
          
//           if (localResult.shouldEndGame) {
//             return { shouldEndGame: true, response: 'Awesome! I guessed it right! Game over.' };
//           }
          
//           if (localResult.newRange && localResult.nextGuess) {
//             return {
//               newRange: localResult.newRange,
//               nextGuess: localResult.nextGuess,
//               response: `Got it, need to go ${buttonFeedback.toLowerCase()}. My current range is [${localResult.newRange.min}, ${localResult.newRange.max}]. I guess ${localResult.nextGuess}. (Using local fallback logic)`
//             };
//           }
          
//           return { error: true, response: 'Something went wrong with the calculation. Please restart the game.' };
//         }
        
//       } catch (error) {
//         console.error('V2 Guesser API error:', error);
//         return { error: true, response: 'Sorry, I encountered an API error. Please try again.' };
//       }
//     }
//   };

//   const handleTextInput = async (userMessage) => {
//     if (processingRef.current || isThinking || gameState === 'finished' || api.isProcessing || gameData.currentRole !== 'hider') return;
    
//     processingRef.current = true;
//     console.log('👤 User guess input:', userMessage);
//     addToConversation('user', userMessage);
//     setAIThinking(true);
    
//     try {
//       const response = await generateHiderResponse(userMessage, gameData);
      
//       setAIThinking(false);
//       console.log('🤖 AI response:', response);
//       addToConversation('ai', response);
      
//       if (response.includes('Correct! Congratulations')) {
//         setTimeout(() => {
//           if (!processingRef.current) return; // 防止重复触发
//           endGame();
//         }, 1000);
//       }
      
//       if (userMessage.match(/(\d+)/)) {
//         incrementGuessCount();
//       }
      
//     } catch (error) {
//       console.error('❌ AI response failed:', error);
//       setAIThinking(false);
//       addToConversation('ai', 'Sorry, I encountered some issues. Please restart the game.');
//     } finally {
//       processingRef.current = false;
//     }
//   };

//   const handleButtonInput = async (buttonFeedback) => {
//     console.log('🎮 Button clicked:', buttonFeedback);
//     console.log('Current gameData before processing:', gameData);
    
//     if (gameState !== 'playing') {
//       console.error('❌ Game is not in playing state');
//       return;
//     }
    
//     if (processingRef.current || isThinking || gameState === 'finished' || api.isProcessing) {
//       console.log('❌ Button click blocked due to state');
//       return;
//     } 
    
//     processingRef.current = true;
//     console.log('✅ Processing button feedback:', buttonFeedback);
//     addToConversation('user', buttonFeedback);
//     setAIThinking(true);
    
//     try {
//       const result = await generateGuesserResponse(buttonFeedback, gameData);
//       console.log('V2 generateGuesserResponse result:', result);
      
//       if (result.error) {
//         setAIThinking(false);
//         addToConversation('ai', result.response);
//         return;
//       }

//       if (result.shouldEndGame) {
//         setAIThinking(false);
//         addToConversation('ai', result.response);
//         setTimeout(() => {
//           if (!processingRef.current) return; // 防止重复触发
//           endGame();
//         }, 1000);
//         return;
//       }

//       if (result.newRange && result.nextGuess) {
//         console.log('V2 Updating guesser state with:', result.newRange, result.nextGuess);
        
//         updateGuesserState(result.newRange, result.nextGuess);
        
//         setAIThinking(false);
//         console.log('🤖 V2 AI response:', result.response);
//         addToConversation('ai', result.response);
        
//         incrementGuessCount();
//       } else {
//         setAIThinking(false);
//         console.log('🤖 V2 AI response (fallback):', result.response);
//         addToConversation('ai', result.response);
//         incrementGuessCount();
//       }
      
//     } catch (error) {
//       console.error('❌ Button feedback failed:', error);
//       setAIThinking(false);
//       addToConversation('ai', 'Sorry, I encountered some issues. Please restart the game.');
//     } finally {
//       processingRef.current = false;
//     }
//   };

//   // 🔧 修复：清理函数，防止内存泄漏
//   React.useEffect(() => {
//     return () => {
//       processingRef.current = false;
//     };
//   }, []);

//   // 🔧 修复：游戏状态验证  
//   React.useEffect(() => {
//     if (gameData.currentRole === 'guesser' && gameState === 'playing') {
//       try {
//         const validation = validateGameState(gameData);
//         if (!validation.isValid) {
//           console.warn('Game state validation failed:', validation.errors);
//         }
//       } catch (error) {
//         console.warn('Game state validation error:', error);
//       }
//     }
//   }, [gameData, gameState]);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
//       <div className="bg-white rounded-3xl shadow-2xl p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
//             🧠 Unified AI Agent System V2
//           </h1>
//           <div className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6">
//             An advanced AI agent system that combines intelligent number guessing gameplay with real API integration. 
//             Features robust error handling, button-based feedback for 100% accuracy, hybrid intelligence with local validation, 
//             and comprehensive state management to deliver a seamless interactive experience.
//           </div>
          
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={() => {
//                 processingRef.current = false; // 重置处理状态
//                 resetGame();
//               }}
//               disabled={isThinking || api.isProcessing}
//               className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
//             >
//               <RotateCcw className="w-5 h-5" />
//               Reset Game
//             </button>
//           </div>
//         </div>

//         <GameConfiguration 
//           config={apiConfig}
//           onConfigChange={handleConfigChange}
//           apiStatus={api.getAPIStatus()}
//           showAdvancedSettings={true}
//           variant="v2"
//           gameData={{
//             ...gameData,
//             useRealAPI: apiConfig.useRealAPI
//           }}
//           conversation={conversation}
//           gameState={gameState}
//         />

//         {gameState === 'idle' && (
//           <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
//             <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
//               <BookOpen className="w-7 h-7 text-emerald-600" />
//               Choose Game Mode
//             </h3>
//             <p className="text-center text-gray-600 mb-6">Select your preferred interaction method with full API support!</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div
//                 className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-300 group"
//                 onClick={() => {
//                   processingRef.current = false;
//                   startGame('hider');
//                 }}
//               >
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-all">
//                     <span className="text-2xl">🎯</span>
//                   </div>
//                   <h4 className="text-xl font-semibold text-gray-800 mb-3">AI Hides Number</h4>
//                   <p className="text-gray-600 text-sm mb-4">AI will think of a number between 1-100, and you guess it with text input</p>
//                   <div className="bg-emerald-50 rounded-lg p-3">
//                     <p className="text-xs text-emerald-700">
//                       {apiConfig.useRealAPI ? `Real ${apiConfig.model} responses` : 'Enhanced simulation'} with instant feedback
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-teal-300 group"
//                 onClick={() => {
//                   processingRef.current = false;
//                   startGame('guesser');
//                 }}
//               >
//                 <div className="text-center">
//                   <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-all">
//                     <span className="text-2xl">🔍</span>
//                   </div>
//                   <h4 className="text-xl font-semibold text-gray-800 mb-3">AI Guesses Number</h4>
//                   <p className="text-gray-600 text-sm mb-4">You think of a number, give feedback using simple buttons</p>
//                   <div className="bg-teal-50 rounded-lg p-3">
//                     <p className="text-xs text-teal-700">
//                       100% accurate with Higher/Lower/Correct buttons - {apiConfig.useRealAPI ? `Real ${apiConfig.model}` : 'Smart simulation'}!
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {(isThinking || api.isProcessing) && (
//           <div className="mb-6">
//             <AIThinkingIndicator 
//               message={apiConfig.useRealAPI 
//                 ? `Real ${apiConfig.model} is processing your input...` 
//                 : "Enhanced AI is processing your input with optimized speed..."
//               } 
//             />
//           </div>
//         )}

//         {api.apiError && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl">
//             <div className="flex items-center gap-2 text-red-800">
//               <AlertCircle className="w-5 h-5" />
//               <span className="font-semibold">API Error:</span>
//               <span>{api.apiError}</span>
//             </div>
//           </div>
//         )}

//         {gameData.currentRole === 'guesser' && gameData.guesserState?.currentRange && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
//             <h4 className="font-semibold mb-2 text-cyan-800">🔍 AI Guesser Status (Binary Search + Button Feedback)</h4>
//             <div className="text-sm text-cyan-700">
//               <p>Current Search Range: [{gameData.guesserState.currentRange.min}, {gameData.guesserState.currentRange.max}]</p>
//               {gameData.guesserState.lastGuess && (
//                 <p>Last Guess: {gameData.guesserState.lastGuess}</p>
//               )}
//               <p className="text-xs mt-1 text-green-600 font-medium">
//                 ✅ 100% Accurate Button Recognition - Mode: {apiConfig.useRealAPI ? `Real ${apiConfig.model}` : 'Enhanced Simulation'}
//               </p>
//             </div>
//           </div>
//         )}

//         {gameState === 'playing' && (
//           <div>
//             {gameData.currentRole === 'guesser' && conversation.length > 0 && (
//               <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
//                 <p className="text-emerald-700 text-sm font-medium">
//                   🎯 Use the buttons below to give feedback on AI's guess:
//                   <span className="block mt-1">
//                     <strong>Higher:</strong> The secret number is higher than AI's guess |
//                     <strong> Lower:</strong> The secret number is lower than AI's guess |
//                     <strong> Correct:</strong> AI got it right!
//                   </span>
//                 </p>
//               </div>
//             )}
            
//             {gameData.currentRole === 'hider' && conversation.length > 0 && (
//               <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
//                 <p className="text-teal-700 text-sm font-medium">
//                   🎯 Enter your number guess in the text box below. AI will give instant feedback!
//                 </p>
//               </div>
//             )}

//             <ConversationLog 
//               conversation={conversation}
//               variant="v2"
//               title="Enhanced AI Agent Conversation (Real API Supported)"
//               isThinking={isThinking || api.isProcessing}
//             />

//             {gameData.currentRole === 'hider' ? (
//               <TextInput
//                 onSubmit={handleTextInput}
//                 disabled={isThinking || api.isProcessing || gameState === 'finished' || processingRef.current}
//                 placeholder="Enter your guess..."
//                 buttonText="Guess"
//                 variant="v2"
//               />
//             ) : (
//               <div className="space-y-4">
//                 <div className="text-center space-y-2 mb-6">
//                   <div className="text-lg font-semibold text-gray-700">
//                     Give feedback on AI's guess
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Click the appropriate button based on your secret number
//                   </div>
//                 </div>

//                 <div className="flex justify-center gap-4 flex-wrap">
//                   <button
//                     onClick={() => handleButtonInput('Higher')}
//                     disabled={isThinking || api.isProcessing || gameState === 'finished' || processingRef.current}
//                     className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <div>📈 Higher</div>
//                       <div className="text-xs opacity-90 font-normal">Secret number is greater</div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleButtonInput('Lower')}
//                     disabled={isThinking || api.isProcessing || gameState === 'finished' || processingRef.current}
//                     className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <div>📉 Lower</div>
//                       <div className="text-xs opacity-90 font-normal">Secret number is smaller</div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleButtonInput('Correct')}
//                     disabled={isThinking || api.isProcessing || gameState === 'finished' || processingRef.current}
//                     className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <div>✅ Correct</div>
//                       <div className="text-xs opacity-90 font-normal">Guess is exactly right</div>
//                     </div>
//                   </button>
//                 </div>

//                 <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-700 border border-emerald-200">
//                   <div className="text-center font-medium mb-2">How to use:</div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
//                     <div>📈 <strong>Higher:</strong> Your secret number is larger than AI's guess</div>
//                     <div>📉 <strong>Lower:</strong> Your secret number is smaller than AI's guess</div>
//                     <div>✅ <strong>Correct:</strong> AI guessed your secret number exactly</div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

// {gameState === 'finished' && (
//           <div className="mt-8 text-center p-8 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-lg">
//             <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 Game Complete!</h3>
//             <p className="text-xl text-gray-700 mb-2">
//               The enhanced AI agent as <strong>{gameData.currentRole === 'hider' ? 'Hider' : 'Guesser'}</strong> successfully completed the game!
//             </p>
//             <p className="text-lg text-gray-600">
//               Total of <strong>{gameData.guessCount}</strong> guesses made
//             </p>
//           </div>
//         )}

//         <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-xl">
//           <h4 className="font-bold text-emerald-800 mb-5 text-xl flex items-center gap-3">
//             <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
//               <AlertCircle className="w-5 h-5 text-white" />
//             </div>
//             System Features
//           </h4>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Enhanced Button Interface</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Hybrid Intelligence System</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Advanced Number Extraction</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Race Condition Prevention</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Real-time API Integration</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Binary Search Optimization</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Error Handling & Recovery</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all">
//               <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
//               <span className="text-emerald-800 font-medium">Game State Validation</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnifiedLLMAgentV2;