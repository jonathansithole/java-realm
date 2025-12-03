import { Level, ChallengeType } from './types.ts';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Safe Division Generator",
    type: ChallengeType.ARITHMETIC,
    story: "The power generator divides raw energy inputs. Currently, a zero input is causing catastrophic sparks.",
    description: "Wrap the risky division operation in a try-catch block to handle ArithmeticException.",
    brokenLine: "int output = energy / divisor;",
    expectedException: ["ArithmeticException"],
    initialCode: `public void generatePower(int energy, int divisor) {
    // TODO: Prevent the generator from crashing when divisor is 0
    
    int output = energy / divisor;
    System.out.println("Power generated: " + output);

}`,
    validationRegex: [
      /try\s*\{/s,
      /catch\s*\(\s*ArithmeticException\s+\w+\s*\)\s*\{/s
    ],
    hint: "Use 'try' before the code that might fail, and 'catch(ArithmeticException e)' to handle the error safely."
  },
  {
    id: 2,
    title: "The Null Bridge",
    type: ChallengeType.NULL_POINTER,
    story: "The bridge actuator system is attempting to activate a mechanism that might not exist yet.",
    description: "Handle the potential NullPointerException when accessing the bridge actuator.",
    brokenLine: "bridge.activate();",
    expectedException: ["NullPointerException"],
    initialCode: `public void crossBridge(BridgeActuator bridge) {
    // TODO: Safely attempt to activate the bridge
    
    bridge.activate();
    System.out.println("Bridge status: Active");

}`,
    validationRegex: [
      /try\s*\{/s,
      /catch\s*\(\s*NullPointerException\s+\w+\s*\)\s*\{/s
    ],
    hint: "The object 'bridge' might be null. Catch the 'NullPointerException' to prevent a crash."
  },
  {
    id: 3,
    title: "Array Alignment",
    type: ChallengeType.ARRAY_INDEX,
    story: "We are trying to access device #5, but the array might be smaller than that.",
    description: "Prevent the ArrayIndexOutOfBoundsException.",
    brokenLine: "System.out.println(devices[5].status());",
    expectedException: ["ArrayIndexOutOfBoundsException"],
    initialCode: `public void checkDevice(Device[] devices) {
    // TODO: Safely check device status at index 5
    
    System.out.println(devices[5].status());

}`,
    validationRegex: [
      /try\s*\{/s,
      /catch\s*\(\s*ArrayIndexOutOfBoundsException\s+\w+\s*\)\s*\{/s
    ],
    hint: "Accessing index 5 is risky. Catch 'ArrayIndexOutOfBoundsException'."
  },
  {
    id: 4,
    title: "The Observatory Console",
    type: ChallengeType.MULTIPLE,
    story: "This console is old. It might fail due to math errors OR missing components. It also needs to reset every time.",
    description: "Handle both exceptions and add a finally block to reset the console.",
    brokenLine: "Multiple risky operations...",
    expectedException: ["ArithmeticException", "NullPointerException"],
    initialCode: `public void operateConsole(int energy, int divisor) {
    // TODO: Handle ArithmeticException AND NullPointerException
    // TODO: Ensure resetConsole() always runs
    
    int x = energy / divisor;
    bridge.activate();

    // Tip: Add finally block here
}`,
    validationRegex: [
      /try\s*\{/s,
      /catch\s*\(\s*ArithmeticException\s+\w+\s*\)/s,
      /catch\s*\(\s*NullPointerException\s+\w+\s*\)/s,
      /finally\s*\{/s,
      /resetConsole\(\)/s
    ],
    hint: "You need two catch blocks and one finally block. The finally block executes regardless of errors."
  },
  {
    id: 5,
    title: "Polymorphic Stabilizer",
    type: ChallengeType.POLYMORPHIC,
    story: "The core stabilizer throws various sub-types of MachineException (PowerException, SensorException).",
    description: "Catch the parent MachineException to handle all possible specific errors at once.",
    brokenLine: "powerModule.run();",
    expectedException: ["MachineException"],
    initialCode: `public void stabilizeFortress() {
    // TODO: Catch the parent MachineException to handle all sub-types
    
    powerModule.run(); // May throw PowerException or SensorException

}`,
    validationRegex: [
      /try\s*\{/s,
      /catch\s*\(\s*MachineException\s+\w+\s*\)\s*\{/s
    ],
    hint: "Polymorphism allows you to catch the parent class 'MachineException' to handle any of its children."
  }
];

export const STABILITY_DATA_INIT = [
  { name: 'Lvl 1', stability: 20 },
  { name: 'Lvl 2', stability: 35 },
  { name: 'Lvl 3', stability: 45 },
  { name: 'Lvl 4', stability: 60 },
  { name: 'Lvl 5', stability: 80 },
  { name: 'Final', stability: 100 },
];