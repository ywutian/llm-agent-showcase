import React, { useState, useCallback, useRef, useMemo } from 'react';
import { 
  Settings, Shield, Cpu, AlertTriangle, Brain, MessageCircle, 
  Zap, Target, Activity 
} from 'lucide-react';
import { getTheme, MODEL_OPTIONS, BUILTIN_API_TOKEN } from '../../constants';

const DEFAULT_THEME = {
  primary: { bg: 'from-gray-100 to-gray-200', icon: 'text-gray-600', text: 'text-gray-700', border: 'border-gray-200' },
  role: { bg: 'from-gray-100 to-gray-200', icon: 'text-gray-600', text: 'text-gray-700' },
  ai: { bg: 'from-blue-100 to-blue-200', icon: 'text-blue-600', text: 'text-blue-700' },
  user: { bg: 'from-green-100 to-green-200', icon: 'text-green-600', text: 'text-green-700' }
};

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

const GameConfiguration = ({ 
  config, 
  onConfigChange, 
  apiStatus, 
  showAdvancedSettings = false,
  variant = 'default',
  gameData, 
  conversation = [], 
  gameState = 'idle'
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = getSafeTheme(variant);
  
  const autoTokenSetRef = useRef(false);
  const onConfigChangeRef = useRef(onConfigChange);
  
  React.useLayoutEffect(() => {
    onConfigChangeRef.current = onConfigChange;
  });

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

  React.useEffect(() => {
    if (config.useRealAPI && !config.apiToken && !autoTokenSetRef.current) {
      autoTokenSetRef.current = true;
      onConfigChangeRef.current('apiToken', BUILTIN_API_TOKEN);
    }
    
    if (!config.useRealAPI) {
      autoTokenSetRef.current = false;
    }
  }, [config.useRealAPI, config.apiToken]);

  const handleConfigChange = useCallback(async (key, value) => {
    if (key === 'useRealAPI') {
      setIsTransitioning(true);
      
      if (value === true) {
        autoTokenSetRef.current = false;
      }
      
      onConfigChange(key, value);
      setTimeout(() => setIsTransitioning(false), 150);
    } else {
      if (key === 'apiToken' && value) {
        autoTokenSetRef.current = true;
      }
      onConfigChange(key, value);
    }
  }, [onConfigChange]);

  const hasGameData = gameData || (conversation && conversation.length > 0);

  return (
    <div className={`bg-gradient-to-r ${theme.primary.bg} rounded-2xl p-6 mb-6 shadow-inner border ${theme.primary.border}`}>
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Game Configuration
        </h3>
      </div>

      <div className="mb-8">
        <h4 className="text-center text-sm font-medium text-gray-600 mb-4">Choose Game Mode</h4>
        
        <div className="flex justify-center gap-2 p-2 bg-white bg-opacity-70 rounded-2xl max-w-md mx-auto shadow-sm">
          <button
            onClick={() => handleConfigChange('useRealAPI', false)}
            disabled={isTransitioning}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all transform ${
              !config.useRealAPI 
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-transparent text-gray-600 hover:bg-gray-50'
            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Shield className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bold">Simulation</div>
              <div className="text-xs opacity-75">Free & Fast</div>
            </div>
          </button>
          
          <button
            onClick={() => handleConfigChange('useRealAPI', true)}
            disabled={isTransitioning}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all transform ${
              config.useRealAPI 
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-transparent text-gray-600 hover:bg-gray-50'
            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Cpu className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bold">Real AI</div>
              <div className="text-xs opacity-75">Authentic</div>
            </div>
          </button>
        </div>
      </div>

      {hasGameData ? (
        <div className="mb-8">
          <h4 className="text-center text-sm font-medium text-gray-600 mb-4">Game Statistics</h4>
          <div className={`grid ${gridClass} gap-4`}>
            {statsConfig.map((stat, index) => {
              const safeColor = stat.color || DEFAULT_THEME.primary;
              const safeBg = safeColor.bg || DEFAULT_THEME.primary.bg;
              const safeIcon = safeColor.icon || DEFAULT_THEME.primary.icon;
              const safeText = safeColor.text || DEFAULT_THEME.primary.text;

              return (
                <div 
                  key={stat.key}
                  className={`bg-gradient-to-br ${safeBg} p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-200 group relative transform hover:-translate-y-1 min-w-0`}
                  title={stat.tooltip}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${safeIcon} group-hover:scale-110 transition-transform duration-200`} />
                  
                  <div className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</div>
                  
                  <div className={`text-lg font-bold ${safeText} group-hover:scale-105 transition-transform duration-200`}>
                    {stat.value}
                  </div>

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
      ) : (
        <div className="text-center py-6 mb-8">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50 text-gray-500" />
          <p className="text-sm text-gray-500">Start a game to see statistics</p>
        </div>
      )}

      {showAdvancedSettings && config.useRealAPI && (
        <div className="bg-white bg-opacity-70 rounded-xl p-4 shadow-sm mb-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Model Selection
          </h5>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">AI Model:</label>
            <select
              value={config.model}
              onChange={(e) => handleConfigChange('model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-transparent"
            >
              {MODEL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
          config.useRealAPI ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {config.useRealAPI ? <Cpu className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          <span>
            {config.useRealAPI 
              ? `Real ${config.model.split('/')[1]} API` 
              : 'Enhanced Simulation Mode'
            }
          </span>
          {config.useRealAPI && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </div>
      </div>

      {apiStatus?.callHistory?.total > 0 && (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="bg-white bg-opacity-70 p-3 rounded-lg text-center shadow-sm">
      <div className="text-lg font-bold text-blue-600">{apiStatus.callHistory.successful}</div>
      <div className="text-xs text-gray-500">Successful</div>
    </div>
    <div className="bg-white bg-opacity-70 p-3 rounded-lg text-center shadow-sm">
      <div className="text-lg font-bold text-purple-600">{apiStatus.callHistory.total}</div>
      <div className="text-xs text-gray-500">Total Calls</div>
    </div>
  </div>
)}

      {config.useRealAPI && !config.apiToken && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>API token is required for real API mode</span>
          </div>
        </div>
      )}

      {isTransitioning && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Switching mode...
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(GameConfiguration);