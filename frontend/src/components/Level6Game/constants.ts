import { Challenge } from './types.ts';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "The Wooden Door",
    description: "Learn basic inheritance by extending the Door class.",
    scenario: "A heavy wooden door blocks your path. It relies on the base Door mechanism but needs a specific implementation to open.",
    task: "Create a class `WoodenDoor` that extends `Door`. Override the `open()` method to print 'Wooden door creaks open.'",
    starterCode: `class Door {
    void open() { System.out.println("The door opens."); }
}

// Write your WoodenDoor class here
`,
    expectedBehavior: "The door should rotate open with a creaking sound effect.",
    hint: "Use the `extends` keyword and the `@Override` annotation.",
  },
  {
    id: 2,
    title: "The Magic Platform",
    description: "Master method overriding to activate magical properties.",
    scenario: "A floating platform sits dormant. Standard activation is boring; this one needs magic.",
    task: "Create a class `MagicPlatform` that extends `Platform`. Override `activate()` to perform a magical flash.",
    starterCode: `class Platform {
    void activate() { System.out.println("Platform rises slowly."); }
}

class MagicPlatform extends Platform {
    // Override activate() here
}
`,
    expectedBehavior: "The platform should rise glowing with purple magical energy.",
    hint: "Don't forget to keep the method signature exactly the same as the parent.",
  },
  {
    id: 3,
    title: "Polymorphic Interaction",
    description: "Interact with different objects using a common parent reference.",
    scenario: "Two devices stand before you. You must trigger them both using their common interface.",
    task: "Instantiate a `WoodenDoor` and a `MagicPlatform` as `Interactable` objects. Call `interact()` on both.",
    starterCode: `interface Interactable {
    void interact();
}
class WoodenDoor implements Interactable { /* ... */ }
class MagicPlatform implements Interactable { /* ... */ }

public class Level3 {
    public static void main(String[] args) {
        // Create objects using Interactable reference
        Interactable obj1 = 
        Interactable obj2 = 

        // Call interact()
    }
}
`,
    expectedBehavior: "The door opens AND the platform activates sequentially.",
    hint: "Polymorphism allows you to treat children (WoodenDoor) as their parent type (Interactable).",
  },
  {
    id: 4,
    title: "The Multi-Level Elevator",
    description: "Implement a hierarchy of classes for a high-speed elevator.",
    scenario: "The tower is tall. You need a `SpeedElevator` which is a special type of `MagicElevator`.",
    task: "Define `SpeedElevator` extending `MagicElevator`. Override `move()` for faster action.",
    starterCode: `class Elevator { void move() { ... } }
class MagicElevator extends Elevator { 
    @Override void move() { ... } 
}

// Create SpeedElevator here
`,
    expectedBehavior: "The elevator shoots up the shaft at high speed with a trail of light.",
    hint: "Inheritance can be chained: A extends B, B extends C.",
  },
  {
    id: 5,
    title: "The Polymorphic Loop",
    description: "Trigger the Grand Finale using an array of polymorphic objects.",
    scenario: "The final gate requires simultaneous activation of all palace systems.",
    task: "Create an array of `Interactable` devices. Loop through it and call `interact()` on each.",
    starterCode: `Interactable[] devices = { 
    new WoodenDoor(), 
    new MagicPlatform(), 
    new SpeedElevator() 
};

// Write a loop to interact with all devices
`,
    expectedBehavior: "All elements in the palace activate in harmony.",
    hint: "Use a `for-each` loop: `for (Interactable device : devices) { ... }`",
  },
];
