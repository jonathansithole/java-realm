import Editor from '@monaco-editor/react';
import React, { useState, useEffect } from 'react';
import { lintCode } from '../utils/CodeLinter';

export default function CodeEditor({ code, setCode }) {
  const [errors, setErrors] = useState([]); // ← Fix: define state

  // Lint the code in real-time
  useEffect(() => {
    const linted = lintCode(code) || [];
    setErrors(linted);
  }, [code]);

  return (
    <div className="rounded-lg overflow-hidden border-2 border-orange-700">
      <Editor
        height="350px"
        language="java"
        theme="vs-light"
        value={code}
        onChange={(value) => setCode(value)}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />

      {/* Show errors below the editor */}
      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '8px' }}>
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}
    </div>
  );
}
