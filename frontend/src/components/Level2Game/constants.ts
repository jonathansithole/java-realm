
import { CodeLine } from './types';

export const LEVEL2_CHALLENGE_LINES: CodeLine[] = [
  // CLASS + MAIN
  {
    id: 1,
    content: 'public class DecisionChallenge {',
    isBroken: false,
    correctContent: 'public class DecisionChallenge {',
    userAttempt: 'public class DecisionChallenge {',
    status: 'correct',
    instruction: 'Start of the class — no issues here.'
  },
  {
    id: 2,
    content: '  public static void main(String[] args) {',
    isBroken: false,
    correctContent: '  public static void main(String[] args) {',
    userAttempt: '  public static void main(String[] args) {',
    status: 'correct',
    instruction: 'Main method — correct.'
  },

  // LOGICAL OPERATORS (broken line)
  {
    id: 3,
    content: '    int age = 20;',
    isBroken: false,
    correctContent: '    int age = 20;',
    userAttempt: '    int age = 20;',
    status: 'correct',
    instruction: 'Correct variable declaration.'
  },
  {
    id: 4,
    content: '    boolean hasID = true',
    isBroken: true,
    correctContent: '    boolean hasID = true;',
    userAttempt: '    boolean hasID = true',
    status: 'pending',
    instruction: 'Add the missing semicolon after the boolean value.'
  },
  {
    id: 5,
    content: '    if (age >= 18 && hasID) {',
    isBroken: false,
    correctContent: '    if (age >= 18 && hasID) {',
    userAttempt: '    if (age >= 18 && hasID) {',
    status: 'correct',
    instruction: 'This line uses a logical AND (&&) correctly — no changes needed.'
  },
  {
    id: 6,
    content: '        System.out.println("Access granted");',
    isBroken: false,
    correctContent: '        System.out.println("Access granted");',
    userAttempt: '        System.out.println("Access granted");',
    status: 'correct',
    instruction: 'Prints a success message — correct.'
  },
  {
    id: 7,
    content: '    } else',
    isBroken: true,
    correctContent: '    } else {',
    userAttempt: '    } else',
    status: 'pending',
    instruction: 'Add a { after the else keyword.'
  },
  {
    id: 8,
    content: '        System.out.println("Access denied");',
    isBroken: false,
    correctContent: '        System.out.println("Access denied");',
    userAttempt: '        System.out.println("Access denied");',
    status: 'correct',
    instruction: 'Inside else block — correct.'
  },
  {
    id: 9,
    content: '    }',
    isBroken: false,
    correctContent: '    }',
    userAttempt: '    }',
    status: 'correct',
    instruction: 'End of if–else block.'
  },

  // SWITCH STATEMENT (broken)
  {
    id: 10,
    content: '    int day = 3;',
    isBroken: false,
    correctContent: '    int day = 3;',
    userAttempt: '    int day = 3;',
    status: 'correct',
    instruction: 'Correct variable for switch test.'
  },
  {
    id: 11,
    content: '    switch day {',
    isBroken: true,
    correctContent: '    switch (day) {',
    userAttempt: '    switch day {',
    status: 'pending',
    instruction: 'Fix the switch syntax by adding parentheses around day.'
  },
  {
    id: 12,
    content: '      case 1:',
    isBroken: false,
    correctContent: '      case 1:',
    userAttempt: '      case 1:',
    status: 'correct',
    instruction: 'Correct case label.'
  },
  {
    id: 13,
    content: '        System.out.println("Monday");',
    isBroken: false,
    correctContent: '        System.out.println("Monday");',
    userAttempt: '        System.out.println("Monday");',
    status: 'correct',
    instruction: 'Correct print statement.'
  },

  // missing break (broken)
  {
    id: 14,
    content: '      // missing break here',
    isBroken: false,
    correctContent: '      // missing break here',
    userAttempt: '      // missing break here',
    status: 'correct',
    instruction: 'Comment describing the issue — no fix required.'
  },
  {
    id: 15,
    content: '      case 3:',
    isBroken: false,
    correctContent: '      case 3:',
    userAttempt: '      case 3:',
    status: 'correct',
    instruction: 'Another case label — correct.'
  },
  {
    id: 16,
    content: '        System.out.println("Wednesday")',
    isBroken: true,
    correctContent: '        System.out.println("Wednesday");',
    userAttempt: '        System.out.println("Wednesday")',
    status: 'pending',
    instruction: 'Add a semicolon at the end.'
  },
  {
    id: 17,
    content: '        break;',
    isBroken: false,
    correctContent: '        break;',
    userAttempt: '        break;',
    status: 'correct',
    instruction: 'Correct break statement.'
  },
  {
    id: 18,
    content: '      default:',
    isBroken: false,
    correctContent: '      default:',
    userAttempt: '      default:',
    status: 'correct',
    instruction: 'Default case — correct.'
  },
  {
    id: 19,
    content: '        System.out.println("Unknown day");',
    isBroken: false,
    correctContent: '        System.out.println("Unknown day");',
    userAttempt: '        System.out.println("Unknown day");',
    status: 'correct',
    instruction: 'Correct print statement.'
  },
  {
    id: 20,
    content: '    }',
    isBroken: false,
    correctContent: '    }',
    userAttempt: '    }',
    status: 'correct',
    instruction: 'End of switch block.'
  },

  // DECISION TREE (if-else-if chain)
  {
    id: 21,
    content: '    int score = 78;',
    isBroken: false,
    correctContent: '    int score = 78;',
    userAttempt: '    int score = 78;',
    status: 'correct',
    instruction: 'Variable for decision tree — correct.'
  },
  {
    id: 22,
    content: '    if score >= 90) {',
    isBroken: true,
    correctContent: '    if (score >= 90) {',
    userAttempt: '    if score >= 90) {',
    status: 'pending',
    instruction: 'Fix the parentheses and add the missing opening bracket after if.'
  },
  {
    id: 23,
    content: '        System.out.println("A Grade");',
    isBroken: false,
    correctContent: '        System.out.println("A Grade");',
    userAttempt: '        System.out.println("A Grade");',
    status: 'correct',
    instruction: 'Correct statement — no fix needed.'
  },
  {
    id: 24,
    content: '    } else if (score >= 75) {',
    isBroken: false,
    correctContent: '    } else if (score >= 75) {',
    userAttempt: '    } else if (score >= 75) {',
    status: 'correct',
    instruction: 'Correct else-if structure.'
  },
  {
    id: 25,
    content: '        System.out.println("B Grade")',
    isBroken: true,
    correctContent: '        System.out.println("B Grade");',
    userAttempt: '        System.out.println("B Grade")',
    status: 'pending',
    instruction: 'Add the missing semicolon.'
  },
  {
    id: 26,
    content: '    } else {',
    isBroken: false,
    correctContent: '    } else {',
    userAttempt: '    } else {',
    status: 'correct',
    instruction: 'Final else block — correct.'
  },
  {
    id: 27,
    content: '        System.out.println("C Grade");',
    isBroken: false,
    correctContent: '        System.out.println("C Grade");',
    userAttempt: '        System.out.println("C Grade");',
    status: 'correct',
    instruction: 'Correct statement — nothing to fix.'
  },
  {
    id: 28,
    content: '    }',
    isBroken: false,
    correctContent: '    }',
    userAttempt: '    }',
    status: 'correct',
    instruction: 'End of decision tree.'
  },

  // CLASS END
  {
    id: 29,
    content: '}',
    isBroken: false,
    correctContent: '}',
    userAttempt: '}',
    status: 'correct',
    instruction: 'End of class — correct.'
  }
];



export const LEVEL2_DIALOGUE = {
    intro: "The chamber is calibrated. Solve the logic quickly!",
    start: "I can feel the pressure mounting. Let's adjust the logic!",
    level25: "It's going down a little faster now. Can you adjust the code? I believe in you!",
    level50: "Whoa, it's getting close! Focus on the combined conditions!",
    level75: "Almost there! Fix that last line—we can beat this!",
    level90: "Just a few lines left! Get this right and we're free!",
    success: "You did it! Nice work! This puzzle chamber didn’t stand a chance!",
    fail: "Aw man… so close! Let’s try again—it’ll open if we get the code right.", 

};
