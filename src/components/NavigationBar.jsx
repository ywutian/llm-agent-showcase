import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { versions } from '../constants/versions';

const NavigationBar = ({ 
  currentView, 
  onNavigate, 
  showVersionNav = true 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:text-gray-900"
              aria-label="Back to overview"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Overview</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Home className="w-4 h-4" />
              <span>/</span>
              <span className="text-gray-700 font-medium">
                {currentView === 'home' ? 'Overview' : 
                 versions.find(v => v.id === currentView)?.title.split(':')[0] || 'Unknown'}
              </span>
            </div>
          </div>
          
          {/* Center - Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              🧠 LLM Agent Evolution
            </div>
          </div>
          
          {/* Right side - Version navigation */}
          {showVersionNav && (
            <div className="flex items-center gap-2">
              {versions.map((version) => {
                const isActive = currentView === version.id;
                return (
                  <button
                    key={version.id}
                    onClick={() => onNavigate(version.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? `bg-gradient-to-r ${version.color} text-white shadow-md`
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                    aria-label={`Navigate to ${version.title}`}
                  >
                    <span className="text-sm">{version.icon}</span>
                    <span className="hidden lg:inline text-sm">
                      {version.title.split(':')[0]}
                    </span>
                    <span className="lg:hidden text-xs">
                      {version.id.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Mobile version navigation */}
        {showVersionNav && (
          <div className="md:hidden mt-4 flex flex-wrap gap-2">
            {versions.map((version) => {
              const isActive = currentView === version.id;
              return (
                <button
                  key={version.id}
                  onClick={() => onNavigate(version.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${version.color} text-white shadow-md`
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span>{version.icon}</span>
                  <span>{version.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

// Compact navigation bar for mobile or minimal layouts
export const CompactNavigationBar = ({ currentView, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          
          <div className="text-sm font-semibold text-gray-700">
            {versions.find(v => v.id === currentView)?.icon} {' '}
            {versions.find(v => v.id === currentView)?.title.split(':')[0] || 'LLM Agent'}
          </div>
          
          <div className="flex items-center gap-1">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => onNavigate(version.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                  currentView === version.id
                    ? `bg-gradient-to-r ${version.color} text-white`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={version.title}
              >
                {version.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Floating navigation buttons for overlay navigation
export const FloatingNavigation = ({ currentView, onNavigate }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Home button */}
      <button
        onClick={() => onNavigate('home')}
        className="w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Back to Overview"
      >
        <Home className="w-5 h-5 text-gray-600" />
      </button>
      
      {/* Version buttons */}
      {versions.map((version) => {
        const isActive = currentView === version.id;
        return (
          <button
            key={version.id}
            onClick={() => onNavigate(version.id)}
            className={`w-12 h-12 rounded-full shadow-lg border flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isActive
                ? `bg-gradient-to-r ${version.color} text-white`
                : 'bg-white hover:bg-gray-50 text-gray-600'
            }`}
            title={version.title}
          >
            <span className="text-lg">{version.icon}</span>
          </button>
        );
      })}
    </div>
  );
};

// Progress indicator showing current step in the evolution
export const EvolutionProgressIndicator = ({ currentView }) => {
  const currentIndex = versions.findIndex(v => v.id === currentView);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / versions.length) * 100 : 0;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {versions.map((version, index) => (
          <span 
            key={version.id}
            className={`${index <= currentIndex ? 'text-indigo-600 font-medium' : ''}`}
          >
            {version.icon}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;