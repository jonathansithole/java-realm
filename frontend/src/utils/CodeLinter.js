// src/utils/CodeLinter.js

// --- HELPER FUNCTIONS ---

const makeIssue = (code, index, message, severity) => {
  if (index < 0) index = 0;
  const precedingCode = code.substring(0, index);
  const line = (precedingCode.match(/\n/g) || []).length + 1;
  const col = index - precedingCode.lastIndexOf('\n');
  return { line, col, message, severity };
};

const findFirstIndex = (code, regex) => {
  const match = code.match(regex);
  return match ? match.index : -1;
};

// --- MAIN LINTER ---

export const lintCode = (code) => {
  const issues = [];
  const trimmed = code.trim();

  if (!trimmed) {
    issues.push(makeIssue(trimmed, 0, "Your code is empty! Start with the `public class Main { ... }` structure.", 'error'));
    return issues.map(i => i.message);
  }

  // --- PASS 1: Fundamental Structure ---
  if (!/public\s+class\b/.test(trimmed)) {
    issues.push(makeIssue(trimmed, 0, "All Java code must be inside a class. Wrap your code in:\npublic class Main {\n    // ...\n}", 'error'));
  }
  if (/\bpublik\b/i.test(trimmed) || /\bclasz\b/i.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bpublik\b/i) ?? findFirstIndex(trimmed, /\bclasz\b/i);
    issues.push(makeIssue(trimmed, idx, 'Did you mean "public class"? Java keywords must be spelled exactly.', 'error'));
  }
  const openBraces = (trimmed.match(/{/g) || []).length;
  const closeBraces = (trimmed.match(/}/g) || []).length;
  if (openBraces > closeBraces) {
    const idx = trimmed.lastIndexOf('{');
    issues.push(makeIssue(trimmed, idx, "You're missing a closing curly brace `}`. Every `{` must have a matching `}`.", 'error'));
  }
  if (closeBraces > openBraces) {
    const idx = trimmed.lastIndexOf('}');
    issues.push(makeIssue(trimmed, idx, 'You have an extra closing curly brace `}`. Check your code structure.', 'error'));
  }

  // --- PASS 2: Main Method ---
  if (!/\bmain\b/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bpublic\s+class\b/) || 0;
    issues.push(makeIssue(trimmed, idx, "Your program doesn’t have a `main` method. Java needs a starting point: `public static void main(String[] args)`", 'error'));
  } else if (!/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bmain\b/);
    if (!/public\s+static\s+void/.test(trimmed)) {
      issues.push(makeIssue(trimmed, idx, "Almost there! Your main method should start with: `public static void main(...)`", 'error'));
    } else if (!/String\s*\[\s*\]/.test(trimmed)) {
      issues.push(makeIssue(trimmed, idx, "The main method parameter is specific. It should be `String[] args` (don't forget `[]`).", 'error'));
    } else {
      issues.push(makeIssue(trimmed, idx, "Your `main` method signature looks incorrect. Make sure it's exactly: `public static void main(String[] args)`", 'error'));
    }
  }

  // --- PASS 3: Print Statements ---
  if (/system\.out\.println/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /system\.out\.println/);
    issues.push(makeIssue(trimmed, idx, 'Java is case-sensitive. You should use `System.out.println()` with a capital "S".', 'error'));
  }
  if (/System\.out\.printline/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /System\.out\.printline/);
    issues.push(makeIssue(trimmed, idx, 'Did you mean `System.out.println()`? The method is `println`, not `printline`.', 'error'));
  }
  const printlnLineMatch = trimmed.split('\n').find(l => l.trim().startsWith('System.out.println'));
  if (printlnLineMatch && !printlnLineMatch.trim().endsWith(';')) {
    const idx = trimmed.indexOf(printlnLineMatch);
    issues.push(makeIssue(trimmed, idx, "Java statements must end with a semicolon `;`. Try:\n`System.out.println(\"Hello\");`", 'error'));
  }
  if (/System\.out\.println\s*\('([^']*)'\)/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /System\.out\.println\s*\('([^']*)'\)/);
    issues.push(makeIssue(trimmed, idx, "In Java, use double quotes `\"\"` for Strings. Single quotes `''` are for single characters.", 'warning'));
  }

  // --- PASS 5: Common Keyword Typos ---
  if (/\bstrng\b/i.test(trimmed) || /\bStirng\b/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bstrng\b|\bStirng\b/i);
    issues.push(makeIssue(trimmed, idx, "Did you mean `String`? Java is case-sensitive.", 'error'));
  }
  if (/\bscnner\b/i.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bscnner\b/i);
    issues.push(makeIssue(trimmed, idx, "Did you mean `Scanner`?", 'error'));
  }

  // --- PASS 6: Scanner & Input Issues ---
  if (/new\s+Scanner\s*\(/.test(trimmed) && !/import\s+java\.util\.Scanner\s*;/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /new\s+Scanner\s*\(/);
    issues.push(makeIssue(trimmed, idx, "You're using `Scanner` but forgot to import it. Add `import java.util.Scanner;` at the top.", 'error'));
  }
  if (/Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;/.test(trimmed) && !/\w+\.close\s*\(\s*\)\s*;/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /new\s+Scanner\s*\(\s*System\.in\s*\)/);
    issues.push(makeIssue(trimmed, idx, "Remember to close your Scanner with `scanner.close();` when you're done.", 'warning'));
  }

  // --- PASS 7: Class Name ---
  const classNameMatch = trimmed.match(/public\s+class\s+([A-Za-z_]\w*)/);
  if (classNameMatch) {
    const className = classNameMatch[1];
    if (className !== 'Main') {
      const idx = trimmed.indexOf(className);
      issues.push(makeIssue(trimmed, idx, `Your class is named \`${className}\`. For this exercise, the public class should be named \`Main\`.`, 'warning'));
    }
  }

  // --- PASS 8: Unbalanced Quotes/Parens ---
  if (((trimmed.match(/"/g) || []).length % 2) !== 0) {
    const idx = findFirstIndex(trimmed, /"/);
    issues.push(makeIssue(trimmed, idx, 'Your double quotes are unbalanced. Strings must start and end with `"`.', 'error'));
  }
  if ((trimmed.match(/\(/g) || []).length !== (trimmed.match(/\)/g) || []).length) {
    const idx = findFirstIndex(trimmed, /\(/);
    issues.push(makeIssue(trimmed, idx, 'You have mismatched parentheses `(` and `)`. Make sure they are balanced.', 'error'));
  }

  // --- PASS 13–22: Runtime & OOP checks ---
  if (/(if|while)\s*\([^)]*=[^=][^)]*\)/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /(if|while)\s*\([^)]*=[^=][^)]*\)/);
    issues.push(makeIssue(trimmed, idx, "It looks like you're using a single `=` inside an if/while. Did you mean `==` for comparison?", 'error'));
  }
  if (/while\s*\(\s*true\s*\)\s*{/.test(trimmed) && !/break\s*;/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /while\s*\(\s*true\s*\)\s*{/);
    issues.push(makeIssue(trimmed, idx, "Careful! You wrote a `while(true)` loop without a `break;`. This will run forever.", 'warning'));
  }
  if (/for\s*\(\s*(?:int\s+)?([A-Za-z_]\w*)\s*=\s*\d+;\s*\1\s*<=\s*[A-Za-z_]\w*\.length/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /for\s*\(\s*(?:int\s+)?([A-Za-z_]\w*)\s*=\s*\d+;\s*\1\s*<=\s*[A-Za-z_]\w*\.length/);
    issues.push(makeIssue(trimmed, idx, "Using `<= array.length` will cause an error. Array indices go from 0 to length-1. Use `< array.length` instead.", 'error'));
  }
  if (/if\s*\([^)]*==[^)]*"\w+[^)]*\)/.test(trimmed) || /if\s*\([^)]*"\w+[^)]*==/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /==.*".*"/);
    issues.push(makeIssue(trimmed, idx, "To compare strings for content, use `.equals()`, not `==`. Example: `if (str.equals(\"hello\"))`.", 'warning'));
  }
  if (/\/\s*0\b/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\/\s*0\b/);
    issues.push(makeIssue(trimmed, idx, "You are dividing by zero. This will crash your program with an `ArithmeticException`.", 'error'));
  }
  if (/\bTrue\b|\bFalse\b|\bNull\b/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bTrue\b|\bFalse\b|\bNull\b/);
    issues.push(makeIssue(trimmed, idx, "Java uses all lowercase for its special literal values: `true`, `false`, and `null`.", 'error'));
  }
  if (/public\s+void\s+[A-Z][A-Za-z0-9_]*\s*\(/g.test(trimmed) && classNameMatch) {
    const match = trimmed.match(/public\s+void\s+([A-Z][A-Za-z0-9_]*)\s*\(/);
    if (match && match[1] === classNameMatch[1]) {
      const idx = findFirstIndex(trimmed, /public\s+void\s+[A-Z][A-Za-z0-9_]*\s*\(/);
      issues.push(makeIssue(trimmed, idx, "A constructor should not have a return type, not even `void`. Remove `void` to fix this.", 'error'));
    }
  }
  if (/static\s+void\s+main\s*\([^)]*\)\s*{[^}]*\bthis\b/.test(trimmed)) {
    const idx = findFirstIndex(trimmed, /\bthis\b/);
    issues.push(makeIssue(trimmed, idx, "You cannot use the `this` keyword inside a `static` method like `main`.", 'error'));
  }

  // --- PASS 30+: Incomplete Code ---

  // Incomplete variable declaration
  const incompleteVarRegex = /^\s*(int|double|float|char|byte|short|long|boolean|String)\s*;?\s*$/gm;
  let match;
  while ((match = incompleteVarRegex.exec(trimmed)) !== null) {
    const idx = match.index;
    issues.push(makeIssue(trimmed, idx, 
      "It looks like you started declaring a variable but didn’t finish. Example: `int x = 5;` or `String name;`", 
      'error'
    ));
  }

  // Incomplete method declaration
  const incompleteMethodRegex = /^\s*(public|private|protected)?\s*(static\s+)?(void|int|double|float|char|boolean|String)\s+\w*\s*\(\s*\)\s*$/gm;
  while ((match = incompleteMethodRegex.exec(trimmed)) !== null) {
    const idx = match.index;
    issues.push(makeIssue(trimmed, idx,
      "You started a method declaration but didn’t provide a body `{ ... }`. Example:\n`public void greet() { System.out.println(\"Hi\"); }`",
      'error'
    ));
  }

  // Incomplete class declaration
  const incompleteClassRegex = /^\s*public\s+class\s+\w+\s*$/gm;
  while ((match = incompleteClassRegex.exec(trimmed)) !== null) {
    const idx = match.index;
    issues.push(makeIssue(trimmed, idx,
      "You started a class declaration but didn’t open `{ }`. Example:\n`public class Main { }`",
      'error'
    ));
  }

  // Incomplete control structures
  const incompleteControlRegex = /^\s*(if|for|while|switch)\s*\(.*\)\s*$/gm;
  while ((match = incompleteControlRegex.exec(trimmed)) !== null) {
    const idx = match.index;
    issues.push(makeIssue(trimmed, idx,
      "Looks like you wrote a control structure without a body. Example:\n`if (x > 5) { System.out.println(x); }`",
      'error'
    ));
  }

  // Final output: unique messages only
  const uniqueMessages = [...new Set(issues.map(i => i.message))];
  return uniqueMessages.length > 0 ? uniqueMessages : null;
};
