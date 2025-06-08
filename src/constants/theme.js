// constants/theme.js
export const THEME_VARIANTS = {
  v1: {
    primary: {
      gradient: "from-purple-500 to-indigo-500",
      bg: "from-purple-100 to-indigo-100",
      border: "border-purple-200",
      text: "text-purple-700",
      icon: "text-purple-600",
    },
    user: {
      gradient: "from-green-500 to-green-600",
      bg: "from-green-100 to-green-200",
    },
    ai: {
      gradient: "from-purple-500 to-purple-600",
      bg: "from-purple-100 to-purple-200",
      name: "🤖 AI Agent",
    },
    role: {
      bg: "from-purple-100 to-purple-200",
      text: "text-purple-700",
      icon: "text-purple-600",
    },
    button:
      "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
    focus: "focus:ring-purple-500",
  },

  v2: {
    primary: {
      gradient: "from-green-500 to-emerald-500",
      bg: "from-emerald-100 to-teal-100",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
    user: {
      gradient: "from-emerald-500 to-emerald-600",
      bg: "from-emerald-100 to-emerald-200",
    },
    ai: {
      gradient: "from-teal-500 to-teal-600",
      bg: "from-teal-100 to-teal-200",
      name: "🤖 AI Agent V2",
    },
    role: {
      bg: "from-emerald-100 to-emerald-200",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    },
    button:
      "from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    focus: "focus:ring-emerald-500",
  },

  v3: {
    primary: {
      gradient: "from-indigo-500 to-purple-500",
      bg: "from-indigo-100 to-purple-100",
      border: "border-indigo-200",
      text: "text-indigo-700",
      icon: "text-indigo-600",
    },
    user: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "from-indigo-100 to-indigo-200",
    },
    ai: {
      gradient: "from-purple-500 to-purple-600",
      bg: "from-purple-100 to-purple-200",
      name: "🤖 AI Agent V3",
    },
    role: {
      bg: "from-indigo-100 to-indigo-200",
      text: "text-indigo-700",
      icon: "text-indigo-600",
    },
    button:
      "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
    focus: "focus:ring-indigo-500",
  },

  default: {
    primary: {
      gradient: "from-blue-500 to-blue-600",
      bg: "from-gray-100 to-gray-200",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: "text-blue-600",
    },
    user: {
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-100 to-blue-200",
    },
    ai: {
      gradient: "from-gray-500 to-gray-600",
      bg: "from-gray-100 to-gray-200",
      name: "🤖 AI Agent",
    },
    role: {
      bg: "from-gray-100 to-gray-200",
      text: "text-gray-700",
      icon: "text-gray-600",
    },
    button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    focus: "focus:ring-blue-500",
  },
};

export const GAME_BUTTONS = {
  higher: {
    text: "📈 Higher",
    value: "Higher",
    color: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    shortcut: "H",
  },
  lower: {
    text: "📉 Lower",
    value: "Lower",
    color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    shortcut: "L",
  },
  correct: {
    text: "✅ Correct",
    value: "Correct",
    color:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    shortcut: "C",
  },
};

export const getTheme = (variant = "default") => {
  return THEME_VARIANTS[variant] || THEME_VARIANTS.default;
};

export const getGameButtons = () => {
  return Object.values(GAME_BUTTONS);
};

export const STATUS_COLORS = {
  idle: "bg-gray-100 text-gray-800",
  playing: "bg-blue-100 text-blue-800",
  finished: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  processing: "bg-orange-100 text-orange-800",
};

export const API_STATUS_COLORS = {
  simulation: "bg-blue-100 text-blue-800",
  real: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  offline: "bg-gray-100 text-gray-800",
};
