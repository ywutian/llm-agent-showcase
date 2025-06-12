# Dual LLM Agent Architecture: Hider vs Guesser

## 🎭 The Two Distinct AI Personalities

### 🎯 Hider Agent: The Strategic Number Selector

The Hider agent represents the **adversarial intelligence** side of the system, responsible for selecting secret numbers that provide optimal challenge.

#### Core Capabilities
- **Player Profiling**: Analyzes guesser behavior patterns, strategy preferences, and cognitive biases
- **Strategic Number Selection**: Chooses numbers designed to exploit identified weaknesses
- **Psychological Warfare**: Employs tactics like anti-binary search numbers (primes like 7, 13, 23) and boundary traps
- **Adaptive Difficulty**: Scales challenge level based on opponent skill and game history

#### Learning Mechanisms
```javascript
// Hider's knowledge accumulation:
{
  playerWeaknesses: ["binary_search_deviation", "round_number_bias", "edge_avoidance"],
  trickyStrategies: ["antiBinarySearch", "psychologicalTraps", "boundaryTraps"],
  effectivenessTracking: "Records which strategies force more guesses",
  difficultyProgression: "Gradually increases challenge as opponent improves"
}
```

#### Decision Process
1. **Analyze opponent history**: Identify patterns in previous guessing behavior
2. **Select counter-strategy**: Choose number type that exploits detected weaknesses
3. **Calculate expected difficulty**: Predict how many guesses this number will require
4. **Learn from results**: Update strategy effectiveness based on actual game outcomes

---

### 🔍 Guesser Agent: The Adaptive Problem Solver

The Guesser agent embodies **adaptive intelligence**, employing multiple reasoning strategies to efficiently locate hidden numbers.

#### Core Capabilities
- **Multi-Strategy Reasoning**: Binary search, adaptive exploration, pattern recognition, creative approaches
- **Feedback Analysis**: Interprets hint quality and adjusts strategy accordingly
- **Meta-Cognitive Awareness**: Monitors its own performance and confidence levels
- **Opponent Modeling**: Develops understanding of Hider's tactics and preferences

#### Strategy Arsenal
```javascript
// Guesser's available approaches:
{
  standardStrategies: {
    binarySearch: "Optimal mathematical approach for unknown opponents",
    adaptiveExploration: "Adjusts based on feedback quality and patterns",
    elimination: "Systematic ruling out of possibilities"
  },
  advancedStrategies: {
    psychologicalCounter: "Anticipates Hider's psychological traps",
    patternBreaking: "Deliberately avoids predictable sequences",
    creativeChaos: "Introduces controlled randomness to confuse opponent"
  }
}
```

#### Learning Evolution
1. **Performance Tracking**: Monitors guess efficiency across different scenarios
2. **Strategy Effectiveness**: Identifies which approaches work best against specific Hider types
3. **Confidence Calibration**: Improves accuracy of uncertainty estimates
4. **Adaptation Speed**: Learns to switch strategies faster when current approach fails

---

## 🧠 Cognitive Architecture Differences

### Hider's Mindset: "How can I challenge this opponent?"
- **Analytical Focus**: Understanding opponent psychology and exploiting weaknesses
- **Strategic Patience**: Plans several moves ahead to create cumulative difficulty
- **Adaptive Cruelty**: Becomes more challenging as opponent skill increases
- **Success Metric**: Maximum number of guesses required while maintaining fairness

### Guesser's Mindset: "How can I solve this efficiently?"
- **Problem-Solving Orientation**: Finding optimal path to solution
- **Tactical Flexibility**: Rapid strategy switching based on real-time feedback
- **Efficiency Optimization**: Minimizing guesses through intelligent search
- **Success Metric**: Consistently finding numbers in fewer attempts

---

## 🔄 Interactive Learning Dynamics

### The Escalation Cycle
```
Round 1-3: Hider uses basic strategies → Guesser employs standard binary search
Round 4-6: Hider identifies guesser patterns → Guesser notices decreased efficiency  
Round 7-10: Hider employs psychological traps → Guesser develops counter-strategies
Round 10+: Advanced psychological warfare → Meta-strategic thinking emerges
```

### Mutual Adaptation
- **Hider Learning**: "This guesser always starts with 50, so I'll pick numbers that make that inefficient"
- **Guesser Learning**: "This hider likes prime numbers, so I should adjust my binary search to handle odd divisions better"

### Emergent Behaviors
Both agents develop sophisticated tactics not explicitly programmed:
- **Hider**: Begins selecting numbers based on predicted guesser psychology
- **Guesser**: Develops "opponent-specific" strategies for different Hider personality types

---

## 🎯 Distinct Prompt Engineering

### Hider Prompts: Strategic and Analytical
```
"Analyze this guesser's pattern: [history]. They show [weaknesses]. 
Select a number that exploits [specific_bias] while maintaining fairness.
Consider psychological impact and expected difficulty."
```

### Guesser Prompts: Tactical and Adaptive  
```
"Current range: [min-max]. Recent feedback: [hints]. Opponent pattern: [analysis].
Choose optimal guess considering: efficiency, feedback quality, opponent psychology.
Justify strategy selection and confidence level."
```

---

## 📊 Performance Differentiation

### Hider Success Metrics
- **Average guesses induced**: Higher numbers indicate more challenging selections
- **Strategy success rate**: Percentage of games requiring 8+ guesses
- **Player frustration generation**: Ability to create engaging difficulty

### Guesser Success Metrics  
- **Guess efficiency**: Average guesses per game across different opponents
- **Adaptation speed**: How quickly it adjusts to new Hider strategies
- **Confidence accuracy**: How well its uncertainty estimates match actual performance

This dual-agent architecture creates a dynamic system where both AIs continuously push each other toward greater sophistication, resulting in genuinely emergent strategic intelligence.