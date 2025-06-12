export class AdvancedIntelligentPromptSystem {
  constructor() {
    // Learning data storage
    this.learningDatabase = {
      rangePatterns: new Map(),
      feedbackAnalysis: new Map(),
      strategyEffectiveness: new Map(),
      opponentBehavior: new Map(),
      contextualInsights: [],
    };

    // Intelligent range classification system
    this.rangeClassification = {
      mega_range: { min: 51, max: 100, strategy: "aggressive_binary" },
      large_range: { min: 26, max: 50, strategy: "standard_binary" },
      medium_range: { min: 11, max: 25, strategy: "adaptive_binary" },
      small_range: { min: 6, max: 10, strategy: "smart_elimination" },
      tiny_range: { min: 3, max: 5, strategy: "pattern_recognition" },
      final_range: { min: 1, max: 2, strategy: "educated_guess" },
    };

    // Context intelligent analysis
    this.contextAnalyzers = {
      proximity: this.analyzeProximitySignals.bind(this),
      momentum: this.analyzeMomentumPatterns.bind(this),
      feedback: this.analyzeFeedbackQuality.bind(this),
      efficiency: this.analyzeEfficiencyTrends.bind(this),
    };
  }

  // Main method: Build learning-oriented intelligent prompt
  buildLearningOrientedPrompt(
    gameState,
    conversationHistory,
    learningData = null
  ) {
    const rangeSize = gameState.range.max - gameState.range.min + 1;
    const classification = this.classifyRange(rangeSize);
    const contextualInsights = this.gatherContextualInsights(
      gameState,
      conversationHistory
    );
    const learningInsights = this.extractLearningInsights(learningData);
    const strategicGuidance = this.generateStrategicGuidance(
      gameState,
      contextualInsights,
      learningInsights
    );

    return this.assembleIntelligentPrompt({
      classification,
      gameState,
      contextualInsights,
      learningInsights,
      strategicGuidance,
      conversationHistory,
    });
  }

  // Intelligent range classification
  classifyRange(rangeSize) {
    for (const [category, config] of Object.entries(this.rangeClassification)) {
      if (rangeSize >= config.min && rangeSize <= config.max) {
        return { category, config, size: rangeSize };
      }
    }
    return {
      category: "ultra_large",
      config: { strategy: "ultra_aggressive_binary" },
      size: rangeSize,
    };
  }

  // Gather contextual insights
  gatherContextualInsights(gameState, conversationHistory) {
    const insights = {
      proximitySignals: this.contextAnalyzers.proximity(conversationHistory),
      momentumPatterns: this.contextAnalyzers.momentum(gameState),
      feedbackQuality: this.contextAnalyzers.feedback(conversationHistory),
      efficiencyTrends: this.contextAnalyzers.efficiency(gameState),
    };

    return this.synthesizeInsights(insights);
  }

  // Extract learning insights
  extractLearningInsights(learningData) {
    if (!learningData) return { confidence: 0.5, recommendations: [] };

    const gameHistory = learningData.gameHistory || [];
    const insights = {
      averageGuesses: this.calculateAverageGuesses(gameHistory),
      successPatterns: this.identifySuccessPatterns(gameHistory),
      commonMistakes: this.identifyCommonMistakes(gameHistory),
      optimalStrategies: this.identifyOptimalStrategies(gameHistory),
    };

    return {
      confidence: Math.min(0.95, 0.5 + gameHistory.length * 0.05),
      ...insights,
    };
  }

  // Generate strategic guidance
  generateStrategicGuidance(gameState, contextualInsights, learningInsights) {
    const { min, max } = gameState.range;
    const optimalGuess = Math.floor((min + max) / 2);
    const rangeSize = max - min + 1;

    let primaryStrategy = "binary_search";
    let confidence = 0.8;
    let reasoning = `Standard binary search for range ${min}-${max}`;

    // Adjust strategy based on learning data
    if (learningInsights.confidence > 0.7) {
      if (learningInsights.successPatterns.includes("aggressive_early")) {
        primaryStrategy = "aggressive_binary";
        confidence = 0.9;
        reasoning = "Learned pattern: aggressive early moves are effective";
      } else if (
        learningInsights.commonMistakes.includes("premature_precision")
      ) {
        primaryStrategy = "conservative_binary";
        confidence = 0.85;
        reasoning =
          "Learned pattern: avoid premature precision, maintain binary search";
      }
    }

    // Adjust based on context
    if (contextualInsights.proximitySignal === "very_close" && rangeSize > 5) {
      reasoning += " | Proximity detected but maintaining optimal strategy";
    }

    return {
      primaryStrategy,
      optimalGuess,
      confidence,
      reasoning,
      alternatives: this.generateAlternativeStrategies(
        gameState,
        contextualInsights
      ),
    };
  }

  // Assemble intelligent prompt
  assembleIntelligentPrompt({
    classification,
    gameState,
    contextualInsights,
    learningInsights,
    strategicGuidance,
  }) {
    const { min, max } = gameState.range;
    const { category, size } = classification;
    const { optimalGuess, reasoning, confidence } = strategicGuidance;

    let prompt = `INTELLIGENT NUMBER GUESSING SYSTEM
===========================================

CURRENT SITUATION:
• Range: ${min} to ${max} (${size} numbers remaining)
• Range Category: ${category.toUpperCase().replace("_", " ")}
• Optimal Mathematical Choice: ${optimalGuess}

`;

    // Add learning insights
    if (learningInsights.confidence > 0.6) {
      prompt += `LEARNED INTELLIGENCE (Confidence: ${(
        learningInsights.confidence * 100
      ).toFixed(0)}%):
• Average guesses in similar situations: ${
        learningInsights.averageGuesses || "N/A"
      }
• Success patterns identified: ${
        learningInsights.successPatterns.join(", ") || "Analyzing..."
      }
• Strategic recommendation: ${reasoning}

`;
    }

    // Add contextual analysis
    if (contextualInsights.proximitySignal !== "none") {
      prompt += `CONTEXTUAL ANALYSIS:
• Proximity signals: ${contextualInsights.proximitySignal}
• Momentum pattern: ${contextualInsights.momentum}
• Feedback quality: ${contextualInsights.feedbackQuality}
• Strategic note: ${contextualInsights.strategicNote}

`;
    }

    // Add specific strategy guidance
    prompt += this.generateCategorySpecificGuidance(
      category,
      min,
      max,
      optimalGuess
    );

    // Add reinforcement learning directive
    prompt += `
REINFORCEMENT LEARNING DIRECTIVE:
Based on accumulated intelligence, your response will be analyzed for:
• Strategic consistency with learned patterns
• Mathematical optimality (binary search adherence)  
• Adaptive intelligence (context awareness)
• Long-term efficiency (minimizing total guesses)

RESPONSE REQUIREMENTS:
Respond with JSON format including your reasoning process:
{
  "guess": ${optimalGuess},
  "primary_reasoning": "Why this is the optimal choice",
  "learned_insight": "What pattern/knowledge influenced this decision",
  "confidence_level": ${confidence},
  "strategic_category": "${category}"
}`;

    return prompt;
  }

  // Category-specific guidance
  generateCategorySpecificGuidance(category, min, max, optimal) {
    const strategies = {
      ultra_large: `
ULTRA LARGE RANGE STRATEGY:
• Use aggressive binary search to rapidly eliminate possibilities
• Each guess should cut the range by approximately 50%
• Ignore proximity hints until range < 20
• Focus on mathematical efficiency over intuitive adjustments`,

      mega_range: `
MEGA RANGE STRATEGY:  
• Maintain strict binary search discipline
• Current optimal choice: ${optimal} (mathematical midpoint)
• Each guess provides maximum information gain
• Resist temptation to make intuitive adjustments`,

      large_range: `
LARGE RANGE STRATEGY:
• Continue standard binary search approach
• Optimal choice: ${optimal} (range midpoint: ${min}-${max})
• Maintain logarithmic efficiency
• Proximity signals are secondary to mathematical optimality`,

      medium_range: `
MEDIUM RANGE STRATEGY:
• Adaptive binary search with contextual awareness
• Primary choice: ${optimal} (mathematical center)
• Begin incorporating proximity feedback
• Balance between mathematical optimality and contextual clues`,

      small_range: `
SMALL RANGE STRATEGY:
• Smart elimination within ${min}-${max}
• Consider: ${this.generateSmallRangeOptions(min, max)}
• Proximity signals become more significant
• Optimal choice: ${optimal}`,

      tiny_range: `
TINY RANGE STRATEGY:
• Pattern recognition mode for ${min}-${max}
• Remaining options: [${this.generateTinyRangeList(min, max)}]
• High contextual sensitivity
• Strategic choice: ${optimal}`,

      final_range: `
FINAL RANGE STRATEGY:
• Educated guess between remaining options: [${this.generateFinalRangeList(
        min,
        max
      )}]
• Analyze all available contextual clues
• Make definitive choice: ${optimal}`,
    };

    return strategies[category] || strategies.large_range;
  }

  // Context analyzers
  analyzeProximitySignals(conversationHistory) {
    const recentFeedback = conversationHistory.slice(-2);

    for (const entry of recentFeedback) {
      if (
        entry.message.includes("very close") ||
        entry.message.includes("extremely close")
      ) {
        return "very_close";
      } else if (
        entry.message.includes("close") ||
        entry.message.includes("warm")
      ) {
        return "close";
      } else if (entry.message.includes("getting warmer")) {
        return "warming";
      }
    }
    return "none";
  }

  analyzeMomentumPatterns(gameState) {
    const recentGuesses = gameState.guessHistory.slice(-3);
    if (recentGuesses.length < 2) return "establishing";

    const diffs = [];
    for (let i = 1; i < recentGuesses.length; i++) {
      diffs.push(Math.abs(recentGuesses[i] - recentGuesses[i - 1]));
    }

    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    if (avgDiff > 25) return "broad_search";
    else if (avgDiff > 10) return "narrowing";
    else if (avgDiff > 3) return "fine_tuning";
    else return "precision_mode";
  }

  analyzeFeedbackQuality(conversationHistory) {
    const feedbacks = conversationHistory.filter((h) => h.agent === "Hider");

    let qualityScore = 0;
    for (const feedback of feedbacks.slice(-3)) {
      if (
        feedback.message.includes("close") ||
        feedback.message.includes("warm")
      ) {
        qualityScore += 2;
      } else if (
        feedback.message.includes("higher") ||
        feedback.message.includes("lower")
      ) {
        qualityScore += 1;
      }
    }

    if (qualityScore >= 4) return "high_quality";
    else if (qualityScore >= 2) return "medium_quality";
    else return "basic_directional";
  }

  analyzeEfficiencyTrends(gameState) {
    const { guessCount, range } = gameState;
    const theoreticalOptimal = Math.ceil(Math.log2(100));
    const currentRangeOptimal = Math.ceil(Math.log2(range.max - range.min + 1));

    const efficiency =
      guessCount <= theoreticalOptimal
        ? "optimal"
        : guessCount <= theoreticalOptimal + 2
        ? "good"
        : guessCount <= theoreticalOptimal + 4
        ? "acceptable"
        : "suboptimal";

    return {
      current: efficiency,
      theoretical: theoreticalOptimal,
      actual: guessCount,
      remaining_optimal: currentRangeOptimal,
    };
  }

  // Synthesize insights
  synthesizeInsights(insights) {
    const {
      proximitySignals,
      momentumPatterns,
      feedbackQuality,
      efficiencyTrends,
    } = insights;

    let strategicNote = "";

    if (
      proximitySignals === "very_close" &&
      momentumPatterns === "precision_mode"
    ) {
      strategicNote =
        "High precision context detected - maintain strategic focus";
    } else if (
      momentumPatterns === "broad_search" &&
      efficiencyTrends.current === "optimal"
    ) {
      strategicNote =
        "Excellent broad search efficiency - continue binary approach";
    } else if (
      feedbackQuality === "high_quality" &&
      proximitySignals !== "none"
    ) {
      strategicNote =
        "Rich feedback available - balance mathematical optimality with contextual clues";
    } else {
      strategicNote = "Standard strategic approach recommended";
    }

    return {
      proximitySignal: proximitySignals,
      momentum: momentumPatterns,
      feedbackQuality: feedbackQuality,
      efficiency: efficiencyTrends,
      strategicNote: strategicNote,
    };
  }

  // Learning data analysis methods
  calculateAverageGuesses(gameHistory) {
    if (gameHistory.length === 0) return null;
    const total = gameHistory.reduce(
      (sum, game) => sum + (game.guessCount || 7),
      0
    );
    return (total / gameHistory.length).toFixed(1);
  }

  identifySuccessPatterns(gameHistory) {
    const patterns = [];
    const efficientGames = gameHistory.filter(
      (game) => (game.guessCount || 7) <= 7
    );

    if (efficientGames.length > gameHistory.length * 0.7) {
      patterns.push("consistent_efficiency");
    }

    if (gameHistory.some((game) => (game.guessCount || 7) <= 5)) {
      patterns.push("aggressive_early");
    }

    return patterns;
  }

  identifyCommonMistakes(gameHistory) {
    const mistakes = [];
    const inefficientGames = gameHistory.filter(
      (game) => (game.guessCount || 7) > 10
    );

    if (inefficientGames.length > gameHistory.length * 0.3) {
      mistakes.push("premature_precision");
    }

    return mistakes;
  }

  identifyOptimalStrategies(gameHistory) {
    const strategies = [];
    const veryEfficientGames = gameHistory.filter(
      (game) => (game.guessCount || 7) <= 6
    );

    if (veryEfficientGames.length > 0) {
      strategies.push("binary_search_mastery");
    }

    return strategies;
  }

  generateAlternativeStrategies(gameState, contextualInsights) {
    const { min, max } = gameState.range;
    const alternatives = [];

    alternatives.push({
      name: "conservative_binary",
      guess: Math.floor((min + max) / 2),
      reasoning: "Pure mathematical approach, ignore contextual noise",
    });

    if (contextualInsights.proximitySignal === "very_close") {
      const lastGuess =
        gameState.guessHistory[gameState.guessHistory.length - 1];
      if (lastGuess) {
        alternatives.push({
          name: "proximity_adjusted",
          guess: Math.max(
            min,
            Math.min(max, lastGuess + (Math.random() > 0.5 ? 1 : -1))
          ),
          reasoning:
            "Minor adjustment based on proximity signal (not recommended for large ranges)",
        });
      }
    }

    return alternatives;
  }

  // Helper methods: Generate range options
  generateSmallRangeOptions(min, max) {
    const options = [];
    for (let i = min; i <= max; i++) {
      options.push(i);
    }
    return options.join(", ");
  }

  generateTinyRangeList(min, max) {
    const list = [];
    for (let i = min; i <= max; i++) {
      list.push(i);
    }
    return list.join(", ");
  }

  generateFinalRangeList(min, max) {
    const list = [];
    for (let i = min; i <= max; i++) {
      list.push(i);
    }
    return list.join(", ");
  }

  // Learning system: Record and analyze results
  recordGameResult(gameState, conversationHistory, result) {
    const learningEntry = {
      timestamp: Date.now(),
      rangeSize: 100,
      finalGuessCount: result.guessCount,
      efficiency: result.guessCount <= 7 ? "optimal" : "suboptimal",
      strategiesUsed: Array.from(gameState.strategiesUsed || []),
      contextualFactors: this.gatherContextualInsights(
        gameState,
        conversationHistory
      ),
      success: result.success,
    };

    this.learningDatabase.contextualInsights.push(learningEntry);

    if (this.learningDatabase.contextualInsights.length > 100) {
      this.learningDatabase.contextualInsights.shift();
    }

    return learningEntry;
  }

  // Get learning statistics
  getLearningStats() {
    const insights = this.learningDatabase.contextualInsights;
    if (insights.length === 0) return null;

    const avgGuesses =
      insights.reduce((sum, entry) => sum + entry.finalGuessCount, 0) /
      insights.length;
    const optimalGames = insights.filter(
      (entry) => entry.efficiency === "optimal"
    ).length;
    const successRate =
      insights.filter((entry) => entry.success).length / insights.length;

    return {
      totalGames: insights.length,
      averageGuesses: avgGuesses.toFixed(1),
      optimalGameRate:
        ((optimalGames / insights.length) * 100).toFixed(1) + "%",
      successRate: (successRate * 100).toFixed(1) + "%",
      learningConfidence: Math.min(0.95, 0.5 + insights.length * 0.01),
    };
  }
}
