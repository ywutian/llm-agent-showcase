// components/shared/GameStats.jsx - 简化版本，移除turns和efficiency
import React, { useMemo } from 'react';
import { Brain, MessageCircle, Cpu, Zap, Target, Activity } from 'lucide-react';
import { getTheme } from '../../constants';

// 默认主题配置 - 防止 getTheme 返回 undefined
const DEFAULT_THEME = {
  primary: { bg: 'from-gray-100 to-gray-200', icon: 'text-gray-600', text: 'text-gray-700' },
  role: { bg: 'from-gray-100 to-gray-200', icon: 'text-gray-600', text: 'text-gray-700' },
  ai: { bg: 'from-blue-100 to-blue-200', icon: 'text-blue-600', text: 'text-blue-700' },
  user: { bg: 'from-green-100 to-green-200', icon: 'text-green-600', text: 'text-green-700' }
};

// 安全的主题获取函数
const getSafeTheme = (variant) => {
  try {
    const theme = getTheme(variant);
    return {
      primary: theme?.primary || DEFAULT_THEME.primary,
      role: theme?.role || DEFAULT_THEME.role,
      ai: theme?.ai || DEFAULT_THEME.ai,
      user: theme?.user || DEFAULT_THEME.user
    };
  } catch (error) {
    console.warn('Failed to get theme for variant:', variant, error);
    return DEFAULT_THEME;
  }
};

const getGridClass = (itemCount) => {
  if (itemCount <= 2) return 'grid-cols-1 md:grid-cols-2';
  if (itemCount <= 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
};

const GameStats = ({ 
  gameData, 
  conversation = [], 
  gameState = 'idle', 
  variant = 'default'
}) => {
  // 使用安全的主题获取
  const theme = useMemo(() => getSafeTheme(variant), [variant]);
  
  // 安全的统计数据计算
  const stats = useMemo(() => {
    const safeGameData = gameData || {};
    const safeConversation = Array.isArray(conversation) ? conversation : [];
    
    return {
      totalMessages: safeConversation.length,
      guessCount: safeGameData.guessCount || safeGameData.totalGuesses || 0,
      secretNumber: safeGameData.secretNumber || (gameState === 'finished' ? 'Unknown' : '???'),
      currentRole: safeGameData.currentRole || 'unknown',
      useRealAPI: safeGameData.useRealAPI || false
    };
  }, [gameData, conversation, gameState]);

  const statsConfig = useMemo(() => {
    const safeTheme = {
      role: theme.role || DEFAULT_THEME.role,
      primary: theme.primary || DEFAULT_THEME.primary,
      ai: theme.ai || DEFAULT_THEME.ai,
      user: theme.user || DEFAULT_THEME.user
    };

    if (variant === 'v3') {
      // V3 自对弈模式 - 简化版
      return [
        {
          key: 'mode',
          icon: Brain,
          label: 'Game Mode',
          value: stats.useRealAPI ? 'Real API' : 'Simulation',
          color: safeTheme.role,
          tooltip: stats.useRealAPI ? 'Using real AI API calls' : 'Using simulation'
        },
        {
          key: 'guesses',
          icon: Target,
          label: 'Guesses',
          value: stats.guessCount,
          color: safeTheme.ai,
          tooltip: 'Total guesses made'
        },
        {
          key: 'secret',
          icon: Zap,
          label: 'Secret Number',
          value: stats.secretNumber,
          color: safeTheme.user,
          tooltip: stats.secretNumber === '???' ? 'Hidden during game' : 'The secret number'
        }
      ];
    } else {
      // 默认模式 - 简化版
      return [
        {
          key: 'role',
          icon: Brain,
          label: 'AI Role',
          value: stats.currentRole === 'hider' ? '🎯 Hider' : '🔍 Guesser',
          color: safeTheme.role,
          tooltip: stats.currentRole === 'hider' ? 'AI is hiding a number' : 'AI is guessing your number'
        },
        {
          key: 'messages',
          icon: MessageCircle,
          label: 'Messages',
          value: stats.totalMessages,
          color: safeTheme.primary,
          tooltip: 'Total messages exchanged'
        },
        {
          key: 'guesses',
          icon: Zap,
          label: 'Guesses',
          value: stats.guessCount,
          color: safeTheme.ai,
          tooltip: 'Number of guesses made'
        },
        {
          key: 'secret',
          icon: Cpu,
          label: 'Secret Number',
          value: stats.secretNumber,
          color: safeTheme.user,
          tooltip: stats.secretNumber === '???' ? 'Hidden during game' : 'The secret number'
        }
      ];
    }
  }, [variant, stats, theme]);

  const gridClass = useMemo(() => getGridClass(statsConfig.length), [statsConfig.length]);

  // 空状态检查
  if (!gameData && (!conversation || conversation.length === 0)) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No game data available</p>
        <p className="text-sm">Start a game to see statistics</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-8 w-full">
      <div className={`grid ${gridClass} gap-6 w-full max-w-5xl px-4`}>
        {statsConfig.map((stat, index) => {
        const safeColor = stat.color || DEFAULT_THEME.primary;
        const safeBg = safeColor.bg || DEFAULT_THEME.primary.bg;
        const safeIcon = safeColor.icon || DEFAULT_THEME.primary.icon;
        const safeText = safeColor.text || DEFAULT_THEME.primary.text;

        return (
          <div 
            key={stat.key}
            className={`bg-gradient-to-br ${safeBg} p-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-200 group relative transform hover:-translate-y-1 min-w-0`}
            title={stat.tooltip}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <stat.icon className={`w-10 h-10 mx-auto mb-3 ${safeIcon} group-hover:scale-110 transition-transform duration-200`} />
            
            {/* Label */}
            <div className="text-base text-gray-600 mb-2 font-medium">{stat.label}</div>
            
            {/* Value */}
            <div className={`text-xl font-bold ${safeText} group-hover:scale-105 transition-transform duration-200`}>
              {stat.value}
            </div>

            {/* Special indicators */}
            {stat.key === 'mode' && stat.value === 'Real API' && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Real API Active"></div>
            )}
            
            {stat.key === 'secret' && stat.value !== '???' && gameState === 'finished' && (
              <div className="absolute top-2 right-2 text-green-500 text-xs" title="Game Finished!">✓</div>
            )}
          </div>
        );
              })}
      </div>
    </div>
  );
};

export default React.memo(GameStats);