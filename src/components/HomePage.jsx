import React from 'react';
import { Eye, ChevronRight, Award, Users, MessageSquare } from 'lucide-react';
import { versions, sampleConversation, gameConfig } from '../constants/versions.js';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="w-12 h-12 text-blue-600" />
          <MessageSquare className="w-12 h-12 text-purple-600" />
        </div>

        <QuickNavigation versions={versions} onNavigate={onNavigate} />
        
        <HeroContent />
      </div>

      <ConversationPreview conversation={sampleConversation} gameConfig={gameConfig} />

      <VersionCards versions={versions} onNavigate={onNavigate} />

      <CallToAction versions={versions} onNavigate={onNavigate} />
    </div>
  );
};

const QuickNavigation = ({ versions, onNavigate }) => (
  <div className="fixed top-6 left-6 z-50">
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-3 border">
      <p className="text-xs text-gray-600 mb-2 text-center font-medium">Quick Access</p>
      <div className="flex flex-col gap-2">
        {versions.map((version) => (
          <button
            key={version.id}
            onClick={() => onNavigate(version.id)}
            className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${version.color} text-white rounded-lg font-medium hover:shadow-md transition-all transform hover:scale-105 text-sm ${version.id === 'v3' ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <span className="text-lg">{version.icon}</span>
            <span className="whitespace-nowrap">{version.id.toUpperCase()}</span>
            {version.id === 'v3' && <span className="text-yellow-300">⭐</span>}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const HeroContent = () => (
  <>
    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
      🤖 AI Agent Communication System
    </h1>
    <h2 className="text-2xl text-gray-600 mb-4">
      Joyous Interview Assignment - Two AI Agents Playing Number Guessing Game
    </h2>
    <p className="text-lg text-gray-500 max-w-4xl mx-auto leading-relaxed mb-6">
      Created for Joyous Company Interview: Demonstrates two AI agents communicating with each other to play a number guessing game. 
      Features Hider Agent (selects number 1-100) and Guesser Agent (uses binary search) with real-time dialogue.
    </p>
    
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-yellow-300 mb-8">
      <p className="text-yellow-800 font-semibold text-lg">
        🏢 Joyous Interview Assignment
      </p>
      <p className="text-yellow-700 text-sm mt-2">
        Yitian Yu <br/>
        Two AI agents communicate autonomously to solve number guessing game
      </p>
    </div>
  </>
);

const ConversationPreview = ({ conversation, gameConfig }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
      <MessageSquare className="w-7 h-7 text-blue-600" />
      Sample AI-to-AI Conversation
    </h2>
    
    <div className="bg-gray-50 rounded-xl p-6 max-w-3xl mx-auto">
      <div className="space-y-3 text-sm font-mono">
        {conversation.map((msg, index) => (
          <div key={index} className="flex gap-2">
            <span className={`${gameConfig.roles[msg.role].color} font-bold`}>
              {gameConfig.roles[msg.role].icon} {gameConfig.roles[msg.role].name}:
            </span>
            <span className={msg.isCorrect ? "text-green-600 font-bold" : ""}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
    </div>
    
    <p className="text-center text-gray-600 mt-4 text-sm">
      ⬆️ Actual conversation between two AI agents - Watch it happen live in Version 3!
    </p>
  </div>
);

const VersionCards = ({ versions, onNavigate }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      Three AI Agent Communication Approaches
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {versions.map((version) => (
        <VersionCard 
          key={version.id} 
          version={version} 
          onNavigate={onNavigate} 
        />
      ))}
    </div>
  </div>
);

const VersionCard = ({ version, onNavigate }) => (
  <div 
    className={`p-6 bg-gradient-to-r ${version.bgColor} rounded-2xl shadow-lg border-2 border-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative`}
    onClick={() => onNavigate(version.id)}
  >
    {version.id === 'v3' && (
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
        🌟 PURE AI-TO-AI
      </div>
    )}
    
    <div className="text-center mb-4">
      <div className="text-4xl mb-3">{version.icon}</div>
      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${version.color} text-white text-xs font-bold rounded-full mb-3`}>
        {version.status}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{version.title}</h3>
      <p className="text-gray-600 text-sm">{version.subtitle}</p>
    </div>
    
    <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
      <p className="text-xs text-gray-700 font-medium">
        {getCommunicationType(version.id)}
      </p>
    </div>
    
    <p className="text-gray-700 mb-4 leading-relaxed text-sm">{version.description}</p>
    
    <div className="flex flex-wrap gap-1 mb-4">
      {version.features.map((feature, i) => (
        <span key={i} className="px-2 py-1 bg-white bg-opacity-70 rounded-full text-xs font-medium text-gray-700 border">
          {feature}
        </span>
      ))}
    </div>
    
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNavigate(version.id);
      }}
      className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${version.color} text-white rounded-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105 w-full justify-center text-base`}
    >
      <Eye className="w-5 h-5" />
      {version.id === 'v3' ? 'See AI-to-AI Communication' : `Explore ${version.status}`}
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

const CallToAction = ({ versions, onNavigate }) => (
  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
    <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
      <Award className="w-8 h-8" />
      Experience AI Agent Communication
    </h2>
    <p className="text-xl mb-6 opacity-90">
      Watch two AI agents communicate autonomously to solve the number guessing game!
    </p>
    <div className="flex flex-wrap justify-center gap-6">
      {versions.map((version) => (
        <button
          key={version.id}
          onClick={() => onNavigate(version.id)}
          className={`flex items-center gap-3 px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl font-bold text-lg hover:bg-opacity-30 transition-all transform hover:scale-105 ${version.id === 'v3' ? 'ring-3 ring-yellow-300' : ''}`}
        >
          <span className="text-2xl">{version.icon}</span>
          <span>{version.title.split(':')[0]}</span>
          {version.id === 'v3' && <span className="text-yellow-300 text-xl">⭐</span>}
          <ChevronRight className="w-5 h-5" />
        </button>
      ))}
    </div>
    
    <p className="mt-4 text-yellow-200 text-sm font-medium">
      ⭐ Version 3 shows pure AI-to-AI communication as requested in the interview!
    </p>
  </div>
);

const getCommunicationType = (versionId) => {
  const types = {
    'v1': "🤖↔️👤 Human mediates AI agent communication",
    'v2': "🤖↔️🔘 Enhanced human-AI agent interaction", 
    'v3': "🤖↔️🤖 Pure AI-to-AI communication (Interview Requirement!)"
  };
  return types[versionId];
};

export default HomePage;