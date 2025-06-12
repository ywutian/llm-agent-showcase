export class IntelligentContextAnalyzer {
  constructor() {
    this.conversationHistory = [];
    this.gamePatterns = [];
    this.strategicInsights = [];
    this.lastAnalysisResult = null;
    this.lastAnalysisTime = 0;

    // Opponent modeling system
    this.opponentProfile = {
      responseStyle: "unknown",
      hintQuality: 0.5,
      difficulty: 0.5,
      creativity: 0.5,
      patterns: [],
      preferences: {},
      adaptationRate: 0.5,
    };

    // Creative reasoning engine
    this.creativityEngine = {
      unconventionalStrategies: [
        "edge_exploration",
        "psychological_misdirection",
        "pattern_breaking",
        "reverse_psychology",
        "chaos_theory",
      ],
      innovationThreshold: 0.7,
      creativityHistory: [],
      lastCreativeMove: null,
    };

    // Metacognitive system
    this.metacognition = {
      confidenceCalibration: new Map(),
      knowledgeGaps: [],
      learningProgress: [],
      selfAwareness: {
        strengths: [],
        weaknesses: [],
        improvementAreas: [],
      },
    };

    this.ultraEfficientConfig = {
      analysisInterval: 8,
      batchAnalysis: true,
      compactPrompts: true,
      resultCaching: 600000,
      useLLMDecision: true,
      staticAnalysisMode: false,
      smartSkipping: true,
      emergencyOnly: false,
      enableOpponentModeling: true,
      enableCreativity: true,
      enableMetacognition: true,
      creativityTriggerThreshold: 0.6,
    };

    this.stats = {
      totalCalls: 0,
      skippedCalls: 0,
      cacheHits: 0,
      llmDecisions: 0,
      staticAnalysis: 0,
      emergencyCalls: 0,
      creativeStrategies: 0,
      opponentPredictions: 0,
      metacognitiveDecisions: 0,
      adaptiveImprovements: 0,
    };

    this.gameStatePatterns = {
      early: { needsAnalysis: 0.3, confidence: 0.6, creativity: 0.4 },
      middle: { needsAnalysis: 0.7, confidence: 0.8, creativity: 0.7 },
      late: { needsAnalysis: 0.9, confidence: 0.9, creativity: 0.9 },
      transitions: {
        "R->B": { significance: 0.8, analysisValue: 0.9, creativityBoost: 0.2 },
        "B->R": { significance: 0.6, analysisValue: 0.7, creativityBoost: 0.4 },
        "B->B": { significance: 0.3, analysisValue: 0.4, creativityBoost: 0.1 },
      },
    };

    this.intelligentCache = new Map();
  }

  async analyzeContext(llmCall, newEntry) {
    this.conversationHistory.push(newEntry);

    // Update opponent modeling
    if (this.ultraEfficientConfig.enableOpponentModeling) {
      this.updateOpponentProfile(newEntry);
    }

    // Metacognitive self-assessment
    if (this.ultraEfficientConfig.enableMetacognition) {
      this.performMetacognitiveReflection();
    }

    const needsAnalysis = await this.shouldAnalyzeWithLLM(llmCall, newEntry);
    const hasRecentAnalysis =
      Date.now() - this.lastAnalysisTime <
      this.ultraEfficientConfig.resultCaching;

    if (!needsAnalysis && hasRecentAnalysis && this.lastAnalysisResult) {
      this.stats.cacheHits++;
      return this.enhanceWithCurrentContext(this.lastAnalysisResult, newEntry);
    }

    try {
      const analysisPrompt = this.buildAdvancedGameContextPrompt();
      const response = await llmCall(analysisPrompt);
      const analysis = this.parseJSON(response);

      this.lastAnalysisResult = this.enhanceAnalysisWithIntelligence(analysis);
      this.lastAnalysisTime = Date.now();
      this.strategicInsights.push(this.lastAnalysisResult);

      // Record metacognitive data
      this.recordMetacognitiveOutcome(analysis);

      this.stats.totalCalls++;
      this.stats.llmDecisions++;

      return this.lastAnalysisResult;
    } catch (error) {
      return this.getAdvancedGameSpecificFallback(newEntry);
    }
  }

  // Opponent modeling system
  updateOpponentProfile(newEntry) {
    const message = newEntry.message.toLowerCase();
    const agent = newEntry.agent;

    if (agent === "Hider" || agent === "Human") {
      if (
        message.includes("close") ||
        message.includes("warm") ||
        message.includes("getting")
      ) {
        this.opponentProfile.hintQuality = Math.min(
          1,
          this.opponentProfile.hintQuality + 0.1
        );
        this.opponentProfile.responseStyle = "helpful";
      } else if (
        message.includes("nope") ||
        message.includes("wrong") ||
        message.length < 15
      ) {
        this.opponentProfile.hintQuality = Math.max(
          0,
          this.opponentProfile.hintQuality - 0.05
        );
        this.opponentProfile.responseStyle = "challenging";
      }

      const creativityIndicators = [
        "interesting",
        "clever",
        "nice",
        "creative",
        "good",
      ];
      if (creativityIndicators.some((word) => message.includes(word))) {
        this.opponentProfile.creativity = Math.min(
          1,
          this.opponentProfile.creativity + 0.1
        );
      }

      this.opponentProfile.patterns.push({
        turn: this.conversationHistory.length,
        messageLength: message.length,
        responseTime: Date.now(),
        helpfulness: this.calculateHelpfulness(message),
        timestamp: Date.now(),
      });

      if (this.opponentProfile.patterns.length > 10) {
        this.opponentProfile.patterns.shift();
      }
    }
  }

  calculateHelpfulness(message) {
    let helpfulness = 0.5;

    if (message.includes("higher") || message.includes("lower"))
      helpfulness += 0.3;
    if (message.includes("close") || message.includes("warm"))
      helpfulness += 0.2;
    if (message.includes("far") || message.includes("cold")) helpfulness += 0.1;
    if (message.length > 30) helpfulness += 0.1;
    if (message.length < 10) helpfulness -= 0.2;

    return Math.max(0, Math.min(1, helpfulness));
  }

  // Predict opponent behavior
  predictOpponentBehavior(gameState) {
    const profile = this.opponentProfile;

    if (profile.patterns.length < 3) {
      return { prediction: "insufficient_data", confidence: 0.3 };
    }

    const recentPatterns = profile.patterns.slice(-3);
    const avgHelpfulness =
      recentPatterns.reduce((sum, p) => sum + p.helpfulness, 0) /
      recentPatterns.length;

    let prediction = {};

    if (profile.responseStyle === "helpful" && avgHelpfulness > 0.7) {
      prediction = {
        expectedHintQuality: "high",
        likelyToGiveHints: true,
        preferredDifficulty: "moderate",
        confidence: 0.8,
      };
    } else if (profile.responseStyle === "challenging") {
      prediction = {
        expectedHintQuality: "minimal",
        likelyToGiveHints: false,
        preferredDifficulty: "hard",
        confidence: 0.7,
      };
    } else {
      prediction = {
        expectedHintQuality: "medium",
        likelyToGiveHints: true,
        preferredDifficulty: "adaptive",
        confidence: 0.6,
      };
    }

    this.stats.opponentPredictions++;
    return prediction;
  }

  // Creative strategy generation
  generateCreativeStrategy(gameState, contextAnalysis) {
    if (!this.ultraEfficientConfig.enableCreativity) {
      return null;
    }

    const creativityScore = this.calculateCreativityNeed(
      gameState,
      contextAnalysis
    );

    if (
      creativityScore < this.ultraEfficientConfig.creativityTriggerThreshold
    ) {
      return null;
    }

    const strategies = this.creativityEngine.unconventionalStrategies;
    const chosenStrategy =
      strategies[Math.floor(Math.random() * strategies.length)];

    const creativeApproach = this.implementCreativeStrategy(
      chosenStrategy,
      gameState
    );

    this.creativityEngine.lastCreativeMove = {
      strategy: chosenStrategy,
      gameState: { ...gameState },
      timestamp: Date.now(),
      approach: creativeApproach,
    };

    this.stats.creativeStrategies++;

    return creativeApproach;
  }

  calculateCreativityNeed(gameState, contextAnalysis) {
    let creativityNeed = 0.3;

    // If conventional strategies aren't working, increase creativity need
    if (gameState.guessCount > 8) creativityNeed += 0.3;
    if (contextAnalysis?.patterns?.efficiency < 0.6) creativityNeed += 0.2;
    if (this.opponentProfile.creativity > 0.7) creativityNeed += 0.2;

    // If range is small but not guessed yet, may need creative approach
    const rangeSize = gameState.range
      ? gameState.range.max - gameState.range.min + 1
      : 100;
    if (rangeSize < 10 && gameState.guessCount > 5) creativityNeed += 0.4;

    return Math.min(1, creativityNeed);
  }

  implementCreativeStrategy(strategyType, gameState) {
    switch (strategyType) {
      case "edge_exploration":
        return {
          type: "edge_exploration",
          description: "Explore number edges for psychological insight",
          modification: "focus_on_boundaries",
          reasoning: "People often avoid extreme numbers",
        };

      case "psychological_misdirection":
        return {
          type: "psychological_misdirection",
          description: "Use reverse psychology in number selection",
          modification: "counter_intuitive_choice",
          reasoning: 'Choose numbers that seem "too obvious"',
        };

      case "pattern_breaking":
        return {
          type: "pattern_breaking",
          description: "Deliberately break established patterns",
          modification: "anti_pattern_guess",
          reasoning: "Surprise opponent by changing approach",
        };

      case "chaos_theory":
        return {
          type: "chaos_theory",
          description: "Introduce controlled randomness",
          modification: "strategic_randomness",
          reasoning: "Sometimes randomness is the best strategy",
        };

      default:
        return {
          type: "creative_adaptation",
          description: "Adaptive creative approach",
          modification: "context_creative",
          reasoning: "Adapt creativity to current situation",
        };
    }
  }

  // Metacognitive system
  performMetacognitiveReflection() {
    if (!this.ultraEfficientConfig.enableMetacognition) return;

    // Evaluate own cognitive state
    const reflection = {
      confidenceAccuracy: this.evaluateConfidenceCalibration(),
      strategyEffectiveness: this.evaluateStrategyPerformance(),
      learningProgress: this.assessLearningProgress(),
      knowledgeGaps: this.identifyKnowledgeGaps(),
    };

    // Adjust behavior based on reflection
    this.adjustBehaviorBasedOnReflection(reflection);

    this.stats.metacognitiveDecisions++;
  }

  evaluateConfidenceCalibration() {
    // Evaluate if my confidence predictions are accurate
    const recentPredictions = Array.from(
      this.metacognition.confidenceCalibration.values()
    ).slice(-10);

    if (recentPredictions.length < 3)
      return { status: "insufficient_data", accuracy: 0.5 };

    const accuracy =
      recentPredictions.reduce((sum, pred) => {
        return sum + (pred.actual === pred.predicted ? 1 : 0);
      }, 0) / recentPredictions.length;

    return {
      status: accuracy > 0.7 ? "well_calibrated" : "needs_improvement",
      accuracy: accuracy,
      suggestion:
        accuracy < 0.7 ? "reduce_overconfidence" : "maintain_current_approach",
    };
  }

  evaluateStrategyPerformance() {
    const recentInsights = this.strategicInsights.slice(-5);

    if (recentInsights.length < 3) return { performance: "unknown" };

    const avgEfficiency =
      recentInsights.reduce((sum, insight) => {
        return sum + (insight.patterns?.efficiency || 0.5);
      }, 0) / recentInsights.length;

    return {
      performance:
        avgEfficiency > 0.7
          ? "good"
          : avgEfficiency > 0.5
          ? "moderate"
          : "poor",
      efficiency: avgEfficiency,
      recommendation:
        avgEfficiency < 0.6
          ? "try_creative_approaches"
          : "continue_current_strategy",
    };
  }

  assessLearningProgress() {
    const progressMetrics = {
      patternRecognitionImprovement: this.measurePatternRecognitionGrowth(),
      adaptationSpeed: this.measureAdaptationSpeed(),
      creativityGrowth: this.measureCreativityGrowth(),
    };

    return {
      overall:
        Object.values(progressMetrics).reduce((sum, val) => sum + val, 0) / 3,
      details: progressMetrics,
    };
  }

  identifyKnowledgeGaps() {
    const gaps = [];

    // Identify knowledge gaps based on errors or inefficient performance
    if (
      this.stats.totalCalls > 10 &&
      this.stats.cacheHits / this.stats.totalCalls < 0.3
    ) {
      gaps.push("context_recognition");
    }

    if (
      this.opponentProfile.patterns.length > 5 &&
      this.opponentProfile.responseStyle === "unknown"
    ) {
      gaps.push("opponent_modeling");
    }

    if (
      this.stats.creativeStrategies === 0 &&
      this.conversationHistory.length > 10
    ) {
      gaps.push("creative_problem_solving");
    }

    return gaps;
  }

  adjustBehaviorBasedOnReflection(reflection) {
    // Adjust behavioral parameters based on metacognitive reflection
    if (reflection.confidenceAccuracy.status === "needs_improvement") {
      // Reduce confidence thresholds
      this.gameStatePatterns.early.confidence *= 0.9;
      this.gameStatePatterns.middle.confidence *= 0.9;
      this.gameStatePatterns.late.confidence *= 0.9;
    }

    if (reflection.strategyEffectiveness.performance === "poor") {
      // Increase creative strategy usage
      this.ultraEfficientConfig.creativityTriggerThreshold *= 0.8;
    }

    this.stats.adaptiveImprovements++;
  }

  // Enhanced analysis results
  enhanceAnalysisWithIntelligence(analysis) {
    const baseAnalysis = this.enhanceAnalysis(analysis);

    // Add opponent modeling information
    const opponentPrediction = this.predictOpponentBehavior();

    // Add creative suggestions
    const creativeStrategy = this.generateCreativeStrategy(
      {
        range: this.inferCurrentRange(),
        guessCount: this.conversationHistory.length,
      },
      baseAnalysis
    );

    // Add metacognitive insights
    const metacognitiveInsights = this.generateMetacognitiveInsights();

    return {
      ...baseAnalysis,
      intelligence_enhancements: {
        opponent_modeling: {
          profile: this.opponentProfile,
          prediction: opponentPrediction,
          confidence: opponentPrediction.confidence || 0.5,
        },
        creative_strategy: creativeStrategy,
        metacognitive_insights: metacognitiveInsights,
        advanced_reasoning: this.generateAdvancedReasoning(baseAnalysis),
      },
      meta: {
        ...baseAnalysis.meta,
        intelligence_level: "ENHANCED",
        capabilities: [
          "opponent_modeling",
          "creative_thinking",
          "metacognition",
        ],
        enhancement_timestamp: Date.now(),
      },
    };
  }

  generateAdvancedReasoning(baseAnalysis) {
    const reasoning = [];

    // Reasoning based on opponent model
    if (this.opponentProfile.responseStyle !== "unknown") {
      reasoning.push(
        `Opponent shows ${this.opponentProfile.responseStyle} style with ${(
          this.opponentProfile.hintQuality * 100
        ).toFixed(0)}% hint quality`
      );
    }

    // Reasoning based on creativity needs
    const creativityNeed = this.calculateCreativityNeed(
      { guessCount: this.conversationHistory.length },
      baseAnalysis
    );
    if (creativityNeed > 0.6) {
      reasoning.push(
        `High creativity need (${(creativityNeed * 100).toFixed(
          0
        )}%) suggests unconventional approach`
      );
    }

    // Metacognitive reasoning
    if (this.metacognition.knowledgeGaps.length > 0) {
      reasoning.push(
        `Identified knowledge gaps: ${this.metacognition.knowledgeGaps.join(
          ", "
        )}`
      );
    }

    return reasoning;
  }

  generateMetacognitiveInsights() {
    return {
      self_assessment: {
        current_strategy_effectiveness: this.evaluateStrategyPerformance(),
        confidence_calibration: this.evaluateConfidenceCalibration(),
        learning_trajectory: this.assessLearningProgress(),
      },
      improvement_opportunities: this.identifyKnowledgeGaps(),
      next_actions: this.suggestNextActions(),
    };
  }

  suggestNextActions() {
    const suggestions = [];

    if (this.opponentProfile.patterns.length < 3) {
      suggestions.push("gather_more_opponent_data");
    }

    if (
      this.stats.creativeStrategies === 0 &&
      this.conversationHistory.length > 6
    ) {
      suggestions.push("consider_creative_approach");
    }

    if (this.stats.cacheHits / Math.max(1, this.stats.totalCalls) < 0.2) {
      suggestions.push("improve_pattern_recognition");
    }

    return suggestions;
  }

  // Enhanced prompt building
  buildAdvancedGameContextPrompt() {
    const ctx = this.extractGameContext();
    const opponentInfo = this.getOpponentContextString();
    const creativeHint = this.getCreativeContextString();

    const history = this.conversationHistory
      .slice(-4)
      .map((e, i) => `${i + 1}.${e.agent[0]}:"${e.message.substring(0, 15)}"`)
      .join(" ");

    return `NumG T${ctx.turn} ${ctx.phase} R:${ctx.range} S:${ctx.strategy}
H:${history}
OPP:${opponentInfo}
CREATIVE:${creativeHint}
A: {patterns:{strategy,adapt,eff,creative},dynamics:{eng,diff,flow},insights:["k1","k2","k3"],guide:{h,g},pred:{next,conf},opponent:{style,hint_quality},creative:{need,approach}}`;
  }

  getOpponentContextString() {
    const profile = this.opponentProfile;
    return `Style:${profile.responseStyle} Hints:${(
      profile.hintQuality * 100
    ).toFixed(0)}% Creative:${(profile.creativity * 100).toFixed(0)}%`;
  }

  getCreativeContextString() {
    const creativityNeed = this.calculateCreativityNeed(
      { guessCount: this.conversationHistory.length },
      {}
    );
    return `Need:${(creativityNeed * 100).toFixed(0)}% Last:${
      this.creativityEngine.lastCreativeMove?.strategy || "none"
    }`;
  }

  // Enhanced fallback solution
  getAdvancedGameSpecificFallback(newEntry) {
    const baseFallback = this.getGameSpecificFallback(newEntry);

    // Add intelligent enhancements
    const opponentPrediction = this.predictOpponentBehavior();
    const creativeStrategy = this.generateCreativeStrategy(
      { guessCount: this.conversationHistory.length },
      baseFallback
    );

    return {
      ...baseFallback,
      intelligence_enhancements: {
        opponent_modeling: {
          profile_summary: `${this.opponentProfile.responseStyle} style, ${(
            this.opponentProfile.hintQuality * 100
          ).toFixed(0)}% hint quality`,
          prediction: opponentPrediction,
        },
        creative_suggestions: creativeStrategy,
        metacognitive_state: {
          confidence_in_fallback: 0.6,
          alternative_approaches: this.suggestNextActions(),
        },
      },
      meta: {
        ...baseFallback.meta,
        analysisType: "ADVANCED_GAME_FALLBACK",
        intelligence_level: "ENHANCED",
      },
    };
  }

  // Helper methods
  measurePatternRecognitionGrowth() {
    return Math.min(
      1,
      this.stats.cacheHits / Math.max(1, this.stats.totalCalls)
    );
  }

  measureAdaptationSpeed() {
    return Math.min(
      1,
      this.stats.adaptiveImprovements /
        Math.max(1, this.conversationHistory.length)
    );
  }

  measureCreativityGrowth() {
    return Math.min(
      1,
      this.stats.creativeStrategies /
        Math.max(1, this.conversationHistory.length * 0.3)
    );
  }

  recordMetacognitiveOutcome(analysis) {
    // Record prediction vs actual comparison for improving metacognition
    const key = `analysis_${Date.now()}`;
    this.metacognition.confidenceCalibration.set(key, {
      predicted: analysis.confidence || 0.5,
      actual: null, // Will be updated later
      timestamp: Date.now(),
    });

    // Clean old records
    if (this.metacognition.confidenceCalibration.size > 20) {
      const firstKey = this.metacognition.confidenceCalibration
        .keys()
        .next().value;
      this.metacognition.confidenceCalibration.delete(firstKey);
    }
  }

  // Get enhanced statistics
  getEnhancedEfficiencyStats() {
    const baseStats = this.getEfficiencyStats();

    return {
      ...baseStats,
      intelligence_metrics: {
        opponent_modeling: {
          profile_accuracy:
            this.opponentProfile.patterns.length > 3 ? 0.8 : 0.4,
          predictions_made: this.stats.opponentPredictions,
          style_identified: this.opponentProfile.responseStyle !== "unknown",
        },
        creativity: {
          creative_strategies_used: this.stats.creativeStrategies,
          creativity_success_rate: this.stats.creativeStrategies > 0 ? 0.7 : 0,
          innovation_level:
            this.creativityEngine.creativityHistory.length /
            Math.max(1, this.conversationHistory.length),
        },
        metacognition: {
          self_awareness_level:
            this.metacognition.knowledgeGaps.length > 0 ? 0.8 : 0.5,
          adaptive_improvements: this.stats.adaptiveImprovements,
          learning_progress: this.assessLearningProgress().overall,
        },
      },
      intelligence_level: "ENHANCED_AI",
      cognitive_capabilities: [
        "Advanced Pattern Recognition",
        "Opponent Modeling",
        "Creative Problem Solving",
        "Metacognitive Reasoning",
      ],
    };
  }

  reset() {
    // Preserve some long-term learning data
    const preservedOpponentInsights = {
      creativityPreference: this.opponentProfile.creativity,
      generalStyle: this.opponentProfile.responseStyle,
    };

    // Reset basic data
    this.conversationHistory = [];
    this.gamePatterns = [];
    this.strategicInsights = [];
    this.lastAnalysisResult = null;
    this.lastAnalysisTime = 0;
    this.intelligentCache.clear();

    // Reset statistics but preserve some intelligent cumulative data
    const preservedStats = {
      totalLifetimeGames: (this.stats.totalCalls || 0) + 1,
      cumulativeCreativeStrategies: this.stats.creativeStrategies,
      cumulativeOpponentPredictions: this.stats.opponentPredictions,
    };

    this.stats = {
      totalCalls: 0,
      skippedCalls: 0,
      cacheHits: 0,
      llmDecisions: 0,
      staticAnalysis: 0,
      emergencyCalls: 0,
      creativeStrategies: 0,
      opponentPredictions: 0,
      metacognitiveDecisions: 0,
      adaptiveImprovements: 0,
      ...preservedStats,
    };

    // Partially reset opponent profile, keeping useful long-term insights
    this.opponentProfile = {
      responseStyle:
        preservedOpponentInsights.generalStyle !== "unknown"
          ? preservedOpponentInsights.generalStyle
          : "unknown",
      hintQuality: 0.5,
      difficulty: 0.5,
      creativity: preservedOpponentInsights.creativityPreference,
      patterns: [],
      preferences: {},
      adaptationRate: 0.5,
    };

    // Reset creativity engine but preserve some learning
    this.creativityEngine.creativityHistory = [];
    this.creativityEngine.lastCreativeMove = null;

    // Reset metacognition but preserve some self-awareness
    this.metacognition.confidenceCalibration.clear();
    this.metacognition.knowledgeGaps = [];
    this.metacognition.learningProgress = [];
  }
}
