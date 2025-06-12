import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Brain, User, Bot, Clock, MessageSquare } from 'lucide-react';

// Simple theme function
const getTheme = (variant) => {
  const themes = {
    default: {
      primary: { bg: 'from-purple-100 to-pink-100', icon: 'text-purple-600' },
      user: { gradient: 'from-green-500 to-emerald-500' },
      ai: { gradient: 'from-purple-500 to-pink-500' }
    }
  };
  return themes[variant] || themes.default;
};

const formatTimestamp = (timestamp) => {
  return timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }) : 'Unknown';
};

// Simple markdown parser for basic formatting
const parseMarkdown = (text) => {
  if (!text) return text;
  
  // Replace **text** with <strong>text</strong>
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *text* with <em>text</em>
  parsed = parsed.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  
  return parsed;
};

// Component to render text with basic markdown
const MarkdownText = ({ children, className }) => {
  const parsedText = parseMarkdown(children);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: parsedText }}
    />
  );
};

const MessageItem = React.memo(({ 
  msg, 
  index, 
  theme, 
  showTimestamps, 
  isNew = false 
}) => {
  const messageStyle = useMemo(() => {
    if (!isNew && index < 10) {
      return {
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'forwards'
      };
    }
    return { animationFillMode: 'forwards' };
  }, [isNew, index]);

  const isUser = msg.sender === 'user';
  
  const isGuesser = msg.currentPlayer === 'guesser' || 
                   msg.metadata?.action === 'make_guess' ||
                   msg.metadata?.role === 'guesser' ||
                   msg.metadata?.phase === 'guessing' ||
                   (msg.message && (
                     msg.message.includes('Is it') ||
                     msg.message.includes('My guess is') ||
                     msg.message.includes('I guess') ||
                     /\d+\?/.test(msg.message)
                   ));
  
  const showOnRight = isUser || isGuesser;
  
  const containerClass = useMemo(() => 
    `flex ${showOnRight ? 'justify-end' : 'justify-start'} opacity-0 animate-fade-in`
  , [showOnRight]);

  const messageClass = useMemo(() => {
    let gradientClass;
    if (isUser) {
      gradientClass = theme.user.gradient;
    } else if (isGuesser) {
      gradientClass = 'from-blue-500 to-cyan-500';
    } else {
      gradientClass = theme.ai.gradient;
    }
    
    return `max-w-2xl px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r ${gradientClass} text-white`;
  }, [isUser, isGuesser, theme.user.gradient, theme.ai.gradient]);

  const getRoleInfo = useMemo(() => {
    if (isUser) {
      return { icon: <User className="w-4 h-4" />, name: '👤 User', color: 'text-white' };
    } else if (isGuesser) {
      return { icon: <div className="w-4 h-4 text-center">🔍</div>, name: '🔍 AI Guesser', color: 'text-white' };
    } else {
      return { icon: <div className="w-4 h-4 text-center">🎯</div>, name: '🎯 AI Hider', color: 'text-white' };
    }
  }, [isUser, isGuesser]);

  return (
    <div className={containerClass} style={messageStyle}>
      <div className={messageClass}>
        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
          {getRoleInfo.icon}
          <span className="font-semibold">
            {getRoleInfo.name}
          </span>
          {showTimestamps && msg.timestamp && (
            <>
              <Clock className="w-3 h-3 opacity-75" />
              <span className="text-xs opacity-75">{formatTimestamp(msg.timestamp)}</span>
            </>
          )}
          <span className="text-xs opacity-75 ml-auto">#{index + 1}</span>
        </div>
        
        <MarkdownText className="text-lg leading-relaxed break-words">
          {msg.message}
        </MarkdownText>

        {msg.metadata && (
          <div className="mt-2 text-xs opacity-75 border-t border-white border-opacity-20 pt-2">
            {msg.metadata.guessCount && (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded mr-2">
                Guess #{msg.metadata.guessCount}
              </span>
            )}
           {msg.metadata.confidence && (
  <span className="bg-white bg-opacity-20 px-2 py-1 rounded mr-2">
    Confidence: {typeof msg.metadata.confidence === 'number' ? 
      (msg.metadata.confidence > 1 ? 
        msg.metadata.confidence.toFixed(1) : 
        (msg.metadata.confidence * 100).toFixed(1)
      ) : msg.metadata.confidence}%
  </span>
)}
            {msg.metadata.action && (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded mr-2">
                Action: {msg.metadata.action}
              </span>
            )}
            {msg.metadata.phase && (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                Phase: {msg.metadata.phase}
              </span>
            )}
          </div>
        )}

        {(msg.intelligence || msg.strategy || msg.learningApplied) && (
          <div className="mt-2 text-xs opacity-75 border-t border-white border-opacity-20 pt-2">
            {msg.intelligence && (
              <div className="mb-1">💡 {msg.intelligence}</div>
            )}
            {msg.strategy && (
              <div className="mb-1">🎯 Strategy: {msg.strategy}</div>
            )}
            {msg.learningApplied && (
              <div>📚 Learning Applied</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const ThinkingIndicator = React.memo(({ theme, customMessage, isGuesser = false, currentPlayer = null }) => {
  const shouldShowOnRight = isGuesser || 
                           currentPlayer === 'guesser' || 
                           (customMessage && (
                             customMessage.includes('🔍') || 
                             customMessage.includes('Guesser')
                           ));
  
  const containerClass = useMemo(() => 
    `flex ${shouldShowOnRight ? 'justify-end' : 'justify-start'}`
  , [shouldShowOnRight]);

  const indicatorClass = useMemo(() => {
    const gradientClass = shouldShowOnRight ? 'from-blue-500 to-cyan-500' : theme.ai.gradient;
    return `max-w-2xl px-6 py-4 rounded-2xl shadow-lg bg-gradient-to-r ${gradientClass} text-white animate-pulse`;
  }, [shouldShowOnRight, theme.ai.gradient]);

  const getThinkingMessage = useMemo(() => {
    if (customMessage) return customMessage;
    
    if (shouldShowOnRight) {
      return '🔍 AI Guesser is thinking...';
    } else {
      return '🎯 AI Hider is thinking...';
    }
  }, [customMessage, shouldShowOnRight]);

  return (
    <div className={containerClass}>
      <div className={indicatorClass}>
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm font-medium">
            {getThinkingMessage}
          </span>
        </div>
      </div>
    </div>
  );
});

const EmptyState = React.memo(() => (
  <div className="text-center py-8 text-gray-500">
    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
    <p className="text-lg font-medium">No messages yet</p>
    <p className="text-sm">Start the conversation!</p>
  </div>
));

const ConversationStats = React.memo(({ stats, showRoleStats = false }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
    <div className="flex items-center gap-1">
      <MessageSquare className="w-4 h-4" />
      <span>{stats.total}</span>
    </div>
    <div className="flex items-center gap-1">
      <User className="w-4 h-4 text-green-600" />
      <span>{stats.userMessages}</span>
    </div>
    <div className="flex items-center gap-1">
      <Bot className="w-4 h-4 text-purple-600" />
      <span>{stats.aiMessages}</span>
    </div>
    {showRoleStats && (
      <>
        <div className="flex items-center gap-1">
          <span className="text-blue-600">🔍</span>
          <span>{stats.guesserMessages || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-600">🎯</span>
          <span>{stats.hiderMessages || 0}</span>
        </div>
      </>
    )}
  </div>
));

const ConversationFooter = React.memo(({ conversation, stats }) => {
  if (conversation.length === 0) return null;
  
  return (
    <div className="text-xs text-gray-500 text-center border-t pt-2 space-y-1">
      <div>
        Started: {formatTimestamp(conversation[0]?.timestamp)} • 
        Latest: {formatTimestamp(conversation[conversation.length - 1]?.timestamp)}
      </div>
      <div>
        {stats.total} total messages ({stats.userMessages} from you, {stats.aiMessages} from AI)
        {stats.guesserMessages > 0 && (
          <span> • {stats.guesserMessages} guesses, {stats.hiderMessages} hints</span>
        )}
      </div>
    </div>
  );
});

const ConversationLog = ({ 
  conversation = [], 
  variant = 'default',
  title = 'AI Conversation',
  isThinking = false,
  thinkingMessage = null,
  currentPlayer = null,
  showTimestamps = true,
  maxHeight = 384,
  showRoleInfo = false,
  learningActive = false
}) => {
  const chatContainerRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const prevConversationLengthRef = useRef(0);
  const scrollTimeoutRef = useRef(null);

  const theme = useMemo(() => getTheme(variant), [variant]);
  


  const hasNewMessages = conversation.length > prevConversationLengthRef.current;
  const newMessagesStartIndex = prevConversationLengthRef.current;

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (!chatContainerRef.current) return;
      
      const container = chatContainerRef.current;
      const isNearBottom = Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) < 50;
      
      setIsAutoScroll(isNearBottom);
    }, 100);
  }, []);

  const scrollToLatest = useCallback(() => {
    setIsAutoScroll(true);
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (hasNewMessages || isThinking) {
      prevConversationLengthRef.current = conversation.length;
      
      if (isAutoScroll) {
        const timeoutId = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [conversation.length, isThinking, isAutoScroll, scrollToBottom, hasNewMessages]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);



  const containerClass = useMemo(() => 
    `bg-gradient-to-r ${theme.primary.bg} rounded-2xl p-6 shadow-inner mb-6`
  , [theme.primary.bg]);

  const chatContainerClass = useMemo(() => 
    "space-y-6 overflow-y-auto mb-6 scroll-smooth"
  , []);

  const chatContainerStyle = useMemo(() => 
    ({ maxHeight: `${maxHeight}px` })
  , [maxHeight]);

  // Sample conversation data for demo
  const sampleConversation = [
    {
      sender: 'ai',
      message: 'You\'re doing brilliantly! You\'re incredibly close to the target. Stay sharp, and move **LOWER**!',
      timestamp: Date.now() - 30000,
      currentPlayer: 'hider'
    },
    {
      sender: 'ai',
      message: 'Is it **42**? I think this might be the *perfect* answer!',
      timestamp: Date.now() - 15000,
      currentPlayer: 'guesser'
    },
    {
      sender: 'user',
      message: 'This formatting test shows **bold** and *italic* text working properly.',
      timestamp: Date.now() - 5000
    }
  ];

  const displayConversation = conversation.length > 0 ? conversation : sampleConversation;

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Brain className={`w-7 h-7 ${theme.primary.icon}`} />
          {title}
          {learningActive && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
              📚 Learning Active
            </span>
          )}
        </h3>
        
        {displayConversation.length > 0 && (
          <ConversationStats 
            stats={{
              total: displayConversation.length,
              userMessages: displayConversation.filter(msg => msg.sender === 'user').length,
              aiMessages: displayConversation.filter(msg => msg.sender === 'ai').length,
              guesserMessages: displayConversation.filter(msg => msg.currentPlayer === 'guesser').length,
              hiderMessages: displayConversation.filter(msg => msg.currentPlayer === 'hider').length
            }} 
            showRoleStats={showRoleInfo} 
          />
        )}
      </div>

      {showRoleInfo && displayConversation.length > 0 && (
        <div className="mb-4 p-3 bg-white/50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">🎯</span>
              <span className="text-purple-700 font-medium">AI Hider (Left)</span>
              <span className="text-gray-500">Chooses number & gives hints</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🔍</span>
              <span className="text-blue-700 font-medium">AI Guesser (Right)</span>
              <span className="text-gray-500">Makes guesses</span>
            </div>
          </div>
        </div>
      )}

      {displayConversation.length > 3 && !isAutoScroll && (
        <div className="mb-4 text-center">
          <button
            onClick={scrollToLatest}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
          >
            ↓ Scroll to latest
          </button>
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className={chatContainerClass}
        style={chatContainerStyle}
        onScroll={handleScroll}
      >
        {displayConversation.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {displayConversation.map((msg, index) => {
              const key = `msg-${index}-${msg.timestamp || index}`;
              const isNew = hasNewMessages && index >= newMessagesStartIndex;
              
              return (
                <MessageItem
                  key={key}
                  msg={msg}
                  index={index}
                  theme={theme}
                  showTimestamps={showTimestamps}
                  isNew={isNew}
                />
              );
            })}
            {isThinking && (
              <ThinkingIndicator 
                theme={theme} 
                customMessage={thinkingMessage}
                isGuesser={currentPlayer === 'guesser'}
                currentPlayer={currentPlayer}
              />
            )}
          </>
        )}
      </div>

      <ConversationFooter conversation={displayConversation} stats={{
        total: displayConversation.length,
        userMessages: displayConversation.filter(msg => msg.sender === 'user').length,
        aiMessages: displayConversation.filter(msg => msg.sender === 'ai').length,
        guesserMessages: displayConversation.filter(msg => msg.currentPlayer === 'guesser').length,
        hiderMessages: displayConversation.filter(msg => msg.currentPlayer === 'hider').length
      }} />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { 
          animation: fade-in 0.2s ease-out; 
        }
      `}</style>
    </div>
  );
};

export default React.memo(ConversationLog);