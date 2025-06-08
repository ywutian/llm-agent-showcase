import { useState, useCallback, useRef, useMemo } from "react";
import { simulateSelfPlayGame } from "../utils/gameLogic";
import {
  createAPIResult,
  createErrorResult,
  createDefaultAPIConfig,
  mergeAPIConfig,
} from "../utils/gameConfig";

export const useLLMAPIEnhanced = (customConfig = {}) => {
  const config = useMemo(() => {
    return mergeAPIConfig(createDefaultAPIConfig(), customConfig);
  }, [customConfig]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastCallResult, setLastCallResult] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const abortControllerRef = useRef(null);
  const gameProcessingRef = useRef(false);

  const addToCallHistory = useCallback((result) => {
    setCallHistory((prev) => [...prev.slice(-9), result]);
    setLastCallResult(result);
  }, []);

  const simulateAPIDelay = useCallback((minDelay = 500, maxDelay = 1500) => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }, []);

  const callSingleAPI = useCallback(
    async (messages, systemPrompt = "") => {
      const {
        useRealAPI,
        apiToken,
        apiBaseUrl,
        model,
        maxTokens,
        temperature,
        topP,
        topK,
        frequencyPenalty,
      } = config;

      if (!useRealAPI || !apiToken) {
        await simulateAPIDelay(1000);
        const content = messages[0].content.includes("HIDER")
          ? "I've chosen a secret number between 1-100. Start guessing!"
          : messages[0].content.includes("guess")
          ? `I guess ${Math.floor(Math.random() * 100) + 1}`
          : "Higher! Your guess is too low.";

        return {
          success: true,
          content,
          metadata: {
            cost: { estimatedUSD: 0, tokensUsed: 0 },
            duration: 1000,
            model: "simulation",
            apiType: "simulation",
          },
        };
      }

      const startTime = Date.now();
      abortControllerRef.current = new AbortController();

      const apiMessages = [];
      if (systemPrompt) {
        apiMessages.push({ role: "system", content: systemPrompt });
      }
      apiMessages.push(...messages);

      const requestBody = {
        model: model,
        messages: apiMessages,
        stream: false,
        max_tokens: maxTokens,
        enable_thinking: false,
        thinking_budget: 4096,
        min_p: 0.05,
        stop: null,
        temperature: temperature,
        top_p: topP,
        top_k: topK || 50,
        frequency_penalty: frequencyPenalty || 0.5,
        n: 1,
        response_format: { type: "text" },
        tools: [], 
      };

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      };

      try {
        const response = await fetch(apiBaseUrl, options);
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `API Error ${response.status}: ${
              errorData.error?.message || response.statusText
            }`
          );
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid API response format");
        }

        const content = data.choices[0].message.content.trim();

        return {
          success: true,
          content: content,
          metadata: {
            duration,
            model: model,
            apiType: "real",
            tokensUsed: data.usage?.total_tokens || 0,
            finishReason: data.choices[0].finish_reason,
            responseLength: content.length,
            endTime: new Date(endTime).toISOString(),
          },
        };
      } catch (error) {
        console.error("Single API call failed:", error);
        throw error;
      }
    },
    [config, simulateAPIDelay]
  );

  const callRealLLMAPI = useCallback(
    async (messages, systemPrompt = "") => {
      const startTime = Date.now();
      const callMetadata = {
        apiType: "real",
        model: config.model,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
        messagesCount: messages.length,
        hasSystemPrompt: !!systemPrompt,
        startTime: new Date(startTime).toISOString(),
      };

      if (!config.apiToken) {
        const error = new Error("API token is required for real API calls");
        const errorResult = createErrorResult(error, callMetadata);
        addToCallHistory(errorResult);
        throw error;
      }

      try {
        const result = await callSingleAPI(messages, systemPrompt);
        const successResult = createAPIResult(result.content, {
          ...callMetadata,
          ...result.metadata,
        });

        addToCallHistory(successResult);
        return successResult;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (error.name === "AbortError") {
          const abortError = new Error("Request was cancelled");
          const errorResult = createErrorResult(abortError, {
            ...callMetadata,
            duration,
            cancelled: true,
            endTime: new Date(endTime).toISOString(),
          });
          addToCallHistory(errorResult);
          throw abortError;
        }

        const errorResult = createErrorResult(error, {
          ...callMetadata,
          duration,
          endTime: new Date(endTime).toISOString(),
        });
        addToCallHistory(errorResult);
        throw error;
      }
    },
    [config, callSingleAPI, addToCallHistory]
  );

  const startRealTimeGame = useCallback(
    async (onTurnUpdate, onGameComplete, onError) => {
      if (gameProcessingRef.current) {
        return;
      }

      gameProcessingRef.current = true;
      const secretNumber = Math.floor(Math.random() * 100) + 1;
      let guessCount = 0;

      try {
        const hiderSetupPrompt = `You are the HIDER in a number guessing game. You have secretly chosen the number ${secretNumber} (between 1-100). 

Your role: Provide feedback to guesses with "Higher!", "Lower!", or "Correct!" based on the secret number ${secretNumber}.

Respond ONLY with: "I've chosen a secret number between 1-100. Start guessing!"`;

        await callSingleAPI([{ role: "user", content: hiderSetupPrompt }]);

        gameProcessingRef.current = false;
        onGameComplete({
          success: true,
          gameData: { secretNumber, totalGuesses: guessCount },
        });
      } catch (error) {
        gameProcessingRef.current = false;
        onError(error);
      }
    },
    [callSingleAPI]
  );

  const callSelfPlayLLMAPI = useCallback(
    async (options = {}) => {
      if (!config.useRealAPI) {
        setIsProcessing(true);
        try {
          await simulateAPIDelay(2000);
          const gameData = simulateSelfPlayGame(options);
          const result = createAPIResult("Game completed", {
            apiType: "simulation",
            model: "built-in-algorithm",
            duration: 2000,
            cost: { estimatedUSD: 0, tokensUsed: 0 },
            gameData,
          });
          addToCallHistory(result);
          return result;
        } catch (error) {
          const errorResult = createErrorResult(error, {
            apiType: "simulation",
          });
          addToCallHistory(errorResult);
          throw error;
        } finally {
          setIsProcessing(false);
        }
      }

      throw new Error("Real API self-play not implemented");
    },
    [config, simulateAPIDelay, addToCallHistory]
  );

  const getAPIStatus = useCallback(() => {
    const total = callHistory.length;
    const successful = callHistory.filter((call) => call.success).length;
    const totalCost = callHistory.reduce(
      (sum, call) => sum + (call.metadata?.cost?.estimatedUSD || 0),
      0
    );

    return {
      isProcessing: isProcessing || gameProcessingRef.current,
      hasError: !!apiError,
      errorMessage: apiError,
      canRetry: !isProcessing && !gameProcessingRef.current,
      usingRealAPI: config.useRealAPI,
      hasValidToken: !!config.apiToken,
      model: config.model,
      environment: process.env.NODE_ENV,
      version: "simplified",
      callHistory: {
        total,
        successful,
        failed: total - successful,
        totalCost,
      },
    };
  }, [isProcessing, apiError, config, callHistory]);

  return {
    callRealLLMAPI,
    callSelfPlayLLMAPI,
    startRealTimeGame,
    isProcessing: isProcessing || gameProcessingRef.current,
    apiError,
    cancelRequest: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsProcessing(false);
        setApiError("Request cancelled");
      }
      if (gameProcessingRef.current) {
        gameProcessingRef.current = false;
      }
    },
    clearError: () => setApiError(null),
    getAPIStatus,
    lastCallResult,
    callHistory,
    clearCallHistory: () => {
      setCallHistory([]);
      setLastCallResult(null);
    },
    simulateAPIDelay,
    config,
  };
};

export default useLLMAPIEnhanced;
