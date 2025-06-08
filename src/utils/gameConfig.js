// utils/gameConfig.js - 清理版本，移除与 gameLogic.js 重复的函数
export const GAME_CONFIG = {
  RULES: {
    MIN_NUMBER: 1,
    MAX_NUMBER: 100,
    MAX_GUESSES: 10,
    DEFAULT_TEMPERATURE: 0.7,
  },

  STATES: {
    IDLE: "idle",
    PLAYING: "playing",
    FINISHED: "finished",
    PROCESSING: "processing",
  },

  ROLES: {
    HIDER: "hider",
    GUESSER: "guesser",
  },

  FEEDBACK: {
    HIGHER: "higher",
    LOWER: "lower",
    CORRECT: "correct",
  },

  EFFICIENCY_THRESHOLDS: {
    EXCELLENT: 7,
    GOOD: 10,
  },

  API: {
    DEFAULT_MAX_TOKENS: 512,
    DEFAULT_TOP_P: 0.7,
    DEFAULT_TOP_K: 50,
    DEFAULT_FREQUENCY_PENALTY: 0.5,
    DEFAULT_BASE_URL: "https://api.siliconflow.cn/v1/chat/completions",
  },

  UI: {
    ANIMATION_DELAY: 1200,
    SCROLL_DELAY: 500,
    MIN_API_DELAY: 500,
    MAX_API_DELAY: 1500,
  },
};

export const ROLE_CONFIG = {
  [GAME_CONFIG.ROLES.HIDER]: {
    name: "AI Hider",
    icon: "🎯",
    description: "Conceals number and provides feedback",
    styles: {
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-100 to-purple-200",
      border: "border-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-100",
    },
  },
  [GAME_CONFIG.ROLES.GUESSER]: {
    name: "AI Guesser",
    icon: "🔍",
    description: "Uses binary search strategy to guess",
    styles: {
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-100 to-blue-200",
      border: "border-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
    },
  },
};

export const EFFICIENCY_GRADES = {
  EXCELLENT: {
    grade: "A+",
    color: "text-green-600",
    threshold: GAME_CONFIG.EFFICIENCY_THRESHOLDS.EXCELLENT,
  },
  GOOD: {
    grade: "B+",
    color: "text-blue-600",
    threshold: GAME_CONFIG.EFFICIENCY_THRESHOLDS.GOOD,
  },
  AVERAGE: { grade: "C+", color: "text-yellow-600", threshold: Infinity },
};

export const formatDuration = (ms) => {
  if (!ms || ms === 0) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
};

export const formatCost = (cost) => {
  if (!cost || cost.estimatedUSD === 0) return "Free";
  if (cost.estimatedUSD < 0.000001) return "<$0.000001";
  return `$${cost.estimatedUSD.toFixed(6)}`;
};

export const formatEfficiencyGrade = (guessCount) => {
  if (guessCount <= EFFICIENCY_GRADES.EXCELLENT.threshold) {
    return EFFICIENCY_GRADES.EXCELLENT;
  } else if (guessCount <= EFFICIENCY_GRADES.GOOD.threshold) {
    return EFFICIENCY_GRADES.GOOD;
  }
  return EFFICIENCY_GRADES.AVERAGE;
};

export const formatGameMode = (useRealAPI, model) => {
  return useRealAPI ? `Real ${model}` : "Simulation";
};

export const formatAPIStatus = (config, status) => {
  const { useRealAPI, apiToken, model } = config;

  if (!useRealAPI) {
    return { text: "Simulation Mode", color: "bg-blue-100 text-blue-800" };
  }

  if (!apiToken) {
    return { text: "No API Token", color: "bg-red-100 text-red-800" };
  }

  if (status?.hasValidToken) {
    return { text: `${model} Ready`, color: "bg-green-100 text-green-800" };
  }

  return { text: "API Error", color: "bg-orange-100 text-orange-800" };
};

export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG[GAME_CONFIG.ROLES.GUESSER];
};

export const getRoleStyles = (role) => {
  return getRoleConfig(role).styles;
};

export const getRoleIcon = (role) => {
  return getRoleConfig(role).icon;
};

export const getRoleName = (role) => {
  return getRoleConfig(role).name;
};

export const getRoleDescription = (role) => {
  return getRoleConfig(role).description;
};

export const createGameLogEntry = (
  turn,
  role,
  thought,
  action,
  metadata = {}
) => {
  const roleConfig = getRoleConfig(role);

  return {
    turn,
    role,
    roleIcon: roleConfig.icon,
    roleName: roleConfig.name,
    thought,
    action,
    metadata: {
      timestamp: new Date().toISOString(),
      roleConfig,
      ...metadata,
    },
  };
};

export const createSetupLogEntry = (secretNumber, apiType = "simulation") => {
  const { HIDER } = GAME_CONFIG.ROLES;

  return createGameLogEntry(
    0,
    HIDER,
    `I will choose a challenging number. I select ${secretNumber}.`,
    "I've chosen a secret number between 1 and 100, start guessing!",
    {
      isSetup: true,
      secretNumber,
      apiType,
      gamePhase: "setup",
    }
  );
};

export const createGuessLogEntry = (
  turn,
  guess,
  currentRange,
  strategy = "binary_search"
) => {
  const { GUESSER } = GAME_CONFIG.ROLES;

  return createGameLogEntry(
    turn,
    GUESSER,
    `Current search range is [${currentRange.min}, ${currentRange.max}]. Using ${strategy} strategy, I choose middle value ${guess}.`,
    `I guess ${guess}`,
    {
      guess,
      currentRange: { ...currentRange },
      strategy,
      gamePhase: "guessing",
    }
  );
};

export const createFeedbackLogEntry = (
  turn,
  guess,
  secretNumber,
  feedback,
  gameEnd = false
) => {
  const { HIDER } = GAME_CONFIG.ROLES;

  const thoughtMap = {
    [GAME_CONFIG.FEEDBACK
      .CORRECT]: `Guess ${guess} perfectly matches my secret number ${secretNumber}. Victory!`,
    [GAME_CONFIG.FEEDBACK
      .HIGHER]: `Guess ${guess} is less than my secret number ${secretNumber}. Giving "higher" hint.`,
    [GAME_CONFIG.FEEDBACK
      .LOWER]: `Guess ${guess} is greater than my secret number ${secretNumber}. Giving "lower" hint.`,
  };

  const actionMap = {
    [GAME_CONFIG.FEEDBACK.CORRECT]:
      "🎉 Correct! Congratulations, you guessed it!",
    [GAME_CONFIG.FEEDBACK.HIGHER]: "📈 Too low! Guess higher!",
    [GAME_CONFIG.FEEDBACK.LOWER]: "📉 Too high! Guess lower!",
  };

  return createGameLogEntry(
    turn,
    HIDER,
    thoughtMap[feedback] || `Processing guess ${guess}...`,
    actionMap[feedback] || feedback,
    {
      feedback,
      secretNumber,
      guess,
      gameEnd,
      gamePhase: gameEnd ? "completion" : "feedback",
    }
  );
};

export const createAPIResult = (content, metadata = {}) => {
  return {
    content,
    success: true,
    timestamp: new Date().toISOString(),
    metadata: {
      callId: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...metadata,
    },
  };
};

export const createErrorResult = (error, metadata = {}) => {
  return {
    content: null,
    success: false,
    error: {
      message: error.message,
      type: error.name || "UnknownError",
    },
    timestamp: new Date().toISOString(),
    metadata: {
      callId: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...metadata,
    },
  };
};

export const createDefaultAPIConfig = () => ({
  useRealAPI: false,
  apiToken: "",
  apiBaseUrl: GAME_CONFIG.API.DEFAULT_BASE_URL,
  model: "Qwen/Qwen2.5-32B-Instruct",
  maxTokens: GAME_CONFIG.API.DEFAULT_MAX_TOKENS,
  temperature: GAME_CONFIG.RULES.DEFAULT_TEMPERATURE,
  topP: GAME_CONFIG.API.DEFAULT_TOP_P,
  topK: GAME_CONFIG.API.DEFAULT_TOP_K,
  frequencyPenalty: GAME_CONFIG.API.DEFAULT_FREQUENCY_PENALTY,
});

export const mergeAPIConfig = (defaultConfig, customConfig) => {
  const merged = { ...defaultConfig, ...customConfig };
  return merged;
};

export const initializeGameState = () => ({
  state: GAME_CONFIG.STATES.IDLE,
  currentTurn: 0,
  secretNumber: null,
  totalGuesses: 0,
  gameResult: null,
  gameLog: [],
  currentRange: {
    min: GAME_CONFIG.RULES.MIN_NUMBER,
    max: GAME_CONFIG.RULES.MAX_NUMBER,
  },
  apiCallInfo: null,
});

export const resetGameState = () => initializeGameState();

export const calculateGameEfficiency = (guessCount) => {
  if (guessCount <= GAME_CONFIG.EFFICIENCY_THRESHOLDS.EXCELLENT) {
    return "excellent";
  } else if (guessCount <= GAME_CONFIG.EFFICIENCY_THRESHOLDS.GOOD) {
    return "good";
  } else {
    return "needs improvement";
  }
};
