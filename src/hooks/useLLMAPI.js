import { useState, useCallback, useRef } from "react";
import {
  getUnifiedPrompt,
  getButtonPrompt,
  parseUserFeedback,
} from "../utils/promptEngineering";
// Removed unused generateAIResponse import
import { compareGuess } from "../utils/gameLogic";

// LLM API interactions management
export const useLLMAPI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const abortControllerRef = useRef(null);

  const simulateAPIDelay = useCallback((minDelay = 500, maxDelay = 1500) => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }, []);

  const handleHiderResponse = useCallback((userMessage, gameState) => {
    const guessMatch = userMessage.match(/(\d+)/);
    if (guessMatch) {
      const guess = parseInt(guessMatch[1]);
      const secret = gameState.secretNumber;
      const result = compareGuess(guess, secret);

      switch (result) {
        case "correct":
          return "Correct! Congratulations, you got it!";
        case "higher":
          return "Higher!";
        case "lower":
          return "Lower!";
        default:
          return "Please guess a number between 1 and 100.";
      }
    }

    return "Please guess a number between 1 and 100.";
  }, []);

  const handleGuesserResponse = useCallback((userMessage, gameState) => {
    const feedbackResult = parseUserFeedback(userMessage);

    if (feedbackResult.type === "success") {
      return "Awesome! I guessed it right! Game over.";
    }

    if (feedbackResult.type === "unclear") {
      return "I didn't quite understand your feedback. Please tell me: should I guess higher, lower, or is it correct?";
    }

    const { currentRange, lastGuess } = gameState.guesserState;
    const newRange = { ...currentRange };

    if (feedbackResult.feedback === "lower") {
      newRange.max = lastGuess - 1;
    } else if (feedbackResult.feedback === "higher") {
      newRange.min = lastGuess + 1;
    }

    if (newRange.min > newRange.max) {
      return "Seems like there's a logic error, please restart the game.";
    }

    const nextGuess = Math.floor((newRange.min + newRange.max) / 2);

    return `Okay, need to go ${feedbackResult.feedback}. My current guessing range is [${newRange.min}, ${newRange.max}]. I guess ${nextGuess}.`;
  }, []);

  const handleButtonGuesserResponse = useCallback((buttonInput, gameState) => {
    if (buttonInput === "Correct") {
      return "Awesome! I guessed it right! Game over.";
    }

    const { currentRange, lastGuess } = gameState.guesserState;
    let newRange = { ...currentRange };
    let feedbackType = "";

    if (buttonInput === "Higher") {
      newRange.min = lastGuess + 1;
      feedbackType = "higher";
    } else if (buttonInput === "Lower") {
      newRange.max = lastGuess - 1;
      feedbackType = "lower";
    } else {
      return "Please use the feedback buttons: Higher, Lower, or Correct.";
    }

    if (newRange.min > newRange.max) {
      return "Seems like there's a logic error, please restart the game.";
    }

    const nextGuess = Math.floor((newRange.min + newRange.max) / 2);

    return `Okay, need to go ${feedbackType}. My current guessing range is [${newRange.min}, ${newRange.max}]. I guess ${nextGuess}.`;
  }, []);

  const simulateUnifiedLLMResponse = useCallback(
    (userMessage, role, gameState) => {
      if (role === "hider") {
        return handleHiderResponse(userMessage, gameState);
      } else if (role === "guesser") {
        return handleGuesserResponse(userMessage, gameState);
      }

      return "Game state error, please restart.";
    },
    [handleHiderResponse, handleGuesserResponse]
  );

  const simulateButtonLLMResponse = useCallback(
    (userMessage, role, gameState) => {
      if (role === "hider") {
        return handleHiderResponse(userMessage, gameState);
      } else if (role === "guesser") {
        return handleButtonGuesserResponse(userMessage, gameState);
      }

      return "Game state error, please restart.";
    },
    [handleHiderResponse, handleButtonGuesserResponse]
  );

  // Unified LLM API for V1
  const callUnifiedLLMAPI = useCallback(
    async (userMessage, role, gameState) => {
      setIsProcessing(true);
      setApiError(null);

      try {
        await simulateAPIDelay(1500, 2500);

        // System prompt would be used in real API call
        // const systemPrompt = getUnifiedPrompt(role);
        const response = simulateUnifiedLLMResponse(
          userMessage,
          role,
          gameState
        );

        setIsProcessing(false);
        return response;
      } catch (error) {
        setIsProcessing(false);
        setApiError(error.message);
        throw error;
      }
    },
    [simulateAPIDelay, simulateUnifiedLLMResponse]
  );

  // Button-based LLM API for V2
  const callButtonLLMAPI = useCallback(
    async (userMessage, role, gameState) => {
      setIsProcessing(true);
      setApiError(null);

      try {
        await simulateAPIDelay(500, 1000);

        // System prompt would be used in real API call
        // const systemPrompt = getButtonPrompt(role);
        const response = simulateButtonLLMResponse(
          userMessage,
          role,
          gameState
        );

        setIsProcessing(false);
        return response;
      } catch (error) {
        setIsProcessing(false);
        setApiError(error.message);
        throw error;
      }
    },
    [simulateAPIDelay, simulateButtonLLMResponse]
  );

  // Self-play LLM API for V3
  const callSelfPlayLLMAPI = useCallback(async () => {
    setIsProcessing(true);
    setApiError(null);

    try {
      await simulateAPIDelay(2000, 4000);

      const { simulateSelfPlayGame } = await import("../utils/gameLogic");
      const response = simulateSelfPlayGame();

      setIsProcessing(false);
      return response;
    } catch (error) {
      setIsProcessing(false);
      setApiError(error.message);
      throw error;
    }
  }, [simulateAPIDelay]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setApiError("Request cancelled");
    }
  }, []);

  const clearError = useCallback(() => {
    setApiError(null);
  }, []);

  const getAPIStatus = useCallback(() => {
    return {
      isProcessing,
      hasError: !!apiError,
      errorMessage: apiError,
      canRetry: !isProcessing,
    };
  }, [isProcessing, apiError]);

  return {
    callUnifiedLLMAPI,
    callButtonLLMAPI,
    callSelfPlayLLMAPI,
    isProcessing,
    apiError,
    cancelRequest,
    clearError,
    getAPIStatus,
    simulateAPIDelay,
    handleHiderResponse,
    handleGuesserResponse,
    handleButtonGuesserResponse,
  };
};

export default useLLMAPI;
