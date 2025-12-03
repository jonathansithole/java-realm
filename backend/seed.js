// backend/seed.js

const admin = require('firebase-admin');
// IMPORTANT: Make sure you have downloaded this file from your Firebase project settings
// and placed it in this 'backend' folder.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ==================================================================================
// --- COMPLETE GAME DATA FOR ALL 8 WORLDS (with all fixes) ---
// ==================================================================================

const gameData = {
  // --- WORLD 1: THE VILLAGE OF BASICS ---
  "1": {
    worldId: 1, title: "The Village of Basics", description: "Learn the fundamentals of Java syntax and structure.", icon: "🏡",
    levels: {
      "1.1": { levelId: "1.1", title: "Hello World", instructions: "Awaken the Communication Crystal by printing \"Hello Mzansi!\"", solution: "Hello Mzansi!", xpReward: 20, initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Your code here...\n    }\n}", badge: { name: "First Contact", icon: "📡", description: "Ran your first Java program!" }, simulationType: "CrystalAwakening", tutorial: { goal: "Write a simple Java program and understand its basic structure.", keyConcepts: "A 'class' is a blueprint. The 'main' method is the starting point. 'System.out.println()' prints text.", codeExample: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, world!\");\n    }\n}", breakdown: { "The Class": "`public class HelloWorld` defines a 'container' for your code.", "The Main Method": "`public static void main(String[] args)` is the exact phrase that tells Java where to start your program.", "The Print Command": "`System.out.println(...)` is the command to print a line of text." }, extraTip: "Java is case-sensitive. 'main', 'Main', and 'MAIN' are not the same.", quiz: [ { question: "What is the main entry point of every Java application?", options: ["start()", "main()", "run()"], correctAnswerIndex: 1, explanation: "The `main()` method is the special starting point for the Java Virtual Machine (JVM)." } ] } },
      "1.2": { levelId: "1.2", title: "Syntax & Comments", instructions: "Clarify the Elder's signpost by adding a single-line comment: // Shows the villager count", solution: "42", xpReward: 25, validationRules: ["//"], initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Add your comment here\n        int villagerCount = 42;\n        System.out.println(villagerCount);\n    }\n}", badge: { name: "Code Scribe", icon: "📜", description: "Mastered code comments." }, simulationType: "Signpost", tutorial: { goal: "Learn how to add single-line and multi-line comments to make your code easy to understand.", keyConcepts: "Comments are ignored by the compiler; they are for humans! // is for single lines. /* ... */ is for multiple lines.", codeExample: "// This is a single-line comment.\n\n/*\nThis is a\nmulti-line comment.\n*/", breakdown: { "Single-Line Comment": "`//` starts a comment that goes until the end of the line.", "Multi-Line Comment": "`/* ... */` creates a comment block that starts with `/*` and ends with `*/`." }, extraTip: "Write comments BEFORE you write the code to plan your logic!", quiz: [ { question: "Which symbol starts a single-line comment?", options: ["##", "//", "/*"], correctAnswerIndex: 1, explanation: "In Java, // is used for single-line comments." } ] } },
      "1.3": { levelId: "1.3", title: "Variables & Data Types", instructions: "Store the village's grain supply. Create an `int` named `grainSupply` with a value of 500 and print it.", solution: "500", xpReward: 30, initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Declare and print the grainSupply variable\n    }\n}", badge: { name: "Data Keeper", icon: "📦", description: "Mastered variables." }, simulationType: "GenericSuccess", tutorial: { goal: "Understand how to declare variables to store different types of data.", keyConcepts: "`int` for integers, `double` for decimals, `String` for text, `boolean` for true/false.", codeExample: "int score = 100;\nString playerName = \"Alex\";\nboolean isActive = true;", breakdown: { "Integer (int)": "`int score = 100;` declares a variable to hold a whole number.", "Text (String)": "`String playerName = \"Alex\";` declares a variable for text, which must be in double quotes.", "True/False (boolean)": "`boolean isActive = true;` can only hold `true` or `false`." }, extraTip: "Variable names should be descriptive! `playerScore` is better than `s`.", quiz: [ { question: "Which data type would you use to store the number 3.14?", options: ["int", "String", "double"], correctAnswerIndex: 2, explanation: "`double` is used for floating-point numbers (decimals)." } ] } },
      "1.4": { levelId: "1.4", title: "Type Casting", instructions: "You have 9.78 gold dust. The bank only accepts whole numbers. Cast the `double` to an `int` and print it.", solution: "9", xpReward: 35, initialCode: "public class Main {\n    public static void main(String[] args) {\n        double goldDust = 9.78;\n        // Cast goldDust to an int and print it\n    }\n}", badge: { name: "Shape Shifter", icon: "✨", description: "Mastered type casting." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to convert a value from one data type to another.", keyConcepts: "Explicit casting is when you manually convert a larger type to a smaller type, like `(int)`. This can cause data loss.", codeExample: "double myDouble = 9.78;\nint myInt = (int) myDouble; // myInt is now 9", breakdown: { "The Cast Operator": "`(int) myDouble` explicitly tells Java to convert the `double` value into an integer.", "Data Truncation": "When casting from a `double` to an `int`, the decimal part is cut off (truncated), not rounded." }, extraTip: "Casting from smaller types to larger types (e.g., `int` to `double`) is called widening conversion and is usually safe.", quiz: [ { question: "What is the result of `(int) 3.99`?", options: ["4", "3", "Error"], correctAnswerIndex: 1, explanation: "Casting a double to an int truncates the decimal part, so 3.99 becomes 3." } ] } },
      "1.5": { levelId: "1.5", title: "Boss: The Interactive Calculator", instructions: "Build the logic for a simple calculator. Create a `Calculator` class (non-public) with a public method `add(int a, int b)` that returns the sum.", initialCode: "class Calculator {\n    // Create your public add(int a, int b) method here\n    public int add(int a, int b) {\n        return a + b;\n    }\n}\n\n// The main public class for testing\npublic class Main {\n    public static void main(String[] args) {\n        Calculator myCalc = new Calculator();\n        // The simulation will test your Calculator class directly.\n        // You can test it here if you want:\n        System.out.println(myCalc.add(5, 10));\n    }\n}", solution: "15", xpReward: 100, badge: { name: "Village Hero", icon: "🏆", description: "Built a functional, interactive tool." }, simulationType: "InteractiveCalculator", tutorial: { goal: "Combine your knowledge to create a reusable class with a method.", keyConcepts: "Create a separate, non-public class for your logic. The `public class Main` is the entry point for testing.", codeExample: "class Greeter {\n    public String getGreeting() {\n        return \"Hello\";\n    }\n}\n// in main:\nGreeter g = new Greeter();\nSystem.out.println(g.getGreeting());", breakdown: { "Helper Class": "`class Calculator` is a 'helper' class. Since it's not public, it can live in the same file as `public class Main`.", "Method Logic": "The `add` method contains the core logic that the interactive simulation will use." }, extraTip: "Organizing logic into separate classes is a key principle of good software design!", quiz: [ { question: "Why might you put a method in a separate class like `Calculator`?", options: ["Because you have to", "To organize and reuse code"], correctAnswerIndex: 1, explanation: "Separating logic into classes makes your code cleaner, more organized, and easier to reuse in other parts of your program." } ] } },
    }
  },
 "2": {
  "worldId": 2,
  "title": "The Enchanted Forest",
  "description": "Solve puzzles of logic to journey through the magical woods.",
  "icon": "🌲",
  "levels": {
    "2.1": {
      "levelId": "2.1",
      "title": "The Guardian of Truth",
      "instructions": "To pass the Guardian, both the `powerGem` and `wisdomStone` must be true, OR the `secretRune` must be true. Print whether you can pass.",
      "solution": "true",
      "xpReward": 30,
      "initialCode": "public class Main {\n    public static void main(String[] args) {\n        boolean powerGem = true;\n        boolean wisdomStone = true;\n        boolean secretRune = false;\n        // Print true if both gems are active OR if the secretRune is active\n    }\n}",
      "badge": { "name": "Gatekeeper", "icon": "🔑", "description": "Defeated the Guardian of Truth." },
      "simulationType": "GolemGuardian",
      "tutorial": {
        "goal": "Learn to combine conditions with logical operators to make decisions.",
        "keyConcepts": "`&&` requires both conditions to be true, `||` requires at least one true, and `!` flips a boolean value.",
        "codeExample": "boolean hasKey = true;\nboolean doorLocked = false;\nboolean canEnter = hasKey && !doorLocked; // true",
        "breakdown": {
          "AND": "`&&` is used when multiple conditions must all be true.",
          "OR": "`||` is used when any one of several conditions is sufficient.",
          "NOT": "`!` is used to invert a condition."
        },
        "extraTip": "Be careful not to confuse `=` (assignment) with `==` (comparison).",
        "quiz": [
          {
            "question": "What is the result of `(true && false) || true`?",
            "options": ["true", "false"],
            "correctAnswerIndex": 0,
            "explanation": "`true && false` is false, but OR with true makes the expression true."
          }
        ]
      },
      "miniQuests": [
        {
          "questId": "2.1.1",
          "title": "Hidden Rune Check",
          "instructions": "Print `Rune Ignored` if both gems are active and hiddenRune is false, otherwise print `Rune Activated`.",
          "solution": "Rune Ignored",
          "xpReward": 15,
          "badge": { "name": "Rune Whisperer", "icon": "🔮", "description": "Discovered the hidden rune." },
          "initialCode": "boolean powerGem = true;\nboolean wisdomStone = true;\nboolean hiddenRune = false;\n// Print Rune Ignored or Rune Activated"
        },
        {
          "questId": "2.1.2",
          "title": "Combination Test",
          "instructions": "The secret path opens if either both gems are active OR secretRune AND torch are active. Print `Secret Path Open`.",
          "solution": "Secret Path Open",
          "xpReward": 20,
          "badge": { "name": "Logic Adept", "icon": "🧠", "description": "Mastered complex boolean logic." },
          "initialCode": "boolean powerGem = false;\nboolean wisdomStone = true;\nboolean secretRune = true;\nboolean torch = true;\n// Print Secret Path Open"
        }
      ]
    },
    "2.2": {
      "levelId": "2.2",
      "title": "The Forked Gate",
      "instructions": "If `pathIsClear`, print `Proceed`. If blocked but `torch` is true, print `Use Torch`. Otherwise, print `Wait`.",
      "solution": "Use Torch",
      "xpReward": 35,
      "initialCode": "public class Main {\n    public static void main(String[] args) {\n        boolean pathIsClear = false;\n        boolean torch = true;\n        // Print Proceed, Use Torch, or Wait\n    }\n}",
      "badge": { "name": "Pathfinder", "icon": "🧭", "description": "Opened the Forked Gate." },
      "simulationType": "GenericSuccess",
      "tutorial": {
        "goal": "Learn how if-else statements control program flow.",
        "keyConcepts": "The `if` block executes when the condition is true; the `else` block executes when the condition is false.",
        "codeExample": "int age = 18;\nif (age >= 18) {\n    System.out.println(\"Adult\");\n} else {\n    System.out.println(\"Minor\");\n}",
        "breakdown": {
          "The If": "Code inside `{}` runs only if the condition is true.",
          "The Else": "Provides an alternative when the condition is false."
        },
        "extraTip": "Always make sure the condition inside `if()` evaluates to a boolean value.",
        "quiz": [
          {
            "question": "Given `boolean torch = false; pathIsClear = false;`, what will be printed?",
            "options": ["Proceed", "Use Torch", "Wait"],
            "correctAnswerIndex": 2,
            "explanation": "Neither path is clear nor torch is available, so `Wait` is printed."
          }
        ]
      },
      "miniQuests": [
        {
          "questId": "2.2.1",
          "title": "Multiple Paths",
          "instructions": "The gate has three paths. Print `Proceed` if path is clear, `Burn Vines` if torch is true, `Unlock` if magicKey is true, otherwise `Wait`.",
          "solution": "Unlock",
          "xpReward": 15,
          "badge": { "name": "Gate Explorer", "icon": "🗝️", "description": "Explored alternative paths." },
          "initialCode": "boolean pathIsClear = false;\nboolean torch = false;\nboolean magicKey = true;\n// Print Proceed, Burn Vines, Unlock, or Wait"
        },
        {
          "questId": "2.2.2",
          "title": "Danger Alert",
          "instructions": "If path is clear AND fog is false, print `Safe`. Otherwise, print `Danger Ahead`.",
          "solution": "Danger Ahead",
          "xpReward": 10,
          "badge": { "name": "Cautious Traveler", "icon": "⚠️", "description": "Learned to assess danger." },
          "initialCode": "boolean pathIsClear = true;\nboolean fog = true;\n// Print Safe or Danger Ahead"
        }
      ]
    },
    "2.3": {
      "levelId": "2.3",
      "title": "The Rune Tablet",
      "instructions": "Use a switch on `rune` (1=Fire, 2=Water, 3=Earth, 4=Air). Otherwise, print `Unknown Rune`.",
      "solution": "Air",
      "xpReward": 40,
      "initialCode": "public class Main {\n    public static void main(String[] args) {\n        int rune = 4;\n        // Use a switch statement to print the element\n    }\n}",
      "badge": { "name": "Rune Master", "icon": "💎", "description": "Deciphered the Rune Tablet." },
      "simulationType": "GenericSuccess",
      "tutorial": {
        "goal": "Learn how switch statements provide a clean alternative to long if-else chains.",
        "keyConcepts": "Switch evaluates a variable. `case` matches a value, `break` stops execution, `default` is the fallback.",
        "codeExample": "int day = 7;\nswitch (day) {\n  case 6: System.out.println(\"Saturday\"); break;\n  case 7: System.out.println(\"Sunday\"); break;\n  default: System.out.println(\"Weekday\");\n}",
        "breakdown": {
          "Case": "Each `case` checks a specific value.",
          "Break": "`break;` prevents fall-through to the next case.",
          "Default": "`default:` runs if no case matches."
        },
        "extraTip": "Switch works with `int`, `char`, and `String` types.",
        "quiz": [
          {
            "question": "What will be printed if `rune = 7;`?",
            "options": ["Fire", "Water", "Air", "Unknown Rune"],
            "correctAnswerIndex": 3,
            "explanation": "No case matches, so the default block executes."
          }
        ]
      },
      "miniQuests": [
        {
          "questId": "2.3.1",
          "title": "Element Combo",
          "instructions": "Print `Elements Combined` if rune1 = 1 AND rune2 = 3.",
          "solution": "Elements Combined",
          "xpReward": 15,
          "badge": { "name": "Elementalist", "icon": "🌟", "description": "Combined elemental runes." },
          "initialCode": "int rune1 = 1;\nint rune2 = 3;\n// Print Elements Combined if condition met"
        },
        {
          "questId": "2.3.2",
          "title": "Unknown Rune",
          "instructions": "If the rune value is not 1–4, print `Mystery Element`. Otherwise, print the element name.",
          "solution": "Mystery Element",
          "xpReward": 10,
          "badge": { "name": "Curious Mage", "icon": "🔍", "description": "Investigated unknown runes." },
          "initialCode": "int rune = 7;\n// Print Mystery Element or element name"
        }
      ]
    },
    "2.4": {
      "levelId": "2.4",
      "title": "Boss: The Whispering Woods Maze",
      "instructions": "If `signDirection=1`, print `path:Left Tunnel`. If 2, print `path:Straight Path`. If 3, print `path:Right Bridge`. Otherwise, print `path:Lost`.",
      "solution": "path:Right Bridge",
      "xpReward": 100,
      "initialCode": "public class Main {\n    public static void main(String[] args) {\n        int signDirection = 3;\n        // Use if-else if-else to print the correct path\n    }\n}",
      "badge": { "name": "Forest Sage", "icon": "🏆", "description": "Escaped the Whispering Woods Maze." },
      "simulationType": "LogicMaze",
      "tutorial": {
        "goal": "Learn to build decision trees using if-else if-else chains.",
        "keyConcepts": "Only one block executes—the first one whose condition is true. Else is the fallback.",
        "codeExample": "int option = 2;\nif (option == 1) {\n  System.out.println(\"Option 1\");\n} else if (option == 2) {\n  System.out.println(\"Option 2\");\n} else {\n  System.out.println(\"Invalid\");\n}",
        "breakdown": {
          "First Check": "The `if` runs first; if true, others are skipped.",
          "Second Check": "`else if` runs only if the first condition is false.",
          "Fallback": "The `else` block runs if all previous conditions are false."
        },
        "extraTip": "Perfect for menus, game choices, or multiple program states.",
        "quiz": [
          {
            "question": "In an if-else if-else chain, how many blocks can execute at most?",
            "options": ["Zero", "One", "Two", "All of them"],
            "correctAnswerIndex": 1,
            "explanation": "Only the first true condition executes; else is fallback."
          }
        ]
      },
      "miniQuests": [
        {
          "questId": "2.4.1",
          "title": "Secret Shortcut",
          "instructions": "If `signDirection = 4`, print `path:Hidden Grove`. Otherwise, follow normal paths.",
          "solution": "path:Hidden Grove",
          "xpReward": 20,
          "badge": { "name": "Maze Runner", "icon": "🏃‍♂️", "description": "Found the secret shortcut." },
          "initialCode": "int signDirection = 4;\n// Print path:Hidden Grove or normal path"
        },
        {
          "questId": "2.4.2",
          "title": "Lost Traveler",
          "instructions": "If signDirection is invalid (not 1–3), print `Lost in Woods`. Give hint for correct path.",
          "solution": "Lost in Woods",
          "xpReward": 15,
          "badge": { "name": "Woods Survivor", "icon": "🌳", "description": "Survived getting lost in the woods." },
          "initialCode": "int signDirection = 99;\n// Print Lost in Woods or normal path"
        }
      ]
    }
  }
},


  "3": {
    worldId: 3, title: "The Looping Lake", description: "Master the art of repetition.", icon: "🔁",
    levels: {
        "3.1": { levelId: "3.1", title: "While Loops", instructions: "Use a `while` loop to fill a potion vial by printing \"drip\" 3 times.", solution: "drip\ndrip\ndrip", xpReward: 40, initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Use a counter and a while loop\n    }\n}", badge: { name: "Rainmaker", icon: "💧", description: "Mastered while loops." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn to use a `while` loop to repeat code as long as a condition is true.", keyConcepts: "A `while` loop checks the condition *before* each iteration. You must manage the loop variable yourself.", codeExample: "int i = 0;\nwhile (i < 3) {\n  System.out.println(i);\n  i++;\n}", breakdown: { "Initialization": "`int i = 0;` - You must set up a counter *before* the loop.", "The Condition": "`while (i < 3)` - The loop continues as long as this is true.", "The Update": "`i++;` - Inside the loop, you must change the variable so the condition eventually becomes false to avoid an infinite loop!" }, extraTip: "Forgetting to increment your counter (`i++`) is the most common cause of an infinite loop!", quiz: [{ question: "If you forget `i++` inside a `while (i < 5)` loop, what happens?", options: ["It runs 5 times", "It runs forever"], correctAnswerIndex: 1, explanation: "Without `i++`, `i` will always be less than 5, and the loop's condition will never become false, causing an infinite loop." }] } },
        "3.2": { levelId: "3.2", title: "For Loops", instructions: "Chop a log 5 times to gather wood. Use a `for` loop to print \"chop\" 5 times.", solution: "chop\nchop\nchop\nchop\nchop", xpReward: 45, initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Use a for loop\n    }\n}", badge: { name: "Lumberjack", icon: "🪓", description: "Mastered for loops." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn to use a `for` loop, which is perfect for when you know exactly how many times you want to repeat a task.", keyConcepts: "A `for` loop combines initialization, condition, and update into one line.", codeExample: "for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}", breakdown: { "Initialization": "`int i = 0;` runs once at the beginning.", "Condition": "`i < 5;` is checked *before* each iteration.", "Update": "`i++` runs *after* each iteration." }, extraTip: "`for` loops are the most common type of loop in Java. Master them and you'll be a pro!", quiz: [{ question: "How many times will this loop run? `for (int i = 1; i <= 3; i++)`", options: ["2", "3", "4"], correctAnswerIndex: 1, explanation: "It will run for `i=1`, `i=2`, and `i=3`. When `i` becomes 4, the condition `4 <= 3` is false, and the loop stops. That's 3 times." }] } },
        "3.3": { levelId: "3.3", title: "Boss: The Ancient Forge", instructions: "Craft 3 swords. For each sword, strike the anvil 2 times. Print a data string for the final result: `swords_crafted:3,strikes_per_sword:2`.", solution: "swords_crafted:3,strikes_per_sword:2", xpReward: 120, initialCode: "public class Main {\n    public static void main(String[] args) {\n        // Use nested loops to simulate crafting\n        // Finally, print the data string\n    }\n}", badge: { name: "Master Smith", icon: "🏆", description: "Conquered the Looping Lake." }, simulationType: "Forge", tutorial: { goal: "Learn how to place one loop inside another (nested loops) to solve complex problems.", keyConcepts: "The outer loop controls the rows. The inner loop controls the columns.", codeExample: "for (int i = 0; i < 2; i++) { // Outer\n  for (int j = 0; j < 3; j++) { // Inner\n    System.out.print(\"*\");\n  }\n  System.out.println();\n}", breakdown: { "Outer Loop": "Controls how many times the entire inner process repeats.", "Inner Loop": "For each single run of the outer loop, the inner loop runs completely.", "Println vs Print": "`print()` prints without a new line, while `println()` adds a new line after printing." }, extraTip: "Nested loops are fundamental for working with 2D data, like grids, tables, or pixels in an image.", quiz: [{ question: "If the outer loop runs 4 times and the inner loop runs 5 times, how many total times does the inner loop's code execute?", options: ["9", "20", "4"], correctAnswerIndex: 1, explanation: "The inner loop's code will run 5 times for each of the 4 iterations of the outer loop, so 4 * 5 = 20 times." }] } },
    }
  },
  "4": {
    worldId: 4, title: "The Fortress of Functions", description: "Build reusable magic spells (methods).", icon: "🧱",
    levels: {
        "4.1": { levelId: "4.1", title: "Defining Methods", instructions: "Create a method `castBarrier()` that prints \"Barrier cast!\". Call it from `main`.", solution: "Barrier cast!", xpReward: 50, initialCode: "public class Main {\n    // Define castBarrier() here\n\n    public static void main(String[] args) {\n        // Call the method\n    }\n}", badge: { name: "Spell Caster", icon: "🪄", description: "Defined a method." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to create and use methods to organize your code into reusable blocks.", keyConcepts: "A method is a named block of code. You 'define' it once and 'call' it whenever you need it.", codeExample: "public class Main {\n  public static void myMethod() {\n    System.out.println(\"Called!\");\n  }\n  public static void main(String[] args) {\n    myMethod();\n  }\n}", breakdown: { "Method Definition": "`public static void myMethod() { ... }` defines the method.", "Method Call": "`myMethod();` inside `main` executes the code within the `myMethod` block." }, extraTip: "Methods keep your `main` method clean and readable.", quiz: [{ question: "What does the keyword `void` mean in a method definition?", options: ["It returns a value", "It returns nothing"], correctAnswerIndex: 1, explanation: "`void` explicitly tells Java that this method will not send back any data when it's done." }] } },
        "4.2": { levelId: "4.2", title: "Parameters & Return", instructions: "Create a method `empower(int powerLevel)` that returns the level multiplied by 2. Call it with `25` and print the result.", solution: "50", xpReward: 60, initialCode: "public class Main {\n    // Define empower() here\n\n    public static void main(String[] args) {\n        // Call empower and print the result\n    }\n}", badge: { name: "Code Alchemist", icon: "🧪", description: "Used parameters and return." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to pass data into methods using parameters and get data back using return types.", keyConcepts: "Parameters are variables in the method signature. The `return` keyword sends a value back.", codeExample: "public class Main {\n  public static int square(int x) {\n    return x * x;\n  }\n  public static void main(String[] args) {\n    System.out.println(square(5));\n  }\n}", breakdown: { "Parameters": "`int x` is a parameter. When we call `square(5)`, the value `5` is passed into `x`.", "Return Type": "`public static int...` The `int` before the method name is the return type, a promise of what data type will be sent back.", "Return Statement": "`return x * x;` calculates the value and sends it back to where the method was called." }, extraTip: "Once a `return` statement is executed, the method immediately stops.", quiz: [{ question: "A method is defined as `public static String greet(String name)`. What is its return type?", options: ["void", "String", "greet"], correctAnswerIndex: 1, explanation: "The return type is the data type specified right before the method name." }] } },
        "4.3": { levelId: "4.3", title: "Boss: The Interactive Potion Brewer", instructions: "Create the logic for a potion brewer. Create a `PotionBrewer` class with a method `mix(String ingredient1, String ingredient2)` that returns a new potion name.", initialCode: "class PotionBrewer {\n    public String mix(String ingredient1, String ingredient2) {\n        if (ingredient1.equals(\"Stardust\") && ingredient2.equals(\"River Water\")) {\n            return \"Elixir of Clarity\";\n        } else if (ingredient1.equals(\"Ginseng\") && ingredient2.equals(\"Moonpetal\")) {\n            return \"Lunar Vigor\";\n        }\n        return \"Murky Water\";\n    }\n}\n\npublic class Main { \n    public static void main(String[] args) {\n        PotionBrewer brewer = new PotionBrewer();\n        System.out.println(brewer.mix(\"Ginseng\", \"Moonpetal\"));\n    }\n}", solution: "Lunar Vigor", xpReward: 150, badge: { name: "Master Architect", icon: "🏆", description: "Built an interactive potion brewer." }, simulationType: "InteractivePotionBrewer", tutorial: { goal: "Build a class with logic that can be tested by an interactive UI.", keyConcepts: "Your Java class will act as the 'brain' for the simulation. The methods you write will be called based on user interaction.", codeExample: "class Greeter { public String sayHello(String name) { return \"Hello, \" + name; } }", breakdown: { "The Class": "`PotionBrewer` encapsulates the logic for mixing.", "The Method": "The `mix` method takes inputs and returns a result, which is perfect for an interactive system." }, extraTip: "This is how real applications work! The user interface (frontend) calls logic (backend) to get results.", quiz: [{ question: "Why is it good to put the `mix` logic in its own class?", options: ["It's required by Java", "It organizes the code and makes it reusable"], correctAnswerIndex: 1, explanation: "Separating logic into classes makes code cleaner and easier to test and reuse." }] } },
    }
  },
  "5": {
    worldId: 5, title: "The Object-Oriented Oasis", description: "Bring your own creations to life.", icon: "📦",
    levels: {
        "5.1": { levelId: "5.1", title: "Classes & Objects", instructions: "Define a `Golem` class with a `stomp()` method that prints \"Thump!\". In `main`, create a new `Golem` object and call `stomp()`.", solution: "Thump!", xpReward: 70, initialCode: "class Golem {\n    // Add stomp() method here\n}\n\npublic class Main { public static void main(String[] args) {\n // Create and use your Golem here \n} }", badge: { name: "Creator", icon: "✨", description: "Brought an object to life." }, simulationType: "GenericSuccess", tutorial: { goal: "Understand classes as blueprints and objects as instances.", keyConcepts: "A `class` is a template. An `object` is a real instance created from that template.", codeExample: "class Car {\n  void start() { System.out.println(\"Started!\"); }\n}\n// In main:\nCar myCar = new Car();\nmyCar.start();", breakdown: { "Class Definition": "`class Car { ... }` defines the blueprint.", "Object Creation": "`Car myCar = new Car();` creates an actual `Car` object in memory.", "Calling a Method": "`myCar.start();` uses the dot `.` to access and run a method on that specific object." }, extraTip: "You can create many objects from one class, just like you can build many houses from one blueprint.", quiz: [{ question: "In `Dog fido = new Dog();`, what is `fido`?", options: ["A class", "A method", "An object"], correctAnswerIndex: 2, explanation: "`fido` is the name of the variable that holds the new `Dog` object." }] } },
        "5.2": { levelId: "5.2", title: "Constructors", instructions: "Create a `Warrior` class with a `name` field and a constructor to set it. In `main`, create a warrior named \"Rudo\" and print their name.", solution: "Rudo", xpReward: 75, initialCode: "class Warrior {\n    String name;\n    // Add your constructor here\n}\n\npublic class Main { public static void main(String[] args) { Warrior w = new Warrior(\"Rudo\"); System.out.println(w.name); } }", badge: { name: "Object Constructor", icon: "👷", description: "Used a constructor." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to use constructors, special methods called when an object is created.", keyConcepts: "A constructor has the same name as the class and no return type. It's used to set initial values for fields.", codeExample: "class Person {\n  String name;\n  public Person(String n) { name = n; }\n}\n// In main:\nPerson p = new Person(\"David\");", breakdown: { "The Constructor": "`public Person(String n)` is the constructor. It runs when you type `new Person(...)`.", "Initialization": "`name = n;` takes the value passed in and assigns it to the `name` field of the object.", "Fields": "`String name;` is a field. Each `Person` object gets its own copy of this variable." }, extraTip: "If you don't create a constructor, Java provides a default, empty one for you.", quiz: [{ question: "What is the primary purpose of a constructor?", options: ["To destroy an object", "To initialize a new object"], correctAnswerIndex: 1, explanation: "Constructors are used to set the initial state of an object by assigning values to its fields." }] } },
        "5.3": { levelId: "5.3", title: "Boss: The Creature Customizer", instructions: "Build the blueprint for our menagerie's creatures. Create a `Creature` class with a constructor that accepts a name, color, and leg count, and a method `getDescription()` that returns a descriptive string.", initialCode: "class Creature {\n    String name;\n    String color;\n    int legs;\n\n    public Creature(String n, String c, int l) {\n        name = n;\n        color = c;\n        legs = l;\n    }\n\n    public String getDescription() {\n        return \"This is \" + name + \", a \" + color + \" creature with \" + legs + \" legs.\";\n    }\n}\n\npublic class Main { public static void main(String[] args) { Creature c = new Creature(\"Gloop\", \"purple\", 6); System.out.println(c.getDescription()); } }", solution: "This is Gloop, a purple creature with 6 legs.", xpReward: 160, badge: { name: "Oasis Biologist", icon: "🏆", description: "Designed an interactive creature customizer." }, simulationType: "InteractiveCreatureCustomizer", tutorial: { goal: "Build a class with fields, a constructor, and a method that will power an interactive UI.", keyConcepts: "Your class will act as a 'model' for the data. The simulation will create objects of your class and call your methods.", codeExample: "class Pet { String name; public Pet(String n) { name = n; } public String speak() { return \"I am \" + name; } }", breakdown: { "The Blueprint": "Your `Creature` class defines what a creature IS.", "The Constructor": "The constructor allows the UI to create new creatures with different properties.", "The Method": "The `getDescription()` method provides the text that the UI will display." }, extraTip: "This separation of data (the class) and presentation (the UI) is a fundamental concept in software engineering.", quiz: [{ question: "Why is it useful for `getDescription()` to be a method in the `Creature` class?", options: ["It's the only place it can be", "It keeps the logic related to the creature's data together with the data itself"], correctAnswerIndex: 1, explanation: "This is a key principle of encapsulation: bundling an object's data and the methods that operate on that data together." }] } },
    }
  },
  "6": {
    worldId: 6, title: "The Inheritance Island", description: "Explore the family trees of code.", icon: "🧬",
    levels: {
        "6.1": { levelId: "6.1", title: "Inheritance", instructions: "Create a `Mage` class that `extends` the `Character` class. Call the inherited `cast()` method on a new `Mage` object.", solution: "Spell cast!", xpReward: 80, initialCode: "class Character { public void cast() { System.out.println(\"Spell cast!\"); } }\n\nclass Mage extends Character {}\n\npublic class Main { public static void main(String[] args) { Mage m = new Mage(); m.cast(); } }", badge: { name: "Heir of the Code", icon: "👑", description: "Mastered inheritance." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to create a new class based on an existing one (inheritance).", keyConcepts: "The `extends` keyword creates a parent-child relationship. The child class inherits fields and methods from the parent.", codeExample: "class Vehicle { void move() { /*...*/ } }\nclass Car extends Vehicle { /* Car can now use move() */ }", breakdown: { "Inheritance": "`class Car extends Vehicle` makes `Car` a child of `Vehicle`. `Car` automatically gets the `move()` method." }, extraTip: "Inheritance promotes code reuse and creates logical hierarchies.", quiz: [{ question: "What keyword is used to make one class inherit from another?", options: ["implements", "inherits", "extends"], correctAnswerIndex: 2, explanation: "The `extends` keyword establishes an inheritance relationship." }] } },
        "6.2": { levelId: "6.2", title: "Method Overriding", instructions: "A `Mage` should cast a specific spell. Override the `cast()` method in your `Mage` class to print \"Fireball!\" instead of the generic spell.", solution: "Fireball!", xpReward: 85, initialCode: "class Character { public void cast() { System.out.println(\"Spell cast!\"); } }\nclass Mage extends Character { \n    // Override the cast() method here\n}\n\npublic class Main { public static void main(String[] args) { Mage m = new Mage(); m.cast(); } }", badge: { name: "Re-Animator", icon: "🔄", description: "Mastered overriding." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to change the behavior of an inherited method.", keyConcepts: "Overriding is when a child class provides its own version of a parent's method. Use the `@Override` annotation.", codeExample: "class Vehicle { void move() { System.out.println(\"Vehicle moves\"); } }\nclass Car extends Vehicle { @Override void move() { System.out.println(\"Car drives\"); } }", breakdown: { "Method Overriding": "By redefining `move()` in the `Car` class, we replace the parent's behavior.", "The `@Override` Annotation": "This is optional but recommended. It tells the compiler you intend to override a method and gives an error if you make a typo." }, extraTip: "Overriding allows for more specific behaviors in child classes.", quiz: [{ question: "What does the `@Override` annotation do?", options: ["It's just a comment", "It tells the compiler to check for a valid override"], correctAnswerIndex: 1, explanation: "It's a way to ensure you are correctly overriding a method from the parent class." }] } },
        "6.3": { levelId: "6.3", title: "Boss: Polymorphism", instructions: "An array of `Character`s contains a `Warrior` and a `Mage`. Loop through them and call `attack()` on each. The Warrior should \"Swing sword!\" and the Mage should \"Cast fireball!\".", solution: "Swing sword!\nCast fireball!", xpReward: 150, initialCode: "abstract class Character { abstract void attack(); }\nclass Warrior extends Character { @Override public void attack() { System.out.println(\"Swing sword!\"); } }\nclass Mage extends Character { @Override public void attack() { System.out.println(\"Cast fireball!\"); } }\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = { new Warrior(), new Mage() };\n        // Loop through the party and call attack() on each character\n    }\n}", badge: { name: "Polymorph Prime", icon: "🏆", description: "Conquered Inheritance Island." }, simulationType: "CharacterBattle", tutorial: { goal: "Understand polymorphism, the ability for an object to take on many forms.", keyConcepts: "You can treat a child class object as its parent class type. Java will call the correct overridden method at runtime.", codeExample: "Character myChar = new Mage();\nmyChar.attack(); // This will call the Mage's attack method", breakdown: { "The Concept": "Polymorphism means 'many forms'. An `Character` variable can hold a `Mage` or a `Warrior` object.", "Dynamic Method Dispatch": "Java is smart enough to know it's *actually* a `Mage` at runtime, so it calls the `Mage`'s version of `attack()`." }, extraTip: "Polymorphism is one of the most powerful concepts in OOP, allowing for incredible flexibility.", quiz: [{ question: "If `Character c = new Warrior();`, what will `c.attack()` do?", options: ["Call Character's attack", "Call Warrior's attack"], correctAnswerIndex: 1, explanation: "Because of polymorphism, Java calls the overridden method in the actual object's class (`Warrior`)." }] } },
    }
  },
  "7": {
    worldId: 7, title: "The Cleanup Canyon", description: "Defend your code from chaos.", icon: "🧹",
    levels: {
        "7.1": { levelId: "7.1", title: "Try-Catch Blocks", instructions: "The code tries to divide by zero. Wrap it in a `try-catch` block to catch the `ArithmeticException` and print \"Cannot divide by zero!\".", solution: "Cannot divide by zero!", xpReward: 90, initialCode: "public class Main {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n            System.out.println(result);\n        } catch (ArithmeticException e) {\n            // Print the error message\n        }\n    }\n}", badge: { name: "Exception Defender", icon: "🛡️", description: "Handled an exception." }, simulationType: "GenericSuccess", tutorial: { goal: "Learn how to handle unexpected errors (exceptions) without crashing your program.", keyConcepts: "You put 'risky' code in the `try` block. If an error occurs, the `catch` block is executed.", codeExample: "try {\n  int[] arr = {1};\n  System.out.println(arr[5]);\n} catch (Exception e) {\n  System.out.println(\"Oops!\");\n}", breakdown: { "The `try` Block": "This is where you place code that might cause an error.", "The `catch` Block": "`catch (Exception e)` - If an error occurs in the `try` block, the program jumps here instead of crashing." }, extraTip: "You can have multiple `catch` blocks to handle different types of specific exceptions.", quiz: [{ question: "If no error occurs in a `try` block, what happens to the `catch` block?", options: ["It runs anyway", "It is skipped"], correctAnswerIndex: 1, explanation: "The `catch` block is completely skipped if the `try` block executes without any exceptions." }] } },
        "7.2": { levelId: "7.2", title: "Boss: Data Rescue", instructions: "The code tries to convert corrupted text (\"abc\") to a number. Catch the `NumberFormatException` and print \"Data rescued!\" as a confirmation.", solution: "Data rescued!", xpReward: 160, initialCode: "public class Main {\n    public static void main(String[] args) {\n        String corruptedData = \"abc\";\n        try {\n            int value = Integer.parseInt(corruptedData);\n        } catch (NumberFormatException e) {\n            // Print the rescue message\n        }\n    }\n}", badge: { name: "Data Rescuer", icon: "🏆", description: "Conquered the Cleanup Canyon." }, simulationType: "DataRescue", tutorial: { goal: "Apply exception handling to a real-world problem: validating user input.", keyConcepts: "`Integer.parseInt()` converts a String to an int, but throws a `NumberFormatException` if the string isn't a valid number.", codeExample: "String input = \"123\";\ntry {\n  int age = Integer.parseInt(input);\n} catch (NumberFormatException e) {\n  System.out.println(\"Invalid number!\");\n}", breakdown: { "Parsing Strings": "`Integer.parseInt(text)` is a common way to convert text input into a number.", "Specific Exceptions": "Catching `NumberFormatException` is more specific than a generic `Exception`. It's good practice to catch the most specific exception you can." }, extraTip: "The `finally` block is an optional part of a try-catch that runs whether an exception occurred or not, often used for cleanup.", quiz: [{ question: "What will `Integer.parseInt(\"5\")` return?", options: ["\"5\"", "5", "Error"], correctAnswerIndex: 1, explanation: "It will successfully parse the string and return the integer value 5." }] } },
    }
  },
  "8": {
    worldId: 8, title: "The Wisdom Mountains", description: "Prove your mastery.", icon: "🧠",
    levels: {
        "8.1": { levelId: "8.1", title: "Code Debugging", instructions: "This code is broken! Fix the case-sensitivity, missing semicolon, and data type to make it print \"Java is fun\".", solution: "Java is fun", xpReward: 180, initialCode: "public class Main {\n    public static void main(String[] args) {\n        string Message = \"Java is fun\"\n        system.out.printline(message);\n    }\n}", badge: { name: "Bug Squasher", icon: "🐞", description: "Debugged a program." }, simulationType: "GenericSuccess", tutorial: { goal: "Practice debugging by identifying and fixing multiple common errors.", keyConcepts: "Debugging involves carefully reading code, identifying errors in syntax and logic, and applying your knowledge to fix them.", codeExample: "Remember common mistakes: case sensitivity (`System`), data types (`String`), missing semicolons, and method typos (`println`).", breakdown: { "Analyze First": "Don't just change things randomly. Read the code and identify potential problems.", "One Fix at a Time": "Fix one error, then re-read. Sometimes one fix can reveal another problem." }, extraTip: "Real-world programmers spend more time debugging than writing new code. Mastering this skill is incredibly important!", quiz: [{ question: "What is the first step in debugging?", options: ["Randomly change code", "Carefully read the code and error messages"], correctAnswerIndex: 1, explanation: "The most important first step is to carefully read and understand the problem before making any changes." }] } },
        "8.2": { levelId: "8.2", title: "Boss: The Final Project", instructions: "Create a `Player` class with `name` and `score`. Create a method to increase the score. In `main`, create a player, increase their score by 50, and print the score.", solution: "50", xpReward: 250, initialCode: "class Player {\n    // Add fields, a constructor, and a method to increase score\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1. Create a Player object named \"Hero\" with an initial score of 0\n        // 2. Call the method to increase the score by 50\n        // 3. Print the player's final score\n    }\n}", badge: { name: "Java Sage", icon: "🌟", description: "Completed the final challenge!" }, simulationType: "FinalProject", tutorial: { goal: "Combine classes, objects, methods, and variables to build a complete mini-program.", keyConcepts: "Class definition, object instantiation, method calls, and printing variables.", codeExample: "You've learned all the pieces! Think back to the Object-Oriented Oasis and the Fortress of Functions to assemble your solution.", breakdown: { "Your Class": "The `Player` class needs fields for `name` and `score`.", "Your Constructor": "Create a constructor that sets the initial name and score.", "Your Method": "Create a method like `increaseScore(int amount)` that adds the `amount` to the player's `score`." }, extraTip: "Congratulations! This project proves you have a solid understanding of Java fundamentals.", quiz: [{ question: "Which concept is NOT required for this final challenge?", options: ["Classes", "Methods", "Loops"], correctAnswerIndex: 2, explanation: "This specific challenge can be solved without needing to use a `for` or `while` loop." }] } },
    }
  }
};

// ==================================================================================
// --- THE SCRIPT TO UPLOAD THE DATA ---
// ==================================================================================
async function seedDatabase() {
    console.log("Starting to seed database...");
    const batch = db.batch();
    for (const worldId in gameData) {
        const world = gameData[worldId];
        const worldRef = db.collection('worlds').doc(worldId);
        batch.set(worldRef, {
            worldId: parseInt(world.worldId),
            title: world.title,
            description: world.description,
            icon: world.icon
        });
        console.log(`- Queued World ${worldId} for creation.`);
        for (const levelId in world.levels) {
            const level = world.levels[levelId];
            if (!level.tutorial) {
                level.tutorial = { goal: "Challenge level - apply your knowledge!" };
            }
            const levelRef = worldRef.collection('levels').doc(levelId);
            batch.set(levelRef, level);
            console.log(`  - Queued Level ${levelId} for World ${worldId}.`);
        }
    }
    try {
        await batch.commit();
        console.log("✅ Database seeding complete! All data has been uploaded.");
    } catch (error) {
        console.error("❌ Error committing batch:", error);
    }
}

seedDatabase();