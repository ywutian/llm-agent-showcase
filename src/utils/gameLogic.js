import {
  GAME_CONFIG,
  createGameLogEntry,
  createSetupLogEntry,
  calculateGameEfficiency,
} from "./gameConfig";

// Generate secure random secret number
export const generateSecretNumber = (
  min = GAME_CONFIG.RULES.MIN_NUMBER,
  max = GAME_CONFIG.RULES.MAX_NUMBER
) => {
  try {
    if (typeof min !== "number" || typeof max !== "number") {
      console.warn("generateSecretNumber: Invalid parameters, using defaults");
      min = 1;
      max = 100;
    }

    if (min >= max) {
      console.warn("generateSecretNumber: min >= max, using defaults");
      min = 1;
      max = 100;
    }

    const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (secretNumber < min || secretNumber > max) {
      console.error(
        "generateSecretNumber: Generated invalid number, using fallback"
      );
      return Math.floor(Math.random() * 100) + 1;
    }

    console.log(
      `✅ Generated secret number: ${secretNumber} (range: ${min}-${max})`
    );
    return secretNumber;
  } catch (error) {
    console.error(
      "generateSecretNumber: Error occurred, using fallback:",
      error
    );
    return Math.floor(Math.random() * 100) + 1;
  }
};

// Calculate next binary search guess
export const calculateBinarySearchGuess = (min, max) => {
  try {
    if (typeof min !== "number" || typeof max !== "number") {
      console.warn("calculateBinarySearchGuess: Invalid parameters");
      return 50;
    }

    if (min > max) {
      console.warn("calculateBinarySearchGuess: min > max, swapping");
      [min, max] = [max, min];
    }

    const guess = Math.floor((min + max) / 2);
    console.log(`🔍 Binary search guess: ${guess} (range: [${min}, ${max}])`);
    return guess;
  } catch (error) {
    console.error("calculateBinarySearchGuess: Error occurred:", error);
    return 50;
  }
};

// Enhanced number parsing with decimal support
export const parseNumber = (input) => {
  try {
    if (typeof input === "number") {
      return Math.floor(input);
    }

    if (typeof input === "string") {
      const trimmed = input.trim();

      if (!trimmed || !/^-?\d*\.?\d+$/.test(trimmed)) {
        return null;
      }

      const num = parseFloat(trimmed);

      if (isNaN(num)) {
        return null;
      }

      return Math.floor(num);
    }

    return null;
  } catch (error) {
    console.error("parseNumber: Error parsing input:", input, error);
    return null;
  }
};

// Compare guess with secret number
export const compareGuess = (guess, secret) => {
  try {
    const numGuess = parseNumber(guess);
    const numSecret = parseNumber(secret);

    if (numGuess === null || numSecret === null) {
      console.error("compareGuess: Invalid numbers provided", {
        guess,
        secret,
        parsedGuess: numGuess,
        parsedSecret: numSecret,
      });
      return "error";
    }

    console.log(`🎯 Comparing guess ${numGuess} with secret ${numSecret}`);

    if (numGuess === numSecret) {
      console.log("✅ Correct guess!");
      return GAME_CONFIG.FEEDBACK.CORRECT;
    } else if (numGuess < numSecret) {
      console.log("📈 Guess too low, need higher");
      return GAME_CONFIG.FEEDBACK.HIGHER;
    } else {
      console.log("📉 Guess too high, need lower");
      return GAME_CONFIG.FEEDBACK.LOWER;
    }
  } catch (error) {
    console.error("compareGuess: Error occurred:", error);
    return "error";
  }
};

// Update guessing range based on feedback
export const updateGuessingRange = (currentRange, lastGuess, feedback) => {
  try {
    // Input validation
    if (
      !currentRange ||
      typeof currentRange.min !== "number" ||
      typeof currentRange.max !== "number"
    ) {
      console.error(
        "updateGuessingRange: Invalid currentRange provided:",
        currentRange
      );
      return {
        min: 1,
        max: 100,
        isError: true,
        errorMessage: "Invalid current range provided",
      };
    }

    const parsedLastGuess = parseNumber(lastGuess);
    if (parsedLastGuess === null) {
      console.error(
        "updateGuessingRange: Invalid lastGuess provided:",
        lastGuess
      );
      return {
        ...currentRange,
        isError: true,
        errorMessage: "Invalid last guess provided",
      };
    }

    const { min, max } = currentRange;
    let newRange = { min, max };

    const normalizedFeedback = normalizeFeedback(feedback);

    console.log(
      `🔄 Updating range from [${min}, ${max}] based on guess ${parsedLastGuess} and feedback "${feedback}" (normalized: "${normalizedFeedback}")`
    );

    switch (normalizedFeedback) {
      case "higher":
        newRange.min = parsedLastGuess + 1;
        break;
      case "lower":
        newRange.max = parsedLastGuess - 1;
        break;
      case "correct":
        newRange = { min: parsedLastGuess, max: parsedLastGuess };
        break;
      default:
        console.warn(
          "updateGuessingRange: Unknown feedback, keeping current range"
        );
        return {
          ...currentRange,
          isError: false,
          message: `Unknown feedback: ${feedback}`,
        };
    }

    console.log(`🔍 Proposed new range: [${newRange.min}, ${newRange.max}]`);

    if (newRange.min > newRange.max) {
      console.error(
        `❌ updateGuessingRange: Invalid range created [${newRange.min}, ${newRange.max}]`
      );
      console.error(`❌ This indicates a logical error in feedback:`);
      console.error(`   - Last guess: ${parsedLastGuess}`);
      console.error(
        `   - Feedback: ${feedback} (normalized: ${normalizedFeedback})`
      );
      console.error(`   - Previous range: [${min}, ${max}]`);

      return {
        min: newRange.min,
        max: newRange.max,
        isError: true,
        errorMessage: `Logical inconsistency detected: feedback "${feedback}" for guess ${parsedLastGuess} creates invalid range [${newRange.min}, ${newRange.max}]. This suggests inconsistent feedback or a game logic error.`,
        debugInfo: {
          lastGuess: parsedLastGuess,
          feedback: feedback,
          normalizedFeedback: normalizedFeedback,
          previousRange: { min, max },
          attemptedRange: newRange,
          suggestion:
            "Please restart the game or check your feedback consistency.",
        },
      };
    }

    // Boundary check and auto-correction
    if (newRange.min < 1 || newRange.max > 100) {
      console.warn(
        `⚠️  Range extends outside game bounds: [${newRange.min}, ${newRange.max}]`
      );
      const originalRange = { ...newRange };
      newRange.min = Math.max(1, newRange.min);
      newRange.max = Math.min(100, newRange.max);
      console.log(
        `🔧 Auto-corrected range from [${originalRange.min}, ${originalRange.max}] to [${newRange.min}, ${newRange.max}]`
      );
    }

    // Single number case
    if (newRange.min === newRange.max) {
      console.log(`🎯 Range narrowed to single number: ${newRange.min}`);
      return {
        ...newRange,
        isFinalGuess: true,
        message: `Range narrowed to single possibility: ${newRange.min}`,
        isError: false,
      };
    }

    // Final validation
    if (!isValidGameRange(newRange.min, newRange.max)) {
      console.error(
        `❌ Final range validation failed: [${newRange.min}, ${newRange.max}]`
      );
      return {
        min: 1,
        max: 100,
        isError: true,
        errorMessage:
          "Generated range failed final validation, reset to default",
      };
    }

    console.log(`✅ Valid new range: [${newRange.min}, ${newRange.max}]`);
    return { ...newRange, isError: false };
  } catch (error) {
    console.error("updateGuessingRange: Unexpected error occurred:", error);
    return {
      min: 1,
      max: 100,
      isError: true,
      errorMessage:
        "Range update failed due to unexpected error: " + error.message,
      originalError: error.message,
    };
  }
};

// Normalize feedback input to standard format
const normalizeFeedback = (feedback) => {
  if (typeof feedback !== "string") {
    feedback = String(feedback);
  }

  const normalized = feedback.toLowerCase().trim();

  // Handle various forms of "higher" feedback
  if (
    normalized.includes("higher") ||
    normalized.includes("up") ||
    normalized.includes("more") ||
    normalized.includes("bigger") ||
    normalized.includes("increase") ||
    normalized === "h" ||
    normalized === GAME_CONFIG.FEEDBACK.HIGHER
  ) {
    return "higher";
  }

  // Handle various forms of "lower" feedback
  if (
    normalized.includes("lower") ||
    normalized.includes("down") ||
    normalized.includes("less") ||
    normalized.includes("smaller") ||
    normalized.includes("decrease") ||
    normalized === "l" ||
    normalized === GAME_CONFIG.FEEDBACK.LOWER
  ) {
    return "lower";
  }

  // Handle various forms of "correct" feedback
  if (
    normalized.includes("correct") ||
    normalized.includes("right") ||
    normalized.includes("yes") ||
    normalized.includes("bingo") ||
    normalized.includes("exactly") ||
    normalized === "c" ||
    normalized === GAME_CONFIG.FEEDBACK.CORRECT
  ) {
    return "correct";
  }

  return feedback;
};

// Validate guess with decimal support
export const isValidGuess = (guess) => {
  const parsed = parseNumber(guess);
  return parsed !== null && parsed >= 1 && parsed <= 100;
};

// Check if range is valid
export const isValidGameRange = (min, max) => {
  return (
    Number.isInteger(min) &&
    Number.isInteger(max) &&
    min >= 1 &&
    max <= 100 &&
    min <= max
  );
};

// Enhanced game state validation
export const validateGameState = (gameData) => {
  try {
    const errors = [];
    const warnings = [];

    if (!gameData || typeof gameData !== "object") {
      errors.push("Game data must be an object");
      return { isValid: false, errors, warnings };
    }

    const { currentRole, secretNumber, guesserState, guessCount } = gameData;

    // Role validation
    if (currentRole && !["hider", "guesser"].includes(currentRole)) {
      errors.push("Invalid current role: " + currentRole);
    }

    // Hider state validation
    if (currentRole === "hider") {
      if (secretNumber === null || secretNumber === undefined) {
        errors.push("Hider role requires a secret number");
      } else if (!isValidGuess(secretNumber)) {
        errors.push(`Secret number ${secretNumber} must be between 1-100`);
      }
    }

    // Guesser state validation
    if (currentRole === "guesser" && guesserState) {
      const { currentRange, lastGuess } = guesserState;

      if (!currentRange) {
        errors.push("Guesser state must have currentRange");
      } else {
        if (!isValidGameRange(currentRange.min, currentRange.max)) {
          errors.push(
            `Current range [${currentRange.min}, ${currentRange.max}] is invalid`
          );
        }

        if (currentRange.max - currentRange.min < 0) {
          errors.push(
            `Range [${currentRange.min}, ${currentRange.max}] indicates logical error`
          );
        } else if (currentRange.max - currentRange.min === 0) {
          warnings.push(`Range narrowed to single number: ${currentRange.min}`);
        } else if (currentRange.max - currentRange.min < 3) {
          warnings.push(
            `Range very narrow: [${currentRange.min}, ${currentRange.max}]`
          );
        }
      }

      // Last guess validation
      if (lastGuess !== null && lastGuess !== undefined) {
        if (!isValidGuess(lastGuess)) {
          errors.push(
            `Last guess ${lastGuess} must be valid integer between 1-100`
          );
        } else if (
          currentRange &&
          (lastGuess < currentRange.min || lastGuess > currentRange.max)
        ) {
          warnings.push(
            `Last guess ${lastGuess} is outside current range [${currentRange.min}, ${currentRange.max}]`
          );
        }
      }
    }

    // Guess count validation
    if (typeof guessCount !== "number" || guessCount < 0) {
      errors.push("Guess count must be a non-negative number");
    } else if (guessCount > 20) {
      warnings.push(`High guess count: ${guessCount}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        role: currentRole,
        guesses: guessCount,
        rangeSize:
          currentRole === "guesser" && guesserState?.currentRange
            ? guesserState.currentRange.max - guesserState.currentRange.min + 1
            : null,
      },
    };
  } catch (error) {
    console.error("validateGameState: Error occurred:", error);
    return {
      isValid: false,
      errors: ["Game state validation failed due to error: " + error.message],
      warnings: [],
    };
  }
};

// Simulate self-play game
export const simulateSelfPlayGame = (options = {}) => {
  try {
    const {
      secretNumber = generateSecretNumber(),
      maxGuesses = GAME_CONFIG.RULES.MAX_GUESSES,
      startRange = {
        min: GAME_CONFIG.RULES.MIN_NUMBER,
        max: GAME_CONFIG.RULES.MAX_NUMBER,
      },
    } = options;

    console.log(
      `🎮 Starting self-play game with secret number: ${secretNumber}`
    );

    const gameLog = [];
    let currentRange = { ...startRange };
    let guessCount = 0;
    let found = false;

    gameLog.push(createSetupLogEntry(secretNumber, "simulation"));

    let turnNumber = 1;
    while (!found && guessCount < maxGuesses) {
      const guess = calculateBinarySearchGuess(
        currentRange.min,
        currentRange.max
      );
      guessCount++;

      console.log(
        `🔍 Turn ${turnNumber}: Guessing ${guess} (range: [${currentRange.min}, ${currentRange.max}])`
      );

      let guesserThought = `Range is [${currentRange.min}, ${currentRange.max}].`;
      if (turnNumber > 1) {
        const prevHiderEntry = gameLog[gameLog.length - 1];
        const prevGuesserEntry = gameLog[gameLog.length - 2];
        guesserThought = `Hider said "${prevHiderEntry.action}". My last guess was ${prevGuesserEntry.metadata.guess}. Previous range was [${prevGuesserEntry.metadata.currentRange.min}, ${prevGuesserEntry.metadata.currentRange.max}]. New range is [${currentRange.min}, ${currentRange.max}].`;
      }
      guesserThought += ` My ${
        turnNumber === 1 ? "first" : "next"
      } guess will be floor((${currentRange.min} + ${
        currentRange.max
      }) / 2) = ${guess}.`;

      gameLog.push(
        createGameLogEntry(
          turnNumber,
          GAME_CONFIG.ROLES.GUESSER,
          guesserThought,
          `My guess is ${guess}.`,
          {
            guess,
            currentRange: { ...currentRange },
            strategy: "binary_search",
          }
        )
      );

      const feedback = compareGuess(guess, secretNumber);
      const hiderThought = `My secret number is ${secretNumber}. Guesser guessed ${guess}. ${
        feedback === GAME_CONFIG.FEEDBACK.CORRECT
          ? `${guess} equals ${secretNumber}. I must respond "correct".`
          : feedback === GAME_CONFIG.FEEDBACK.HIGHER
          ? `${guess} is less than ${secretNumber}. I must respond "higher".`
          : `${guess} is greater than ${secretNumber}. I must respond "lower".`
      }`;

      gameLog.push(
        createGameLogEntry(
          turnNumber,
          GAME_CONFIG.ROLES.HIDER,
          hiderThought,
          feedback,
          { secretNumber, feedback, guess }
        )
      );

      if (feedback === GAME_CONFIG.FEEDBACK.CORRECT) {
        found = true;
        gameLog.push(
          createGameLogEntry(
            turnNumber + 1,
            GAME_CONFIG.ROLES.GUESSER,
            'Hider said "correct"! I found the number. Game over.',
            `The number is ${secretNumber}! I won with ${guessCount} guesses.`,
            { gameEnd: true, result: "success", totalGuesses: guessCount }
          )
        );
        console.log(
          `🎉 Game completed! Found ${secretNumber} in ${guessCount} guesses`
        );
      } else {
        const newRangeResult = updateGuessingRange(
          currentRange,
          guess,
          feedback
        );

        if (newRangeResult.isError) {
          console.error(
            "❌ Self-play game encountered range error:",
            newRangeResult.errorMessage
          );
          break;
        }

        currentRange = newRangeResult;
      }

      turnNumber++;
    }

    if (!found) {
      gameLog.push(
        createGameLogEntry(
          turnNumber,
          GAME_CONFIG.ROLES.HIDER,
          "Guesser has exceeded maximum attempts. Game over.",
          `You have run out of guesses. The secret number was ${secretNumber}.`,
          { gameEnd: true, result: "timeout", secretNumber }
        )
      );
      console.log(
        `⏰ Game timed out after ${guessCount} guesses. Secret was ${secretNumber}`
      );
    }

    return {
      gameLog,
      secretNumber,
      totalGuesses: guessCount,
      result: found ? "success" : "timeout",
      efficiency: calculateGameEfficiency(guessCount),
    };
  } catch (error) {
    console.error("simulateSelfPlayGame: Error occurred:", error);
    return {
      gameLog: [],
      secretNumber: null,
      totalGuesses: 0,
      result: "error",
      efficiency: "failed",
      error: error.message,
    };
  }
};
