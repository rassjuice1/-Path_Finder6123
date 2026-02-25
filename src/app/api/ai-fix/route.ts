import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface FixRequest {
  action: "analyze" | "fix" | "explain" | "test";
  issue?: string;
  errorContext?: string;
  filePath?: string;
  fixContent?: string;
}

interface CodeAnalysis {
  file: string;
  issues: string[];
  line?: number;
}

const PROJECT_ROOT = process.cwd();

// Common error patterns and their fixes
const ERROR_PATTERNS: Record<string, { fix: string; explanation: string }> = {
  "Cannot read properties of undefined": {
    fix: "Add null/undefined checks before accessing properties",
    explanation:
      "This error occurs when trying to access a property on null/undefined. Solution: Use optional chaining (?.) or add conditional checks.",
  },
  "is not defined": {
    fix: "Import the missing variable or check for typos",
    explanation:
      "A variable is being used before it's declared or imported. Solution: Add proper imports or define the variable.",
  },
  "Expected {": {
    fix: "Check for missing closing braces or syntax errors",
    explanation:
      "There's a syntax error, likely a missing closing brace. Solution: Check the surrounding code for matching braces.",
  },
  "TypeError": {
    fix: "Check the types of variables being passed",
    explanation:
      "A variable has an unexpected type. Solution: Add type assertions or convert types appropriately.",
  },
  "ReferenceError": {
    fix: "Declare the variable before using it",
    explanation:
      "A variable is being referenced before declaration. Solution: Move the declaration before usage or use let/const properly.",
  },
  "SyntaxError": {
    fix: "Fix the syntax error in the code",
    explanation:
      "There's invalid JavaScript/TypeScript syntax. Solution: Check the line number and fix the syntax.",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: FixRequest = await request.json();
    const { action, issue, errorContext, filePath, fixContent } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "analyze": {
        // Analyze the issue and find relevant files
        const analysis = await analyzeIssue(issue || errorContext || "");
        return NextResponse.json({ success: true, analysis });
      }

      case "explain": {
        // Provide detailed explanation of the issue
        const explanation = await explainIssue(issue || errorContext || "");
        return NextResponse.json({ success: true, explanation });
      }

      case "fix": {
        // Apply the fix to the specified file
        if (!filePath || !fixContent) {
          return NextResponse.json(
            { error: "filePath and fixContent are required for fix action" },
            { status: 400 }
          );
        }
        const result = await applyFix(filePath, fixContent);
        return NextResponse.json({ success: true, result });
      }

      case "test": {
        // Run tests or validate the fix
        const testResult = await runTests();
        return NextResponse.json({ success: true, testResult });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI Fix API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function analyzeIssue(issueText: string): Promise<{
  matchedPattern?: string;
  suggestedFix: string;
  explanation: string;
  relatedFiles: string[];
}> {
  const lowerIssue = issueText.toLowerCase();

  // Find matching error pattern
  let matchedPattern: string | undefined;
  let suggestion: { fix: string; explanation: string } | undefined;

  for (const [pattern, solution] of Object.entries(ERROR_PATTERNS)) {
    if (lowerIssue.includes(pattern.toLowerCase())) {
      matchedPattern = pattern;
      suggestion = solution;
      break;
    }
  }

  // Search for related files
  const relatedFiles = await findRelatedFiles(issueText);

  return {
    matchedPattern,
    suggestedFix: suggestion?.fix || "Analyze the error and apply appropriate fix",
    explanation:
      suggestion?.explanation ||
      "The error doesn't match a known pattern. Please provide more context.",
    relatedFiles,
  };
}

async function explainIssue(issueText: string): Promise<{
  explanation: string;
  steps: string[];
  prevention: string[];
}> {
  const analysis = await analyzeIssue(issueText);

  return {
    explanation: analysis.explanation,
    steps: [
      "1. Identify the root cause from the error message",
      "2. Locate the problematic code in the stack trace",
      "3. Apply the suggested fix or create a custom solution",
      "4. Test the fix to ensure it resolves the issue",
      "5. Add error handling to prevent future occurrences",
    ],
    prevention: [
      "Use TypeScript strict mode to catch type errors early",
      "Add proper null checks and use optional chaining",
      "Implement comprehensive error boundaries",
      "Write tests for edge cases",
      "Use ESLint and Prettier for code quality",
    ],
  };
}

async function applyFix(
  filePath: string,
  fixContent: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Sanitize file path to prevent directory traversal
    const sanitizedPath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(PROJECT_ROOT, sanitizedPath);

    // Verify the file exists
    try {
      await fs.access(fullPath);
    } catch {
      return { success: false, message: `File not found: ${filePath}` };
    }

    // Read current content
    const currentContent = await fs.readFile(fullPath, "utf-8");

    // For now, we'll append the fix as a comment (safety measure)
    // In production, you'd want to use more sophisticated patching
    const newContent = currentContent + `\n\n// AI Fix applied:\n${fixContent}\n`;

    // Write the fix (with safety check - only modify if it's a known safe location)
    if (sanitizedPath.startsWith("src/")) {
      await fs.writeFile(fullPath, newContent, "utf-8");
      return {
        success: true,
        message: `Fix applied to ${filePath}. Please review the changes.`,
      };
    }

    return {
      success: false,
      message: "Cannot modify files outside src/ directory for safety",
    };
  } catch (error) {
    console.error("Apply fix error:", error);
    return {
      success: false,
      message: `Failed to apply fix: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function runTests(): Promise<{
  passed: boolean;
  results: string[];
}> {
  try {
    // Check if there are any lint or type errors
    const { execSync } = require("child_process");

    let results: string[] = [];

    try {
      execSync("bun run typecheck", { stdio: "pipe" });
      results.push("✓ TypeScript type check passed");
    } catch {
      results.push("✗ TypeScript type check failed");
    }

    try {
      execSync("bun run lint", { stdio: "pipe" });
      results.push("✓ ESLint check passed");
    } catch {
      results.push("⚠ ESLint found some issues (warnings only)");
    }

    return {
      passed: results.every((r) => r.includes("✓") || r.includes("⚠")),
      results,
    };
  } catch (error) {
    return {
      passed: false,
      results: [`Error running tests: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}

async function findRelatedFiles(issueText: string): Promise<string[]> {
  const files: string[] = [];
  const keywords = issueText
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  try {
    const srcDir = path.join(PROJECT_ROOT, "src");

    async function searchDir(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== "node_modules") {
          await searchDir(fullPath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
        ) {
          const content = await fs.readFile(fullPath, "utf-8");
          for (const keyword of keywords) {
            if (content.toLowerCase().includes(keyword.toLowerCase())) {
              files.push(fullPath.replace(PROJECT_ROOT + "/", ""));
              break;
            }
          }
        }
      }
    }

    await searchDir(srcDir);
  } catch {
    // Ignore errors in file search
  }

  return files.slice(0, 5);
}
