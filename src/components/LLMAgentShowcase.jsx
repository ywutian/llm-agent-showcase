import React, { useState, lazy, Suspense, useCallback } from 'react';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import LoadingSpinner from './LoadingSpinner';

const UnifiedLLMAgentV1 = lazy(() => import('./versions/UnifiedLLMAgentV1'));
const UnifiedLLMAgentV2 = lazy(() => import('./versions/UnifiedLLMAgentV2'));
const LLMSelfPlaySystemV3 = lazy(() => import('./versions/LLMSelfPlaySystemV3'));

const LLMAgentShowcase = () => {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentPageTitle = useCallback(() => {
    switch (currentView) {
      case 'v1':
        return 'Version 1: Natural Language Recognition | LLM Agent Evolution';
      case 'v2':
        return 'Version 2: Button-Based Interaction | LLM Agent Evolution';
      case 'v3':
        return 'Version 3: Self-Play System | LLM Agent Evolution';
      default:
        return 'LLM Agent Systems Evolution | From Natural Language to Autonomous Self-Play';
    }
  }, [currentView]);

  const renderContent = () => {
    if (currentView === 'home') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    const versionComponents = {
      v1: UnifiedLLMAgentV1,
      v2: UnifiedLLMAgentV2,
      v3: LLMSelfPlaySystemV3
    };

    const VersionComponent = versionComponents[currentView];
    
    if (!VersionComponent) {
      console.warn('Unknown view:', currentView);
      return <HomePage onNavigate={handleNavigate} />;
    }

    return (
      <Suspense 
        fallback={
          <LoadingSpinner 
            message={`Loading ${currentView.toUpperCase()} System...`}
            type="processing"
            size="lg"
          />
        }
      >
        <VersionComponent />
      </Suspense>
    );
  };

  React.useEffect(() => {
    document.title = getCurrentPageTitle();
  }, [getCurrentPageTitle]);

  React.useEffect(() => {
    const handlePopState = (event) => {
      const view = event.state?.view || 'home';
      setCurrentView(view);
    };

    if (window.history.state === null) {
      window.history.replaceState({ view: currentView }, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  React.useEffect(() => {
    if (currentView !== 'home') {
      const url = new URL(window.location);
      url.searchParams.set('view', currentView);
      window.history.pushState({ view: currentView }, '', url.toString());
    } else {
      const url = new URL(window.location);
      url.searchParams.delete('view');
      window.history.pushState({ view: 'home' }, '', url.toString());
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'home' && (
        <NavigationBar 
          currentView={currentView} 
          onNavigate={handleNavigate}
          showVersionNav={true}
        />
      )}

      <main role="main" aria-label="Main content">
        {renderContent()}
      </main>

      {currentView === 'home' && (
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">🧠 LLM Agent Systems Evolution</h3>
              <p className="text-gray-300">
                Exploring the frontier of AI agent development and human-AI interaction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">🎯 Version 1</h4>
                <p className="text-sm text-gray-400">Natural Language Recognition</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎮 Version 2</h4>
                <p className="text-sm text-gray-400">Button-Based Interaction</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🧠 Version 3</h4>
                <p className="text-sm text-gray-400">Autonomous Self-Play</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">
                © 2025 LLM Agent Evolution Project. Built with React & Advanced Prompt Engineering.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Demonstrating the evolution from natural language processing to autonomous AI gameplay
              </p>
            </div>
          </div>
        </footer>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Current view: {currentView === 'home' ? 'Home page' : `Version ${currentView.replace('v', '')} page`}
      </div>

      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
    </div>
  );
};

class LLMAgentShowcaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LLM Agent Showcase Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              The LLM Agent Showcase encountered an unexpected error. 
              Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LLMAgentShowcaseWithErrorBoundary = () => (
  <LLMAgentShowcaseErrorBoundary>
    <LLMAgentShowcase />
  </LLMAgentShowcaseErrorBoundary>
);

export default LLMAgentShowcaseWithErrorBoundary;