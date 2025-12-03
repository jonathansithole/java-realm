
import { CodeLine } from './types';

export const CODE_CHALLENGE_LINES: CodeLine[] = [
  // --- Displaying Text ---
  { 
    id: 1, 
    content: 'public class BasicsTest {', 
    isBroken: false, 
    correctContent: 'public class BasicsTest {', 
    userAttempt: 'public class BasicsTest {', 
    status: 'correct',
    instruction: ''
  },
  { 
    id: 2, 
    content: '  public static void main(String[] args) {', 
    isBroken: false, 
    correctContent: '  public static void main(String[] args) {', 
    userAttempt: '  public static void main(String[] args) {', 
    status: 'correct',
    instruction: ''
  },

  // Broken: Missing closing quote and semicolon
  { 
    id: 3, 
    content: '    System.out.println("Hello World)', 
    isBroken: true, 
    correctContent: '    System.out.println("Hello World");', 
    userAttempt: '    System.out.println("Hello World)', 
    status: 'pending',
    instruction: 'Fix the string output'
  },

  // --- Syntax & Comments ---
  { 
    id: 4, 
    content: '    // This prints the sum of two numbers', 
    isBroken: false, 
    correctContent: '    // This prints the sum of two numbers', 
    userAttempt: '    // This prints the sum of two numbers', 
    status: 'correct',
    instruction: ''
  },

  // Broken: comment syntax incorrect
  { 
    id: 5, 
    content: '    / This is a valid multi-line comment', 
    isBroken: true, 
    correctContent: '    /* This is a valid multi-line comment */', 
    userAttempt: '    / This is a valid multi-line comment', 
    status: 'pending',
    instruction: 'Fix the comment: use proper multi-line comment syntax.'
  },

  // --- Variables & Data Types ---
  { 
    id: 6, 
    content: '    int age = 20', 
    isBroken: true, 
    correctContent: '    int age = 20;', 
    userAttempt: '    int age = 20', 
    status: 'pending',
    instruction: 'correct the variable declaration.'
  },

  { 
    id: 7, 
    content: '    double price = 99.99;', 
    isBroken: false, 
    correctContent: '    double price = 99.99;', 
    userAttempt: '    double price = 99.99;', 
    status: 'correct',
    instruction: 'This variable is correctly declared and typed.'
  },

  // Broken: using wrong data type keyword
  { 
    id: 8, 
    content: '    string name = "Jonathan";', 
    isBroken: true, 
    correctContent: '    String name = "Jonathan";', 
    userAttempt: '    string name = "Jonathan";', 
    status: 'pending',
    instruction: 'Correct the data type'
  },

  // --- Type Casting ---
  // Broken: missing cast
  { 
    id: 9, 
    content: '    int number =  (5.6);', 
    isBroken: true, 
    correctContent: '    int number = (int) (5.6);', 
    userAttempt: '    int number =  (5.6);', 
    status: 'pending',
    instruction: 'Add an explicit cast from double to int.'
  },

  { 
    id: 10, 
    content: '    double converted = age;', 
    isBroken: false, 
    correctContent: '    double converted = age;', 
    userAttempt: '    double converted = age;', 
    status: 'correct',
    instruction: ''
  },

  // Closing brackets
  { 
    id: 11, 
    content: '  }', 
    isBroken: false, 
    correctContent: '  }', 
    userAttempt: '  }', 
    status: 'correct',
    instruction: ''
  },
  { 
    id: 12, 
    content: '}', 
    isBroken: false, 
    correctContent: '}', 
    userAttempt: '}', 
    status: 'correct',
    instruction: ''
  },
];


export const DIALOGUE = {
  intro: "Where… where am I? Somebody—hello?",
  start: "Hurry! I can’t hold on forever!",
  level25: "It’s… it’s getting higher… please don’t stop. I’m begging you!",
  level50: "Hurry! I don’t want to drown!",
  level75: "It’s almost… at my neck—please!",
  level90: "Save me… please—submit the code—do it now!",
  success: "I… I’m alive…? Thank you! You saved me—I’m free! I’m finally free!",
  fail: "No... no!",
};
