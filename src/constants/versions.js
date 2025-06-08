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

export const performanceMetrics = [
  {
    label: "V1 Recognition Accuracy",
    value: "~85%",
    color: "text-purple-600",
  },
  {
    label: "V2 Button Accuracy",
    value: "100%",
    color: "text-green-600",
  },
  {
    label: "V3 Human Intervention",
    value: "0ms",
    color: "text-indigo-600",
  },
  {
    label: "Complexity Increase",
    value: "3x",
    color: "text-blue-600",
  },
];

// Game configuration
export const gameConfig = {
  minNumber: 1,
  maxNumber: 100,
  maxGuesses: 7, // log2(100) ≈ 6.64
  roles: {
    hider: {
      name: "Hider",
      icon: "🎯",
      color: "text-purple-600",
    },
    guesser: {
      name: "Guesser",
      icon: "🔍",
      color: "text-blue-600",
    },
  },
};

// Sample conversation
export const sampleConversation = [
  {
    role: "hider",
    message: "I have chosen a number between 1 and 100.",
    isCorrect: false,
  },
  {
    role: "guesser",
    message: "Is it 50?",
    isCorrect: false,
  },
  {
    role: "hider",
    message: "Higher.",
    isCorrect: false,
  },
  {
    role: "guesser",
    message: "Is it 75?",
    isCorrect: false,
  },
  {
    role: "hider",
    message: "Lower.",
    isCorrect: false,
  },
  {
    role: "guesser",
    message: "Is it 60?",
    isCorrect: false,
  },
  {
    role: "hider",
    message: "Higher.",
    isCorrect: false,
  },
  {
    role: "guesser",
    message: "Is it 65?",
    isCorrect: false,
  },
  {
    role: "hider",
    message: "Lower.",
    isCorrect: false,
  },
  {
    role: "guesser",
    message: "Is it 62?",
    isCorrect: false,
  },
  {
    role: "hider",
    message: "Correct!",
    isCorrect: true,
  },
];
