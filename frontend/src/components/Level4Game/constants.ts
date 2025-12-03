import { Challenge } from './types.ts';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "The Energy Calculator",
    machineName: "Flux Generator",
    description: "The generator needs a method that adds two energy units together to stabilize the output.",
    instructions: [
      "Complete the method 'addEnergy'.",
      "It must accept two integers (a, b).",
      "It must return their sum."
    ],
    initialCode: `public static int addEnergy(int a, int b) {
    // TODO: return the sum of a and b
    
}`,
    hint: "Use the + operator and the return keyword.",
    solutionCriteria: "Must return a + b. Check for integer types.",
    timeLimit: 120
  },
  {
    id: 2,
    title: "Temperature Converter",
    machineName: "Cryo Chamber",
    description: "The Cooling Chamber can't operate until it knows how to convert Celsius inputs to Fahrenheit.",
    instructions: [
      "Complete 'toFahrenheit'.",
      "Accept a double 'celsius'.",
      "Return (c * 9/5) + 32."
    ],
    initialCode: `public static double toFahrenheit(double celsius) {
    // TODO: apply the formula and return the result
    
}`,
    hint: "Formula: (celsius * 9.0 / 5.0) + 32. Watch out for integer division!",
    solutionCriteria: "Must implement (celsius * 9/5) + 32 returning a double.",
    timeLimit: 180
  },
  {
    id: 3,
    title: "Greeting System Reboot",
    machineName: "Automaton Greeter",
    description: "The robot greeter has lost its voice files. It needs a method to format names correctly.",
    instructions: [
      "Complete 'greet'.",
      "Accept a String 'name'.",
      "Return 'Hello, <name>!'."
    ],
    initialCode: `public static String greet(String name) {
    // TODO: return the greeting message
    
}`,
    hint: "String concatenation uses '+'. Don't forget the exclamation mark!",
    solutionCriteria: "Must return 'Hello, ' + name + '!'.",
    timeLimit: 150
  },
  {
    id: 4,
    title: "The Power Core Multiplier",
    machineName: "Tri-Core Processor",
    description: "The Power Core needs to synchronize three energy streams by multiplying their frequencies.",
    instructions: [
      "Define method 'multiplyThree'.",
      "Parameters: three ints (x, y, z).",
      "Return: product of x, y, and z."
    ],
    initialCode: `public static int multiplyThree(int x, int y, int z) {
    // TODO: return x * y * z
    
}`,
    hint: "Multiply all three parameters together.",
    solutionCriteria: "Must return x * y * z.",
    timeLimit: 200
  },
  {
    id: 5,
    title: "Method Inception",
    machineName: "Output Analyzer",
    description: "This advanced machine requires a complex calculation using existing protocols.",
    instructions: [
      "Complete 'boostedAdd'.",
      "Call 'addEnergy(a, b)' first.",
      "Multiply that result by 5 and return it."
    ],
    initialCode: `public static int boostedAdd(int a, int b) {
    // TODO: use addEnergy(a, b)
    // TODO: multiply the result by 5
    
}`,
    hint: "You can call methods like this: int result = addEnergy(a, b);",
    solutionCriteria: "Must call addEnergy(a,b) and multiply result by 5.",
    timeLimit: 240
  }
];

export const API_KEY_ERROR = "API Key not configured. Please check environment settings.";