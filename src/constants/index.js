// Core configuration data
export const THEME_VARIANTS = {
  default: {
    primary: { bg: "from-blue-50 to-indigo-100", icon: "text-blue-600" },
    user: { gradient: "from-green-500 to-emerald-600" },
    ai: { gradient: "from-purple-500 to-indigo-600", name: "🤖 AI Assistant" },
  },
  hider: {
    primary: { bg: "from-red-50 to-pink-100", icon: "text-red-600" },
    user: { gradient: "from-red-500 to-pink-600" },
    ai: { gradient: "from-red-600 to-pink-700", name: "🔒 Hider AI" },
  },
  guesser: {
    primary: { bg: "from-green-50 to-emerald-100", icon: "text-green-600" },
    user: { gradient: "from-green-500 to-emerald-600" },
    ai: { gradient: "from-green-600 to-emerald-700", name: "🎯 Guesser AI" },
  },
  selfplay: {
    primary: { bg: "from-purple-50 to-indigo-100", icon: "text-purple-600" },
    user: { gradient: "from-purple-500 to-indigo-600" },
    ai: { gradient: "from-purple-600 to-indigo-700", name: "🧠 Self-Play AI" },
  },
};

export const GAME_BUTTONS = {
  correct: { text: "✅ Correct!", style: "bg-green-500 hover:bg-green-600" },
  tooHigh: { text: "📈 Too High", style: "bg-red-500 hover:bg-red-600" },
  tooLow: { text: "📉 Too Low", style: "bg-blue-500 hover:bg-blue-600" },
};

export const STATUS_COLORS = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
  idle: "text-gray-500",
};

export const API_STATUS_COLORS = {
  connected: "bg-green-100 text-green-800",
  disconnected: "bg-red-100 text-red-800",
  connecting: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

export const GAME_CONFIG = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 100,
  MAX_GUESSES: 10,
  BINARY_SEARCH_OPTIMAL: 7,
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
};

export const ROLE_CONFIG = {
  hider: {
    name: "Number Hider",
    description: "Selects and hides a secret number",
    icon: "🔒",
    color: "red",
  },
  guesser: {
    name: "Number Guesser",
    description: "Tries to guess the hidden number",
    icon: "🎯",
    color: "green",
  },
};

export const EFFICIENCY_GRADES = {
  S: { threshold: 7, label: "Perfect", color: "text-purple-600" },
  A: { threshold: 8, label: "Excellent", color: "text-green-600" },
  B: { threshold: 10, label: "Good", color: "text-blue-600" },
  C: { threshold: 12, label: "Average", color: "text-yellow-600" },
  D: { threshold: 15, label: "Poor", color: "text-red-600" },
};

// Utility functions
export const getTheme = (variant = "default") => {
  return THEME_VARIANTS[variant] || THEME_VARIANTS.default;
};

export const getGameButtons = () => GAME_BUTTONS;

export const generateSecretNumber = (
  min = GAME_CONFIG.MIN_NUMBER,
  max = GAME_CONFIG.MAX_NUMBER
) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const calculateBinarySearchGuess = (min, max) => {
  return Math.floor((min + max) / 2);
};

export const compareGuess = (guess, secret) => {
  if (guess === secret) return "correct";
  return guess > secret ? "tooHigh" : "tooLow";
};

export const updateGuessingRange = (currentRange, guess, result) => {
  const { min, max } = currentRange;

  switch (result) {
    case "tooHigh":
      return { min, max: guess - 1 };
    case "tooLow":
      return { min: guess + 1, max };
    case "correct":
      return { min: guess, max: guess };
    default:
      return currentRange;
  }
};

export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
};

export const formatCost = (cost) => {
  if (cost < 0.01) return `$${(cost * 1000).toFixed(2)}k`;
  return `$${cost.toFixed(4)}`;
};

export const formatEfficiencyGrade = (guessCount) => {
  for (const [grade, config] of Object.entries(EFFICIENCY_GRADES)) {
    if (guessCount <= config.threshold) {
      return { grade, ...config };
    }
  }
  return { grade: "F", label: "Failed", color: "text-gray-600" };
};

export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.guesser;
};

export const getRoleStyles = (role) => {
  const config = getRoleConfig(role);
  return {
    bg: `bg-${config.color}-50`,
    border: `border-${config.color}-200`,
    text: `text-${config.color}-800`,
    icon: config.icon,
  };
};

export const createGameLogEntry = (type, data, timestamp = Date.now()) => {
  return {
    id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    timestamp,
    data: { ...data },
  };
};

// API configuration management
export const createDefaultAPIConfig = () => ({
  model: MODEL_OPTIONS[0].value,
  temperature: 0.7,
  maxTokens: 1000,
  timeout: GAME_CONFIG.TIMEOUT_MS,
  retryAttempts: GAME_CONFIG.RETRY_ATTEMPTS,
});

export const mergeAPIConfig = (defaultConfig, userConfig = {}) => {
  return { ...defaultConfig, ...userConfig };
};

export const validateAPIConfig = (config) => {
  const errors = [];

  if (!config.model) errors.push("Model is required");
  if (config.temperature < 0 || config.temperature > 2) {
    errors.push("Temperature must be between 0 and 2");
  }
  if (config.maxTokens < 1 || config.maxTokens > 4000) {
    errors.push("Max tokens must be between 1 and 4000");
  }

  return { isValid: errors.length === 0, errors };
};

export const createAPIResult = (success, data, error = null, metadata = {}) => {
  return {
    success,
    data: success ? data : null,
    error: success ? null : error,
    timestamp: Date.now(),
    metadata,
  };
};

export const createErrorResult = (error, code = "UNKNOWN_ERROR") => {
  return createAPIResult(false, null, { message: error, code });
};

// Application metadata
export const versions = [
  {
    id: "v1",
    title: "Version 1: Natural Language Recognition",
    subtitle: "Smart feedback parsing with role selection",
    description:
      "First implementation with sophisticated natural language understanding for user feedback. Features unified prompting and dynamic role assignment.",
    features: [
      "Natural Language Processing",
      "Role Selection Interface",
      "Smart Feedback Recognition",
      "Unified Prompting",
    ],
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
    borderColor: "border-purple-500",
    icon: "🎯",
    status: "Foundational",
    accuracy: "~85%",
    responseTime: "1.5-2.5s",
    intervention: "Required",
  },
  {
    id: "v2",
    title: "Version 2: Button-Based Interaction",
    subtitle: "Enhanced UX with reliable feedback mechanisms",
    description:
      "Improved version addressing natural language ambiguity through button-based feedback. Significantly enhanced user experience and reliability.",
    features: [
      "Button-Based Feedback",
      "Auto-Scroll Chat",
      "Fast Response Time",
      "100% Accurate Recognition",
    ],
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    borderColor: "border-green-500",
    icon: "🎮",
    status: "Enhanced",
    accuracy: "100%",
    responseTime: "0.5-1s",
    intervention: "Minimal",
  },
  {
    id: "v3",
    title: "Version 3: Self-Play System",
    subtitle: "Autonomous dual-role AI gameplay",
    description:
      "Revolutionary self-play implementation where a single LLM internally simulates both game roles. Represents advanced prompt engineering breakthrough.",
    features: [
      "Complete Self-Play",
      "Chain-of-Thought Reasoning",
      "Information Asymmetry",
      "Autonomous Gameplay",
    ],
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-500",
    icon: "🧠",
    status: "Revolutionary",
    accuracy: "100%",
    responseTime: "Variable",
    intervention: "None",
  },
];

export const innovations = [
  {
    icon: "🎯",
    title: "Smart Recognition",
    description:
      "Advanced natural language understanding for flexible user interaction patterns",
    gradient: "from-purple-100 to-indigo-100",
  },
  {
    icon: "🎮",
    title: "Enhanced UX",
    description:
      "Button-based feedback system eliminating ambiguity and improving reliability",
    gradient: "from-green-100 to-emerald-100",
  },
  {
    icon: "🧠",
    title: "Self-Play AI",
    description:
      "Breakthrough in autonomous dual-role simulation within single LLM instance",
    gradient: "from-indigo-100 to-purple-100",
  },
];

export const MODEL_OPTIONS = [
  { value: "Qwen/Qwen2.5-32B-Instruct", label: "Qwen2.5-32B-Instruct" },
  { value: "Qwen/QwQ-32B-Preview", label: "QwQ-32B-Preview" },
  { value: "deepseek-ai/DeepSeek-V2.5", label: "DeepSeek-V2.5" },

  {
    value: "meta-llama/Llama-3.1-70B-Instruct",
    label: "Llama-3.1-70B-Instruct",
  },
];

export const BUILTIN_API_TOKEN =
  "sk-clqqswaqxemhlqebormuzmjfhoavnorctpparvurmemasrnx";

export const performanceMetrics = [
  { label: "V1 Recognition Accuracy", value: "~85%", color: "text-purple-600" },
  { label: "V2 Button Accuracy", value: "100%", color: "text-green-600" },
  { label: "V3 Human Intervention", value: "0ms", color: "text-indigo-600" },
  { label: "Complexity Increase", value: "3x", color: "text-blue-600" },
];

export const APP_METADATA = {
  title: "AI Agent Communication System - Interview Project",
  description:
    "Interview Project: AI agents communicate to play number guessing game. Hider agent selects number 1-100, Guesser agent uses binary search. Demonstrates AI-to-AI communication.",
  keywords:
    "AI agents, interview project, LLM communication, number guessing game, artificial intelligence, agent dialogue, autonomous AI, prompt engineering",
  author: "Yitian Yu",
  created: "June 2024",
  purpose: "Interview Project - AI Agent Communication",
};
