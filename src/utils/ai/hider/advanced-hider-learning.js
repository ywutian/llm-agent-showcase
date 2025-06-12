export class AdvancedHiderLearningSystem {
  constructor() {
    // Tricky strategy database
    this.trickyStrategies = {
      antiBinarySearch: {
        name: "Anti-Binary Search",
        description: "Select numbers that minimize binary search efficiency",
        trickinessLevel: 0.8,
        preferredNumbers: [7, 13, 23, 37, 43, 67, 73, 89, 97], // Prime preference
      },

      psychologicalTraps: {
        name: "Psychological Traps",
        description: "Exploit human psychological biases",
        trickinessLevel: 0.9,
        avoidPatterns: ["round_numbers", "middle_bias", "edge_preference"],
      },

      boundaryTraps: {
        name: "Boundary Traps",
        description: "Set traps near boundaries",
        trickinessLevel: 0.7,
        boundaryZones: [1, 2, 3, 98, 99, 100, 9, 10, 11, 89, 90, 91],
      },

      patternBreaker: {
        name: "Pattern Breaker",
        description: "Disrupt player's established strategy patterns",
        trickinessLevel: 0.85,
        adaptiveSelection: true,
      },

      ultimateChallenge: {
        name: "Ultimate Challenge",
        description: "Maximum difficulty tricky number selection",
        trickinessLevel: 0.95,
        requiresExpertAnalysis: true,
      },
    };

    // Player weakness exploitation database
    this.playerWeaknessDatabase = {
      binary_search_deviations: {
        exploit: "Select numbers that deviate from standard binary search",
        targetNumbers: [7, 13, 23, 31, 41, 59, 67, 79, 83],
      },
      round_number_bias: {
        exploit: "Avoid all multiples of 5 and 10",
        avoidNumbers: [
          5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
          95, 100,
        ],
      },
      middle_preference: {
        exploit: "Select numbers far from 40-60 range",
        preferNumbers: [1, 7, 13, 19, 23, 73, 79, 83, 89, 97],
      },
      edge_avoidance: {
        exploit: "Select extreme boundary numbers",
        preferNumbers: [1, 2, 3, 4, 97, 98, 99, 100],
      },
      pattern_dependency: {
        exploit: "Break expected number patterns",
        requiresHistoryAnalysis: true,
      },
    };

    // Learning data storage
    this.learningData = {
      playerProfiles: new Map(),
      strategyEffectiveness: new Map(),
      difficultyProgression: [],
      trickinessHistory: [],
      gameResults: [],
    };

    // System configuration
    this.config = {
      maxTrickinessLevel: 0.95,
      learningRate: 0.1,
      adaptationThreshold: 3,
      difficultyIncrement: 0.1,
      psychologicalAnalysisDepth: 5,
    };

    // Statistics
    this.stats = {
      totalNumbersGenerated: 0,
      averageDifficultyInduced: 0,
      strategySuccessRates: new Map(),
      playerFrustrationLevel: 0,
      trickinessEvolution: [],
    };
  }

  // Main method: Generate advanced tricky number
  generateAdvancedTrickyNumber(gameHistory, playerProfile, contextData) {
    console.log("Generating ADVANCED tricky number with full analysis...");

    try {
      const weaknessAnalysis = this.analyzePlayerWeaknesses(
        playerProfile,
        gameHistory
      );
      const optimalStrategy = this.selectOptimalTrickyStrategy(
        weaknessAnalysis,
        playerProfile,
        gameHistory.length
      );
      const candidates = this.generateTrickyCandidates(
        optimalStrategy,
        weaknessAnalysis,
        playerProfile
      );
      const finalSelection = this.evaluateAndSelectFinalNumber(
        candidates,
        optimalStrategy,
        weaknessAnalysis
      );
      const expectedDifficulty = this.calculateExpectedDifficulty(
        finalSelection.number,
        playerProfile,
        optimalStrategy
      );

      this.recordTrickyNumberGeneration(
        finalSelection,
        optimalStrategy,
        playerProfile
      );
      this.stats.totalNumbersGenerated++;

      return {
        number: finalSelection.number,
        strategy: optimalStrategy.name,
        reasoning: finalSelection.reasoning,
        trickinessScore: finalSelection.trickinessScore,
        expectedDifficulty: expectedDifficulty,
        psychologicalTrap: finalSelection.psychologicalTrap,
        learningInsight: finalSelection.learningInsight,
        weaknessesTargeted: finalSelection.weaknessesTargeted,
      };
    } catch (error) {
      console.warn("Advanced tricky number generation failed:", error.message);
      return this.generateFallbackTrickyNumber(playerProfile);
    }
  }

  // Analyze player weaknesses
  analyzePlayerWeaknesses(playerProfile, gameHistory) {
    const analysis = {
      primaryWeaknesses: [],
      exploitablePatterns: [],
      psychologicalBiases: [],
      strategicGaps: [],
      confidenceScore: 0.5,
    };

    if (!playerProfile || gameHistory.length < 2) {
      return { ...analysis, confidenceScore: 0.3 };
    }

    if (playerProfile.identifiedWeaknesses) {
      analysis.primaryWeaknesses = playerProfile.identifiedWeaknesses;
    }

    if (playerProfile.psychologicalProfile !== "neutral") {
      analysis.psychologicalBiases.push(playerProfile.psychologicalProfile);
    }

    if (playerProfile.preferredStrategies) {
      analysis.exploitablePatterns = playerProfile.preferredStrategies;
    }

    const skillMultiplier =
      {
        expert: 1.2,
        advanced: 1.0,
        intermediate: 0.8,
        beginner: 0.6,
        unknown: 0.7,
      }[playerProfile.skillLevel] || 0.7;

    analysis.confidenceScore = Math.min(
      0.95,
      0.5 + gameHistory.length * 0.05 * skillMultiplier
    );

    return analysis;
  }

  // Select optimal tricky strategy
  selectOptimalTrickyStrategy(weaknessAnalysis, playerProfile, gameCount) {
    let selectedStrategy = this.trickyStrategies.antiBinarySearch;

    // Escalate difficulty based on game count
    if (gameCount < 2) {
      selectedStrategy = this.trickyStrategies.boundaryTraps;
    } else if (gameCount < 5) {
      selectedStrategy = this.trickyStrategies.psychologicalTraps;
    } else if (gameCount < 10) {
      selectedStrategy = this.trickyStrategies.patternBreaker;
    } else {
      selectedStrategy = this.trickyStrategies.ultimateChallenge;
    }

    // Adjust strategy based on weakness analysis
    if (
      weaknessAnalysis.primaryWeaknesses.includes("imperfect_binary_search")
    ) {
      selectedStrategy = this.trickyStrategies.antiBinarySearch;
    } else if (
      weaknessAnalysis.psychologicalBiases.includes("round_number_preference")
    ) {
      selectedStrategy = this.trickyStrategies.psychologicalTraps;
    } else if (
      weaknessAnalysis.psychologicalBiases.includes("edge_avoidance")
    ) {
      selectedStrategy = this.trickyStrategies.boundaryTraps;
    }

    // Adjust based on player skill level
    if (playerProfile.skillLevel === "expert") {
      selectedStrategy = this.trickyStrategies.ultimateChallenge;
    } else if (playerProfile.skillLevel === "beginner") {
      selectedStrategy = this.trickyStrategies.boundaryTraps;
    }

    console.log(
      `Selected strategy: ${selectedStrategy.name} (Level: ${selectedStrategy.trickinessLevel})`
    );

    return selectedStrategy;
  }

  // Generate tricky candidates
  generateTrickyCandidates(strategy, weaknessAnalysis, playerProfile) {
    const candidates = [];

    switch (strategy.name) {
      case "Anti-Binary Search":
        candidates.push(...this.generateAntiBinaryCandidates(weaknessAnalysis));
        break;
      case "Psychological Traps":
        candidates.push(
          ...this.generatePsychologicalTrapCandidates(playerProfile)
        );
        break;
      case "Boundary Traps":
        candidates.push(...this.generateBoundaryTrapCandidates());
        break;
      case "Pattern Breaker":
        candidates.push(
          ...this.generatePatternBreakerCandidates(playerProfile)
        );
        break;
      case "Ultimate Challenge":
        candidates.push(
          ...this.generateUltimateChallengeNumbers(
            weaknessAnalysis,
            playerProfile
          )
        );
        break;
      default:
        candidates.push(...this.generateDefaultTrickyCandidates());
    }

    if (candidates.length === 0) {
      candidates.push(...[7, 13, 23, 37, 43, 67, 73, 89, 97]);
    }

    return candidates.map((num) => ({
      number: num,
      trickinessScore: this.calculateTrickinessScore(
        num,
        strategy,
        weaknessAnalysis
      ),
      reasoning: `Strategy: ${strategy.name}`,
    }));
  }

  // Generate anti-binary search candidates
  generateAntiBinaryCandidates(weaknessAnalysis) {
    const primes = [
      7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79,
      83, 89, 97,
    ];
    const trickyPrimes = primes.filter(
      (p) => p !== 50 && Math.abs(p - 50) > 10
    );
    return trickyPrimes.slice(0, 8);
  }

  // Generate psychological trap candidates
  generatePsychologicalTrapCandidates(playerProfile) {
    const candidates = [];

    if (playerProfile.psychologicalProfile === "round_number_preference") {
      candidates.push(
        ...[
          7, 13, 17, 23, 27, 33, 37, 43, 47, 53, 57, 63, 67, 73, 77, 83, 87, 93,
          97,
        ]
      );
    }

    if (playerProfile.psychologicalProfile === "middle_bias") {
      candidates.push(...[3, 7, 11, 13, 17, 19, 83, 87, 89, 91, 93, 97]);
    }

    if (playerProfile.psychologicalProfile === "edge_avoidance") {
      candidates.push(...[1, 2, 3, 4, 5, 96, 97, 98, 99, 100]);
    }

    if (candidates.length === 0) {
      candidates.push(...[7, 13, 23, 31, 41, 59, 67, 79, 83, 89]);
    }

    return candidates;
  }

  // Generate boundary trap candidates
  generateBoundaryTrapCandidates() {
    return [
      1, 2, 3, 4, 5, 6, 94, 95, 96, 97, 98, 99, 100, 8, 9, 10, 11, 88, 89, 90,
      91, 92,
    ];
  }

  // Generate pattern breaker candidates
  generatePatternBreakerCandidates(playerProfile) {
    const candidates = [];

    if (playerProfile.preferredStrategies?.includes("pure_binary_search")) {
      candidates.push(...[7, 13, 23, 37, 43, 67, 73, 89, 97]);
    }

    if (playerProfile.preferredStrategies?.includes("pattern_seeking")) {
      candidates.push(...[11, 17, 29, 41, 53, 71, 83, 91]);
    }

    if (candidates.length === 0) {
      candidates.push(...[13, 17, 31, 37, 41, 71, 73, 79]);
    }

    return candidates;
  }

  // Generate ultimate challenge numbers
  generateUltimateChallengeNumbers(weaknessAnalysis, playerProfile) {
    const ultimateNumbers = [7, 13, 23, 31, 41, 59, 67, 73, 79, 83, 89, 97];

    if (weaknessAnalysis.confidenceScore > 0.8) {
      return ultimateNumbers.filter((n) => n % 10 !== 0 && n % 5 !== 0);
    }

    return ultimateNumbers.slice(0, 6);
  }

  // Generate default tricky candidates
  generateDefaultTrickyCandidates() {
    return [7, 13, 23, 37, 43, 67, 73, 89, 97];
  }

  // Calculate trickiness score
  calculateTrickinessScore(number, strategy, weaknessAnalysis) {
    let score = strategy.trickinessLevel;

    if (this.isPrime(number)) {
      score += 0.1;
    }

    const distanceFrom50 = Math.abs(number - 50);
    if (distanceFrom50 > 20) {
      score += 0.05;
    }

    if (number % 5 !== 0 && number % 10 !== 0) {
      score += 0.05;
    }

    if (weaknessAnalysis.confidenceScore > 0.7) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  // Evaluate and select final number
  evaluateAndSelectFinalNumber(candidates, strategy, weaknessAnalysis) {
    if (candidates.length === 0) {
      return {
        number: 37,
        reasoning: "Fallback to default tricky number",
        trickinessScore: 0.7,
        psychologicalTrap: "Basic difficulty",
        learningInsight: "No candidates available",
        weaknessesTargeted: [],
      };
    }

    candidates.sort((a, b) => b.trickinessScore - a.trickinessScore);
    const topCandidate = candidates[0];

    return {
      number: topCandidate.number,
      reasoning: `${strategy.name}: ${topCandidate.reasoning}`,
      trickinessScore: topCandidate.trickinessScore,
      psychologicalTrap: this.describePsychologicalTrap(
        topCandidate.number,
        strategy
      ),
      learningInsight: this.generateLearningInsight(
        topCandidate,
        weaknessAnalysis
      ),
      weaknessesTargeted: this.identifyTargetedWeaknesses(
        topCandidate.number,
        weaknessAnalysis
      ),
    };
  }

  // Describe psychological trap
  describePsychologicalTrap(number, strategy) {
    const traps = {
      "Anti-Binary Search": `Number ${number} maximizes binary search inefficiency`,
      "Psychological Traps": `Number ${number} exploits cognitive biases`,
      "Boundary Traps": `Number ${number} creates edge-case confusion`,
      "Pattern Breaker": `Number ${number} disrupts expected patterns`,
      "Ultimate Challenge": `Number ${number} represents maximum difficulty`,
    };

    return traps[strategy.name] || `Strategic selection: ${number}`;
  }

  // Generate learning insight
  generateLearningInsight(candidate, weaknessAnalysis) {
    if (weaknessAnalysis.confidenceScore < 0.5) {
      return "Limited player data - using general difficulty principles";
    }

    if (weaknessAnalysis.primaryWeaknesses.length > 0) {
      return `Targeting identified weaknesses: ${weaknessAnalysis.primaryWeaknesses.join(
        ", "
      )}`;
    }

    if (weaknessAnalysis.psychologicalBiases.length > 0) {
      return `Exploiting psychological patterns: ${weaknessAnalysis.psychologicalBiases.join(
        ", "
      )}`;
    }

    return `Strategic number selection based on ${candidate.trickinessScore.toFixed(
      2
    )} trickiness score`;
  }

  // Identify targeted weaknesses
  identifyTargetedWeaknesses(number, weaknessAnalysis) {
    const targeted = [];

    if (this.isPrime(number)) {
      targeted.push("binary_search_optimization");
    }

    if (number % 5 !== 0 && number % 10 !== 0) {
      targeted.push("round_number_bias");
    }

    if (number < 20 || number > 80) {
      targeted.push("middle_preference");
    }

    if (number <= 10 || number >= 90) {
      targeted.push("edge_avoidance");
    }

    return targeted;
  }

  // Calculate expected difficulty
  calculateExpectedDifficulty(number, playerProfile, strategy) {
    const baseGuesses = 7;
    let difficultyMultiplier = 1.0;

    difficultyMultiplier += strategy.trickinessLevel * 0.5;

    const skillAdjustment =
      {
        expert: 0.8,
        advanced: 1.0,
        intermediate: 1.2,
        beginner: 1.4,
        unknown: 1.1,
      }[playerProfile.skillLevel] || 1.1;

    difficultyMultiplier *= skillAdjustment;

    if (this.isPrime(number)) {
      difficultyMultiplier += 0.2;
    }

    if (Math.abs(number - 50) > 30) {
      difficultyMultiplier += 0.1;
    }

    const expectedGuesses = Math.round(baseGuesses * difficultyMultiplier);
    return Math.max(6, Math.min(15, expectedGuesses));
  }

  // Record tricky number generation
  recordTrickyNumberGeneration(selection, strategy, playerProfile) {
    const record = {
      timestamp: Date.now(),
      number: selection.number,
      strategy: strategy.name,
      trickinessScore: selection.trickinessScore,
      playerSkillLevel: playerProfile.skillLevel,
      expectedDifficulty: selection.expectedDifficulty,
    };

    this.learningData.trickinessHistory.push(record);

    if (this.learningData.trickinessHistory.length > 100) {
      this.learningData.trickinessHistory.shift();
    }
  }

  // Learn from game result
  learnFromGameResult(gameResult, secretNumber, conversationHistory) {
    console.log("Hider learning from game result:", gameResult);

    try {
      const learningRecord = {
        timestamp: Date.now(),
        secretNumber: secretNumber,
        actualGuesses: gameResult.guessCount,
        expectedGuesses: gameResult.expectedGuesses || 7,
        strategy: gameResult.strategy,
        success: gameResult.guessCount >= 8,
        playerGuessHistory: gameResult.guessHistory || [],
      };

      this.learningData.gameResults.push(learningRecord);
      this.updateStrategyEffectiveness(
        gameResult.strategy,
        learningRecord.success
      );
      this.updateAverageDifficulty(gameResult.guessCount);
      this.analyzePlayerResponse(gameResult.guessHistory, secretNumber);

      console.log("Hider learning completed");
    } catch (error) {
      console.warn("Hider learning failed:", error.message);
    }
  }

  // Update strategy effectiveness
  updateStrategyEffectiveness(strategy, wasSuccessful) {
    if (!this.stats.strategySuccessRates.has(strategy)) {
      this.stats.strategySuccessRates.set(strategy, { success: 0, total: 0 });
    }

    const stats = this.stats.strategySuccessRates.get(strategy);
    stats.total++;
    if (wasSuccessful) {
      stats.success++;
    }

    console.log(
      `Strategy ${strategy}: ${stats.success}/${stats.total} success rate`
    );
  }

  // Update average difficulty
  updateAverageDifficulty(actualGuesses) {
    const totalGames = this.stats.totalNumbersGenerated;
    this.stats.averageDifficultyInduced =
      (this.stats.averageDifficultyInduced * (totalGames - 1) + actualGuesses) /
      totalGames;
  }

  // Analyze player response
  analyzePlayerResponse(guessHistory, secretNumber) {
    if (!guessHistory || guessHistory.length === 0) return;

    const analysis = {
      usedBinarySearch: this.detectBinarySearchUsage(
        guessHistory,
        secretNumber
      ),
      hadPsychologicalBias: this.detectPsychologicalBias(guessHistory),
      showedPatternSeeking: this.detectPatternSeeking(guessHistory),
      efficiencyScore: this.calculateEfficiencyScore(guessHistory.length),
    };

    this.learningData.gameResults[
      this.learningData.gameResults.length - 1
    ].playerAnalysis = analysis;
  }

  // Detect binary search usage
  detectBinarySearchUsage(guesses, secret) {
    if (guesses.length <= 2) return true;

    let range = { min: 1, max: 100 };
    let binaryLikeSteps = 0;

    for (const guess of guesses.slice(0, -1)) {
      const expectedMidpoint = Math.floor((range.min + range.max) / 2);

      if (Math.abs(guess - expectedMidpoint) <= 3) {
        binaryLikeSteps++;
      }

      if (guess < secret) {
        range.min = guess + 1;
      } else {
        range.max = guess - 1;
      }
    }

    return binaryLikeSteps / (guesses.length - 1) > 0.6;
  }

  // Detect psychological bias
  detectPsychologicalBias(guesses) {
    const roundNumbers = guesses.filter((g) => g % 5 === 0 || g % 10 === 0);
    return roundNumbers.length / guesses.length > 0.3;
  }

  // Detect pattern seeking
  detectPatternSeeking(guesses) {
    if (guesses.length < 3) return false;

    let consecutiveSmallSteps = 0;
    for (let i = 1; i < guesses.length; i++) {
      if (Math.abs(guesses[i] - guesses[i - 1]) <= 3) {
        consecutiveSmallSteps++;
      }
    }

    return consecutiveSmallSteps > guesses.length * 0.3;
  }

  // Calculate efficiency score
  calculateEfficiencyScore(guessCount) {
    const optimal = Math.ceil(Math.log2(100));
    return Math.max(0, 1 - (guessCount - optimal) / 10);
  }

  // Generate fallback tricky number
  generateFallbackTrickyNumber(playerProfile) {
    const fallbackNumbers = [7, 13, 23, 37, 43, 67, 73, 89, 97];
    const selectedNumber =
      fallbackNumbers[Math.floor(Math.random() * fallbackNumbers.length)];

    return {
      number: selectedNumber,
      strategy: "fallback",
      reasoning: "Fallback to default tricky number",
      trickinessScore: 0.7,
      expectedDifficulty: 8,
      psychologicalTrap: "Basic prime number difficulty",
      learningInsight: "Using fallback strategy",
      weaknessesTargeted: ["binary_search_optimization"],
    };
  }

  // Get learning statistics
  getLearningStats() {
    const recentGames = this.learningData.gameResults.slice(-10);

    return {
      totalGamesAnalyzed: this.learningData.gameResults.length,
      averageDifficultyInduced: this.stats.averageDifficultyInduced.toFixed(1),
      trickinessLevel: this.calculateOverallTrickinessLevel(),
      strategySuccessRates: this.getStrategySuccessRates(),
      recentPerformance: this.analyzeRecentPerformance(recentGames),
      learningConfidence: Math.min(
        0.95,
        0.3 + this.learningData.gameResults.length * 0.02
      ),
    };
  }

  // Calculate overall trickiness level
  calculateOverallTrickinessLevel() {
    if (this.learningData.trickinessHistory.length === 0) return 0.5;

    const avgTrickiness =
      this.learningData.trickinessHistory.reduce(
        (sum, record) => sum + record.trickinessScore,
        0
      ) / this.learningData.trickinessHistory.length;

    return avgTrickiness.toFixed(2);
  }

  // Get strategy success rates
  getStrategySuccessRates() {
    const rates = {};
    for (const [strategy, stats] of this.stats.strategySuccessRates) {
      rates[strategy] =
        stats.total > 0
          ? `${((stats.success / stats.total) * 100).toFixed(1)}%`
          : "0%";
    }
    return rates;
  }

  // Analyze recent performance
  analyzeRecentPerformance(recentGames) {
    if (recentGames.length === 0) return "No recent data";

    const avgRecentGuesses =
      recentGames.reduce((sum, game) => sum + game.actualGuesses, 0) /
      recentGames.length;
    const successfulTricks = recentGames.filter((game) => game.success).length;

    return {
      averageGuessesInduced: avgRecentGuesses.toFixed(1),
      trickSuccessRate: `${(
        (successfulTricks / recentGames.length) *
        100
      ).toFixed(1)}%`,
      gamesAnalyzed: recentGames.length,
    };
  }

  // Reset system
  reset() {
    this.stats = {
      totalNumbersGenerated: 0,
      averageDifficultyInduced: 0,
      strategySuccessRates: new Map(),
      playerFrustrationLevel: 0,
      trickinessEvolution: [],
    };

    console.log(
      "Advanced Hider Learning System reset (learning data preserved)"
    );
  }

  // Helper method: Check if prime
  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }
}
