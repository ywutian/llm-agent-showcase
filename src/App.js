import React from "react";
import LLMAgentShowcase from "./components/LLMAgentShowcase";
import "./App.css";

/**
 * Main App component
 * AI Agent Communication System - Interview Project
 * Demonstrates AI agents communicating to play number guessing game
 * @returns {JSX.Element} Application root component
 */
function App() {
  // Set up global error handling
  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
    };

    const handleError = (event) => {
      console.error("Global error:", event.error);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  React.useEffect(() => {
    document.title = "AI Agent Communication System - Interview Project";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Interview Project: AI agents communicate to play number guessing game. Hider agent selects number 1-100, Guesser agent uses binary search. Demonstrates AI-to-AI communication."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Interview Project: AI agents communicate to play number guessing game. Hider agent selects number 1-100, Guesser agent uses binary search. Demonstrates AI-to-AI communication.";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "AI agents, interview project, LLM communication, number guessing game, artificial intelligence, agent dialogue, autonomous AI, prompt engineering"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content =
        "AI agents, interview project, LLM communication, number guessing game, artificial intelligence, agent dialogue, autonomous AI, prompt engineering";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      meta.content = "AI Agent Communication System - Interview Project";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescription) {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      meta.content =
        "AI agents communicate autonomously to solve number guessing game. Demonstrates advanced AI-to-AI communication patterns.";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="App">
      {/* Interview Project Header - Hidden but SEO-friendly */}
      <div style={{ display: "none" }}>
        <h1>AI Agent Communication System - Interview Project</h1>
        <h2>AI Agents Playing Number Guessing Game</h2>
        <p>
          Interview task completion: Created AI agents that communicate with
          each other. Hider agent selects number 1-100, Guesser agent uses
          binary search strategy. Features autonomous AI-to-AI dialogue and
          real-time communication.
        </p>
        <meta name="author" content="Yitian Yu" />
        <meta name="created" content="June 2024" />
        <meta
          name="purpose"
          content="Interview Project - AI Agent Communication"
        />
      </div>

      {/* Main Application */}
      <LLMAgentShowcase />

      {/* Footer with interview project info */}
      <div style={{ display: "none" }}>
        <footer>
          <p>Interview Project by Yitian Yu - AI Agent Communication System</p>
          <p>
            Demonstrates AI agents communicating to solve number guessing game
          </p>
          <p>
            Features: Hider Agent, Guesser Agent, Autonomous Communication,
            Binary Search Algorithm
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
