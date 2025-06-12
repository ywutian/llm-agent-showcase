// 高级 Hider 学习系统 - 专门设计刁钻数字的AI
export class AdvancedHiderLearningSystem {
  constructor() {
    // 🎯 刁钻策略数据库
    this.trickyStrategies = {
      // 反二分搜索策略
      antiBinarySearch: {
        name: "Anti-Binary Search",
        description: "选择让二分搜索效率最低的数字",
        trickinessLevel: 0.8,
        preferredNumbers: [7, 13, 23, 37, 43, 67, 73, 89, 97], // 质数偏好
      },

      // 心理陷阱策略
      psychologicalTraps: {
        name: "Psychological Traps",
        description: "利用人类心理偏见的数字",
        trickinessLevel: 0.9,
        avoidPatterns: ["round_numbers", "middle_bias", "edge_preference"],
      },

      // 边界陷阱策略
      boundaryTraps: {
        name: "Boundary Traps",
        description: "在边界附近设置陷阱",
        trickinessLevel: 0.7,
        boundaryZones: [1, 2, 3, 98, 99, 100, 9, 10, 11, 89, 90, 91],
      },

      // 模式破坏策略
      patternBreaker: {
        name: "Pattern Breaker",
        description: "破坏玩家建立的策略模式",
        trickinessLevel: 0.85,
        adaptiveSelection: true,
      },

      // 极端困难策略
      ultimateChallenge: {
        name: "Ultimate Challenge",
        description: "最高难度的刁钻数字选择",
        trickinessLevel: 0.95,
        requiresExpertAnalysis: true,
      },
    };

    // 🧠 玩家弱点数据库
    this.playerWeaknessDatabase = {
      binary_search_deviations: {
        exploit: "选择让偏离标准二分搜索的数字",
        targetNumbers: [7, 13, 23, 31, 41, 59, 67, 79, 83],
      },
      round_number_bias: {
        exploit: "避开所有5和10的倍数",
        avoidNumbers: [
          5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
          95, 100,
        ],
      },
      middle_preference: {
        exploit: "选择远离40-60范围的数字",
        preferNumbers: [1, 7, 13, 19, 23, 73, 79, 83, 89, 97],
      },
      edge_avoidance: {
        exploit: "选择极端边界数字",
        preferNumbers: [1, 2, 3, 4, 97, 98, 99, 100],
      },
      pattern_dependency: {
        exploit: "打破玩家期望的数字模式",
        requiresHistoryAnalysis: true,
      },
    };

    // 📊 学习数据存储
    this.learningData = {
      playerProfiles: new Map(), // 玩家档案
      strategyEffectiveness: new Map(), // 策略有效性
      difficultyProgression: [], // 难度递增记录
      trickinessHistory: [], // 刁钻历史
      gameResults: [], // 游戏结果
    };

    // ⚙️ 系统配置
    this.config = {
      maxTrickinessLevel: 0.95,
      learningRate: 0.1,
      adaptationThreshold: 3, // 3局后开始适应
      difficultyIncrement: 0.1,
      psychologicalAnalysisDepth: 5,
    };

    // 📈 统计数据
    this.stats = {
      totalNumbersGenerated: 0,
      averageDifficultyInduced: 0,
      strategySuccessRates: new Map(),
      playerFrustrationLevel: 0,
      trickinessEvolution: [],
    };
  }

  // 🎯 主要方法：生成高级刁钻数字
  generateAdvancedTrickyNumber(gameHistory, playerProfile, contextData) {
    console.log("🎯 Generating ADVANCED tricky number with full analysis...");

    try {
      // 1. 分析玩家档案
      const weaknessAnalysis = this.analyzePlayerWeaknesses(
        playerProfile,
        gameHistory
      );

      // 2. 选择最佳刁钻策略
      const optimalStrategy = this.selectOptimalTrickyStrategy(
        weaknessAnalysis,
        playerProfile,
        gameHistory.length
      );

      // 3. 生成候选数字
      const candidates = this.generateTrickyCandidates(
        optimalStrategy,
        weaknessAnalysis,
        playerProfile
      );

      // 4. 评估和选择最终数字
      const finalSelection = this.evaluateAndSelectFinalNumber(
        candidates,
        optimalStrategy,
        weaknessAnalysis
      );

      // 5. 计算预期难度
      const expectedDifficulty = this.calculateExpectedDifficulty(
        finalSelection.number,
        playerProfile,
        optimalStrategy
      );

      // 6. 记录学习数据
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

  // 🔍 分析玩家弱点
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

    // 分析识别出的弱点
    if (playerProfile.identifiedWeaknesses) {
      analysis.primaryWeaknesses = playerProfile.identifiedWeaknesses;
    }

    // 分析心理档案
    if (playerProfile.psychologicalProfile !== "neutral") {
      analysis.psychologicalBiases.push(playerProfile.psychologicalProfile);
    }

    // 分析偏好策略
    if (playerProfile.preferredStrategies) {
      analysis.exploitablePatterns = playerProfile.preferredStrategies;
    }

    // 基于技能水平调整
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

  // 🎲 选择最佳刁钻策略
  selectOptimalTrickyStrategy(weaknessAnalysis, playerProfile, gameCount) {
    let selectedStrategy = this.trickyStrategies.antiBinarySearch; // 默认策略

    // 基于游戏次数递增难度
    if (gameCount < 2) {
      selectedStrategy = this.trickyStrategies.boundaryTraps; // 温和开始
    } else if (gameCount < 5) {
      selectedStrategy = this.trickyStrategies.psychologicalTraps; // 心理战
    } else if (gameCount < 10) {
      selectedStrategy = this.trickyStrategies.patternBreaker; // 模式破坏
    } else {
      selectedStrategy = this.trickyStrategies.ultimateChallenge; // 终极挑战
    }

    // 基于弱点分析调整策略
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

    // 基于玩家技能水平调整
    if (playerProfile.skillLevel === "expert") {
      selectedStrategy = this.trickyStrategies.ultimateChallenge;
    } else if (playerProfile.skillLevel === "beginner") {
      selectedStrategy = this.trickyStrategies.boundaryTraps;
    }

    console.log(
      `🎲 Selected strategy: ${selectedStrategy.name} (Level: ${selectedStrategy.trickinessLevel})`
    );

    return selectedStrategy;
  }

  // 🔢 生成刁钻候选数字
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

    // 确保至少有一些候选数字
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

  // 🎯 生成反二分搜索候选数字
  generateAntiBinaryCandidates(weaknessAnalysis) {
    // 质数通常让二分搜索效率较低
    const primes = [
      7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79,
      83, 89, 97,
    ];

    // 选择位置较刁钻的质数
    const trickyPrimes = primes.filter((p) => {
      // 避开太明显的中点
      return p !== 50 && Math.abs(p - 50) > 10;
    });

    return trickyPrimes.slice(0, 8); // 返回前8个
  }

  // 🧠 生成心理陷阱候选数字
  generatePsychologicalTrapCandidates(playerProfile) {
    const candidates = [];

    // 如果玩家避免圆整数，故意选择看起来不像圆整数的数字
    if (playerProfile.psychologicalProfile === "round_number_preference") {
      candidates.push(
        ...[
          7, 13, 17, 23, 27, 33, 37, 43, 47, 53, 57, 63, 67, 73, 77, 83, 87, 93,
          97,
        ]
      );
    }

    // 如果玩家偏好中间数字，选择边缘数字
    if (playerProfile.psychologicalProfile === "middle_bias") {
      candidates.push(...[3, 7, 11, 13, 17, 19, 83, 87, 89, 91, 93, 97]);
    }

    // 如果玩家避开边界，选择边界数字
    if (playerProfile.psychologicalProfile === "edge_avoidance") {
      candidates.push(...[1, 2, 3, 4, 5, 96, 97, 98, 99, 100]);
    }

    // 如果没有明确偏好，选择反直觉的数字
    if (candidates.length === 0) {
      candidates.push(...[7, 13, 23, 31, 41, 59, 67, 79, 83, 89]);
    }

    return candidates;
  }

  // 🎲 生成边界陷阱候选数字
  generateBoundaryTrapCandidates() {
    return [
      1, 2, 3, 4, 5, 6, 94, 95, 96, 97, 98, 99, 100, 8, 9, 10, 11, 88, 89, 90,
      91, 92,
    ];
  }

  // 🔀 生成模式破坏候选数字
  generatePatternBreakerCandidates(playerProfile) {
    // 分析玩家的历史偏好，选择相反的数字
    const candidates = [];

    // 基于偏好策略选择相反的模式
    if (playerProfile.preferredStrategies?.includes("pure_binary_search")) {
      // 选择让纯二分搜索低效的数字
      candidates.push(...[7, 13, 23, 37, 43, 67, 73, 89, 97]);
    }

    if (playerProfile.preferredStrategies?.includes("pattern_seeking")) {
      // 选择无规律的数字
      candidates.push(...[11, 17, 29, 41, 53, 71, 83, 91]);
    }

    // 确保有候选数字
    if (candidates.length === 0) {
      candidates.push(...[13, 17, 31, 37, 41, 71, 73, 79]);
    }

    return candidates;
  }

  // 💀 生成终极挑战数字
  generateUltimateChallengeNumbers(weaknessAnalysis, playerProfile) {
    // 这些是经过精心计算的最难猜测的数字
    const ultimateNumbers = [
      7, // 小质数，破坏二分搜索
      13, // 不吉利数字，心理影响
      23, // 中小质数
      31, // 稍大质数
      41, // 接近中间但不是
      59, // 大质数
      67, // 2/3位置质数
      73, // 3/4位置质数
      79, // 接近80但不是
      83, // 大质数
      89, // 接近90但不是
      97, // 最大两位质数
    ];

    // 基于玩家弱点选择最刁钻的
    if (weaknessAnalysis.confidenceScore > 0.8) {
      return ultimateNumbers.filter((n) => n % 10 !== 0 && n % 5 !== 0);
    }

    return ultimateNumbers.slice(0, 6);
  }

  // 🎯 生成默认刁钻候选数字
  generateDefaultTrickyCandidates() {
    return [7, 13, 23, 37, 43, 67, 73, 89, 97];
  }

  // 📊 计算刁钻分数
  calculateTrickinessScore(number, strategy, weaknessAnalysis) {
    let score = strategy.trickinessLevel;

    // 质数加分
    if (this.isPrime(number)) {
      score += 0.1;
    }

    // 远离50加分
    const distanceFrom50 = Math.abs(number - 50);
    if (distanceFrom50 > 20) {
      score += 0.05;
    }

    // 不是5或10的倍数加分
    if (number % 5 !== 0 && number % 10 !== 0) {
      score += 0.05;
    }

    // 基于玩家弱点调整
    if (weaknessAnalysis.confidenceScore > 0.7) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  // 🏆 评估和选择最终数字
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

    // 按刁钻分数排序
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

  // 🎭 描述心理陷阱
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

  // 💡 生成学习洞察
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

  // 🎯 识别目标弱点
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

  // 📈 计算预期难度
  calculateExpectedDifficulty(number, playerProfile, strategy) {
    const baseGuesses = 7; // 理论二分搜索次数
    let difficultyMultiplier = 1.0;

    // 基于策略调整
    difficultyMultiplier += strategy.trickinessLevel * 0.5;

    // 基于玩家技能调整
    const skillAdjustment =
      {
        expert: 0.8,
        advanced: 1.0,
        intermediate: 1.2,
        beginner: 1.4,
        unknown: 1.1,
      }[playerProfile.skillLevel] || 1.1;

    difficultyMultiplier *= skillAdjustment;

    // 基于数字特性调整
    if (this.isPrime(number)) {
      difficultyMultiplier += 0.2;
    }

    if (Math.abs(number - 50) > 30) {
      difficultyMultiplier += 0.1;
    }

    const expectedGuesses = Math.round(baseGuesses * difficultyMultiplier);
    return Math.max(6, Math.min(15, expectedGuesses)); // 限制在合理范围内
  }

  // 📝 记录刁钻数字生成
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

    // 保持历史记录不超过100条
    if (this.learningData.trickinessHistory.length > 100) {
      this.learningData.trickinessHistory.shift();
    }
  }

  // 🔄 从游戏结果中学习
  learnFromGameResult(gameResult, secretNumber, conversationHistory) {
    console.log("🎯 Hider learning from game result:", gameResult);

    try {
      const learningRecord = {
        timestamp: Date.now(),
        secretNumber: secretNumber,
        actualGuesses: gameResult.guessCount,
        expectedGuesses: gameResult.expectedGuesses || 7,
        strategy: gameResult.strategy,
        success: gameResult.guessCount >= 8, // 8次以上算成功的刁钻
        playerGuessHistory: gameResult.guessHistory || [],
      };

      this.learningData.gameResults.push(learningRecord);

      // 更新策略有效性
      this.updateStrategyEffectiveness(
        gameResult.strategy,
        learningRecord.success
      );

      // 更新平均难度
      this.updateAverageDifficulty(gameResult.guessCount);

      // 分析玩家的应对方式
      this.analyzePlayerResponse(gameResult.guessHistory, secretNumber);

      console.log("✅ Hider learning completed");
    } catch (error) {
      console.warn("Hider learning failed:", error.message);
    }
  }

  // 📊 更新策略有效性
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
      `📊 Strategy ${strategy}: ${stats.success}/${stats.total} success rate`
    );
  }

  // 📈 更新平均难度
  updateAverageDifficulty(actualGuesses) {
    const totalGames = this.stats.totalNumbersGenerated;
    this.stats.averageDifficultyInduced =
      (this.stats.averageDifficultyInduced * (totalGames - 1) + actualGuesses) /
      totalGames;
  }

  // 🔍 分析玩家应对方式
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

    // 存储分析结果用于未来改进
    this.learningData.gameResults[
      this.learningData.gameResults.length - 1
    ].playerAnalysis = analysis;
  }

  // 🔍 检测二分搜索使用
  detectBinarySearchUsage(guesses, secret) {
    if (guesses.length <= 2) return true;

    // 简化检测：检查是否大致遵循二分搜索模式
    let range = { min: 1, max: 100 };
    let binaryLikeSteps = 0;

    for (const guess of guesses.slice(0, -1)) {
      // 除了最后一次
      const expectedMidpoint = Math.floor((range.min + range.max) / 2);

      if (Math.abs(guess - expectedMidpoint) <= 3) {
        binaryLikeSteps++;
      }

      // 更新范围
      if (guess < secret) {
        range.min = guess + 1;
      } else {
        range.max = guess - 1;
      }
    }

    return binaryLikeSteps / (guesses.length - 1) > 0.6;
  }

  // 🧠 检测心理偏见
  detectPsychologicalBias(guesses) {
    const roundNumbers = guesses.filter((g) => g % 5 === 0 || g % 10 === 0);
    return roundNumbers.length / guesses.length > 0.3;
  }

  // 🔄 检测模式寻求
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

  // 📊 计算效率分数
  calculateEfficiencyScore(guessCount) {
    const optimal = Math.ceil(Math.log2(100)); // ~7
    return Math.max(0, 1 - (guessCount - optimal) / 10);
  }

  // 🔄 生成回退刁钻数字
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

  // 📊 获取学习统计
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

  // 📈 计算整体刁钻水平
  calculateOverallTrickinessLevel() {
    if (this.learningData.trickinessHistory.length === 0) return 0.5;

    const avgTrickiness =
      this.learningData.trickinessHistory.reduce(
        (sum, record) => sum + record.trickinessScore,
        0
      ) / this.learningData.trickinessHistory.length;

    return avgTrickiness.toFixed(2);
  }

  // 📊 获取策略成功率
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

  // 📈 分析近期表现
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

  // 🔄 重置系统
  reset() {
    // 保留学习数据但重置游戏特定状态
    this.stats = {
      totalNumbersGenerated: 0,
      averageDifficultyInduced: 0,
      strategySuccessRates: new Map(),
      playerFrustrationLevel: 0,
      trickinessEvolution: [],
    };

    console.log(
      "🔄 Advanced Hider Learning System reset (learning data preserved)"
    );
  }

  // 🧮 辅助方法：检查质数
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
