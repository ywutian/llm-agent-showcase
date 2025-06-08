import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Brain, User, Bot, Clock, MessageSquare } from 'lucide-react';
import { getTheme } from '../../constants';

const formatTimestamp = (timestamp) => {
  return timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }) : 'Unknown';
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
  
  const containerClass = useMemo(() => 
    `flex ${isUser ? 'justify-end' : 'justify-start'} opacity-0 animate-fade-in`
  , [isUser]);

  const messageClass = useMemo(() => 
    `max-w-2xl px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
      isUser
        ? `bg-gradient-to-r ${theme.user.gradient} text-white`
        : `bg-gradient-to-r ${theme.ai.gradient} text-white`
    }`
  , [isUser, theme.user.gradient, theme.ai.gradient]);

  return (
    <div className={containerClass} style={messageStyle}>
      <div className={messageClass}>
        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          <span className="font-semibold">
            {msg.metadata?.aiRole || (isUser ? '👤 User' : theme.ai.name)}
          </span>
          {showTimestamps && msg.timestamp && (
            <>
              <Clock className="w-3 h-3 opacity-75" />
              <span className="text-xs opacity-75">{formatTimestamp(msg.timestamp)}</span>
            </>
          )}
          <span className="text-xs opacity-75 ml-auto">#{index + 1}</span>
        </div>
        
        <div className="text-lg leading-relaxed break-words">{msg.message}</div>

        {msg.metadata && (
          <div className="mt-2 text-xs opacity-75 border-t border-white border-opacity-20 pt-2">
            {msg.metadata.guessCount && (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded mr-2">
                Guess #{msg.metadata.guessCount}
              </span>
            )}
            {msg.metadata.confidence && (
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                Confidence: {msg.metadata.confidence}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const ThinkingIndicator = React.memo(({ theme, customMessage, isGuesser = false }) => {
  const isRightSide = isGuesser || (customMessage && customMessage.includes('🔍 AI Guesser'));
  
  const containerClass = useMemo(() => 
    `flex ${isRightSide ? 'justify-end' : 'justify-start'}`
  , [isRightSide]);

  const indicatorClass = useMemo(() => 
    `max-w-2xl px-6 py-4 rounded-2xl shadow-lg bg-gradient-to-r ${
      isRightSide ? theme.user.gradient : theme.ai.gradient
    } text-white animate-pulse`
  , [isRightSide, theme.user.gradient, theme.ai.gradient]);

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
            {customMessage || `${theme.ai.name} is thinking...`}
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

const ConversationStats = React.memo(({ stats }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
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
  maxHeight = 384
}) => {
  const chatContainerRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const prevConversationLengthRef = useRef(0);
  const scrollTimeoutRef = useRef(null);

  const theme = useMemo(() => getTheme(variant), [variant]);
  
  const stats = useMemo(() => {
    if (conversation.length === 0) {
      return { userMessages: 0, aiMessages: 0, total: 0 };
    }
    
    const userMessages = conversation.filter(msg => msg.sender === 'user').length;
    const aiMessages = conversation.filter(msg => msg.sender === 'ai').length;
    
    return { userMessages, aiMessages, total: conversation.length };
  }, [conversation]);

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

  const messageList = useMemo(() => {
    return conversation.map((msg, index) => {
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
    });
  }, [conversation, theme, showTimestamps, hasNewMessages, newMessagesStartIndex]);

  const containerClass = useMemo(() => 
    `bg-gradient-to-r ${theme.primary.bg} rounded-2xl p-6 shadow-inner mb-6`
  , [theme.primary.bg]);

  const chatContainerClass = useMemo(() => 
    "space-y-6 overflow-y-auto mb-6 scroll-smooth"
  , []);

  const chatContainerStyle = useMemo(() => 
    ({ maxHeight: `${maxHeight}px` })
  , [maxHeight]);

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Brain className={`w-7 h-7 ${theme.primary.icon}`} />
          {title}
        </h3>
        
        {conversation.length > 0 && (
          <ConversationStats stats={stats} />
        )}
      </div>

      {conversation.length > 3 && !isAutoScroll && (
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
        {conversation.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messageList}
            {isThinking && (
              <ThinkingIndicator 
                theme={theme} 
                customMessage={thinkingMessage}
                isGuesser={currentPlayer === 'guesser'}
              />
            )}
          </>
        )}
      </div>

      <ConversationFooter conversation={conversation} stats={stats} />

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

export default React.memo(ConversationLog, (prevProps, nextProps) => {
  return (
    prevProps.conversation.length === nextProps.conversation.length &&
    prevProps.variant === nextProps.variant &&
    prevProps.title === nextProps.title &&
    prevProps.isThinking === nextProps.isThinking &&
    prevProps.thinkingMessage === nextProps.thinkingMessage &&
    prevProps.currentPlayer === nextProps.currentPlayer &&
    prevProps.showTimestamps === nextProps.showTimestamps &&
    prevProps.maxHeight === nextProps.maxHeight &&
    (prevProps.conversation.length === 0 || 
     (prevProps.conversation[prevProps.conversation.length - 1] === 
      nextProps.conversation[nextProps.conversation.length - 1]))
  );
});