import React from 'react';
import { Cpu, Brain, Zap } from 'lucide-react';

const LoadingSpinner = ({ 
  message = "Loading AI System...", 
  type = "default",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  };

  const getIcon = () => {
    switch (type) {
      case 'thinking':
        return <Brain className={`${sizeClasses[size]} text-purple-600 animate-pulse`} />;
      case 'processing':
        return <Zap className={`${sizeClasses[size]} text-blue-600 animate-pulse`} />;
      default:
        return <Cpu className={`${sizeClasses[size]} text-indigo-600 animate-pulse`} />;
    }
  };

  const getThemeColors = () => {
    switch (type) {
      case 'thinking':
        return {
          gradient: 'from-purple-100 to-indigo-100',
          border: 'border-purple-200',
          text: 'text-purple-800',
          dots: 'bg-purple-500'
        };
      case 'processing':
        return {
          gradient: 'from-blue-100 to-cyan-100',
          border: 'border-blue-200',
          text: 'text-blue-800',
          dots: 'bg-blue-500'
        };
      default:
        return {
          gradient: 'from-indigo-100 to-purple-100',
          border: 'border-indigo-200',
          text: 'text-indigo-800',
          dots: 'bg-indigo-500'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className={`p-8 bg-gradient-to-r ${colors.gradient} rounded-2xl border ${colors.border} shadow-lg`}>
        <div className="flex items-center justify-center gap-4">
          {getIcon()}
          
          <div className="text-center">
            <h3 className={`${textSizeClasses[size]} font-semibold ${colors.text} mb-2`}>
              {message}
            </h3>
            
            {type === 'thinking' && (
              <p className="text-purple-700 text-sm">
                AI is analyzing and preparing responses...
              </p>
            )}
            
            {type === 'processing' && (
              <p className="text-blue-700 text-sm">
                Processing your request...
              </p>
            )}
            
            {type === 'default' && (
              <p className="text-indigo-700 text-sm">
                Initializing components...
              </p>
            )}
          </div>
          
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className={`w-3 h-3 ${colors.dots} rounded-full animate-bounce`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-4 w-full bg-white bg-opacity-50 rounded-full h-2">
          <div 
            className={`h-2 bg-gradient-to-r ${type === 'thinking' ? 'from-purple-400 to-purple-600' : 
              type === 'processing' ? 'from-blue-400 to-blue-600' : 
              'from-indigo-400 to-indigo-600'} rounded-full animate-pulse`}
            style={{
              width: '60%',
              animation: 'loading-progress 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 20%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 20%;
          }
        }
      `}</style>
    </div>
  );
};

export const CompactLoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Cpu className="w-5 h-5 text-indigo-600 animate-spin" />
      <span className="text-indigo-700 font-medium">{text}</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"
            style={{animationDelay: `${i * 0.15}s`}}
          />
        ))}
      </div>
    </div>
  );
};

export const AIThinkingIndicator = ({ message = "AI is thinking..." }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border border-purple-200">
      <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
      <span className="text-lg font-semibold text-purple-800">
        🤖 {message}
      </span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
};

export const SelfPlayLoadingIndicator = ({ phase = "Conducting Internal Self-Play..." }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200">
      <div className="flex items-center justify-center gap-4">
        <Cpu className="w-8 h-8 text-indigo-600 animate-pulse" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">
            🤖 AI {phase}
          </h3>
          <p className="text-indigo-700">
            Hider is selecting secret number, Guesser preparing binary search strategy
          </p>
        </div>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" 
              style={{animationDelay: `${i * 0.1}s`}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;