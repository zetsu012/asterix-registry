import * as vscode from 'vscode';

export type EditorType = 'vscode' | 'vscode-insiders' | 'cursor' | 'windsurf' | 'vscodium' | 'unknown';

export interface EditorInfo {
  type: EditorType;
  appName: string;
  uriScheme: string;
  cliCommand: string;
  displayName: string;
}

/**
 * Detects which VS Code fork/variant is currently running
 */
export function detectEditor(): EditorInfo {
  const appName = vscode.env.appName;
  const uriScheme = vscode.env.uriScheme;
  
  // Cursor detection
  if (appName.toLowerCase().includes('cursor') || uriScheme === 'cursor') {
    return {
      type: 'cursor',
      appName,
      uriScheme,
      cliCommand: 'cursor',
      displayName: 'Cursor'
    };
  }
  
  // Windsurf detection
  if (appName.toLowerCase().includes('windsurf') || uriScheme === 'windsurf') {
    return {
      type: 'windsurf',
      appName,
      uriScheme,
      cliCommand: 'windsurf',
      displayName: 'Windsurf'
    };
  }
  
  // VSCodium detection
  if (appName.toLowerCase().includes('vscodium') || uriScheme === 'vscodium') {
    return {
      type: 'vscodium',
      appName,
      uriScheme,
      cliCommand: 'codium',
      displayName: 'VSCodium'
    };
  }
  
  // VS Code Insiders detection
  if (appName.includes('Insiders') || uriScheme === 'vscode-insiders') {
    return {
      type: 'vscode-insiders',
      appName,
      uriScheme,
      cliCommand: 'code-insiders',
      displayName: 'VS Code Insiders'
    };
  }
  
  // Standard VS Code
  if (appName.includes('Visual Studio Code') || uriScheme === 'vscode') {
    return {
      type: 'vscode',
      appName,
      uriScheme,
      cliCommand: 'code',
      displayName: 'Visual Studio Code'
    };
  }
  
  // Unknown fork - fallback to default
  return {
    type: 'unknown',
    appName,
    uriScheme,
    cliCommand: 'code',
    displayName: appName
  };
}

/**
 * Gets the CLI command for the current editor
 */
export function getEditorCliCommand(): string {
  return detectEditor().cliCommand;
}
