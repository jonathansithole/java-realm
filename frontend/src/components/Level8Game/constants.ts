import { LevelData } from './types.ts';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Syntax Fix",
    scenario: "The main power panel is sparking! The energy variables aren't terminating correctly.",
    machineName: "Power Panel Alpha",
    brokenCode: `int energy = 100
int loss = 10;
energy = energy - loss`,
    correctCode: `int energy = 100;
int loss = 10;
energy = energy - loss;`,
    validationKeywords: [";", "energy"],
    hint: "Look at the end of the first line. In Java, every statement must end with a semicolon."
  },
  {
    id: 2,
    title: "Object Initialization",
    scenario: "DEBUG-BOT is frozen! The object instantiation is missing the constructor call.",
    machineName: "Bot Motor Controller",
    brokenCode: `Robot r;
r.move();`,
    correctCode: `Robot r = new Robot();
r.move();`,
    validationKeywords: ["new", "Robot()"],
    hint: "You declared variable 'r', but you didn't create the object. Use the 'new' keyword to instantiate it."
  },
  {
    id: 3,
    title: "Logic Correction",
    scenario: "The blast door is jammed. The conditional statement has a syntax error that breaks the logic.",
    machineName: "Blast Door Mechanism",
    brokenCode: `int requiredPower = 50;
if(power > requiredPower); {
    door.open();
}`,
    correctCode: `int requiredPower = 50;
if(power > requiredPower) {
    door.open();
}`,
    validationKeywords: ["if", "{", "}"],
    hint: "There shouldn't be a semicolon immediately after an 'if' condition parentheses. It terminates the logic too early."
  },
  {
    id: 4,
    title: "Variable Scope",
    scenario: "The energy display is reading zero. The variable is being redeclared inside the function scope.",
    machineName: "Energy Monitor",
    brokenCode: `void drainEnergy() {
    int energy = 100;
    energy -= 20;
}
System.out.println(energy);`,
    correctCode: `int energy = 100;
void drainEnergy() {
    energy -= 20;
}
System.out.println(energy);`,
    validationKeywords: ["int energy", "void drainEnergy"],
    hint: "The 'energy' variable is defined inside the function, so it doesn't exist outside. Move the declaration to the global scope (top)."
  },
  {
    id: 5,
    title: "System Integration",
    scenario: "The Dungeon Core is unstable! Assemble the complete program to stabilize the facility.",
    machineName: "Dungeon Core Mainframe",
    brokenCode: `class Door {
    String color
    void open()
        System.out.println("Door opens!");
}

class Robot {
    void move() 
        System.out.println("Robot moves");
}

Door d = Door();
Robot r = new Robot();
d.open();
r.move();`,
    correctCode: `class Door {
    String color;
    void open() {
        System.out.println("Door opens!");
    }
}

class Robot {
    void move() {
        System.out.println("Robot moves");
    }
}

Door d = new Door();
Robot r = new Robot();
d.open();
r.move();`,
    validationKeywords: ["class", "new Door()", "{", "}", ";"],
    hint: "Check for missing semicolons, missing curly braces {} around method bodies, and ensure you use 'new' when creating the Door object."
  }
];