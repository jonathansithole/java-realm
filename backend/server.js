// backend/server.js (Final Version with Robust Error Handling)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// We are no longer using external APIs, so .env and api keys are not needed here.

app.post('/api/run-code', (req, res) => {
  console.log("\n--- [BACKEND] Received request on /api/run-code (Local Execution) ---");
  const { code } = req.body;

  const uniqueDirName = `temp_${uuidv4()}`;
  const tempDir = path.join(__dirname, uniqueDirName);
  const filename = "Main.java";
  const filePath = path.join(tempDir, filename);

  try {
    // Step 1: Create the directory
    fs.mkdirSync(tempDir, { recursive: true });

    // Step 2: Write the .java file
    fs.writeFileSync(filePath, code);

    // Step 3: Compile and run the code
    const command = `javac "${filePath}" && java -cp "${tempDir}" Main`;
    console.log(`[BACKEND] Executing command: ${command}`);

    exec(command, (execError, stdout, stderr) => {
      // Always clean up the temporary directory afterwards
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }

      if (execError) {
        // This will catch compilation errors (from javac) or runtime errors (from java)
        console.error("[BACKEND] Execution or Compilation Error:", stderr || stdout || execError.message);
        // Send a 400 Bad Request status with the error message
        res.status(400).json({ error: (stderr || stdout).replace(new RegExp(filePath, 'g'), 'Main.java') });
        return;
      }
      
      // If there's anything in stderr but no error (e.g., warnings), we can still treat it as a potential issue
      if (stderr) {
          console.warn("[BACKEND] STDERR warning:", stderr);
      }

      // Success! Send the output from stdout.
      console.log("[BACKEND] Execution successful. Output:", stdout.trim());
      res.json({ output: stdout.trim() });
    });
  } catch (error) {
    // This will catch synchronous errors, e.g., if mkdirSync or writeFileSync fails
    console.error("[BACKEND] A synchronous error occurred:", error);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    res.status(500).json({ error: 'A fatal server error occurred during file operations.' });
  }
});

app.listen(port, () => {
    console.log(`✅ Backend server is live on http://localhost:${port}`);
});