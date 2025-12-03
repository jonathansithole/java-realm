import { Puzzle, LoopType } from './types.ts';

export const MAX_TIME_SECONDS = 300;

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: "CHALLENGE 1: Conveyor Floor",
    description: 
      "Goal: Adjust the loop so the explorer crosses the conveyor safely.\n" +
      "The logic is almost correct, but the counter moves in the wrong direction, causing the conveyor to malfunction.",
    loopType: LoopType.FOR,
    visualType: 'conveyor',
    brokenCode: `for(int step = 0; step <= 6; step -= 1) {
  moveForward();
}`,
    solutionRegex: /step\s*\+\+|step\s*=\s*step\s*\+\s*1/,
    hint: "Check whether the loop's counter moves toward or away from the stopping condition."
  },

  {
    id: 2,
    title: "CHALLENGE 2: Pattern Door",
    description: 
      "Goal: Repair the nested loop to generate a growing star pattern.\n" +
      "The inner loop currently works against the outer loop, producing the wrong number of stars.",
    loopType: LoopType.NESTED,
    visualType: 'door',
    brokenCode: `for(int i = 1; i <= 4; i++) {
  for(int j ; j < i; ) {
    print("*");
  }
  println();
}`,
    solutionRegex: /j\s*\+\+|j\s*=\s*j\s*\+\s*1/,
    hint: "Consider the direction the inner counter should move to produce more stars with each new line."
  },

  {
    id: 3,
    title: "CHALLENGE 3: Laser Grid",
    description: 
      "Goal: Ensure the loop properly disables each active laser.\n" +
      "The loop condition is correct, but the body does nothing, so the grid never changes state.",
    loopType: LoopType.WHILE,
    visualType: 'laser',
    brokenCode: `while(grid.isActive()) {
  // TODO
}`,
    solutionRegex: /deactivateGrid\(\)/,
    hint: "Think about what operation needs to happen repeatedly until the condition becomes false. call the function to deactivate the grid."
  },

  {
    id: 4,
    title: "CHALLENGE 4: Loop Bridge",
    description: 
      "Goal: Fix the bridge builder so tiles generate from top to bottom.\n" +
      "The loop's limit and direction conflict with each other, so the bridge never forms.",
    loopType: LoopType.FOR,
    visualType: 'bridge',
    brokenCode: `for(int t = 5;) {
  createTile();
}`,
    solutionRegex: /t\s*--|t\s*=\s*t\s*-\s*1/,
    hint: "Write the condition in the brackets structure: 'for(int t = ; t < ; t = )'"
  },

  {
    id: 5,
    title: "CHALLENGE 5: Loop Synchronizer",
    description:
      "Goal: Stabilize the reactor by generating exactly 10 evenly spaced pulses.\n" +
      "The loop currently jumps in increments that skip over required timings.",
    loopType: LoopType.CONDITION,
    visualType: 'reactor',
    brokenCode: `for(int t = 0; t < 10; t = t + 2) {
  pulseEnergy();
}`,
    solutionRegex: /t\s*\+\+|t\s*\+=\s*1|t\s*=\s*t\s*\+\s*1/,
    hint: "Write the condition that makes the 10 even spaces in the brackets for(int t = ; t < ; t = )"
  }
];
