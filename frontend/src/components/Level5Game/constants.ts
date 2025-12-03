import { Challenge } from './types.ts';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "The Telescope Blueprint",
    description: "Define the blueprint for the Observatory's main telescope.",
    instructions: "Create a class named 'Telescope'. It needs two fields: a String 'model' and an int 'magnification'. Add a constructor to initialize them.",
    initialCode: `// Challenge 1: Define the Telescope class
class Telescope {
    // TODO: Add fields 'model' (String) and 'magnification' (int)
    
    // TODO: Add a constructor to initialize these fields
    
}
`,
    hint: "Remember: A constructor looks like a method but has no return type and matches the class name!",
    successMessage: "Blueprint accepted! The structure is materializing."
  },
  {
    id: 2,
    title: "Powering Up",
    description: "Bring the machine to life by creating an actual Telescope object.",
    instructions: "Inside the main method, create a Telescope object named 't1'. Pass 'StarMaster' as the model and 50 as the magnification. Then call 't1.scan()'. (Assume scan() exists for now).",
    initialCode: `class Telescope {
    String model;
    int magnification;

    Telescope(String model, int magnification) {
        this.model = model;
        this.magnification = magnification;
    }
    
    void scan() {
        System.out.println("Scanning sector...");
    }
}

public class Main {
    public static void main(String[] args) {
        // TODO: Create a Telescope object 't1' with model "StarMaster" and magnification 50
        
        // TODO: Call t1.scan()
        
    }
}`,
    hint: "Use the 'new' keyword to create an object: ClassName varName = new ClassName(...);",
    successMessage: "System Online! The telescope is rotating into position."
  },
  {
    id: 3,
    title: "Default Settings",
    description: "We need a backup telescope that works without specific instructions.",
    instructions: "Add a second constructor to the Telescope class that takes NO parameters. It should set model to 'BasicScope' and magnification to 20.",
    initialCode: `class Telescope {
    String model;
    int magnification;

    Telescope(String model, int magnification) {
        this.model = model;
        this.magnification = magnification;
    }
    
    // TODO: Add a no-argument constructor
    // Set model = "BasicScope" and magnification = 20
    

    void scan() {
        System.out.println(model + " scanning at " + magnification + "x");
    }
}

public class Main {
    public static void main(String[] args) {
        Telescope t1 = new Telescope("StarMaster", 50);
        // We will test your default constructor automatically
        Telescope t2 = new Telescope(); 
        t2.scan();
    }
}`,
    hint: "A no-argument constructor looks like: Telescope() { ... }",
    successMessage: "Redundancy systems active. Secondary platform deployed."
  },
  {
    id: 4,
    title: "Laser Alignment",
    description: "The platforms are too far apart. We need to bridge them with lasers.",
    instructions: "Add a method named 'activateLaser()' to the Telescope class. It should print 'Laser activated!'. Then call it on your 't1' object in main.",
    initialCode: `class Telescope {
    String model;
    int magnification;

    Telescope(String model, int magnification) {
        this.model = model;
        this.magnification = magnification;
    }
    
    Telescope() {
        this.model = "BasicScope";
        this.magnification = 20;
    }

    // TODO: Add void activateLaser() method
    

    void scan() {
        System.out.println("Scanning...");
    }
}

public class Main {
    public static void main(String[] args) {
        Telescope t1 = new Telescope("StarMaster", 50);
        
        // TODO: Call activateLaser() on t1
        
    }
}`,
    hint: "Methods usually specify a return type (like void) and parenthesis.",
    successMessage: "Laser bridge stabilized! Access to the main gate granted."
  },
  {
    id: 5,
    title: "The Grand Opening",
    description: "The giant door requires synchronized activation from two high-powered telescopes.",
    instructions: "Create two Telescope objects: 't1' ('StarMaster', 50) and 't2' ('NightEye', 40). Call 'activateLaser()' on BOTH of them to open the gate.",
    initialCode: `class Telescope {
    String model;
    int magnification;

    Telescope(String model, int magnification) {
        this.model = model;
        this.magnification = magnification;
    }
    
    void activateLaser() {
        System.out.println(model + " laser fired!");
    }
}

public class Main {
    public static void main(String[] args) {
        // TODO: Instantiate t1 ("StarMaster", 50)
        
        // TODO: Instantiate t2 ("NightEye", 40)
        
        // TODO: Activate lasers on both
        
    }
}`,
    hint: "Create two separate variables. Call the method on each one sequentially.",
    successMessage: "SEQUENCE COMPLETE. THE OBSERVATORY IS FULLY OPERATIONAL."
  }
];
