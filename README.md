# 🤖 AI Agent Communication System

An AI agent communication system that demonstrates autonomous communication between two AI agents through a number guessing game. The Hider agent selects a number (1-100) and the Guesser agent uses binary search strategy to find it.

## ✨ Features

- **🎯 Version 1**: Natural Language Recognition - Basic NLP feedback parsing
- **🎮 Version 2**: Button-Based Interaction - 100% accurate feedback mechanism  
- **🧠 Version 3**: AI Self-Play System - Fully autonomous dual-role AI communication ⭐

## 🚀 Quick Start

### Requirements
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the project
git clone [project-url]

# Install dependencies
npm install

# Start development server
npm start
```

Visit http://localhost:3000 to view the application

### Build for Production

```bash
npm run build
```

## 🎮 How to Use

1. **Choose Version**: Select the AI communication version you want to experience
2. **Select Mode**: 
   - Simulation Mode: Quick experience, no API needed
   - Real API Mode: Uses actual large language models
3. **Start Game**: 
   - V1/V2: Choose AI as Hider or Guesser
   - V3: Watch fully autonomous AI vs AI gameplay

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── shared/          # Shared components
│   └── versions/        # Three version implementations
├── hooks/               # Custom React Hooks
├── utils/               # Utility functions
└── constants/           # Configuration constants
```

## 🎯 Technical Highlights

- **Intelligent Dialogue System**: LLM-based natural language processing
- **Binary Search Algorithm**: Efficient number guessing strategy
- **State Management**: Complex game state synchronization
- **Error Handling**: Comprehensive exception handling and recovery
- **Responsive Design**: Adapts to various device sizes

## 🧪 AI Communication Demo

### Version 3 - Pure AI Dialogue Example:
```
🎯 AI Hider: I've chosen a secret number between 1-100. Start guessing!
🔍 AI Guesser: 50
🎯 AI Hider: Higher!
🔍 AI Guesser: 75
🎯 AI Hider: Lower!
🔍 AI Guesser: 62
🎯 AI Hider: Correct!
```

## 👨‍💻 Author

**Yitian Yu**  
Interview Project for Joyous Company

---

*This project demonstrates the evolution from basic human-AI interaction to fully autonomous AI agent communication.*