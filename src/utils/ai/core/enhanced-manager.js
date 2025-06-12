import { AdvancedHiderLearningSystem } from "./advanced-hider-learning";

export class EnhancedPureLLMGameManager extends PureLLMGameManager {
  constructor(config = {}) {
    super(config);

    this.advancedHiderSystem = new AdvancedHiderLearningSystem();

    this.learningConfig = {
      ...this.learningConfig,
      enableAdvancedHider: true,
      hiderLearningMode: "aggressive", // gentle, moderate, aggressive, brutal
      adaptiveTrickiness: true,
      playerProfilingEnabled: true,
      psychologicalAnalysis: true,
    };

    this.hiderStats = {
      trickyNumbersGenerated: 0,
      playerFrustrationsInduced: 0,
      averageGuessesPerGame: 0,
      strategySuccessRates: new Map(),
      playerWeaknessesExploited: 0,
    };
  }

  // Generate advanced tricky secret number
  generateAdvancedTrickySecretNumber(learningData) {
    console.log("Generating ADVANCED TRICKY secret number...");

    if (!this.learningConfig.enableAdvancedHider) {
      return this.generateSmartSecretNumber(learningData);
    }

    try {
      const playerProfile = this.buildPlayerProfile(learningData);
      const contextData = this.buildContextData(learningData);

      const trickyResult =
        this.advancedHiderSystem.generateAdvancedTrickyNumber(
          learningData?.gameHistory || [],
          playerProfile,
          contextData
        );

      this.hiderStats.trickyNumbersGenerated++;

      return {
        number: trickyResult.number,
        message: this.generateTrickyNumberMessage(trickyResult),
        reasoning: trickyResult.reasoning,
        difficulty: trickyResult.trickinessScore,
        strategy: trickyResult.strategy,
        expectedGuesses: trickyResult.expectedDifficulty,
        psychologicalTrap: trickyResult.psychologicalTrap,
        learningBasis: trickyResult.learningInsight,
      };
    } catch (error) {
      console.warn("Advanced tricky number generation failed:", error.message);
      return this.generateSmartSecretNumber(learningData);
    }
  }

  // Build player profile
  buildPlayerProfile(learningData) {
    const gameHistory = learningData?.gameHistory || [];

    if (gameHistory.length === 0) {
      return {
        skillLevel: "unknown",
        avgGuesses: 7,
        preferredStrategies: [],
        identifiedWeaknesses: [],
        psychologicalProfile: "neutral",
      };
    }

    const avgGuesses =
      gameHistory.reduce((sum, game) => sum + (game.guessCount || 7), 0) /
      gameHistory.length;

    const skillLevel =
      avgGuesses <= 5
        ? "expert"
        : avgGuesses <= 7
        ? "advanced"
        : avgGuesses <= 9
        ? "intermediate"
        : "beginner";

    const preferredStrategies = this.analyzePreferredStrategies(gameHistory);
    const identifiedWeaknesses = this.identifyPlayerWeaknesses(gameHistory);
    const psychologicalProfile = this.buildPsychologicalProfile(gameHistory);

    return {
      skillLevel,
      avgGuesses: avgGuesses.toFixed(1),
      preferredStrategies,
      identifiedWeaknesses,
      psychologicalProfile,
      gamesPlayed: gameHistory.length,
      improvementRate: this.calculateImprovementRate(gameHistory),
    };
  }

  // Analyze preferred strategies
  analyzePreferredStrategies(gameHistory) {
    const strategies = [];

    for (const game of gameHistory) {
      const guesses = game.guessHistory || [];

      if (this.isPureBinarySearch(guesses, game.secret)) {
        strategies.push("pure_binary_search");
      }

      if (this.hasRoundNumberBias(guesses)) {
        strategies.push("round_number_bias");
      }

      if (this.hasEdgeAvoidance(guesses)) {
        strategies.push("edge_avoidance");
      }

      if (this.hasPatternDependency(guesses)) {
        strategies.push("pattern_seeking");
      }
    }

    const strategyCount = {};
    strategies.forEach((strategy) => {
      strategyCount[strategy] = (strategyCount[strategy] || 0) + 1;
    });

    return Object.entries(strategyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([strategy]) => strategy);
  }

  // Identify player weaknesses
  identifyPlayerWeaknesses(gameHistory) {
    const weaknesses = [];

    for (const game of gameHistory) {
      const guesses = game.guessHistory || [];

      if (
        !this.isPureBinarySearch(guesses, game.secret) &&
        game.guessCount > 8
      ) {
        weaknesses.push("imperfect_binary_search");
      }

      if (this.detectPrematurePatternSwitching(guesses, game.secret)) {
        weaknesses.push("premature_pattern_switch");
      }

      if (this.hasStrongPsychologicalBias(guesses)) {
        weaknesses.push("psychological_bias");
      }

      if (this.detectRangeTrackingErrors(guesses, game.secret)) {
        weaknesses.push("range_tracking_errors");
      }
    }

    return [...new Set(weaknesses)];
  }

  // Build psychological profile
  buildPsychologicalProfile(gameHistory) {
    let profile = "neutral";

    const allGuesses = gameHistory.flatMap((game) => game.guessHistory || []);

    const roundNumbers = allGuesses.filter((g) => g % 5 === 0 || g % 10 === 0);
    const edgeNumbers = allGuesses.filter((g) => g <= 10 || g >= 90);
    const middleNumbers = allGuesses.filter((g) => g >= 40 && g <= 60);

    if (roundNumbers.length / allGuesses.length > 0.4) {
      profile = "round_number_preference";
    } else if (edgeNumbers.length / allGuesses.length < 0.1) {
      profile = "edge_avoidance";
    } else if (middleNumbers.length / allGuesses.length > 0.6) {
      profile = "middle_bias";
    } else if (this.hasCreativePattern(allGuesses)) {
      profile = "creative_thinker";
    } else if (this.hasSystematicPattern(allGuesses)) {
      profile = "systematic_thinker";
    }

    return profile;
  }

  // Generate tricky number message
  generateTrickyNumberMessage(trickyResult) {
    const messages = {
      gentle: [
        "I've chosen a number between 1 and 100. Let's see how you do!",
        "I have a number in mind. Take your best guess!",
        "Ready for a number guessing challenge?",
      ],
      moderate: [
        "I've selected a number that might surprise you...",
        "This number might be trickier than you expect!",
        "I've chosen something a bit challenging this time.",
      ],
      aggressive: [
        "I've picked a particularly devious number this time...",
        "This one should test your skills! I've chosen carefully.",
        "Let's see if you can crack this tricky selection!",
      ],
      brutal: [
        "I've selected a number specifically designed to challenge you...",
        "This number will put your strategy to the ultimate test!",
        "Prepare yourself - this one is crafted to be especially difficult!",
      ],
    };

    const modeMessages =
      messages[this.learningConfig.hiderLearningMode] || messages.moderate;
    const baseMessage =
      modeMessages[Math.floor(Math.random() * modeMessages.length)];

    let strategyHint = "";
    if (trickyResult.strategy === "antiBinarySearch") {
      strategyHint = " Your usual approach might not work as well this time.";
    } else if (trickyResult.strategy === "psychologicalTraps") {
      strategyHint = " Trust your instincts... or maybe don't!";
    } else if (trickyResult.strategy === "boundaryTraps") {
      strategyHint = " Don't overlook the obvious!";
    }

    return baseMessage + strategyHint;
  }

  // Start advanced tricky game with learning
  async startAdvancedTrickyGameWithLearning(learningData, onUpdate, onEnd) {
    console.log("Starting Advanced Tricky Number Guessing Game");

    this.gameState = {
      secret: null,
      guessCount: 0,
      maxGuesses: 15,
      range: { min: 1, max: 100 },
      guessHistory: [],
      isActive: true,
      currentRole: "hider",
      strategiesUsed: new Set(),
      trickyStrategy: null,
    };

    this.conversationHistory = [];

    try {
      const secretChoice =
        this.generateAdvancedTrickySecretNumber(learningData);
      this.gameState.secret = secretChoice.number;
      this.gameState.trickyStrategy = secretChoice.strategy;
      this.gameState.currentRole = "guesser";

      this.addToHistory("Hider", secretChoice.message, {
        action: "select_tricky_secret",
        reasoning: secretChoice.reasoning,
        strategy: secretChoice.strategy,
        expectedDifficulty: secretChoice.expectedGuesses,
      });

      onUpdate({
        sender: "ai",
        message: secretChoice.message,
        metadata: {
          gameStart: true,
          reasoning: secretChoice.reasoning,
          difficulty: secretChoice.difficulty,
          strategy: secretChoice.strategy,
          expectedGuesses: secretChoice.expectedGuesses,
          trickyMode: true,
        },
      });

      this.runAdvancedTrickyGameLoop(onUpdate, onEnd, learningData);
    } catch (error) {
      console.error("Advanced tricky game failed to start:", error);
      onEnd({ success: false, error: error.message });
    }
  }

  // Enhanced game loop
  async runAdvancedTrickyGameLoop(onUpdate, onEnd, learningData) {
    const gameLoop = async () => {
      if (
        !this.gameState.isActive ||
        this.gameState.guessCount >= this.gameState.maxGuesses
      ) {
        return this.endAdvancedTrickyGameWithLearning(
          false,
          onEnd,
          learningData
        );
      }

      try {
        const guesserMove = await this.executeContextualIntelligentGuesserMove(
          learningData
        );

        if (!guesserMove || !guesserMove.guess || isNaN(guesserMove.guess)) {
          throw new Error("Invalid guess generated");
        }

        this.gameState.guessCount++;
        this.gameState.lastGuess = parseInt(guesserMove.guess);
        this.gameState.guessHistory.push(parseInt(guesserMove.guess));

        this.addToHistory("Guesser", guesserMove.message, {
          action: "make_guess",
          reasoning: guesserMove.reasoning,
        });

        onUpdate({
          sender: "ai",
          message: guesserMove.message,
          metadata: {
            guess: guesserMove.guess,
            reasoning: guesserMove.reasoning,
            confidence: guesserMove.confidence,
            guessCount: this.gameState.guessCount,
            currentRange: this.gameState.range,
          },
        });

        if (guesserMove.guess === this.gameState.secret) {
          const victoryResponse = await this.executeIntelligentHiderResponse(
            guesserMove.guess,
            learningData
          );

          onUpdate({
            sender: "ai",
            message: victoryResponse.message,
            metadata: {
              gameEnd: true,
              result: "victory",
              intelligent: victoryResponse.intelligent,
            },
          });

          return this.endAdvancedTrickyGameWithLearning(
            true,
            onEnd,
            learningData
          );
        }

        const hiderResponse = await this.executeIntelligentHiderResponse(
          guesserMove.guess,
          learningData
        );

        this.updateGameRange(guesserMove.guess, hiderResponse.direction);

        this.addToHistory("Hider", hiderResponse.message, {
          action: "provide_feedback",
          intent: hiderResponse.intent,
          intelligent: hiderResponse.intelligent,
        });

        onUpdate({
          sender: "ai",
          message: hiderResponse.message,
          metadata: {
            direction: hiderResponse.direction,
            currentRange: this.gameState.range,
            intelligent: hiderResponse.intelligent,
          },
        });

        setTimeout(gameLoop, this.efficientConfig.gameLoopInterval);
      } catch (error) {
        console.error("Advanced tricky game loop error:", error);

        if (
          error.message.includes("429") ||
          error.message.includes("Rate limit")
        ) {
          setTimeout(gameLoop, this.efficientConfig.emergencyDelay);
        } else {
          onEnd({ success: false, error: error.message });
        }
      }
    };

    setTimeout(gameLoop, 3000);
  }

  // End enhanced game with learning
  endAdvancedTrickyGameWithLearning(success, onEnd, learningData) {
    this.gameState.isActive = false;
    this.gameMetrics.totalGames++;

    if (this.learningConfig.enableAdvancedHider) {
      try {
        const gameResult = {
          success: success,
          guessCount: this.gameState.guessCount,
          secret: this.gameState.secret,
          strategy: this.gameState.trickyStrategy,
          guessHistory: this.gameState.guessHistory,
        };

        this.advancedHiderSystem.learnFromGameResult(
          gameResult,
          this.gameState.secret,
          this.conversationHistory
        );
        this.updateHiderStats(gameResult);

        console.log("Advanced Hider learned from game result");
      } catch (error) {
        console.warn("Failed to learn from game result:", error.message);
      }
    }

    if (
      this.learningConfig.enableAdvancedLearning &&
      this.advancedPromptSystem.recordGameResult
    ) {
      try {
        this.advancedPromptSystem.recordGameResult(
          this.gameState,
          this.conversationHistory,
          {
            success,
            guessCount: this.gameState.guessCount,
            secret: this.gameState.secret,
          }
        );
      } catch (error) {
        console.warn("Failed to record advanced learning data:", error.message);
      }
    }

    console.log(
      `Advanced Tricky Game Ended: ${success ? "Victory" : "Defeat"}`
    );

    const enhancedStats = this.getEnhancedEfficiencyStats();
    const hiderLearningStats = this.advancedHiderSystem.getLearningStats();

    onEnd({
      success,
      guessCount: this.gameState.guessCount,
      secret: this.gameState.secret,
      strategy: this.gameState.trickyStrategy,
      conversationHistory: this.conversationHistory,
      efficiency: enhancedStats,
      hiderLearning: hiderLearningStats,
      trickyMode: true,
    });
  }

  // Update Hider statistics
  updateHiderStats(gameResult) {
    this.hiderStats.averageGuessesPerGame =
      (this.hiderStats.averageGuessesPerGame *
        (this.hiderStats.trickyNumbersGenerated - 1) +
        gameResult.guessCount) /
      this.hiderStats.trickyNumbersGenerated;

    const strategy = gameResult.strategy;
    if (!this.hiderStats.strategySuccessRates.has(strategy)) {
      this.hiderStats.strategySuccessRates.set(strategy, {
        success: 0,
        total: 0,
      });
    }

    const strategyStats = this.hiderStats.strategySuccessRates.get(strategy);
    strategyStats.total++;
    if (gameResult.guessCount >= 8) {
      strategyStats.success++;
      this.hiderStats.playerFrustrationsInduced++;
    }

    if (gameResult.guessCount > 10) {
      this.hiderStats.playerWeaknessesExploited++;
    }
  }

  // Get enhanced efficiency stats
  getEnhancedEfficiencyStats() {
    const baseStats = super.getAdvancedEfficiencyStats();
    const hiderStats = this.advancedHiderSystem.getLearningStats();

    return {
      ...baseStats,
      hider_intelligence: {
        trickyNumbersGenerated: this.hiderStats.trickyNumbersGenerated,
        averageGuessesInduced: this.hiderStats.averageGuessesPerGame.toFixed(1),
        playerFrustrationsTriggered: this.hiderStats.playerFrustrationsInduced,
        weaknessesExploited: this.hiderStats.playerWeaknessesExploited,
        strategySuccessRates: this.getStrategySuccessRates(),
        trickinessLevel: hiderStats.trickinessLevel,
        learningMode: this.learningConfig.hiderLearningMode,
      },
      combined_intelligence: {
        total_learning_systems: 4, // Guesser + Hider + Context + Advanced
        learning_synergy: "ADVANCED_BIDIRECTIONAL",
        intelligence_evolution: "CONTINUOUS",
      },
    };
  }

  getStrategySuccessRates() {
    const rates = {};
    for (const [strategy, stats] of this.hiderStats.strategySuccessRates) {
      rates[strategy] =
        stats.total > 0
          ? ((stats.success / stats.total) * 100).toFixed(1) + "%"
          : "0%";
    }
    return rates;
  }

  // Reset method
  reset() {
    super.reset();

    this.advancedHiderSystem.reset();

    this.hiderStats = {
      trickyNumbersGenerated: 0,
      playerFrustrationsInduced: 0,
      averageGuessesPerGame: 0,
      strategySuccessRates: new Map(),
      playerWeaknessesExploited: 0,
    };
  }

  // Helper methods
  calculateImprovementRate(gameHistory) {
    if (gameHistory.length < 2) return 0;
    const recent =
      gameHistory.slice(-3).reduce((sum, g) => sum + (g.guessCount || 7), 0) /
      3;
    const older =
      gameHistory
        .slice(0, -3)
        .reduce((sum, g) => sum + (g.guessCount || 7), 0) /
      Math.max(1, gameHistory.length - 3);
    return (((older - recent) / older) * 100).toFixed(1) + "%";
  }

  isPureBinarySearch(guesses, secret) {
    return guesses.length <= Math.ceil(Math.log2(100)) + 1;
  }

  hasRoundNumberBias(guesses) {
    return (
      guesses.filter((g) => g % 5 === 0 || g % 10 === 0).length /
        guesses.length >
      0.3
    );
  }

  hasEdgeAvoidance(guesses) {
    return (
      guesses.filter((g) => g <= 10 || g >= 90).length === 0 &&
      guesses.length > 3
    );
  }

  hasPatternDependency(guesses) {
    return guesses.some((g, i) => i > 0 && Math.abs(g - guesses[i - 1]) < 3);
  }

  detectPrematurePatternSwitching(guesses, secret) {
    return (
      guesses.length > 5 &&
      guesses
        .slice(-3)
        .every((g, i, arr) => i === 0 || Math.abs(g - arr[i - 1]) <= 2)
    );
  }

  hasStrongPsychologicalBias(guesses) {
    return this.hasRoundNumberBias(guesses) || this.hasEdgeAvoidance(guesses);
  }

  detectRangeTrackingErrors(guesses, secret) {
    return false;
  }

  hasCreativePattern(guesses) {
    const uniqueSpacing = new Set();
    for (let i = 1; i < guesses.length; i++) {
      uniqueSpacing.add(Math.abs(guesses[i] - guesses[i - 1]));
    }
    return uniqueSpacing.size > guesses.length * 0.7;
  }

  hasSystematicPattern(guesses) {
    return !this.hasCreativePattern(guesses);
  }
}
