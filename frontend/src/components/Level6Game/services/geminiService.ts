import { ValidationResponse } from '../types.ts';
import { CHALLENGES } from '../constants.ts';

// NOTE: This service has been refactored to run locally without the Gemini API.
// It uses heuristic checks (Regex) to validate the Java code concepts.

export const validateChallenge = async (
  challengeId: number,
  userCode: string
): Promise<ValidationResponse> => {
  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return { success: false, feedback: "Invalid challenge ID" };

  // Simulate a short compiling delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  // Normalize code: remove extra whitespace for easier regex matching
  const code = userCode.replace(/\s+/g, ' ').trim();

  try {
    switch (challengeId) {
      case 1: // Wooden Door
        // Requirement: class WoodenDoor extends Door
        if (!/class\s+WoodenDoor\s+extends\s+Door/.test(code)) {
          return { 
            success: false, 
            feedback: "Compilation Error: Your class 'WoodenDoor' must extend the parent class 'Door'." 
          };
        }
        // Requirement: Override open() method
        if (!/void\s+open\s*\(\s*\)/.test(code)) {
           return { 
             success: false, 
             feedback: "Compilation Error: You must override the 'void open()' method." 
           };
        }
        // Requirement: Print something (simulated action)
        if (!code.includes("System.out.println")) {
            return {
                success: false,
                feedback: "Logic Error: The open method is empty. Print a message to animate the door."
            }
        }
        return { 
          success: true, 
          feedback: "Success! WoodenDoor correctly inherits from Door and overrides behavior.", 
          visualAction: 'OPEN_DOOR' 
        };

      case 2: // Magic Platform
        // Requirement: class MagicPlatform extends Platform
        if (!/class\s+MagicPlatform\s+extends\s+Platform/.test(code)) {
          return { success: false, feedback: "Compilation Error: 'MagicPlatform' must extend 'Platform'." };
        }
        // Requirement: Override activate()
        if (!/void\s+activate\s*\(\s*\)/.test(code)) {
           return { success: false, feedback: "Compilation Error: You need to override the 'void activate()' method." };
        }
        // Optional: Check for @Override
        if (!/@Override/.test(code)) {
            // We allow it to pass without annotation, but maybe give a tip in real life.
            // For this game, we just pass.
        }
        return { 
          success: true, 
          feedback: "Excellent! The platform overrides the default activation with magic.", 
          visualAction: 'ACTIVATE_PLATFORM' 
        };

      case 3: // Polymorphism
        // Requirement: Use Interactable type for variables
        // Matches: Interactable x = new ...
        if (!/Interactable\s+\w+\s*=\s*new/.test(code)) {
           return { success: false, feedback: "Polymorphism Error: Declare your variables using the parent type 'Interactable' (e.g., Interactable obj = new WoodenDoor())." };
        }
        // Requirement: Call .interact()
        if (!code.includes(".interact()")) {
            return { success: false, feedback: "Logic Error: You must call the .interact() method on your objects." };
        }
        return { 
          success: true, 
          feedback: "Polymorphism achieved! The system treats different objects via their common interface.", 
          visualAction: 'POLYMORPHISM_DEMO' 
        };

      case 4: // Multi-level Inheritance
        // Requirement: SpeedElevator extends MagicElevator
        if (!/class\s+SpeedElevator\s+extends\s+MagicElevator/.test(code)) {
           return { success: false, feedback: "Inheritance Error: 'SpeedElevator' must extend 'MagicElevator' to inherit its magic properties." };
        }
        // Requirement: Override move()
        if (!/void\s+move\s*\(\s*\)/.test(code)) {
            return { success: false, feedback: "Compilation Error: Override the 'move()' method to define the high-speed behavior." };
        }
        return { 
          success: true, 
          feedback: "Multi-level inheritance verified. High-speed logic engaged.", 
          visualAction: 'ELEVATOR_RIDE' 
        };

      case 5: // Polymorphic Array Loop
        // Requirement: Interactable[] array
        if (!/Interactable\s*\[\s*\]/.test(code)) {
            return { success: false, feedback: "Data Structure Error: Create an array of type 'Interactable[]'." };
        }
        // Requirement: Loop (for or while)
        if (!/for\s*\(/.test(code) && !/while\s*\(/.test(code)) {
             return { success: false, feedback: "Logic Error: Use a loop (for-each or standard for) to iterate through the devices." };
        }
        return { 
          success: true, 
          feedback: "Mastery Unlocked! The entire palace responds to your polymorphic loop.", 
          visualAction: 'ARRAY_LOOP' 
        };

      default:
        return { success: false, feedback: "Unknown challenge ID." };
    }
  } catch (error) {
    return { success: false, feedback: "An internal validation error occurred." };
  }
};

export const getHint = async (challengeId: number): Promise<string> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const challenge = CHALLENGES.find((c) => c.id === challengeId);
    if(!challenge) return "No hint available.";

    // Return the static hint defined in constants
    return challenge.hint;
}