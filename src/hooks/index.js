// hooks/index.js - Unified Hook exports

export { useGameState } from "./useGameState";
export { useLLMAPIEnhanced as useLLMAPI } from "./useLLMAPI";

import { useState, useCallback, useMemo } from "react";
import {
  createDefaultAPIConfig,
  mergeAPIConfig,
  validateAPIConfig,
} from "../utils";

// API Configuration Hook
export const useAPIConfig = (initialConfig = {}) => {
  const [config, setConfig] = useState(() =>
    mergeAPIConfig(createDefaultAPIConfig(), initialConfig)
  );

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => mergeAPIConfig(prev, { [key]: value }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(createDefaultAPIConfig());
  }, []);

  const validation = useMemo(() => validateAPIConfig(config), [config]);

  return {
    config,
    updateConfig,
    resetConfig,
    validation,
    isValid: validation.isValid,
  };
};

import { getTheme } from "../constants";

// Theme Hook
export const useTheme = (variant = "default") => {
  const theme = getTheme(variant);

  const getVariantClass = useCallback(
    (type, defaultClass = "") => {
      return theme[type]?.gradient || theme[type]?.bg || defaultClass;
    },
    [theme]
  );

  const getVariantTextClass = useCallback(
    (type, defaultClass = "") => {
      return theme[type]?.text || theme[type]?.icon || defaultClass;
    },
    [theme]
  );

  return {
    theme,
    getVariantClass,
    getVariantTextClass,
    primaryGradient: theme.primary?.gradient || "",
    primaryBg: theme.primary?.bg || "",
    primaryText: theme.primary?.text || "",
    primaryIcon: theme.primary?.icon || "",
    userGradient: theme.user?.gradient || "",
    aiGradient: theme.ai?.gradient || "",
    buttonGradient: theme.button || "",
    focusClass: theme.focus || "",
  };
};

import { useRef, useEffect } from "react";
import {
  GAME_CONFIG,
  generateSecretNumber,
  initializeGameState,
  validateGameState,
} from "../utils";

// Simple Game State Hook
export const useSimpleGameState = () => {
  const [gameState, setGameState] = useState(GAME_CONFIG.STATES.IDLE);
  const [gameData, setGameData] = useState(initializeGameState());
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = useCallback((sender, message, metadata = {}) => {
    setConversation((prev) => [
      ...prev,
      {
        sender,
        message,
        timestamp: Date.now(),
        ...metadata,
      },
    ]);
  }, []);

  const startGame = useCallback((role) => {
    setGameState(GAME_CONFIG.STATES.PLAYING);
    setConversation([]);

    const newGameData = {
      ...initializeGameState(),
      currentRole: role,
      secretNumber: role === "hider" ? generateSecretNumber() : null,
    };

    setGameData(newGameData);
  }, []);

  const endGame = useCallback(() => {
    setGameState(GAME_CONFIG.STATES.FINISHED);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GAME_CONFIG.STATES.IDLE);
    setGameData(initializeGameState());
    setConversation([]);
    setIsProcessing(false);
  }, []);

  const updateGameData = useCallback((updates) => {
    setGameData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isValidState = useMemo(() => {
    return validateGameState(gameData).isValid;
  }, [gameData]);

  return {
    gameState,
    gameData,
    conversation,
    isProcessing,
    isValidState,
    addMessage,
    startGame,
    endGame,
    resetGame,
    updateGameData,
    setIsProcessing,
    isPlaying: gameState === GAME_CONFIG.STATES.PLAYING,
    isFinished: gameState === GAME_CONFIG.STATES.FINISHED,
    isIdle: gameState === GAME_CONFIG.STATES.IDLE,
    messageCount: conversation.length,
    currentRole: gameData.currentRole,
  };
};

// Combined Game and API Hook
export const useGameWithAPI = (apiConfig = {}) => {
  const gameState = useSimpleGameState();
  const apiState = useLLMAPI(apiConfig);

  return {
    ...gameState,
    api: apiState,
    async processUserInput(input, role) {
      gameState.setIsProcessing(true);
      try {
        const response = await apiState.generateResponse(
          input,
          role,
          gameState.gameData
        );
        gameState.addMessage("ai", response);
        return response;
      } catch (error) {
        console.error("Failed to process input:", error);
        gameState.addMessage(
          "ai",
          "Sorry, I encountered an error. Please try again."
        );
        throw error;
      } finally {
        gameState.setIsProcessing(false);
      }
    },
  };
};
