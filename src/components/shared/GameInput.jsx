// components/shared/GameInput.jsx - 增强Send按钮颜色版本
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader, Keyboard } from 'lucide-react';
import { getTheme, getGameButtons } from '../../constants';


export const TextInput = React.memo(({ 
  onSubmit, 
  disabled = false, 
  placeholder = "Enter your message...",
  buttonText = "Send",
  variant = 'default',
  multiline = false,
  maxLength = 200
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);
  const theme = getTheme(variant);

  // 自动聚焦
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !disabled && !isComposing) {
      onSubmit(trimmedValue);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [inputValue, disabled, isComposing, onSubmit]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isComposing) {
      if (multiline && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      } else if (!multiline) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [isComposing, multiline, handleSubmit]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputValue(value);
    }
  }, [maxLength]);

  const canSubmit = inputValue.trim() && !disabled && !isComposing;
  const InputComponent = multiline ? 'textarea' : 'input';

  // 增强的按钮样式 - 使用更鲜艳的蓝色渐变
  const getButtonStyle = () => {
    if (!canSubmit) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900';
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <InputComponent
            ref={inputRef}
            type={multiline ? undefined : "text"}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={multiline ? 3 : undefined}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
              disabled 
                ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
                : `${theme.focus} border-gray-300 hover:border-gray-400`
            } ${multiline ? 'min-h-[80px]' : ''}`}
          />
          
          {/* Character count */}
          {maxLength && inputValue.length > 0 && (
            <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded pointer-events-none ${
              inputValue.length > maxLength * 0.9 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {inputValue.length}/{maxLength}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`px-6 py-3 ${getButtonStyle()} text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${
            canSubmit ? 'hover:shadow-xl shadow-blue-500/25' : 'shadow-gray-400/25'
          }`}
        >
          {disabled ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span className="font-bold">{buttonText}</span>
        </button>
      </div>
      
      {/* Help text */}
      {inputValue.length === 0 && !disabled && (
        <div className="text-xs text-gray-500 text-center">
          {multiline 
            ? 'Type your message, then press Enter to send'
            : 'Type your message and press Enter or click Send'
          }
        </div>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

/**
 * 按钮输入组件
 */
export const ButtonInput = React.memo(({ 
  onButtonClick, 
  disabled = false, 
  variant = 'default',
  customButtons = null,
  showShortcuts = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  
  const buttons = customButtons || getGameButtons();

  // 稳定的回调引用
  const stableOnButtonClick = useCallback((value) => {
    if (disabled || isAnimating) return;
    
    setIsAnimating(true);
    
    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    Promise.resolve(onButtonClick(value))
      .finally(() => {
        setTimeout(() => setIsAnimating(false), 200);
      });
  }, [disabled, isAnimating, onButtonClick]);

  // 修复键盘事件监听器
  useEffect(() => {
    if (disabled) return;

    const controller = new AbortController();
    
    const handleKeyDown = (e) => {
      // 避免在输入框中触发
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      
      const key = e.key.toLowerCase();
      const button = buttons.find(btn => btn.shortcut && btn.shortcut.toLowerCase() === key);
      
      if (button) {
        e.preventDefault();
        setPressedKey(key);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (pressedKey === key) {
        const button = buttons.find(btn => btn.shortcut && btn.shortcut.toLowerCase() === key);
        if (button && !disabled && !isAnimating) {
          stableOnButtonClick(button.value);
        }
        setPressedKey(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown, { signal: controller.signal });
    document.addEventListener('keyup', handleKeyUp, { signal: controller.signal });
    
    return () => controller.abort();
  }, [buttons, disabled, pressedKey, isAnimating, stableOnButtonClick]); // 完整依赖

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-center space-y-2 mb-6">
        <div className="text-lg font-semibold text-gray-700">
          Give feedback on AI's guess
        </div>
        <div className="text-sm text-gray-600">
          Click the appropriate button based on your secret number
        </div>
      </div>

      {/* Main buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        {buttons.map((button) => (
          <div key={button.value} className="relative">
            <button
              onClick={() => stableOnButtonClick(button.value)}
              disabled={disabled || isAnimating}
              className={`px-8 py-4 bg-gradient-to-r ${button.color} text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                !disabled ? 'hover:shadow-xl' : ''
              }`}
              title={`${button.text.replace(/[📈📉✅] /, '')} - Press ${button.shortcut}`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  {button.text}
                  {showShortcuts && button.shortcut && !disabled && (
                    <kbd className="text-xs opacity-75 bg-white bg-opacity-20 px-2 py-1 rounded font-mono">
                      {button.shortcut}
                    </kbd>
                  )}
                </div>
                <div className="text-xs opacity-90 font-normal">
                  {button.value}
                </div>
              </div>
            </button>

            {/* Keyboard press indicator */}
            {pressedKey === button.shortcut?.toLowerCase() && (
              <div className="absolute inset-0 bg-white bg-opacity-30 rounded-xl animate-ping pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Keyboard shortcuts info */}
      {showShortcuts && !disabled && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Keyboard className="w-4 h-4" />
            <span>Keyboard shortcuts:</span>
            {buttons.map((btn, index) => (
              <span key={btn.value}>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                  {btn.shortcut}
                </kbd>
                {index < buttons.length - 1 && <span className="mx-1 text-gray-400">•</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status indicator */}
      {isAnimating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Loader className="w-4 h-4 animate-spin" />
            Processing your feedback...
          </div>
        </div>
      )}

      {/* Button explanation */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {buttons.map((button) => (
            <div key={button.value} className="flex items-start gap-2">
              <div className="text-lg">{button.text.split(' ')[0]}</div>
              <div>
                <div className="font-medium">{button.value}</div>
                <div className="text-xs text-gray-500">
                  {button.value === 'Higher' && 'Secret number is greater'}
                  {button.value === 'Lower' && 'Secret number is smaller'}  
                  {button.value === 'Correct' && 'Guess is exactly right'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ButtonInput.displayName = 'ButtonInput';

/**
 * 组合输入组件
 */
export const CombinedInput = React.memo(({
  mode = 'auto',
  onTextSubmit,
  onButtonClick,
  disabled = false,
  variant = 'default',
  ...props
}) => {
  const [currentMode, setCurrentMode] = useState(mode === 'auto' ? 'text' : mode);

  const toggleMode = useCallback(() => {
    if (mode === 'auto') {
      setCurrentMode(prev => prev === 'text' ? 'buttons' : 'text');
    }
  }, [mode]);

  if (currentMode === 'buttons') {
    return (
      <div>
        {mode === 'auto' && (
          <div className="mb-4 text-center">
            <button
              onClick={toggleMode}
              disabled={disabled}
              className="text-sm text-blue-500 hover:text-blue-700 underline disabled:text-gray-400 disabled:no-underline"
            >
              Switch to text input
            </button>
          </div>
        )}
        <ButtonInput
          onButtonClick={onButtonClick}
          disabled={disabled}
          variant={variant}
          {...props}
        />
      </div>
    );
  }

  return (
    <div>
      {mode === 'auto' && (
        <div className="mb-4 text-center">
          <button
            onClick={toggleMode}
            disabled={disabled}
            className="text-sm text-blue-500 hover:text-blue-700 underline disabled:text-gray-400 disabled:no-underline"
          >
            Switch to button input
          </button>
        </div>
      )}
      <TextInput
        onSubmit={onTextSubmit}
        disabled={disabled}
        variant={variant}
        {...props}
      />
    </div>
  );
});

CombinedInput.displayName = 'CombinedInput';