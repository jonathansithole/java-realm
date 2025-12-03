// src/components/CodeBlock.jsx

import React from 'react';

export default function CodeBlock({ code }) {
  // Replace escaped newlines with actual newlines for display
  const formattedCode = code ? code.replace(/\\n/g, '\n') : '';

  return (
    <pre className="bg-white-900 text-black p-4 rounded-lg border border-orange-700 overflow-x-auto">
      <code>{formattedCode}</code>
    </pre>
  );
}