import { useState, useCallback, useEffect } from "react";
import {
  PureLLMGameManager,
  IntelligentContextAnalyzer,
} from "../utils/ai/core/llm-manager.js";

export const useLLMAPIEnhanced = (config) => {
  const [manager] = useState(() => new PureLLMGameManager(config));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameSession, setGameSession] = useState(null);
  const [, forceUpdate] = useState({});

  const [learningMemory, setLearningMemory] = useState(() => ({
    gameHistory: [],
    strategicPatterns: [],
    playerAdaptations: {},
    successfulStrategies: new Set(),
    failurePatterns: new Set(),
    cumulativeIntelligence: 0.7,
    avgConfidence: 0.7,
    confidenceHistory: [],
    lastUpdated: Date.now(),
  }));

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (config) {
      Object.assign(manager.config, config);
    }
  }, [config, manager]);

  const saveLearningMemory = useCallback(
    (newData) => {
      const updatedMemory = {
        ...learningMemory,
        ...newData,
        lastUpdated: Date.now(),
      };
      setLearningMemory(updatedMemory);

      console.log("Learning data updated:", {
        totalGames: updatedMemory.gameHistory.length,
        intelligence: updatedMemory.cumulativeIntelligence,
        confidence: updatedMemory.avgConfidence,
      });
    },
    [learningMemory]
  );

  const getContextualLearning = useCallback(() => {
    if (learningMemory.gameHistory.length === 0) {
      return {
        hasLearning: false,
        insights: [],
        avgIntelligence: 0.7,
        avgConfidence: 0.7,
      };
    }

    const recentGames = learningMemory.gameHistory.slice(-5);
    const successfulGames = recentGames.filter((game) => game.success);
    const avgIntelligence =
      recentGames.reduce(
        (sum, game) => sum + (game.intelligenceScore || 0.7),
        0
      ) / recentGames.length;

    const insights = [
      `Learned from ${learningMemory.gameHistory.length} games`,
      `Recent success rate: ${(
        (successfulGames.length / recentGames.length) *
        100
      ).toFixed(1)}%`,
      `Cumulative intelligence: ${avgIntelligence.toFixed(2)}`,
      `Average confidence: ${learningMemory.avgConfidence.toFixed(2)}`,
      ...Array.from(learningMemory.successfulStrategies).slice(0, 3),
    ];

    return {
      hasLearning: true,
      insights,
      avgIntelligence,
      avgConfidence: learningMemory.avgConfidence,
      patterns: learningMemory.strategicPatterns,
      successfulStrategies: learningMemory.successfulStrategies,
    };
  }, [learningMemory]);

  const makeUltraIntelligentCall = async (input, context = {}) => {
    try {
      const learning = getContextualLearning();
      const enhancedContext = {
        ...context,
        learningHistory: learning.hasLearning
          ? {
              insights: learning.insights,
              patterns: learning.patterns,
              successfulStrategies: Array.from(learning.successfulStrategies),
              avgIntelligence: learning.avgIntelligence,
              avgConfidence: learning.avgConfidence,
            }
          : null,
      };

      const contextAnalysis = await manager.contextAnalyzer.analyzeContext(
        manager.callLLM.bind(manager),
        {
          agent: "User",
          message: input,
          context: enhancedContext,
          timestamp: Date.now(),
        }
      );

      const contextualConfidence = manager.promptEngine
        .calculateContextualConfidence
        ? manager.promptEngine.calculateContextualConfidence(
            { range: { min: 1, max: 100 }, guessCount: 0 },
            contextAnalysis,
            manager.conversationHistory,
            "user"
          )
        : {
            value: learning.avgConfidence,
            reasoning: "Using historical confidence",
          };

      const prompt = `You are an ultra-intelligent AI assistant with cumulative learning experience.

INPUT: ${input}
CONTEXT: ${JSON.stringify(enhancedContext)}
CONTEXTUAL CONFIDENCE: ${contextualConfidence.value} (${
        contextualConfidence.reasoning
      })
LEARNING MEMORY: ${
        learning.hasLearning
          ? `
- Games Played: ${learningMemory.gameHistory.length}
- Cumulative Intelligence: ${learning.avgIntelligence.toFixed(2)}
- Average Confidence: ${learning.avgConfidence.toFixed(2)}
- Key Insights: ${learning.insights.join(", ")}
- Successful Strategies: ${Array.from(learning.successfulStrategies).join(", ")}
`
          : "Starting fresh learning session"
      }

CONVERSATION HISTORY: ${manager.conversationHistory
        .slice(-3)
        .map((h) => `${h.agent}: ${h.message}`)
        .join("\n")}

Apply your accumulated learning to provide intelligent response with JSON:
{
  "response": "Your intelligent response",
  "confidence": 0.0-1.0,
  "reasoning": "Your reasoning process including learning application",
  "intelligence_type": "analytical|creative|strategic|contextual",
  "learning_applied": "How you used past experience"
}`;

      const response = await manager.callLLM(prompt);
      const parsed = manager.parseJSON(response);

      const newConfidence = parsed.confidence || contextualConfidence.value;
      const updatedConfidenceHistory = [
        ...learningMemory.confidenceHistory,
        {
          timestamp: Date.now(),
          confidence: newConfidence,
          context: input.substring(0, 50),
        },
      ].slice(-20);

      const newAvgConfidence =
        updatedConfidenceHistory.reduce((sum, c) => sum + c.confidence, 0) /
        updatedConfidenceHistory.length;

      saveLearningMemory({
        confidenceHistory: updatedConfidenceHistory,
        avgConfidence: newAvgConfidence,
      });

      return {
        response: parsed.response || response,
        intelligence: {
          confidence: newConfidence,
          confidenceReasoning: contextualConfidence.reasoning,
          reasoning: parsed.reasoning || "Deep LLM analysis with learning",
          type: parsed.intelligence_type || "analytical",
          contextualAnalysis: contextAnalysis,
          learningApplied:
            parsed.learning_applied || "Applied cumulative experience",
        },
      };
    } catch (error) {
      throw new Error(`Ultra-intelligent call failed: ${error.message}`);
    }
  };

  const startRealTimeGame = async (
    onTurnUpdate,
    onGameComplete,
    onError,
    gameOptions = {}
  ) => {
    console.log("Starting Pure LLM Intelligence Real-Time Game...");

    try {
      const learning = getContextualLearning();

      const newGameSession = {
        id: Date.now(),
        startTime: Date.now(),
        roles: {
          hider: "ai_hider",
          guesser: "ai_guesser",
        },
        currentRole: "hider",
        turnCount: 0,
        gamePhase: "secret_selection",
        avgConfidence: 0.7,
      };

      setGameSession(newGameSession);
      setCurrentPlayer("hider");

      console.log("Phase 1: Hider selecting secret number...");

      await manager.startIntelligentGameWithLearning(
        learning,
        (turnData) => {
          console.log("Turn Update:", turnData);

          let currentRole, nextRole;

          if (turnData.metadata?.phase === "secret_selection") {
            currentRole = "hider";
            nextRole = "guesser";
            newGameSession.gamePhase = "guessing";
          } else if (turnData.metadata?.phase === "guessing") {
            currentRole = "guesser";
            nextRole = "hider";
          } else if (turnData.metadata?.phase === "feedback") {
            currentRole = "hider";
            nextRole = "guesser";
          } else {
            if (turnData.metadata?.action === "select_secret") {
              currentRole = "hider";
              nextRole = "guesser";
            } else if (turnData.metadata?.action === "make_guess") {
              currentRole = "guesser";
              nextRole = "hider";
            } else if (turnData.metadata?.action === "provide_feedback") {
              currentRole = "hider";
              nextRole = "guesser";
            } else {
              currentRole =
                newGameSession.turnCount % 2 === 0 ? "hider" : "guesser";
              nextRole = currentRole === "hider" ? "guesser" : "hider";
            }
          }

          const turnConfidence = turnData.metadata?.confidence || 0.7;
          newGameSession.avgConfidence =
            (newGameSession.avgConfidence * newGameSession.turnCount +
              turnConfidence) /
            (newGameSession.turnCount + 1);

          newGameSession.turnCount++;
          newGameSession.currentRole = nextRole;
          setGameSession({ ...newGameSession });
          setCurrentPlayer(nextRole);

          const enhancedTurnData = {
            ...turnData,
            currentPlayer: currentRole,
            nextPlayer: nextRole,
            turnNumber: newGameSession.turnCount,
            playerRole:
              currentRole === "hider" ? "Number Hider" : "Number Guesser",
            intelligence:
              turnData.metadata?.intelligence ||
              "Pure LLM reasoning with learning",
            strategy: turnData.metadata?.strategy || "adaptive_learning",
            confidence: turnConfidence,
            gameAvgConfidence: newGameSession.avgConfidence,
            isIntelligent: true,
            learningApplied: learning.hasLearning,
          };

          console.log(`Role Update: ${currentRole} -> ${nextRole}`);
          onTurnUpdate(enhancedTurnData);
        },
        (gameResult) => {
          console.log("Game Complete:", gameResult);

          const gameData = {
            id: newGameSession.id,
            timestamp: Date.now(),
            success: gameResult.success,
            guessCount: gameResult.guessCount,
            secret: gameResult.secret,
            intelligenceScore: gameResult.intelligenceScore || 0.8,
            strategies: Array.from(gameResult.strategiesUsed || []),
            avgConfidence: newGameSession.avgConfidence,
            playerPerformance: {
              hider: gameResult.hiderPerformance || { effectiveness: 0.8 },
              guesser: gameResult.guesserPerformance || { efficiency: 0.8 },
            },
          };

          const updatedLearning = {
            gameHistory: [...learningMemory.gameHistory, gameData],
            cumulativeIntelligence:
              learningMemory.cumulativeIntelligence * 0.8 +
              (gameResult.intelligenceScore || 0.8) * 0.2,
            avgConfidence:
              learningMemory.avgConfidence * 0.8 +
              newGameSession.avgConfidence * 0.2,
            successfulStrategies: new Set([
              ...learningMemory.successfulStrategies,
              ...(gameResult.success ? gameResult.strategiesUsed || [] : []),
            ]),
            strategicPatterns: [
              ...learningMemory.strategicPatterns,
              {
                timestamp: Date.now(),
                pattern: `Game ${learningMemory.gameHistory.length + 1}: ${
                  gameResult.success ? "Success" : "Failure"
                } with ${gameResult.guessCount} guesses`,
                intelligence: gameResult.intelligenceScore || 0.8,
                confidence: newGameSession.avgConfidence,
              },
            ].slice(-20),
          };

          saveLearningMemory(updatedLearning);

          setCurrentPlayer(null);
          setGameSession(null);

          const enhancedResult = {
            ...gameResult,
            systemType: "Pure LLM Intelligence with Learning",
            finalPlayer: currentPlayer,
            totalTurns: gameSession?.turnCount || 0,
            avgConfidence: newGameSession.avgConfidence,
            learningData: {
              totalGamesPlayed: updatedLearning.gameHistory.length,
              cumulativeIntelligence: updatedLearning.cumulativeIntelligence,
              avgConfidence: updatedLearning.avgConfidence,
              learningProgression: updatedLearning.gameHistory.slice(-3),
            },
            intelligenceMetrics: {
              overallScore: gameResult.intelligenceScore || 0.8,
              adaptiveThinking: 0.85,
              contextualUnderstanding: 0.9,
              strategicEvolution: 0.8,
              cumulativeLearning: learning.hasLearning ? 0.9 : 0.7,
              confidenceLevel: newGameSession.avgConfidence,
            },
          };

          onGameComplete(enhancedResult);
        }
      );
    } catch (error) {
      console.error("Pure LLM game start error:", error);
      setCurrentPlayer(null);
      setGameSession(null);
      onError(error);
    }
  };

  const makeGameIntelligentMove = async (gameState, context = {}) => {
    const learning = getContextualLearning();
    const enhancedContext = { ...context, learning };

    try {
      const contextAnalysis = await manager.contextAnalyzer.analyzeContext(
        manager.callLLM.bind(manager),
        {
          agent: "System",
          message: "Game move analysis with learning",
          context: enhancedContext,
          timestamp: Date.now(),
        }
      );

      const contextualConfidence = manager.promptEngine
        .calculateContextualConfidence
        ? manager.promptEngine.calculateContextualConfidence(
            gameState,
            contextAnalysis,
            manager.conversationHistory,
            "guesser"
          )
        : {
            value: learning.avgConfidence,
            reasoning: "Using historical confidence",
          };

      const prompt = manager.promptEngine.generateGuesserPrompt(
        gameState,
        contextAnalysis,
        manager.conversationHistory,
        learning
      );
      const response = await manager.callLLM(prompt);
      const result = manager.parseJSON(response);

      return {
        ...result,
        contextualConfidence: contextualConfidence.value,
      };
    } catch (error) {
      throw new Error(`Intelligent game move failed: ${error.message}`);
    }
  };

  const generateGameResponse = async (guess, secret, gameState) => {
    const learning = getContextualLearning();

    try {
      const contextAnalysis = await manager.contextAnalyzer.analyzeContext(
        manager.callLLM.bind(manager),
        {
          agent: "System",
          message: "Game response generation with learning",
          context: { guess, secret, learning },
          timestamp: Date.now(),
        }
      );

      const prompt = manager.promptEngine.generateHiderPrompt(
        { ...gameState, secret, lastGuess: guess },
        contextAnalysis,
        manager.conversationHistory,
        learning
      );
      const response = await manager.callLLM(prompt);
      return manager.parseJSON(response);
    } catch (error) {
      throw new Error(`Game response generation failed: ${error.message}`);
    }
  };

  const switchCurrentPlayer = () => {
    if (!gameSession) return;

    const nextRole = currentPlayer === "hider" ? "guesser" : "hider";

    setCurrentPlayer(nextRole);
    setGameSession({
      ...gameSession,
      currentRole: nextRole,
      turnCount: gameSession.turnCount + 1,
    });

    console.log(`Manual Role Switch: ${currentPlayer} -> ${nextRole}`);
    triggerUpdate();
  };

  const getCurrentGameState = () => ({
    currentPlayer,
    currentRole: gameSession?.currentRole,
    gameSession,
    isGameActive: gameSession !== null,
    turnCount: gameSession?.turnCount || 0,
    gamePhase: gameSession?.gamePhase || "idle",
    roles: gameSession?.roles || {},
    avgConfidence: gameSession?.avgConfidence || 0.7,
  });

  const resetGameSession = () => {
    setCurrentPlayer(null);
    setGameSession(null);
    manager.gameState = null;
    console.log("Pure LLM Intelligence game session reset");
    triggerUpdate();
  };

  const clearLearningMemory = () => {
    const emptyMemory = {
      gameHistory: [],
      strategicPatterns: [],
      playerAdaptations: {},
      successfulStrategies: new Set(),
      failurePatterns: new Set(),
      cumulativeIntelligence: 0.7,
      avgConfidence: 0.7,
      confidenceHistory: [],
      lastUpdated: Date.now(),
    };
    saveLearningMemory(emptyMemory);
    console.log("Learning memory cleared");
  };

  const exportLearningData = () => {
    const learning = getContextualLearning();
    return {
      ...learningMemory,
      learning: learning,
      exportedAt: Date.now(),
      systemVersion: "Pure LLM Intelligence with Learning v2.0",
    };
  };

  const getConfidenceReport = () => ({
    current: learningMemory.avgConfidence,
    history: learningMemory.confidenceHistory.slice(-10),
    trend:
      learningMemory.confidenceHistory.length > 1
        ? learningMemory.confidenceHistory.slice(-1)[0].confidence >
          learningMemory.avgConfidence
          ? "rising"
          : "falling"
        : "stable",
  });

  const getAPIStatus = () => {
    const learning = getContextualLearning();
    return {
      systemType: "Pure LLM Intelligence System with Learning",
      status: "operational",
      intelligenceLevel: learning.avgIntelligence,
      confidenceLevel: learning.avgConfidence,
      totalGames: learning.hasLearning ? learningMemory.gameHistory.length : 0,
      cumulativeIntelligence: learningMemory.cumulativeIntelligence,
      learningStatus: {
        hasLearning: learning.hasLearning,
        gameHistory: learningMemory.gameHistory.length,
        insights: learning.insights.length,
        successfulStrategies: Array.from(learningMemory.successfulStrategies)
          .length,
      },
      features: [
        "Deep Conversation Analysis",
        "Adaptive Strategy Evolution",
        "Contextual Intelligence",
        "Dynamic Prompt Engineering",
        "Cumulative Learning Memory",
        "Role-Aware Intelligence",
        "Confidence Tracking",
      ],
    };
  };

  const getIntelligenceReport = () => {
    const status = manager.getIntelligenceStatus();
    const learning = getContextualLearning();

    return {
      overallIntelligence: learning.avgIntelligence,
      contextualUnderstanding: status.contextInsights / 10,
      adaptiveCapacity: 0.85,
      learningEvidence: learning.hasLearning,
      strategicThinking: 0.9,
      cumulativeLearning: getContextualLearning().hasLearning ? 0.95 : 0.7,
      confidenceLevel: learning.avgConfidence,
      features: [
        ...status.features,
        `Learning Memory: ${learningMemory.gameHistory.length} games`,
        `Intelligence Growth: ${learning.avgIntelligence.toFixed(2)}`,
        `Confidence Level: ${learning.avgConfidence.toFixed(2)}`,
      ],
    };
  };

  return {
    // Core API methods
    makeUltraIntelligentCall,
    startRealTimeGame,
    makeGameIntelligentMove,
    generateGameResponse,

    // Game state management
    switchCurrentPlayer,
    getCurrentGameState,
    resetGameSession,
    currentPlayer,
    gameSession,
    isGameActive: gameSession !== null,

    // Learning data management
    getContextualLearning,
    saveLearningMemory,
    learningMemory,
    clearLearningMemory,
    exportLearningData,
    getConfidenceReport,

    // System status and reports
    getAPIStatus,
    getIntelligenceReport,
    isProcessing: false,
    apiError: null,
    currentAnalysis:
      manager.contextAnalyzer.strategicInsights.slice(-1)[0] || null,
    aiStrategy: "PURE_LLM_INTELLIGENCE_WITH_LEARNING",
    aiPersonality: "ADAPTIVE_LEARNING_INTELLIGENT",

    // Intelligence data
    intelligence: {
      strategicInsights: manager.contextAnalyzer.strategicInsights,
      gamePatterns: manager.contextAnalyzer.gamePatterns,
      conversationHistory: manager.conversationHistory,
      getFullContextualIntelligence: () => ({
        memoryDepth: manager.conversationHistory.length,
        patterns: manager.contextAnalyzer.gamePatterns,
        strategicInsights: manager.contextAnalyzer.strategicInsights,
        currentContext: "Pure LLM contextual intelligence with learning active",
        userProfile: {
          adaptationLevel: 0.8,
          intelligenceLevel: getContextualLearning().avgIntelligence,
          confidenceLevel: getContextualLearning().avgConfidence,
        },
        learningData: getContextualLearning().hasLearning
          ? learningMemory
          : null,
      }),
    },

    // Configuration options
    availableStrategies: [
      "PURE_LLM_ADAPTIVE_LEARNING",
      "CONTEXTUAL_INTELLIGENCE_WITH_MEMORY",
      "STRATEGIC_EVOLUTION_CUMULATIVE",
    ],
    availablePersonalities: [
      "DEEP_ANALYTICAL_LEARNING",
      "ADAPTIVE_SUPPORTIVE_MEMORY",
      "STRATEGIC_COMPETITIVE_EVOLUTION",
    ],

    // Utility methods
    clearError: () => triggerUpdate(),
    clearConversationHistory: () => {
      manager.conversationHistory = [];
      manager.contextAnalyzer = new IntelligentContextAnalyzer();
      triggerUpdate();
    },
    clearCallHistory: () => {
      manager.conversationHistory = [];
      triggerUpdate();
    },
  };
};
