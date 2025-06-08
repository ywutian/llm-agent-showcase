import { useState, useCallback, useRef, useEffect } from "react";
import {
  calculateBinarySearchGuess,
  validateGameState,
} from "../utils/gameLogic";

// Define generateSecretNumber directly here to avoid import issues
const generateSecretNumber = (min = 1, max = 100) => {
  try {
    if (typeof min !== "number" || typeof max !== "number") {
      console.warn("generateSecretNumber: Invalid parameters, using defaults");
      min = 1;
      max = 100;
    }

    if (min >= max) {
      console.warn("generateSecretNumber: min >= max, using defaults");
      min = 1;
      max = 100;
    }

    const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (secretNumber < min || secretNumber > max) {
      console.error(
        "generateSecretNumber: Generated invalid number, using fallback"
      );
      return Math.floor(Math.random() * 100) + 1;
    }

    console.log(
      `Generated secret number: ${secretNumber} (range: ${min}-${max})`
    );
    return secretNumber;
  } catch (error) {
    console.error(
      "generateSecretNumber: Error occurred, using fallback:",
      error
    );
    return Math.floor(Math.random() * 100) + 1;
  }
};

// Core game state management
export const useGameCore = () => {
  const [gameState, setGameState] = useState("idle");
  const [gameData, setGameData] = useState({
    secretNumber: null,
    guessCount: 0,
    currentRole: null,
    guesserState: {
      currentRange: { min: 1, max: 100 },
      lastGuess: null,
    },
  });

  const resetToIdle = useCallback(() => {
    setGameState("idle");
    setGameData({
      secretNumber: null,
      guessCount: 0,
      currentRole: null,
      guesserState: {
        currentRange: { min: 1, max: 100 },
        lastGuess: null,
      },
    });
  }, []);

  const startGame = useCallback((role) => {
    const newSecretNumber = role === "hider" ? generateSecretNumber() : null;

    setGameState("playing");
    setGameData((prev) => ({
      ...prev,
      currentRole: role,
      secretNumber: newSecretNumber,
      guessCount: 0,
      guesserState: {
        currentRange: { min: 1, max: 100 },
        lastGuess: null,
      },
    }));
  }, []);

  const finishGame = useCallback(() => {
    setGameState("finished");
  }, []);

  const updateGameData = useCallback((updates) => {
    if (typeof updates === "function") {
      setGameData(updates);
    } else {
      setGameData((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  return {
    gameState,
    gameData,
    startGame,
    finishGame,
    resetToIdle,
    updateGameData,
    setGameState,
  };
};

// Conversation management
export const useConversation = () => {
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const addToConversation = useCallback((sender, message, metadata = {}) => {
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      message,
      timestamp: Date.now(),
      ...metadata,
    };

    setConversation((prev) => [...prev, newMessage]);
  }, []);

  const clearConversation = useCallback(() => {
    setConversation([]);
  }, []);

  const setAIThinking = useCallback((thinking) => {
    setIsThinking(thinking);
  }, []);

  return {
    conversation,
    isThinking,
    addToConversation,
    clearConversation,
    setAIThinking,
  };
};

// Guesser state management
export const useGuesserState = () => {
  const processGuesserFeedback = useCallback((gameData, feedback) => {
    console.log("Processing guesser feedback:", {
      feedback,
      gameData: gameData.guesserState,
    });

    const { currentRange, lastGuess } = gameData.guesserState || {
      currentRange: { min: 1, max: 100 },
      lastGuess: 50,
    };

    if (feedback === "Correct" || feedback === "correct") {
      return { shouldEndGame: true, response: null };
    }

    let newRange = { ...currentRange };
    let feedbackType = "";

    const normalizedFeedback = feedback.toLowerCase();

    if (normalizedFeedback === "higher" || feedback === "Higher") {
      newRange.min = lastGuess + 1;
      feedbackType = "higher";
    } else if (normalizedFeedback === "lower" || feedback === "Lower") {
      newRange.max = lastGuess - 1;
      feedbackType = "lower";
    } else {
      return {
        shouldEndGame: false,
        response: "Please use 'Higher', 'Lower', or 'Correct'.",
        error: true,
      };
    }

    console.log(
      `Range calculation: lastGuess=${lastGuess}, feedback=${feedback}`
    );
    console.log(`Old range: [${currentRange.min}, ${currentRange.max}]`);
    console.log(`New range: [${newRange.min}, ${newRange.max}]`);

    if (newRange.min > newRange.max) {
      console.error("Invalid range detected:", newRange);
      return {
        shouldEndGame: false,
        response:
          "I detected a logical inconsistency in the feedback. This suggests there might be an error in the game state. Please restart the game.",
        error: true,
      };
    }

    if (newRange.min === newRange.max) {
      console.log("Range narrowed to single number:", newRange.min);
      return {
        shouldEndGame: false,
        response: `Based on your feedback, the number must be ${newRange.min}. I guess ${newRange.min}.`,
        newRange,
        nextGuess: newRange.min,
        error: false,
      };
    }

    let nextGuess;
    try {
      nextGuess = calculateBinarySearchGuess(newRange.min, newRange.max);
      console.log(`Calculated next guess: ${nextGuess}`);
    } catch (error) {
      console.error("Error calculating next guess:", error);
      return {
        shouldEndGame: false,
        response: "Error calculating next guess. Please restart the game.",
        error: true,
      };
    }

    if (nextGuess < newRange.min || nextGuess > newRange.max) {
      console.error("Invalid guess generated:", { nextGuess, newRange });
      nextGuess = Math.floor((newRange.min + newRange.max) / 2);
      console.log("Fallback guess:", nextGuess);
    }

    return {
      shouldEndGame: false,
      response: `Got it, need to go ${feedbackType}. My current range is [${newRange.min}, ${newRange.max}]. I guess ${nextGuess}.`,
      newRange,
      nextGuess,
      error: false,
    };
  }, []);

  return {
    processGuesserFeedback,
  };
};

// Game counter
export const useGameCounter = () => {
  const incrementGuessCount = useCallback((gameData) => {
    return {
      ...gameData,
      guessCount: gameData.guessCount + 1,
    };
  }, []);

  return { incrementGuessCount };
};

// Safe timeout management
export const useSafeTimeout = () => {
  const timeoutRef = useRef(null);
  const gameStateRef = useRef("idle");

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const safeSetTimeout = useCallback(
    (callback, delay, requiredState = "playing") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (gameStateRef.current === requiredState) {
          callback();
        }
      }, delay);
    },
    []
  );

  const updateGameStateRef = useCallback((state) => {
    gameStateRef.current = state;
  }, []);

  const clearSafeTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    safeSetTimeout,
    updateGameStateRef,
    clearSafeTimeout,
  };
};

// Game validation
export const useGameValidation = () => {
  const isGameStateValid = useCallback((gameData) => {
    return validateGameState(gameData);
  }, []);

  const getGameStats = useCallback((gameState, gameData, conversation) => {
    return {
      messageCount: conversation.length,
      guessCount: gameData.guessCount,
      currentRole: gameData.currentRole,
      gameState,
      secretNumber: gameState === "finished" ? gameData.secretNumber : null,
      guessingRange: gameData.guesserState.currentRange,
      lastGuess: gameData.guesserState.lastGuess,
      isValid: validateGameState(gameData),
    };
  }, []);

  return {
    isGameStateValid,
    getGameStats,
  };
};

// Main composite hook
export const useGameState = () => {
  const gameCore = useGameCore();
  const conversation = useConversation();
  const guesserState = useGuesserState();
  const safeTimeout = useSafeTimeout();
  const gameValidation = useGameValidation();

  useEffect(() => {
    safeTimeout.updateGameStateRef(gameCore.gameState);
  }, [gameCore.gameState, safeTimeout]);

  const resetGame = useCallback(() => {
    safeTimeout.clearSafeTimeout();
    gameCore.resetToIdle();
    conversation.clearConversation();
    conversation.setAIThinking(false);
  }, [gameCore, conversation, safeTimeout]);

  const startGame = useCallback(
    (role) => {
      gameCore.startGame(role);
      conversation.clearConversation();
      conversation.setAIThinking(true);

      safeTimeout.safeSetTimeout(() => {
        if (role === "hider") {
          conversation.setAIThinking(false);
          conversation.addToConversation(
            "ai",
            "Great! I have thought of a secret number between 1 and 100. Please start guessing!"
          );
        } else if (role === "guesser") {
          const initialGuess = 50;
          gameCore.updateGameData((prevData) => ({
            ...prevData,
            guesserState: {
              currentRange: { min: 1, max: 100 },
              lastGuess: initialGuess,
            },
          }));

          conversation.setAIThinking(false);
          conversation.addToConversation(
            "ai",
            "Alright, I'll guess your number! My current guessing range is [1, 100]. I guess 50."
          );
        }
      }, 1000);
    },
    [gameCore, conversation, safeTimeout]
  );

  const incrementGuessCount = useCallback(() => {
    gameCore.updateGameData((prevData) => ({
      ...prevData,
      guessCount: prevData.guessCount + 1,
    }));
  }, [gameCore]);

  const updateGuesserState = useCallback(
    (newRange, nextGuess) => {
      console.log("Hook: updateGuesserState called with:", {
        newRange,
        nextGuess,
      });

      if (
        !newRange ||
        typeof newRange.min !== "number" ||
        typeof newRange.max !== "number"
      ) {
        console.error("Invalid newRange provided:", newRange);
        return;
      }

      if (typeof nextGuess !== "number" || nextGuess < 1 || nextGuess > 100) {
        console.error("Invalid nextGuess provided:", nextGuess);
        return;
      }

      if (nextGuess < newRange.min || nextGuess > newRange.max) {
        console.error("nextGuess is outside of newRange:", {
          nextGuess,
          newRange,
        });
        return;
      }

      gameCore.updateGameData((prevData) => {
        const updatedData = {
          ...prevData,
          guesserState: {
            currentRange: { ...newRange },
            lastGuess: nextGuess,
          },
        };

        console.log(
          "Hook: updating gameData from:",
          prevData.guesserState,
          "to:",
          updatedData.guesserState
        );
        return updatedData;
      });
    },
    [gameCore]
  );

  const validateGuesserState = useCallback(() => {
    const { guesserState } = gameCore.gameData;
    if (!guesserState) return false;

    const { currentRange, lastGuess } = guesserState;

    if (!currentRange || currentRange.min > currentRange.max) {
      console.error("Invalid guesser range:", currentRange);
      return false;
    }

    if (
      lastGuess !== null &&
      (lastGuess < currentRange.min || lastGuess > currentRange.max)
    ) {
      console.error("Last guess outside of current range:", {
        lastGuess,
        currentRange,
      });
      return false;
    }

    return true;
  }, [gameCore.gameData]);

  return {
    // State
    gameState: gameCore.gameState,
    gameData: gameCore.gameData,
    conversation: conversation.conversation,
    isThinking: conversation.isThinking,

    // Basic operations
    startGame,
    resetGame,
    endGame: gameCore.finishGame,

    // Conversation operations
    addToConversation: conversation.addToConversation,
    setAIThinking: conversation.setAIThinking,

    // Game operations
    updateGuesserState,
    incrementGuessCount,
    processGuesserFeedback: guesserState.processGuesserFeedback,

    // Validation functions
    validateGuesserState,

    // Utility functions
    safeSetTimeout: safeTimeout.safeSetTimeout,
    isGameStateValid: gameValidation.isGameStateValid,
    getGameStats: (conversation, gameState, gameData) =>
      gameValidation.getGameStats(gameState, gameData, conversation),
  };
};

export default useGameState;
