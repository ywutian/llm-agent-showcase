export class IntelligentPromptEngine {
  constructor() {
    this.promptCache = new Map();
    this.successPatterns = new Map();
    this.performanceMetrics = new Map();

    this.confidenceMetrics = {
      gamePhaseWeights: {
        initial: { exploration: 0.7, certainty: 0.3 },
        early: { exploration: 0.6, certainty: 0.4 },
        middle: { exploration: 0.4, certainty: 0.6 },
        late: { exploration: 0.2, certainty: 0.8 },
        final: { exploration: 0.1, certainty: 0.9 },
      },
      strategyConfidence: {
        binary_search: 0.9,
        adaptive_exploration: 0.7,
        random_guess: 0.4,
        pattern_based: 0.8,
        elimination: 0.85,
        creative_approach: 0.6,
        meta_strategy: 0.75,
      },
      contextFactors: {
        rangeNarrowing: 0.3,
        guessHistory: 0.25,
        feedbackQuality: 0.2,
        adaptationLevel: 0.15,
        gamePhase: 0.1,
      },
    };

    this.compactTemplates = {
      microGuesser: "R:{range} G:{guess} J:{json}",
      compactGuesser: "Game R:{range} L:{last} S:{strategy} Next:{json}",
      microHider: "Secret:{secret} Guess:{guess} Dir:{direction} Response:",
      compactHider: "N:{secret} G:{guess}→{direction} + hint: {json}",
      intelligentGuesser:
        "NumGuess R:{range} Phase:{phase} Conf:{confidence} Strategy:{strategy} → {json}",
      contextualHider:
        "Hider S:{secret} G:{guess}→{direction} Context:{context} → {json}",
      learningGuesser:
        "Learn R:{range} History:{history} Pattern:{pattern} Next:{json}",
      adaptiveHider: "Adapt Secret:{secret} Player:{profile} Response:{json}",
    };

    this.intelligentSubstitutions = {
      gameState: (gs) => `R:${gs.range.min}-${gs.range.max} G:${gs.guessCount}`,
      strategy: (s) =>
        ({
          binary_search: "Bin",
          adaptive_exploration: "Adapt",
          random_guess: "Rand",
          pattern_based: "Pat",
          creative_approach: "Creative",
          meta_strategy: "Meta",
        }[s] || "Std"),
      confidence: (c) => (c > 0.8 ? "Hi" : c > 0.6 ? "Med" : "Lo"),
      phase: (p) =>
        ({
          initial: "Init",
          early: "Early",
          middle: "Mid",
          late: "Late",
          final: "Final",
        }[p] || "Unknown"),
      complexity: (c) => (c > 0.7 ? "Complex" : c > 0.4 ? "Med" : "Simple"),
      learning: (l) => (l > 0.8 ? "Expert" : l > 0.5 ? "Learn" : "Basic"),
    };

    this.optimizationConfig = {
      enableCaching: true,
      maxCacheSize: 100,
      adaptiveComplexity: true,
      intelligentFallbacks: true,
      performanceTracking: true,
    };

    this.qualityMetrics = {
      tokenEfficiency: new Map(),
      responseQuality: new Map(),
      strategySuccess: new Map(),
    };
  }

  buildGamePrompt(config) {
    const { gameState, conversationHistory, learningData, type } = config;

    try {
      switch (type) {
        case "intelligent_guess":
          return this.generateGuesserPrompt(
            gameState,
            null,
            conversationHistory,
            learningData
          );
        case "intelligent_feedback":
          return this.generateHiderPrompt(
            gameState,
            null,
            conversationHistory,
            learningData
          );
        case "secret_selection":
          return this.buildEnhancedSecretPrompt(null, learningData);
        default:
          return this.generateGuesserPrompt(
            gameState,
            null,
            conversationHistory,
            learningData
          );
      }
    } catch (error) {
      console.warn("Prompt generation failed, using fallback:", error.message);
      return this.buildFallbackPrompt(config);
    }
  }

  generateHiderPrompt(
    gameState,
    contextAnalysis,
    conversationHistory,
    learningData = null
  ) {
    const isSecretSelection = !gameState.secret;

    if (isSecretSelection) {
      return this.buildEnhancedSecretPrompt(contextAnalysis, learningData);
    }

    const enhancedContext = this.analyzeEnhancedContext(
      gameState,
      conversationHistory,
      learningData
    );
    const contextualConfidence = this.calculateContextualConfidence(
      gameState,
      enhancedContext,
      conversationHistory,
      "hider"
    );

    return this.buildEnhancedFeedbackPrompt(
      gameState,
      enhancedContext,
      contextualConfidence,
      learningData
    );
  }

  generateGuesserPrompt(
    gameState,
    contextAnalysis,
    conversationHistory,
    learningData = null
  ) {
    const enhancedContext = this.analyzeEnhancedContext(
      gameState,
      conversationHistory,
      learningData
    );
    const complexity = this.assessEnhancedComplexity(
      gameState,
      enhancedContext,
      learningData
    );

    if (this.optimizationConfig.enableCaching) {
      const cached = this.checkPromptCache(gameState, complexity);
      if (cached) {
        this.recordCacheHit();
        return cached;
      }
    }

    let prompt;
    if (complexity.level === "simple") {
      prompt = this.buildMicroPrompt(gameState, complexity);
    } else if (complexity.level === "medium") {
      prompt = this.buildCompactPrompt(gameState, enhancedContext, complexity);
    } else {
      prompt = this.buildFullPrompt(
        gameState,
        enhancedContext,
        conversationHistory,
        complexity,
        learningData
      );
    }

    if (this.optimizationConfig.enableCaching) {
      this.storePromptCache(gameState, complexity, prompt);
    }

    return prompt;
  }

  analyzeEnhancedContext(gameState, conversationHistory, learningData) {
    const context = {
      gamePhase: this.determineGamePhase(gameState),
      rangeEfficiency: this.calculateRangeEfficiency(gameState),
      guessPattern: this.analyzeGuessPattern(gameState),
      learningInsights: this.extractLearningInsights(learningData),
      playerBehavior: this.analyzePlayerBehavior(conversationHistory),
      strategicRecommendation: this.generateStrategicRecommendation(
        gameState,
        learningData
      ),
    };

    return context;
  }

  assessEnhancedComplexity(gameState, enhancedContext, learningData) {
    const factors = {
      rangeSize: gameState.range.max - gameState.range.min + 1,
      guessCount: gameState.guessCount || 0,
      strategyType:
        enhancedContext?.strategicRecommendation?.strategy || "unknown",
      adaptation: enhancedContext?.playerBehavior?.adaptationLevel || 0.5,
    };

    const enhancedFactors = {
      ...factors,
      learningDepth: learningData?.gameHistory?.length || 0,
      contextRichness: this.calculateContextRichness(enhancedContext),
      playerSophistication:
        enhancedContext?.playerBehavior?.sophistication || 0.5,
      gamePhaseIntensity: this.getGamePhaseIntensity(enhancedContext.gamePhase),
    };

    let complexity = 0;

    if (enhancedFactors.rangeSize > 50) complexity += 0.3;
    if (enhancedFactors.guessCount > 5) complexity += 0.2;
    if (enhancedFactors.strategyType === "adaptive") complexity += 0.3;
    if (enhancedFactors.adaptation > 0.7) complexity += 0.2;

    if (enhancedFactors.learningDepth > 5) complexity += 0.2;
    if (enhancedFactors.contextRichness > 0.7) complexity += 0.15;
    if (enhancedFactors.playerSophistication > 0.8) complexity += 0.1;
    if (enhancedFactors.gamePhaseIntensity > 0.8) complexity += 0.1;

    return {
      level:
        complexity < 0.3 ? "simple" : complexity < 0.7 ? "medium" : "complex",
      score: complexity,
      factors: enhancedFactors,
      tokenBudget: this.calculateOptimalTokenBudget(
        complexity,
        enhancedFactors
      ),
      cacheKey: this.generateCacheKey(gameState, enhancedFactors),
    };
  }

  calculateOptimalTokenBudget(complexity, factors) {
    let budget = complexity < 0.3 ? 60 : complexity < 0.7 ? 100 : 150;

    if (factors.learningDepth > 10) budget += 20;
    if (factors.playerSophistication > 0.8) budget += 15;

    return Math.min(200, budget);
  }

  buildMicroPrompt(gameState, complexity) {
    const { min, max } = gameState.range;
    const size = max - min + 1;
    const phase = this.determineGamePhase(gameState);

    return `${phase} R:${min}-${max}(${size}) Smart guess JSON: {guess:N,reason:"brief",conf:0.8}`;
  }

  buildCompactPrompt(gameState, enhancedContext, complexity) {
    const { min, max } = gameState.range;
    const strategy =
      enhancedContext?.strategicRecommendation?.strategy || "binary";
    const lastGuess = gameState.guessHistory?.slice(-1)[0] || "none";
    const confidence =
      enhancedContext?.strategicRecommendation?.confidence || 0.7;

    return `NumGuess R:${min}-${max} Last:${lastGuess} Strategy:${strategy} Conf:${confidence}
  Optimal: {guess:N,reason:"strategic",conf:${confidence.toFixed(1)}}`;
  }

  buildFullPrompt(
    gameState,
    enhancedContext,
    conversationHistory,
    complexity,
    learningData
  ) {
    const contextualConfidence = this.calculateContextualConfidence(
      gameState,
      enhancedContext,
      conversationHistory,
      "guesser"
    );

    const recentFeedback = this.extractRecentFeedback(conversationHistory);
    const strategicGuidance = this.generateEnhancedStrategicGuidance(
      gameState,
      enhancedContext,
      contextualConfidence,
      learningData
    );

    return this.buildEnhancedGuesserPrompt(
      gameState,
      enhancedContext,
      recentFeedback,
      strategicGuidance,
      contextualConfidence,
      complexity
    );
  }

  generateEnhancedStrategicGuidance(
    gameState,
    enhancedContext,
    contextualConfidence,
    learningData
  ) {
    const baseGuidance =
      enhancedContext?.strategicRecommendation?.reasoning ||
      "Optimal binary search";
    const confidenceLevel = contextualConfidence.value;
    const gamePhase = enhancedContext.gamePhase;
    const learningInsight =
      enhancedContext.learningInsights?.primaryPattern || "none";

    let guidance = baseGuidance;

    if (confidenceLevel > 0.8) {
      guidance += " + Hi conf: decisive action";
    } else if (confidenceLevel > 0.6) {
      guidance += " + Med conf: balanced approach";
    } else {
      guidance += " + Lo conf: exploratory move";
    }

    if (gamePhase === "final") {
      guidance += " + Final phase: precision required";
    } else if (gamePhase === "late") {
      guidance += " + Late game: strategic focus";
    }

    if (learningInsight !== "none") {
      guidance += ` + Learning: ${learningInsight}`;
    }

    return guidance;
  }

  buildEnhancedGuesserPrompt(
    gameState,
    enhancedContext,
    recentFeedback,
    strategicGuidance,
    contextualConfidence,
    complexity
  ) {
    const optimalGuess = Math.floor(
      (gameState.range.min + gameState.range.max) / 2
    );

    return `ENHANCED GUESSER SYSTEM
  ============================
  
  GAME STATE:
  • Range: [${gameState.range.min}, ${gameState.range.max}] (${
      gameState.range.max - gameState.range.min + 1
    } numbers)
  • Count: ${gameState.guessCount}/${gameState.maxGuesses}
  • Phase: ${enhancedContext.gamePhase.toUpperCase()}
  • History: ${JSON.stringify(gameState.guessHistory?.slice(-3) || [])}
  
  INTELLIGENCE ANALYSIS:
  • Recent: ${recentFeedback}
  • Strategy: ${strategicGuidance}
  • Confidence: ${contextualConfidence.value} (${
      contextualConfidence.reasoning
    })
  • Complexity: ${complexity.level} (${complexity.score.toFixed(2)})
  
  LEARNING INSIGHTS:
  ${
    enhancedContext.learningInsights
      ? `• Pattern: ${enhancedContext.learningInsights.primaryPattern}
  • Recommendation: ${enhancedContext.learningInsights.recommendation}`
      : "• No learning data available"
  }
  
  OPTIMAL CHOICE: ${optimalGuess}
  
  Response Format:
  {
    "guess": ${optimalGuess},
    "message": "Based on enhanced analysis, I choose ${optimalGuess}",
    "reasoning": "${strategicGuidance}",
    "confidence": ${contextualConfidence.value},
    "strategy": "${
      enhancedContext?.strategicRecommendation?.strategy || "enhanced_binary"
    }"
  }`;
  }

  buildEnhancedSecretPrompt(contextAnalysis, learningData) {
    const learningInsights = this.extractLearningInsights(learningData);
    const difficulty = learningInsights?.recommendedDifficulty || 0.6;

    return `ENHANCED HIDER SYSTEM - SECRET SELECTION
  ==========================================
  
  LEARNING ANALYSIS:
  ${
    learningData
      ? `• Previous games: ${learningData.gameHistory?.length || 0}
  • Player skill pattern: ${learningInsights?.playerSkillLevel || "unknown"}
  • Recommended difficulty: ${difficulty}`
      : "• No learning data - selecting balanced difficulty"
  }
  
  STRATEGIC OBJECTIVES:
  • Create engaging challenge
  • Balance difficulty with fairness
  • Apply learned patterns
  
  Response Format:
  {
    "number": <strategic_choice_1_to_100>,
    "message": "I have chosen a number between 1 and 100. Good luck!",
    "reasoning": "Strategic selection based on analysis",
    "difficulty": ${difficulty},
    "confidence": 0.8
  }`;
  }

  buildEnhancedFeedbackPrompt(
    gameState,
    enhancedContext,
    contextualConfidence,
    learningData
  ) {
    const direction =
      gameState.lastGuess < gameState.secret ? "higher" : "lower";
    const distance = Math.abs(gameState.lastGuess - gameState.secret);
    const proximity =
      distance <= 5 ? "very close" : distance <= 15 ? "close" : "moderate";

    return `ENHANCED HIDER FEEDBACK SYSTEM
  ==================================
  
  GAME STATE:
  • Secret: ${gameState.secret}
  • Guess: ${gameState.lastGuess}
  • Direction: ${direction.toUpperCase()}
  • Distance: ${distance} (${proximity})
  • Context: ${enhancedContext?.playerBehavior?.recentPattern || "analyzing"}
  
  FEEDBACK STRATEGY:
  • Confidence: ${contextualConfidence.value}
  • Engagement level: ${
    enhancedContext?.playerBehavior?.engagementLevel || "moderate"
  }
  
  Response Format:
  {
    "message": "The number is ${direction} than ${gameState.lastGuess}${
      proximity === "very close"
        ? ". You're getting very close!"
        : proximity === "close"
        ? ". You're getting warmer!"
        : "."
    }",
    "direction": "${direction}",
    "intent": "Clear guidance with appropriate encouragement",
    "confidence": ${contextualConfidence.value}
  }`;
  }

  checkPromptCache(gameState, complexity) {
    if (!this.optimizationConfig.enableCaching) return null;

    const cacheKey = complexity.cacheKey;
    return this.promptCache.get(cacheKey) || null;
  }

  storePromptCache(gameState, complexity, prompt) {
    if (!this.optimizationConfig.enableCaching) return;

    const cacheKey = complexity.cacheKey;
    this.promptCache.set(cacheKey, prompt);

    if (this.promptCache.size > this.optimizationConfig.maxCacheSize) {
      const firstKey = this.promptCache.keys().next().value;
      this.promptCache.delete(firstKey);
    }
  }

  generateCacheKey(gameState, factors) {
    return `${gameState.range.min}-${gameState.range.max}_${gameState.guessCount}_${factors.rangeSize}_${factors.learningDepth}`;
  }

  recordCacheHit() {
    const hits = this.performanceMetrics.get("cacheHits") || 0;
    this.performanceMetrics.set("cacheHits", hits + 1);
  }

  determineGamePhase(gameState) {
    const guessCount = gameState.guessCount || 0;
    const maxGuesses = gameState.maxGuesses || 15;
    const progress = guessCount / maxGuesses;
    const rangeSize = gameState.range.max - gameState.range.min + 1;

    if (guessCount === 0) return "initial";
    if (progress <= 0.25 || rangeSize > 50) return "early";
    if (progress <= 0.6 || rangeSize > 10) return "middle";
    if (progress <= 0.85 || rangeSize > 3) return "late";
    return "final";
  }

  calculateRangeEfficiency(gameState) {
    const initialRange = 100;
    const currentRange = gameState.range.max - gameState.range.min + 1;
    return 1 - currentRange / initialRange;
  }

  analyzeGuessPattern(gameState) {
    if (!gameState.guessHistory || gameState.guessHistory.length < 2) {
      return { pattern: "insufficient_data", consistency: 0.5 };
    }

    const guesses = gameState.guessHistory;
    const differences = [];

    for (let i = 1; i < guesses.length; i++) {
      differences.push(Math.abs(guesses[i] - guesses[i - 1]));
    }

    const avgDifference =
      differences.reduce((a, b) => a + b, 0) / differences.length;

    if (avgDifference > 30)
      return { pattern: "broad_search", consistency: 0.7 };
    if (avgDifference > 15)
      return { pattern: "moderate_search", consistency: 0.8 };
    if (avgDifference > 5)
      return { pattern: "focused_search", consistency: 0.9 };
    return { pattern: "precise_search", consistency: 0.95 };
  }

  extractLearningInsights(learningData) {
    if (
      !learningData ||
      !learningData.gameHistory ||
      learningData.gameHistory.length === 0
    ) {
      return {
        primaryPattern: "none",
        recommendation: "use_standard_approach",
        recommendedDifficulty: 0.6,
      };
    }

    const games = learningData.gameHistory;
    const avgGuesses =
      games.reduce((sum, game) => sum + (game.guessCount || 7), 0) /
      games.length;

    const playerSkillLevel =
      avgGuesses <= 6
        ? "expert"
        : avgGuesses <= 8
        ? "intermediate"
        : "beginner";
    const recommendedDifficulty =
      playerSkillLevel === "expert"
        ? 0.8
        : playerSkillLevel === "intermediate"
        ? 0.6
        : 0.4;

    return {
      primaryPattern: `avg_${avgGuesses.toFixed(1)}_guesses`,
      recommendation: `adapt_to_${playerSkillLevel}`,
      playerSkillLevel,
      recommendedDifficulty,
      gamesAnalyzed: games.length,
    };
  }

  analyzePlayerBehavior(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return {
        sophistication: 0.5,
        engagementLevel: "moderate",
        adaptationLevel: 0.5,
      };
    }

    const recentMessages = conversationHistory.slice(-5);
    let sophistication = 0.5;
    let engagementLevel = "moderate";

    const hasComplexReasoning = recentMessages.some(
      (msg) => msg.metadata?.reasoning && msg.metadata.reasoning.length > 20
    );

    if (hasComplexReasoning) sophistication += 0.2;

    const hasAdaptiveStrategy = recentMessages.some(
      (msg) =>
        msg.metadata?.strategy && msg.metadata.strategy.includes("adaptive")
    );

    if (hasAdaptiveStrategy) sophistication += 0.15;

    engagementLevel =
      sophistication > 0.7 ? "high" : sophistication > 0.4 ? "moderate" : "low";

    return {
      sophistication: Math.min(1.0, sophistication),
      engagementLevel,
      adaptationLevel: sophistication,
      recentPattern: hasAdaptiveStrategy ? "adaptive" : "standard",
    };
  }

  generateStrategicRecommendation(gameState, learningData) {
    const rangeSize = gameState.range.max - gameState.range.min + 1;
    const learningInsights = this.extractLearningInsights(learningData);

    let strategy = "binary_search";
    let confidence = 0.8;
    let reasoning = "Standard binary search approach";

    if (rangeSize <= 5) {
      strategy = "elimination";
      confidence = 0.9;
      reasoning = "Small range - use elimination strategy";
    } else if (rangeSize > 50) {
      strategy = "adaptive_exploration";
      confidence = 0.75;
      reasoning = "Large range - use adaptive exploration";
    }

    if (learningInsights.playerSkillLevel === "expert") {
      strategy = "meta_strategy";
      confidence = 0.85;
      reasoning = "Expert player detected - use meta-strategy";
    } else if (learningInsights.playerSkillLevel === "beginner") {
      strategy = "binary_search";
      confidence = 0.9;
      reasoning = "Beginner player - maintain standard approach";
    }

    return { strategy, confidence, reasoning };
  }

  calculateContextRichness(enhancedContext) {
    let richness = 0.3;

    if (enhancedContext.learningInsights?.gamesAnalyzed > 0) richness += 0.2;
    if (enhancedContext.playerBehavior?.sophistication > 0.6) richness += 0.2;
    if (enhancedContext.strategicRecommendation?.confidence > 0.8)
      richness += 0.15;
    if (enhancedContext.guessPattern?.consistency > 0.8) richness += 0.15;

    return Math.min(1.0, richness);
  }

  getGamePhaseIntensity(phase) {
    const intensityMap = {
      initial: 0.3,
      early: 0.4,
      middle: 0.6,
      late: 0.8,
      final: 1.0,
    };
    return intensityMap[phase] || 0.5;
  }

  buildFallbackPrompt(config) {
    const { gameState, type } = config;

    if (type === "intelligent_feedback" || (gameState && gameState.secret)) {
      const direction =
        gameState.lastGuess < gameState.secret ? "higher" : "lower";
      return `Fallback: The number is ${direction} than ${gameState.lastGuess}. {message:"${direction} than ${gameState.lastGuess}",direction:"${direction}"}`;
    }

    const optimalGuess = gameState
      ? Math.floor((gameState.range.min + gameState.range.max) / 2)
      : 50;
    return `Fallback guess: {guess:${optimalGuess},reason:"fallback binary search",confidence:0.7}`;
  }

  getCacheStats() {
    return {
      cacheSize: this.promptCache.size,
      cacheHits: this.performanceMetrics.get("cacheHits") || 0,
      successPatterns: this.successPatterns.size,
      confidenceMetrics: "enhanced",
      performanceMetrics: Object.fromEntries(this.performanceMetrics),
    };
  }

  recordPromptUsage(prompt, result) {
    const usage = {
      timestamp: Date.now(),
      promptLength: prompt.length,
      success: result ? true : false,
      promptType: this.detectPromptType(prompt),
    };

    const usageHistory = this.performanceMetrics.get("usageHistory") || [];
    usageHistory.push(usage);

    if (usageHistory.length > 100) {
      usageHistory.shift();
    }

    this.performanceMetrics.set("usageHistory", usageHistory);
  }

  detectPromptType(prompt) {
    if (prompt.includes("ENHANCED GUESSER")) return "enhanced_guesser";
    if (prompt.includes("ENHANCED HIDER")) return "enhanced_hider";
    if (prompt.includes("Range:") && prompt.length < 100) return "micro";
    if (prompt.includes("NumGuess") && prompt.length < 200) return "compact";
    return "full";
  }

  getEngineStats() {
    const usageHistory = this.performanceMetrics.get("usageHistory") || [];

    return {
      promptsGenerated: usageHistory.length,
      successRate:
        usageHistory.length > 0
          ? (
              (usageHistory.filter((u) => u.success).length /
                usageHistory.length) *
              100
            ).toFixed(1) + "%"
          : "0%",
      cacheHitRate:
        this.promptCache.size > 0
          ? (
              ((this.performanceMetrics.get("cacheHits") || 0) /
                this.promptCache.size) *
              100
            ).toFixed(1) + "%"
          : "0%",
      averagePromptLength:
        usageHistory.length > 0
          ? (
              usageHistory.reduce((sum, u) => sum + u.promptLength, 0) /
              usageHistory.length
            ).toFixed(0)
          : "0",
    };
  }

  reset() {
    this.promptCache.clear();
    this.successPatterns.clear();
    this.performanceMetrics.clear();
    console.log("Enhanced Prompt Engine reset completed");
  }

  // Placeholder methods that might be called by other parts of the system
  calculateContextualConfidence(gameState, context, history, role) {
    const baseConfidence = 0.7;
    const phaseMultiplier =
      this.confidenceMetrics.gamePhaseWeights[context.gamePhase]?.certainty ||
      0.6;

    return {
      value: Math.min(0.95, baseConfidence * phaseMultiplier),
      reasoning: `${role} confidence based on ${context.gamePhase} phase`,
    };
  }

  extractRecentFeedback(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return "No recent feedback available";
    }

    const recentMessages = conversationHistory.slice(-2);
    return recentMessages
      .map((msg) => msg.message || msg.content || "")
      .join(" | ");
  }
}
