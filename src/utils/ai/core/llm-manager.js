import { IntelligentContextAnalyzer } from "./context-analyzer";
import { AdvancedIntelligentPromptSystem } from "./advanced-prompt-system";
import { IntelligentPromptEngine } from "../engines/prompt-engine";

export { IntelligentContextAnalyzer } from "./context-analyzer";
export { IntelligentPromptEngine } from "../engines/prompt-engine";

export class PureLLMGameManager {
  constructor(config = {}) {
    this.config = {
      apiToken: config.apiToken || "",
      baseUrl: "https://generativelanguage.googleapis.com",
      model: config.model || "gemini-2.5-flash-preview-05-20",
      temperature: 0.2,
      maxTokens: config.maxTokens || 8192,
    };

    // Intelligent systems - Token optimization architecture
    this.contextAnalyzer = new IntelligentContextAnalyzer();
    this.promptEngine = new IntelligentPromptEngine();
    this.advancedPromptSystem = new AdvancedIntelligentPromptSystem();

    // Optimization config - Focus on token efficiency and API intelligence
    this.optimizationConfig = {
      useTokenOptimization: true,
      enableAPIIntelligence: true,
      enableSmartCaching: true,
      singleCallPerRole: true,
    };

    this.gameState = null;
    this.conversationHistory = [];
    this.gameMetrics = { totalGames: 0, avgIntelligence: 0.7 };

    this.learningConfig = {
      enableAdvancedLearning: true,
      learningThreshold: 1,
      adaptiveStrategy: true,
      contextualMemory: 10,
      forceAdvancedPrompts: true,
      optimizePromptGeneration: true,
    };

    this.efficientConfig = {
      gameLoopInterval: 10000,
      minInterval: 6000,
      maxRetries: 2,
      emergencyDelay: 15000,
    };

    this.apiOptimizer = {
      lastCallTime: 0,
      totalCalls: 0,
      successfulCalls: 0,
      rateLimitErrors: 0,
      guesserCalls: 0,
      hiderCalls: 0,
      staticResponsesUsed: 0,
      tokenOptimizationsUsed: 0,
      cachedResponsesUsed: 0,
    };

    this.contextCache = new Map();
    this.responseCache = new Map();
    this.maxContextHistory = 3;
  }

  // Optimized Guesser - Local preprocessing + API analysis
  async executeOptimizedGuesserMove(learningData = null) {
    console.log("Executing OPTIMIZED guesser move...");

    try {
      const preprocessedData = this.preprocessContextForAPI();
      const optimizedPrompt = this.buildTokenOptimizedGuesserPrompt(
        preprocessedData,
        learningData
      );

      const response = await this.callLLM(optimizedPrompt, {
        analysisType: "IntelligentGuessingWithAnalysis",
      });

      const result = this.parseAdvancedJSON(response);

      if (this.validateAdvancedIntelligence(result)) {
        this.apiOptimizer.guesserCalls++;
        this.apiOptimizer.tokenOptimizationsUsed++;
        return this.formatAdvancedResult(result);
      } else {
        return this.generateIntelligentFallback();
      }
    } catch (error) {
      console.warn("Optimized guesser move failed:", error.message);
      return this.generateIntelligentFallback();
    }
  }

  // Local preprocessing - Compress context info, reduce tokens
  preprocessContextForAPI() {
    const { min, max } = this.gameState.range;
    const rangeSize = max - min + 1;

    const phase = this.determineGamePhase();
    const phaseCode =
      {
        initial: "INIT",
        early: "EARLY",
        middle: "MID",
        late: "LATE",
        final: "FINAL",
      }[phase] || "MID";

    const recentFeedback = this.extractKeyFeedbackSignals();
    const compressedHistory = this.compressGuessHistory();
    const optimalGuess = Math.floor((min + max) / 2);
    const patternFlags = this.identifyQuickPatterns();

    return {
      range: `${min}-${max}`,
      size: rangeSize,
      optimal: optimalGuess,
      phase: phaseCode,
      turn: this.gameState.guessCount + 1,
      feedback: recentFeedback,
      history: compressedHistory,
      patterns: patternFlags,
      suggestions: this.generatePrecomputedSuggestions(
        min,
        max,
        rangeSize,
        phase
      ),
    };
  }

  // Extract key feedback signals
  extractKeyFeedbackSignals() {
    const recent = this.conversationHistory
      .slice(-2)
      .filter((h) => h.agent === "Hider")
      .map((h) => h.message);

    if (recent.length === 0) return "NONE";

    const feedback = recent.join(" ").toLowerCase();

    if (feedback.includes("incredibly close") || feedback.includes("breathing"))
      return "VERY_CLOSE";
    if (feedback.includes("very close")) return "V_CLOSE";
    if (feedback.includes("close") || feedback.includes("warm")) return "CLOSE";
    if (feedback.includes("getting") && feedback.includes("warm"))
      return "WARMING";
    if (feedback.includes("far") || feedback.includes("cold")) return "FAR";

    return "DIRECTIONAL";
  }

  // Compress guess history
  compressGuessHistory() {
    const history = this.gameState.guessHistory || [];
    if (history.length === 0) return "NONE";

    const recent = history.slice(-3);
    const pattern = this.detectHistoryPattern(history);

    return {
      recent: recent.join(","),
      pattern: pattern,
      count: history.length,
    };
  }

  // Quick pattern identification
  identifyQuickPatterns() {
    const flags = [];
    const { min, max } = this.gameState.range;

    if (max - min + 1 <= 5) flags.push("TINY");
    if (max - min + 1 <= 15) flags.push("SMALL");
    if (min <= 10 || max >= 90) flags.push("EDGE");
    if (this.gameState.guessCount > 8) flags.push("BEHIND");
    if (this.gameState.guessCount <= 5) flags.push("EFFICIENT");

    return flags.join("|") || "NORMAL";
  }

  // Precomputed suggestions
  generatePrecomputedSuggestions(min, max, rangeSize, phase) {
    const optimal = Math.floor((min + max) / 2);
    const suggestions = [`OPT:${optimal}`];

    if (phase === "FINAL" && rangeSize <= 3) {
      for (let i = min; i <= max; i++) {
        suggestions.push(`OPT:${i}`);
      }
    } else if (rangeSize <= 10) {
      const quarter = Math.floor(rangeSize / 4);
      suggestions.push(`ALT1:${min + quarter}`);
      suggestions.push(`ALT2:${max - quarter}`);
    }

    return suggestions.join(",");
  }

  // Detect history pattern
  detectHistoryPattern(history) {
    if (history.length < 2) return "NONE";

    const diffs = [];
    for (let i = 1; i < history.length; i++) {
      diffs.push(Math.abs(history[i] - history[i - 1]));
    }

    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    if (avgDiff > 30) return "BROAD";
    if (avgDiff > 15) return "MEDIUM";
    if (avgDiff > 5) return "NARROW";
    return "PRECISE";
  }

  // Build token-optimized guesser prompt
  buildTokenOptimizedGuesserPrompt(preprocessed, learningData) {
    const {
      range,
      size,
      optimal,
      phase,
      turn,
      feedback,
      history,
      patterns,
      suggestions,
    } = preprocessed;

    const learningCompressed = this.compressLearningData(learningData);

    return `INTELLIGENT NUMBER GUESSER
===========================

GAME: ${range} (${size}n) T${turn} ${phase}
OPTIMAL: ${optimal}
FEEDBACK: ${feedback}
HISTORY: ${history.recent || "NONE"} (${history.pattern})
PATTERNS: ${patterns}
SUGGESTIONS: ${suggestions}

${learningCompressed ? `LEARNING: ${learningCompressed}` : ""}

ANALYSIS TASKS:
1. Analyze current situation and proximity signals
2. Consider game phase and efficiency requirements  
3. Evaluate historical patterns and feedback quality
4. Choose optimal strategy: binary_search/precision_targeting/adaptive/final_choice
5. Make intelligent guess with reasoning

Your task is to perform intelligent analysis and make the best guess.
Consider proximity signals, game efficiency, and strategic adaptation.

RESPONSE:
{
  "analysis": "brief_situational_analysis",
  "strategy": "chosen_strategy_type", 
  "guess": your_intelligent_choice,
  "reasoning": "why_this_choice",
  "confidence": 0.85
}`;
  }

  // Compress learning data
  compressLearningData(learningData) {
    if (!learningData?.gameHistory?.length) return null;

    const games = learningData.gameHistory.length;
    const avgGuesses = (
      learningData.gameHistory.reduce(
        (sum, g) => sum + (g.guessCount || 7),
        0
      ) / games
    ).toFixed(1);
    const skill =
      avgGuesses <= 6 ? "EXPERT" : avgGuesses <= 8 ? "INTER" : "BEGIN";

    return `${games}G/${avgGuesses}avg/${skill}`;
  }

  // Optimized Hider - Local preprocessing + API response
  async executeOptimizedHiderResponse(guess, learningData = null) {
    console.log("Executing OPTIMIZED hider response...");

    if (guess === this.gameState.secret) {
      return this.generateStaticVictoryMessage();
    }

    try {
      const preprocessedData = this.preprocessHiderContextForAPI(guess);
      const optimizedPrompt = this.buildTokenOptimizedHiderPrompt(
        preprocessedData,
        learningData
      );

      const response = await this.callLLM(optimizedPrompt, {
        analysisType: "IntelligentHiderWithAnalysis",
      });

      const result = this.parseHiderJSON(response);

      if (this.validateHiderResponse(result, guess)) {
        this.apiOptimizer.hiderCalls++;
        this.apiOptimizer.tokenOptimizationsUsed++;
        return this.formatHiderResult(
          result,
          guess,
          preprocessedData.direction
        );
      } else {
        return this.generateHiderFallback(guess, preprocessedData.direction);
      }
    } catch (error) {
      console.warn("Optimized hider response failed:", error.message);
      const direction = guess < this.gameState.secret ? "higher" : "lower";
      return this.generateHiderFallback(guess, direction);
    }
  }

  // Hider local preprocessing
  preprocessHiderContextForAPI(guess) {
    const secret = this.gameState.secret;
    const direction = guess < secret ? "higher" : "lower";
    const distance = Math.abs(guess - secret);
    const turn = this.gameState.guessCount;

    let proximityCode;
    if (distance <= 3) proximityCode = "VERY_CLOSE";
    else if (distance <= 7) proximityCode = "CLOSE";
    else if (distance <= 15) proximityCode = "MODERATE";
    else if (distance <= 30) proximityCode = "FAR";
    else proximityCode = "VERY_FAR";

    const progressCode =
      turn <= 3
        ? "EARLY"
        : turn <= 7
        ? "MID"
        : turn <= 10
        ? "LATE"
        : "EXTENDED";

    const performancePattern = this.analyzePlayerPerformancePattern();

    return {
      guess,
      direction: direction.toUpperCase(),
      distance,
      proximity: proximityCode,
      turn,
      progress: progressCode,
      performance: performancePattern,
    };
  }

  // Analyze player performance pattern
  analyzePlayerPerformancePattern() {
    const history = this.gameState.guessHistory || [];
    if (history.length < 2) return "NEW_PLAYER";

    const patterns = this.detectMultiplePatterns(history);

    if (patterns.systematic && patterns.efficient) {
      return "SYSTEMATIC_EFFICIENT";
    } else if (patterns.systematic) {
      return "SYSTEMATIC_LEARNER";
    } else if (patterns.efficient) {
      return "INTUITIVE_EFFICIENT";
    } else if (patterns.random) {
      return "RANDOM_GUESSER";
    } else if (patterns.conservative) {
      return "CAUTIOUS_PLAYER";
    } else if (patterns.aggressive) {
      return "AGGRESSIVE_PLAYER";
    } else {
      return "ADAPTIVE_PLAYER";
    }
  }

  detectMultiplePatterns(history) {
    return {
      systematic: this.isSystematicApproach(history),
      efficient: this.isEfficientStrategy(history),
      random: this.isRandomStrategy(history),
      conservative: this.isConservativeStrategy(history),
      aggressive: this.isAggressiveStrategy(history),
    };
  }

  isSystematicApproach(history) {
    let expectedRange = { min: 1, max: 100 };
    let systematicSteps = 0;

    for (let i = 0; i < history.length - 1; i++) {
      const guess = history[i];
      const rangeSize = expectedRange.max - expectedRange.min + 1;

      if (guess >= expectedRange.min && guess <= expectedRange.max) {
        const mid = (expectedRange.min + expectedRange.max) / 2;
        const quarterRange = rangeSize / 4;

        if (Math.abs(guess - mid) <= quarterRange) {
          systematicSteps++;
        }
      }

      if (guess < this.gameState.secret) {
        expectedRange.min = guess + 1;
      } else {
        expectedRange.max = guess - 1;
      }
    }

    return systematicSteps / (history.length - 1) > 0.6;
  }

  isEfficientStrategy(history) {
    const actualGuesses = history.length;
    const theoreticalOptimal = Math.ceil(Math.log2(100));

    return actualGuesses <= theoreticalOptimal * 1.5;
  }

  isRandomStrategy(history) {
    if (history.length < 3) return false;

    const distances = [];
    for (let i = 1; i < history.length; i++) {
      distances.push(Math.abs(history[i] - history[i - 1]));
    }

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance =
      distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) /
      distances.length;

    return variance > 400 && avgDistance > 20;
  }

  isConservativeStrategy(history) {
    if (history.length < 3) return false;

    let smallSteps = 0;
    for (let i = 1; i < history.length; i++) {
      if (Math.abs(history[i] - history[i - 1]) <= 5) {
        smallSteps++;
      }
    }

    return smallSteps / (history.length - 1) > 0.7;
  }

  isAggressiveStrategy(history) {
    if (history.length < 3) return false;

    let bigJumps = 0;
    for (let i = 1; i < history.length; i++) {
      if (Math.abs(history[i] - history[i - 1]) > 25) {
        bigJumps++;
      }
    }

    return bigJumps / (history.length - 1) > 0.5;
  }

  // Build token-optimized hider prompt
  buildTokenOptimizedHiderPrompt(preprocessed, learningData) {
    const { guess, direction, proximity, turn, progress, performance } =
      preprocessed;

    const learningCompressed = this.compressLearningData(learningData);

    return `INTELLIGENT HIDER RESPONSE
==========================

SITUATION: G${guess} → ${direction} | ${proximity} | T${turn} ${progress}
PLAYER: ${performance}
${learningCompressed ? `HISTORY: ${learningCompressed}` : ""}

RESPONSE TASKS:
1. Analyze proximity level and player performance
2. Determine appropriate encouragement level
3. Consider player skill and game progress
4. Generate helpful but balanced response
5. Include required direction: ${direction}

Guidelines:
- ${proximity === "VERY_CLOSE" ? "High encouragement + excitement" : ""}
- ${proximity === "CLOSE" ? "Warm encouragement" : ""}
- ${proximity === "MODERATE" ? "Balanced guidance" : ""}
- ${proximity === "FAR" ? "Supportive direction" : ""}
- Always include "${direction}" in your response
- Match tone to ${progress} game stage

RESPONSE:
{
  "message": "Your_encouraging_response_with_${direction}",
  "tone": "encouraging/balanced/excited",
  "analysis": "brief_situation_assessment"
}`;
  }

  // Intelligent secret number generation
  async generateIntelligentSecretNumber(learningData) {
    console.log("Generating intelligent secret number...");

    try {
      const prompt = this.buildSecretNumberPrompt(learningData);
      const response = await this.callLLM(prompt, {
        analysisType: "SecretNumberGeneration",
      });

      const result = this.parseSecretNumberResponse(response);

      if (this.validateSecretNumber(result)) {
        this.apiOptimizer.hiderCalls++;
        return {
          number: result.number,
          message:
            result.message ||
            "I have chosen a number between 1 and 100. Good luck!",
          reasoning:
            result.reasoning || "Intelligent selection based on analysis",
          difficulty: result.difficulty || 0.6,
          intelligent: true,
        };
      } else {
        throw new Error("Invalid secret number response");
      }
    } catch (error) {
      console.warn("Intelligent secret generation failed:", error.message);
      return this.generateSmartSecretNumber(learningData);
    }
  }

  // Build secret number prompt
  buildSecretNumberPrompt(learningData) {
    const playerInsight = this.analyzePlayerPerformance(learningData);
    const gameHistory = learningData?.gameHistory || [];

    return `INTELLIGENT SECRET NUMBER SELECTION
=====================================

PLAYER ANALYSIS:
${
  gameHistory.length > 0
    ? `• Games Played: ${gameHistory.length}
• Skill Level: ${playerInsight.skillLevel}
• Average Guesses: ${playerInsight.avgGuesses}
• Performance Trend: ${this.calculateTrend(gameHistory)}`
    : `• New Player: No previous games
• Default Difficulty: Moderate`
}

SELECTION STRATEGY:
${this.generateSelectionStrategy(playerInsight, gameHistory)}

OBJECTIVES:
• Create engaging challenge
• Balance difficulty with fairness  
• Adapt to player skill level
• Provide satisfying game experience

Choose a number between 1 and 100 that will provide an appropriate challenge.

Response with JSON:
{
  "number": <your_strategic_choice_1_to_100>,
  "message": "I have chosen a number between 1 and 100. Good luck!",
  "reasoning": "Why you chose this number",
  "difficulty": <0.3_to_0.9_difficulty_level>
}`;
  }

  // Generate selection strategy
  generateSelectionStrategy(playerInsight, gameHistory) {
    if (gameHistory.length === 0) {
      return "• First game: Choose moderate difficulty (30-70 range)\n• Avoid extremes to ensure fair experience\n• Consider numbers that aren't too obvious";
    }

    const { skillLevel } = playerInsight;

    if (skillLevel === "expert") {
      return "• Expert player: Can handle challenging numbers\n• Consider edge cases, primes, or psychologically tricky numbers\n• Avoid overly simple patterns";
    } else if (skillLevel === "beginner") {
      return "• Beginner player: Keep it moderate\n• Choose numbers in 20-80 range\n• Avoid extremely difficult selections";
    } else {
      return "• Intermediate player: Balanced challenge\n• Mix of easy and moderate selections\n• Adapt based on recent performance";
    }
  }

  // Optimized game loop
  async runOptimizedGameLoop(onUpdate, onEnd, learningData) {
    const gameLoop = async () => {
      if (
        !this.gameState.isActive ||
        this.gameState.guessCount >= this.gameState.maxGuesses
      ) {
        return this.endIntelligentGameWithLearning(false, onEnd);
      }

      try {
        console.log(
          `=== Game Turn ${this.gameState.guessCount + 1} (2-API-Call Mode) ===`
        );

        const guesserMove = await this.executeOptimizedGuesserMove(
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
          const victoryResponse = {
            message: "🎉 Congratulations! You found my number! Great job!",
            intelligent: false,
            static: true,
          };

          onUpdate({
            sender: "ai",
            message: victoryResponse.message,
            metadata: { gameEnd: true, result: "victory" },
          });

          return this.endIntelligentGameWithLearning(true, onEnd);
        }

        const hiderResponse = await this.executeOptimizedHiderResponse(
          guesserMove.guess,
          learningData
        );

        this.updateGameRange(guesserMove.guess, hiderResponse.direction);

        this.addToHistory("Hider", hiderResponse.message, {
          action: "provide_feedback",
          intent: hiderResponse.intent,
        });

        onUpdate({
          sender: "ai",
          message: hiderResponse.message,
          metadata: {
            direction: hiderResponse.direction,
            currentRange: this.gameState.range,
          },
        });

        console.log(
          `✅ Turn completed with 2 API calls (Total: ${this.apiOptimizer.totalCalls})`
        );

        setTimeout(gameLoop, this.efficientConfig.gameLoopInterval);
      } catch (error) {
        console.error("Optimized game loop error:", error);

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

  // Game start method
  async startIntelligentGameWithLearning(learningData, onUpdate, onEnd) {
    console.log("Starting OPTIMIZED Game (1 initial + 2 per turn API calls)");

    this.gameState = {
      secret: null,
      guessCount: 0,
      maxGuesses: 15,
      range: { min: 1, max: 100 },
      guessHistory: [],
      isActive: true,
      currentRole: "hider",
      strategiesUsed: new Set(),
    };

    this.conversationHistory = [];

    try {
      const secretChoice = await this.generateIntelligentSecretNumber(
        learningData
      );
      this.gameState.secret = secretChoice.number;
      this.gameState.currentRole = "guesser";

      this.addToHistory("Hider", secretChoice.message, {
        action: "select_secret",
        reasoning: secretChoice.reasoning,
      });

      onUpdate({
        sender: "ai",
        message: secretChoice.message,
        metadata: {
          gameStart: true,
          reasoning: secretChoice.reasoning,
          difficulty: secretChoice.difficulty,
          optimizedMode: true,
          intelligent: secretChoice.intelligent,
        },
      });

      console.log(
        `✅ Secret number generated: ${secretChoice.number} (API calls: ${this.apiOptimizer.totalCalls})`
      );

      this.runOptimizedGameLoop(onUpdate, onEnd, learningData);
    } catch (error) {
      console.error("Optimized game failed to start:", error);
      onEnd({ success: false, error: error.message });
    }
  }

  // Helper methods
  determineGamePhase() {
    const guessCount = this.gameState.guessCount || 0;
    const rangeSize = this.gameState.range.max - this.gameState.range.min + 1;

    if (guessCount === 0) return "initial";
    if (rangeSize > 50 || guessCount <= 2) return "early";
    if (rangeSize > 15 || guessCount <= 5) return "middle";
    if (rangeSize > 5 || guessCount <= 10) return "late";
    return "final";
  }

  analyzePlayerPerformance(learningData) {
    if (!learningData?.gameHistory?.length) {
      return { skillLevel: "unknown", avgGuesses: 7 };
    }

    const avgGuesses =
      learningData.gameHistory.reduce(
        (sum, game) => sum + (game.guessCount || 7),
        0
      ) / learningData.gameHistory.length;

    const skillLevel =
      avgGuesses <= 6
        ? "expert"
        : avgGuesses <= 8
        ? "intermediate"
        : "beginner";

    return { skillLevel, avgGuesses };
  }

  calculateTrend(gameHistory) {
    if (gameHistory.length < 2) return "insufficient_data";

    const recent = gameHistory.slice(-3);
    const older = gameHistory.slice(0, -3);

    if (older.length === 0) return "new_player";

    const recentAvg =
      recent.reduce((sum, g) => sum + (g.guessCount || 7), 0) / recent.length;
    const olderAvg =
      older.reduce((sum, g) => sum + (g.guessCount || 7), 0) / older.length;

    if (recentAvg < olderAvg - 1) return "improving";
    if (recentAvg > olderAvg + 1) return "declining";
    return "stable";
  }

  // Parse and validation methods
  parseSecretNumberResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.number && !isNaN(parsed.number)) {
          return {
            number: parseInt(parsed.number),
            message:
              parsed.message || "I have chosen a number between 1 and 100.",
            reasoning: parsed.reasoning || "Strategic selection",
            difficulty: parsed.difficulty || 0.6,
          };
        }
      }

      const numberMatch = text.match(/(\d+)/);
      if (numberMatch) {
        const number = parseInt(numberMatch[1]);
        if (number >= 1 && number <= 100) {
          return {
            number: number,
            message: "I have chosen a number between 1 and 100.",
            reasoning: "Extracted from response",
            difficulty: 0.6,
          };
        }
      }

      throw new Error("No valid number found");
    } catch (error) {
      console.warn("Secret number parsing failed:", error.message);
      throw error;
    }
  }

  validateSecretNumber(result) {
    if (!result || !result.number || isNaN(result.number)) {
      return false;
    }
    const number = parseInt(result.number);
    return number >= 1 && number <= 100;
  }

  parseHiderJSON(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      const messageMatch = text.match(/"([^"]+)"/);
      if (messageMatch) {
        return {
          message: messageMatch[1],
          reasoning: "Extracted from response",
        };
      }

      return null;
    } catch (error) {
      console.warn("Hider JSON parsing failed:", error.message);
      return null;
    }
  }

  validateHiderResponse(result, guess) {
    if (!result || !result.message) {
      console.warn("Hider response missing message");
      return false;
    }

    const secret = this.gameState.secret;
    const requiredDirection = guess < secret ? "higher" : "lower";
    const message = result.message.toLowerCase();

    if (message.includes(requiredDirection)) {
      console.log(
        `✅ Hider response contains correct direction: ${requiredDirection}`
      );
      return true;
    } else {
      console.warn(
        `❌ Hider response missing required direction: ${requiredDirection}`
      );
      return false;
    }
  }

  parseAdvancedJSON(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        if (parsed.guess && !isNaN(parsed.guess)) {
          return {
            guess: parseInt(parsed.guess),
            analysis: parsed.analysis || "Strategic analysis",
            strategy: parsed.strategy || "intelligent_analysis",
            reasoning: parsed.reasoning || "AI analysis and decision",
            confidence: parsed.confidence || 0.8,
          };
        }
      }

      const numberMatch = text.match(/(\d+)/);
      if (numberMatch) {
        const guess = parseInt(numberMatch[1]);
        if (guess >= 1 && guess <= 100) {
          return {
            guess: guess,
            analysis: "Extracted from response",
            strategy: "fallback_extraction",
            reasoning: "Number extracted from API response",
            confidence: 0.6,
          };
        }
      }

      throw new Error("No valid guess found");
    } catch (error) {
      console.warn("Advanced JSON parsing failed:", error.message);
      throw error;
    }
  }

  validateAdvancedIntelligence(result) {
    if (!result || !result.guess || isNaN(result.guess)) {
      console.warn("Invalid guess format");
      return false;
    }

    const guess = parseInt(result.guess);
    const { min, max } = this.gameState.range;

    if (guess < min || guess > max) {
      console.warn(`Guess ${guess} outside valid range ${min}-${max}`);
      return false;
    }

    console.log(`✅ Valid guess: ${guess} with strategy: ${result.strategy}`);
    return true;
  }

  formatAdvancedResult(result) {
    const guess = parseInt(result.guess);

    return {
      guess: guess,
      message: `Based on intelligent analysis, I choose ${guess}`,
      reasoning: result.reasoning,
      analysis: result.analysis,
      confidence: result.confidence,
      strategy: result.strategy,
      contextual: true,
      advanced: true,
      tokenOptimized: true,
    };
  }

  formatHiderResult(result, guess, direction) {
    return {
      message: result.message,
      direction: direction.toLowerCase(),
      intent: "Optimized intelligent guidance",
      intelligent: true,
      tone: result.tone || "encouraging",
      analysis: result.analysis || "Contextual response",
    };
  }

  generateIntelligentFallback() {
    const { min, max } = this.gameState.range;
    const optimalGuess = Math.floor((min + max) / 2);
    const gamePhase = this.determineGamePhase();

    console.log(
      `Intelligent fallback activated: ${gamePhase} phase, optimal=${optimalGuess}`
    );

    return {
      guess: optimalGuess,
      message: `Using intelligent analysis, I choose ${optimalGuess}`,
      reasoning: `Intelligent fallback: ${gamePhase} phase binary search optimal`,
      confidence: 0.8,
      strategy: `intelligent_fallback_${gamePhase}`,
      contextual: true,
      fallback: true,
      advanced: true,
    };
  }

  generateHiderFallback(guess, direction) {
    console.log("Using Hider fallback");
    const secret = this.gameState.secret;
    const distance = Math.abs(guess - secret);

    let message = `The number is ${direction} than ${guess}.`;

    if (distance <= 3) {
      message += " You're very close!";
    } else if (distance <= 10) {
      message += " Getting warmer!";
    }

    return {
      message: message,
      direction: direction.toLowerCase(),
      intent: "Fallback guidance",
      intelligent: false,
      fallback: true,
    };
  }

  generateStaticVictoryMessage() {
    const messages = [
      "🎉 Congratulations! You found my number! Excellent work!",
      "🏆 Perfect! You got it! Well done!",
      "✨ Amazing! You found the number! Great job!",
    ];

    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      intelligent: false,
      static: true,
    };
  }

  generateSmartSecretNumber(learningData) {
    const gameHistory = learningData?.gameHistory || [];
    let number;

    if (gameHistory.length === 0) {
      number = 30 + Math.floor(Math.random() * 40);
    } else {
      const avgGuesses =
        gameHistory.reduce((sum, game) => sum + (game.guessCount || 7), 0) /
        gameHistory.length;

      if (avgGuesses < 5) {
        const difficultNumbers = [7, 13, 23, 37, 43, 67, 73, 89, 97];
        number =
          difficultNumbers[Math.floor(Math.random() * difficultNumbers.length)];
      } else if (avgGuesses > 10) {
        const easyNumbers = [25, 50, 75];
        number = easyNumbers[Math.floor(Math.random() * easyNumbers.length)];
      } else {
        number = 20 + Math.floor(Math.random() * 60);
      }
    }

    this.apiOptimizer.staticResponsesUsed++;

    return {
      number: number,
      message: "I have chosen a number between 1 and 100.",
      reasoning: `Smart selection based on ${gameHistory.length} previous games`,
      difficulty: number <= 10 || number >= 90 ? 0.8 : 0.5,
    };
  }

  updateGameRange(guess, direction) {
    const oldRange = { ...this.gameState.range };

    if (direction === "higher") {
      this.gameState.range.min = guess + 1;
    } else if (direction === "lower") {
      this.gameState.range.max = guess - 1;
    }

    if (this.gameState.range.min > this.gameState.range.max) {
      console.error("Invalid range after update!", {
        guess,
        direction,
        oldRange,
        newRange: this.gameState.range,
      });
      this.gameState.range = oldRange;
      throw new Error("Game state corruption detected");
    } else {
      const newSize = this.gameState.range.max - this.gameState.range.min + 1;
      console.log(
        `Range updated: ${oldRange.min}-${oldRange.max} → ${this.gameState.range.min}-${this.gameState.range.max} (size: ${newSize})`
      );
    }
  }

  addToHistory(agent, message, metadata = {}) {
    if (!message) return;

    this.conversationHistory.push({
      agent,
      message,
      metadata,
      timestamp: Date.now(),
    });

    if (this.conversationHistory.length > this.maxContextHistory) {
      this.conversationHistory.splice(
        0,
        this.conversationHistory.length - this.maxContextHistory
      );
    }
  }

  endIntelligentGameWithLearning(success, onEnd) {
    this.gameState.isActive = false;
    this.gameMetrics.totalGames++;

    console.log(`Game Ended: ${success ? "Victory" : "Defeat"}`);
    console.log(
      "Token-Optimized API Stats:",
      this.getOptimizedEfficiencyStats()
    );

    onEnd({
      success,
      guessCount: this.gameState.guessCount,
      secret: this.gameState.secret,
      conversationHistory: this.conversationHistory,
      efficiency: this.getOptimizedEfficiencyStats(),
    });
  }

  getOptimizedEfficiencyStats() {
    return {
      mode: "TOKEN_OPTIMIZED_API_INTELLIGENCE",
      approach: "Local preprocessing + API intelligence",
      totalAPICalls: this.apiOptimizer.totalCalls,
      successRate: this.getSuccessRate() + "%",
      guesserCalls: this.apiOptimizer.guesserCalls,
      hiderCalls: this.apiOptimizer.hiderCalls,
      tokenOptimizationsUsed: this.apiOptimizer.tokenOptimizationsUsed,
      staticResponsesUsed: this.apiOptimizer.staticResponsesUsed,
      cachedResponsesUsed: this.apiOptimizer.cachedResponsesUsed,
      averageCallsPerTurn:
        this.gameState?.guessCount > 0
          ? (this.apiOptimizer.totalCalls / this.gameState.guessCount).toFixed(
              1
            )
          : "0",
      optimizationLevel: "TOKEN_OPTIMIZED",
      intelligenceSource: "API_WITH_PREPROCESSING",
      costEfficiency: "MAXIMIZED",
    };
  }

  getSuccessRate() {
    return this.apiOptimizer.totalCalls > 0
      ? (
          (this.apiOptimizer.successfulCalls / this.apiOptimizer.totalCalls) *
          100
        ).toFixed(1)
      : "100";
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async callLLM(prompt, options = {}) {
    const { retryCount = 0, analysisType = "standard" } = options;

    console.log(`Sending ${analysisType} prompt (${prompt.length} chars)`);

    try {
      await this.enforceEfficientRateLimit();

      console.log(
        `LLM Call #${this.apiOptimizer.totalCalls + 1} - ${analysisType}`
      );

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
          topP: 0.9,
        },
      };

      const apiUrl = `${this.config.baseUrl}/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiToken}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      this.apiOptimizer.totalCalls++;
      this.apiOptimizer.lastCallTime = Date.now();

      if (response.status === 429) {
        this.apiOptimizer.rateLimitErrors++;
        console.warn(
          `Rate limit hit! Total: ${this.apiOptimizer.rateLimitErrors}`
        );

        if (retryCount < this.efficientConfig.maxRetries) {
          const backoffDelay = 15000 + retryCount * 15000;
          console.log(`Backoff delay: ${backoffDelay / 1000}s`);
          await this.sleep(backoffDelay);
          return this.callLLM(prompt, {
            retryCount: retryCount + 1,
            analysisType,
          });
        } else {
          throw new Error("Rate limit exceeded");
        }
      }

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!result || result.trim() === "") {
        console.warn(`Empty response for ${analysisType}`);

        if (retryCount < 1) {
          console.log(`Retrying empty response`);
          await this.sleep(3000);
          return this.callLLM(prompt, {
            retryCount: retryCount + 1,
            analysisType,
          });
        } else {
          throw new Error("LLM returned empty response");
        }
      }

      this.apiOptimizer.successfulCalls++;
      return result;
    } catch (error) {
      console.error(`LLM Error (${analysisType}):`, error);
      throw error;
    }
  }

  async enforceEfficientRateLimit() {
    const timeSinceLastCall = Date.now() - this.apiOptimizer.lastCallTime;
    let requiredInterval = this.efficientConfig.minInterval;

    if (this.apiOptimizer.rateLimitErrors > 0) {
      requiredInterval =
        this.efficientConfig.minInterval *
        (1 + this.apiOptimizer.rateLimitErrors * 0.5);
    }

    if (timeSinceLastCall < requiredInterval) {
      const waitTime = requiredInterval - timeSinceLastCall;
      console.log(`Rate limiting: ${waitTime}ms`);
      await this.sleep(waitTime);
    }
  }

  reset() {
    this.gameState = null;
    this.conversationHistory = [];
    this.contextCache.clear();
    this.responseCache.clear();

    this.apiOptimizer = {
      lastCallTime: 0,
      totalCalls: 0,
      successfulCalls: 0,
      rateLimitErrors: 0,
      guesserCalls: 0,
      hiderCalls: 0,
      staticResponsesUsed: 0,
      tokenOptimizationsUsed: 0,
      cachedResponsesUsed: 0,
    };
  }
}
