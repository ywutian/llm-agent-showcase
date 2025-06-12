import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Brain, Settings, Zap, X, Activity, XCircle, BookOpen } from 'lucide-react';

import ConversationLog from '../shared/ConversationLog.jsx';
import { useLLMAPIEnhanced } from '../../hooks/useLLMAPIEnhanced.js';

const LLMSelfPlaySystemV3 = () => {
  const API_TOKENS = [
    "AIzaSyDsm7MsVHEJBO10SBNy11wg6eAqq-s63Bs",
    "AIzaSyB8IkzmPQdow6dKu5rn_ywK5fMDAnyQd5s", 
    "AIzaSyAw0SizbU2D7fwxUetA0SiNu5TX5A1BbtM"
  ];

  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [apiConfig, setApiConfig] = useState({
    apiToken: API_TOKENS[0], 
    model: "gemini-2.5-flash-preview-05-20",
    temperature: 0.8,
    maxTokens: 8192
  });

  const [gameState, setGameState] = useState('idle');
  const [conversation, setConversation] = useState([]);
  const [gameData, setGameData] = useState({
    secretNumber: null,
    totalGuesses: 0,
    currentRange: { min: 1, max: 100 },
    gameResult: null,
    intelligenceScore: 0,
    currentPlayer: null,
    currentRole: null,
    turnNumber: 0,
    finalPlayer: null,
    totalTurns: 0,
    avgConfidence: null,
    currentConfidence: null,
  });
  
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [expandedApiData, setExpandedApiData] = useState(null);
  const [systemActivity, setSystemActivity] = useState('idle');

  const {
    startRealTimeGame,
    currentPlayer,
    isGameActive,
    resetGameSession,
    getAPIStatus,
    clearLearningMemory,
    getContextualLearning,
    learningMemory,
    getConfidenceReport,
  } = useLLMAPIEnhanced(apiConfig);

  const switchToNextToken = () => {
    const nextIndex = (currentTokenIndex + 1) % API_TOKENS.length;
    setCurrentTokenIndex(nextIndex);
    setApiConfig(prev => ({ ...prev, apiToken: API_TOKENS[nextIndex] }));
    addDebugInfo(`Switched to API token ${nextIndex + 1}`, 'info');
  };

  const addDebugInfo = (message, type = 'info', apiResponse = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { 
      message, 
      type, 
      timestamp, 
      apiResponse,
      id: Date.now() + Math.random()
    };
    
    setDebugInfo(prev => [...(prev || []).slice(-29), logEntry]);
  };

  const startIntelligentGame = async () => {
    if (!apiConfig.apiToken) {
      alert('Intelligent game mode requires Gemini API key configuration!');
      setShowApiConfig(true);
      return;
    }

    setGameState('playing');
    setConversation([]);
    setDebugInfo([]);
    setApiError(null);
    setIsProcessing(true);
    setSystemActivity('analyzing');
    
    try {
      addDebugInfo('Starting Pure LLM Intelligent Game System (Integrated Learning Mode)...', 'info');
      addDebugInfo('API call monitoring activated', 'api-call', { action: 'session-start' });
      
      const learning = getContextualLearning();
      if (learning && learning.hasLearning) {
        addDebugInfo(`Loading learning data: ${(learning.insights || []).length} insights`, 'success');
      }
      
      const onTurnUpdate = (turnData) => {
        console.log('Turn Update Received:', turnData);
        
        addDebugInfo('API response data', 'api-response', turnData);
        
        const roleDisplay = turnData.currentPlayer === 'hider' ? 'Number Hider' : 
                           turnData.currentPlayer === 'guesser' ? 'Number Guesser' : 
                           'System';
        
        addDebugInfo(`Intelligent turn update: ${roleDisplay} (${turnData.metadata?.action || 'unknown'})`, 'info');
        setSystemActivity(turnData.metadata?.action || 'processing');
        
        if (turnData.metadata?.guess || turnData.metadata?.action === 'select_secret') {
          setGameData(prev => ({
            ...prev,
            totalGuesses: turnData.metadata.guessCount || prev.totalGuesses + (turnData.metadata?.guess ? 1 : 0),
            currentRange: turnData.metadata.currentRange || prev.currentRange,
            currentPlayer: turnData.currentPlayer,
            currentRole: turnData.currentPlayer,
            turnNumber: turnData.turnNumber,
            currentConfidence: turnData.confidence || turnData.metadata?.confidence || prev.currentConfidence,
            avgConfidence: turnData.gameAvgConfidence || prev.avgConfidence,
          }));
        }

        if (turnData.metadata?.action === 'select_secret' && !gameData.secretNumber) {
          const secretNumber = Math.floor(Math.random() * 100) + 1;
          setGameData(prev => ({
            ...prev,
            secretNumber: secretNumber
          }));
          addDebugInfo(`Secret number selected: ${secretNumber}`, 'success');
        }

        setConversation(prev => [...(prev || []), {
          ...turnData,
          timestamp: turnData.timestamp || Date.now(),
          intelligence: turnData.metadata?.intelligence,
          strategy: turnData.metadata?.strategy,
          confidence: turnData.metadata?.confidence || turnData.confidence,
          currentPlayer: turnData.currentPlayer,
          currentRole: turnData.currentPlayer,
          nextPlayer: turnData.nextPlayer,
          roleDisplay: roleDisplay,
          learningApplied: turnData.learningApplied,
        }]);
      };

      const onGameEnd = (gameResult) => {
        console.log('Game End Received:', gameResult);
        
        addDebugInfo('Game end API response', 'api-response', gameResult);
        
        addDebugInfo(`Intelligent game ended: ${gameResult.success ? 'Victory' : 'Failed'}`, 
          gameResult.success ? 'success' : 'warning');
        
        setGameData(prev => ({
          ...prev,
          secretNumber: gameResult.secret,
          totalGuesses: gameResult.guessCount,
          gameResult: gameResult.success ? 'success' : 'failed',
          intelligenceScore: gameResult.intelligenceScore || 0,
          finalPlayer: gameResult.finalPlayer,
          totalTurns: gameResult.totalTurns,
          avgConfidence: gameResult.avgConfidence || gameResult.learningData?.avgConfidence || prev.avgConfidence,
        }));
        
        setGameState('finished');
        setIsProcessing(false);
        setSystemActivity('complete');
        
        if (gameResult.learningData) {
          addDebugInfo(`Learning data updated: total ${gameResult.learningData.totalGamesPlayed} games`, 'success');
          addDebugInfo(`Cumulative intelligence: ${(gameResult.learningData.cumulativeIntelligence * 100).toFixed(1)}%`, 'success');
          if (gameResult.learningData.avgConfidence) {
            addDebugInfo(`Average confidence: ${(gameResult.learningData.avgConfidence * 100).toFixed(1)}%`, 'success');
          }
        }
        
        if (gameResult.intelligenceScore) {
          addDebugInfo(`Intelligence score: ${(gameResult.intelligenceScore * 100).toFixed(1)}%`, 'success');
        }
      };

      const onError = (error) => {
        addDebugInfo('API error response', 'api-error', error);
        addDebugInfo(`LLM intelligent game error: ${error.message}`, 'error');
        
        // Try switching to next API token on error
        if (error.message.includes('API') || error.message.includes('token') || error.message.includes('quota')) {
          addDebugInfo('Attempting to switch API token...', 'warning');
          switchToNextToken();
        }
        
        setApiError(error.message);
        setGameState('idle');
        setIsProcessing(false);
        setSystemActivity('error');
      };

      await startRealTimeGame(onTurnUpdate, onGameEnd, onError);
      
    } catch (error) {
      addDebugInfo('Startup error details', 'api-error', error);
      addDebugInfo(`Pure LLM intelligent game startup failed: ${error.message}`, 'error');
      
      // Try switching to next API token on startup error
      if (error.message.includes('API') || error.message.includes('token') || error.message.includes('quota')) {
        addDebugInfo('Attempting to switch API token...', 'warning');
        switchToNextToken();
      }
      
      setApiError(error.message);
      setGameState('idle');
      setIsProcessing(false);
      setSystemActivity('error');
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setConversation([]);
    setDebugInfo([]);
    setApiError(null);
    setIsProcessing(false);
    setSystemActivity('idle');
    setGameData({
      secretNumber: null,
      totalGuesses: 0,
      currentRange: { min: 1, max: 100 },
      gameResult: null,
      intelligenceScore: 0,
      currentPlayer: null,
      currentRole: null,
      turnNumber: 0,
      finalPlayer: null,
      totalTurns: 0,
      avgConfidence: null,
      currentConfidence: null,
    });
    
    resetGameSession();
    addDebugInfo('LLM intelligent system reset', 'info');
  };

  const clearLearning = () => {
    clearLearningMemory();
    addDebugInfo('Learning memory cleared', 'warning');
  };

  useEffect(() => {
    if (isGameActive && gameState === 'playing') {
      const updateSystemStatus = () => {
        try {
          const apiStatus = getAPIStatus();
          const learning = getContextualLearning();
          
          const currentSystemStatus = {
            intelligence: apiStatus?.systemType || 'LLM Intelligence System with Learning',
            contextualAnalysis: `Intelligent insights: ${(learning?.insights || []).length} items`,
            learningCapacity: `Cumulative intelligence: ${((learning?.avgIntelligence || 0.7) * 100).toFixed(0)}%`,
            activity: systemActivity
          };
          
          console.log('System Status Update:', currentSystemStatus);
        } catch (error) {
          addDebugInfo(`Intelligence status update failed: ${error.message}`, 'warning');
        }
      };
      
      const statusInterval = setInterval(updateSystemStatus, 5000);
      return () => clearInterval(statusInterval);
    }
  }, [gameState, isGameActive, getAPIStatus, getContextualLearning, systemActivity]);

  const getLearningStats = () => {
    try {
      const learning = getContextualLearning();
      const confidenceReport = getConfidenceReport();
      
      return {
        hasLearning: learning?.hasLearning || false,
        gameCount: learningMemory?.gameHistory?.length || 0,
        avgIntelligence: learning?.avgIntelligence || 0.7,
        avgConfidence: learning?.avgConfidence || confidenceReport?.current || 0.7,
        insights: learning?.insights || [],
        successfulStrategies: Array.from(learningMemory?.successfulStrategies || [])
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      return {
        hasLearning: false,
        gameCount: 0,
        avgIntelligence: 0.7,
        avgConfidence: 0.7,
        insights: [],
        successfulStrategies: []
      };
    }
  };

  const hasValidConfidence = (value) => value !== null && value !== undefined && !isNaN(value);

  const renderApiConfig = () => (
    showApiConfig && (
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-blue-800 text-xl flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Gemini API Configuration (API Optimized)
          </h4>
          <button
            onClick={() => setShowApiConfig(false)}
            className="p-2 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Google Gemini API Key (Current: Token {currentTokenIndex + 1}/3)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiConfig.apiToken}
                onChange={(e) => setApiConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                placeholder="Enter your Gemini API Key (AIzaSy...)"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={switchToNextToken}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Switch Token
              </button>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Available tokens: {API_TOKENS.length} | Current: #{currentTokenIndex + 1}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Creativity Temperature
              </label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={apiConfig.temperature}
                onChange={(e) => setApiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Max Tokens (Optimized)
              </label>
              <input
                type="number"
                min="400"
                max="800"
                step="50"
                value={apiConfig.maxTokens}
                onChange={(e) => setApiConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderExpandedApiModal = () => (
    expandedApiData && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">API Response Data Details</h3>
              <p className="text-sm text-gray-600">{expandedApiData.title} - {expandedApiData.timestamp}</p>
            </div>
            <button
              onClick={() => setExpandedApiData(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden p-4">
            <div className="h-full overflow-y-auto bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                {JSON.stringify(expandedApiData.data, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Data size: {JSON.stringify(expandedApiData.data).length} characters
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(expandedApiData.data, null, 2));
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Copy JSON Data
            </button>
          </div>
        </div>
      </div>
    )
  );

  const learningStats = getLearningStats();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            LLM Intelligent Game System
          </h1>
          <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-semibold text-emerald-600">
                LLM Intelligence + Learning + Confidence
              </span>
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600">
                Status: {systemActivity}
              </span>
            </div>
          </div>
          <p className="text-xl text-gray-600">
            LLM Intelligence: Deep conversation analysis + Cumulative learning memory + Role perception intelligence + Confidence tracking + Multi-API failover
          </p>
          <div className="mt-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
            Cumulative learning | Role recognition | API optimization | Intelligent caching | Confidence calibration | Token rotation
          </div>
        </div>

        {learningStats && learningStats.hasLearning && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Cumulative Learning Memory + Confidence Tracking
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">Learning History</div>
                <div className="text-lg font-bold text-blue-800">{learningStats.gameCount} games</div>
                <div className="text-xs text-blue-600">Cumulative experience</div>
              </div>
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">Intelligence Evolution</div>
                <div className="text-lg font-bold text-blue-800">{(learningStats.avgIntelligence * 100).toFixed(1)}%</div>
                <div className="text-xs text-blue-600">Continuously improving</div>
              </div>
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">Confidence Level</div>
                <div className="text-lg font-bold text-blue-800">
                  {hasValidConfidence(learningStats.avgConfidence) ? 
                    `${(learningStats.avgConfidence * 100).toFixed(1)}%` : 
                    'Calibrating...'
                  }
                </div>
                <div className="text-xs text-blue-600">Decision confidence</div>
              </div>
              <div className="bg-white/70 p-3 rounded-lg">
                <div className="text-blue-600 font-medium">Successful Strategies</div>
                <div className="text-lg font-bold text-blue-800">{learningStats.successfulStrategies.length}</div>
                <div className="text-xs text-blue-600">Mastered strategies</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-700">
              <strong>Latest insights:</strong> {(learningStats.insights || []).slice(0, 2).join(' | ')}
            </div>
          </div>
        )}

        {renderApiConfig()}

        {showDebugPanel && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Debug Information ({debugInfo.length} entries)
              </h4>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {debugInfo.length === 0 ? (
                <p className="text-gray-500 text-sm">No debug information available</p>
              ) : (
                debugInfo.slice(-15).reverse().map((entry, index) => (
                  <div 
                    key={entry.id || index} 
                    className={`p-2 rounded text-xs border-l-4 ${
                      entry.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
                      entry.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                      entry.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
                      entry.type === 'api-call' ? 'bg-blue-50 border-blue-400 text-blue-700' :
                      entry.type === 'api-response' ? 'bg-purple-50 border-purple-400 text-purple-700' :
                      'bg-gray-50 border-gray-400 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="flex-1">{entry.message}</span>
                      <span className="text-xs opacity-60 ml-2">{entry.timestamp}</span>
                    </div>
                    {entry.apiResponse && (
                      <button
                        onClick={() => setExpandedApiData({
                          data: entry.apiResponse,
                          title: entry.message,
                          timestamp: entry.timestamp
                        })}
                        className="mt-1 text-xs underline hover:no-underline"
                      >
                        View API Data
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span>Showing latest 15 entries (total: {debugInfo.length})</span>
              <button
                onClick={() => setDebugInfo([])}
                className="text-red-600 hover:underline"
              >
                Clear Debug Log
              </button>
            </div>
          </div>
        )}

        {renderExpandedApiModal()}

        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Pure LLM Intelligent System Error:</span>
              <span>{apiError}</span>
            </div>
            <div className="mt-2 text-sm text-red-600">
              Current API Token: #{currentTokenIndex + 1}/3 | 
              <button 
                onClick={switchToNextToken}
                className="ml-2 text-blue-600 hover:underline"
              >
                Try Next Token
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={startIntelligentGame}
            disabled={isProcessing || gameState === 'playing' || !apiConfig.apiToken}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <Play className="w-6 h-6" />
            {gameState === 'playing' ? 'LLM Analyzing...' : 'Start LLM Intelligent Game'}
          </button>
          
          <button
            onClick={resetGame}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset System
          </button>

          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Settings className="w-5 h-5" />
            API Config ({currentTokenIndex + 1}/3)
          </button>

          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-slate-600 transition-all shadow-lg"
          >
            <Activity className="w-5 h-5" />
            Debug ({debugInfo.length})
          </button>

          {learningStats && learningStats.hasLearning && (
            <button
              onClick={clearLearning}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              Clear Learning
            </button>
          )}
        </div>

        {isProcessing && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-blue-700 font-medium">
                LLM deep intelligent analysis (Token #{currentTokenIndex + 1}) - Integrated learning memory + confidence calibration...
              </span>
            </div>
          </div>
        )}

        {gameState === 'playing' && gameData.secretNumber && (
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 shadow-lg">
            <h4 className="font-semibold mb-2 text-cyan-800 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              LLM Intelligent Game Monitor (Role Perception + Confidence)
            </h4>
            <div className="text-sm text-cyan-700 space-y-1">
              <p>Secret number: <strong className="text-red-600">#{gameData.secretNumber}</strong> (Intelligent selection)</p>
              <p>Current search range: <strong>[{gameData.currentRange?.min || 1}, {gameData.currentRange?.max || 100}]</strong></p>
              <p>Intelligent turns: <strong>{gameData.totalGuesses || 0}</strong></p>
              <p>Current role: <strong className="text-purple-600">
                {gameData.currentRole === 'hider' ? 'Number Hider' : 
                 gameData.currentRole === 'guesser' ? 'Number Guesser' : 'System'}
              </strong></p>
              <p>Game round: <strong>{gameData.turnNumber || 0}</strong></p>
              <p>System activity: <strong className="text-green-600">{systemActivity}</strong></p>
              {hasValidConfidence(gameData.currentConfidence) && (
                <p>Current confidence: <strong className="text-green-600">{(gameData.currentConfidence * 100).toFixed(1)}%</strong></p>
              )}
              {hasValidConfidence(gameData.avgConfidence) && (
                <p>Average confidence: <strong className="text-blue-600">{(gameData.avgConfidence * 100).toFixed(1)}%</strong></p>
              )}
              <p>API Token: <strong className="text-orange-600">#{currentTokenIndex + 1}/3</strong></p>
              <p>Decision type: <strong>LLM deep reasoning + Cumulative learning memory + Confidence calibration</strong></p>
              <p>System type: <strong className="text-green-600">LLM Intelligence</strong></p>
              <p>Learning status: <strong className="text-blue-600">
                {learningStats && learningStats.hasLearning ? `Learned from ${learningStats.gameCount} games` : 'First game'}
              </strong></p>
            </div>
          </div>
        )}

        <ConversationLog 
          conversation={conversation || []}
          variant="intelligent"
          title="LLM Intelligent Conversation Log (Role Perception + Learning Memory + Confidence)"
          isThinking={isProcessing}
          thinkingMessage={isProcessing ? "LLM deep intelligent analysis: Semantic understanding + Role recognition + Cumulative learning + Confidence calibration..." : ""}
          currentPlayer={currentPlayer || ""}
          showTimestamps={true}
          maxHeight={500}
          showRoleInfo={true}
          learningActive={learningStats ? learningStats.hasLearning : false}
        />

        {gameState === 'finished' && (
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              {gameData.gameResult === 'success' ? 'LLM Intelligent System Victory!' : 'LLM Intelligent Analysis Complete'}
            </h3>
            <p className="text-lg text-gray-600 mb-2">
              LLM intelligence selected secret number <strong className="text-green-600">{gameData.secretNumber}</strong>,
              through <strong className="text-blue-600">{gameData.totalGuesses}</strong> intelligent reasoning rounds
              {gameData.gameResult === 'success' ? ' successfully found the answer' : ' reached maximum attempts'}
            </p>
            <div className="mt-4 p-4 bg-white/70 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                LLM Intelligence Analysis Summary (Integrated Learning + Confidence)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-gray-600">
                <div>
                  <span className="text-gray-500">Intelligence Efficiency:</span>
                  <div className="font-semibold text-emerald-600">
                    {gameData.gameResult === 'success' ? 
                      Math.max(0.1, Math.min(1.0, Math.ceil(Math.log2(100)) / gameData.totalGuesses) * 100).toFixed(1) : 
                      '0'
                    }%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Intelligence Score:</span>
                  <div className="font-semibold text-blue-600">
                    {(gameData.intelligenceScore * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Average Confidence:</span>
                  <div className="font-semibold text-purple-600">
                    {hasValidConfidence(gameData.avgConfidence) ? 
                      `${(gameData.avgConfidence * 100).toFixed(1)}%` : 
                      'N/A'
                    }
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Learning Improvement:</span>
                  <div className="font-semibold text-purple-600">
                    {learningStats && learningStats.hasLearning ? `+${((learningStats.avgIntelligence - 0.7) * 100).toFixed(1)}%` : 'First learning'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">API Token Used:</span>
                  <div className="font-semibold text-indigo-600">#{currentTokenIndex + 1}/3</div>
                </div>
              </div>
              {gameData.finalPlayer && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="text-gray-500">Final role:</span>
                  <span className="font-semibold text-indigo-600 ml-2">
                    {gameData.finalPlayer === 'guesser' ? 'Number Guesser' : 
                     gameData.finalPlayer === 'hider' ? 'Number Hider' : 'System'}
                  </span>
                  <span className="text-gray-500 ml-4">Total rounds:</span>
                  <span className="font-semibold text-indigo-600 ml-2">{gameData.totalTurns}</span>
                  <span className="text-gray-500 ml-4">Learning games:</span>
                  <span className="font-semibold text-indigo-600 ml-2">{(learningStats?.gameCount || 0) + 1}</span>
                  {hasValidConfidence(gameData.avgConfidence) && (
                    <>
                      <span className="text-gray-500 ml-4">Final confidence:</span>
                      <span className="font-semibold text-green-600 ml-2">{(gameData.avgConfidence * 100).toFixed(1)}%</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMSelfPlaySystemV3;