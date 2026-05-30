/**
 * Motion Design Configuration
 * Principles from LottieFiles Motion Design Skill
 */

export const EASING = {
  // Premium / Luxury: cubic-bezier(0.4, 0, 0.2, 1) - Elegant, minimal, sophisticated
  premium: [0.4, 0, 0.2, 1],
  
  // Power / Energetic: ease-out-expo - Dynamic, fast
  energetic: [0.19, 1, 0.22, 1],
  
  // Corporate / Professional: cubic-bezier(0.2, 0, 0, 1) - Clean, functional 
  corporate: [0.2, 0, 0, 1],
  
  // Playful: ease-out-back - Bouncy, fun
  playful: [0.34, 1.56, 0.64, 1],
} as const;

export const DURATIONS = {
  micro: 0.1,    // Tooltip / feedback
  fast: 0.2,     // Toggle / button press
  quick: 0.35,   // Icon transition / Small elements
  standard: 0.5, // Cards / Modal / Standard movement
  slow: 0.8,     // Dramatic reveal / Page context switch
} as const;

// Patterns from SKILL.md
export const AMBIENT = {
  breathing: {
    scale: [0.98, 1.02, 0.98],
    opacity: [0.8, 1, 0.8],
    duration: 3, // seconds
  },
  active: {
    scale: [0.95, 1.05, 0.95],
    duration: 2, // seconds
  }
} as const;
