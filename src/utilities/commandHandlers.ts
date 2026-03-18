import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import { StateManager } from '../services/stateManager';
import { Bookmark } from '../interfaces/state';

interface WorkspaceQuickPickItem extends vscode.QuickPickItem {
  bookmark: Bookmark;
}

type WorkspaceAction = 'open' | 'new-window' | 'terminal';

/**
 * Shows a Quick Pick menu with all workspaces and executes the specified action
 */
export async function showWorkspaceQuickPick(
  stateManager: StateManager,
  action: WorkspaceAction
): Promise<void> {
  // Load bookmarks
  const bookmarks = stateManager.loadBookmarks();

  // Check if empty
  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage(
      'No workspaces in Workspace Manager. Add one from the sidebar!'
    );
    return;
  }

  // Sort alphabetically
  const sortedBookmarks = sortBookmarksAlphabetically(bookmarks);

  // Create Quick Pick items
  const quickPickItems = createQuickPickItems(sortedBookmarks);

  // Determine placeholder based on action
  const placeholder = getPlaceholderForAction(action);

  // Show Quick Pick
  const selected = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: placeholder,
    matchOnDescription: true,
    matchOnDetail: false,
    ignoreFocusOut: false
  });

  // Handle cancellation
  if (!selected) {
    return;
  }

  // Execute action
  await executeWorkspaceAction(selected.bookmark, action);
}

/**
 * Sorts bookmarks alphabetically by name (case-insensitive)
 */
function sortBookmarksAlphabetically(bookmarks: Bookmark[]): Bookmark[] {
  return [...bookmarks].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}

/**
 * Creates Quick Pick items from bookmarks
 */
function createQuickPickItems(bookmarks: Bookmark[]): WorkspaceQuickPickItem[] {
  return bookmarks.map(bookmark => ({
    label: bookmark.name,
    description: bookmark.path,
    bookmark: bookmark
  }));
}

/**
 * Gets the appropriate placeholder text for the action
 */
function getPlaceholderForAction(action: WorkspaceAction): string {
  switch (action) {
    case 'open':
      return 'Select a workspace to open in current window';
    case 'new-window':
      return 'Select a workspace to open in new window';
    case 'terminal':
      return 'Select a workspace to open terminal with CLI';
    default:
      return 'Select a workspace';
  }
}

/**
 * Executes the specified action on the selected workspace
 */
async function executeWorkspaceAction(
  bookmark: Bookmark,
  action: WorkspaceAction
): Promise<void> {
  try {
    switch (action) {
      case 'open':
        await openWorkspaceInCurrentWindow(bookmark.path);
        break;
      case 'new-window':
        await openWorkspaceInNewWindow(bookmark.path);
        break;
      case 'terminal':
        await openTerminalWithCli(bookmark.path);
        break;
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to execute action: ${error}`);
  }
}

/**
 * Opens workspace in current window
 */
async function openWorkspaceInCurrentWindow(workspacePath: string): Promise<void> {
  const uri = vscode.Uri.file(workspacePath);
  await vscode.commands.executeCommand('vscode.openFolder', uri, false);
}

/**
 * Opens workspace in new window
 */
async function openWorkspaceInNewWindow(workspacePath: string): Promise<void> {
  const uri = vscode.Uri.file(workspacePath);
  await vscode.commands.executeCommand('vscode.openFolder', uri, true);
}

/**
 * Opens external terminal with acli in workspace directory
 */
async function openTerminalWithCli(workspacePath: string): Promise<void> {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows: Use cmd or Windows Terminal
    spawn('cmd', ['/c', 'start', 'cmd', '/k', `cd /d "${workspacePath}" && acli`], {
      detached: true,
      shell: true
    });
  } else if (platform === 'darwin') {
    // macOS: Use Terminal.app
    const script = `tell application "Terminal" to do script "cd '${workspacePath.replace(/'/g, "'\\''")}' && acli"`;
    spawn('osascript', ['-e', script], {
      detached: true
    });
  } else {
    // Linux: Try common terminal emulators
    const terminals = ['x-terminal-emulator', 'gnome-terminal', 'konsole', 'xterm'];
    let launched = false;

    for (const term of terminals) {
      try {
        if (term === 'gnome-terminal') {
          spawn(term, ['--', 'bash', '-c', `cd "${workspacePath}" && acli; exec bash`], {
            detached: true,
            stdio: 'ignore'
          });
        } else if (term === 'konsole') {
          spawn(term, ['--workdir', workspacePath, '-e', 'bash', '-c', 'acli; exec bash'], {
            detached: true,
            stdio: 'ignore'
          });
        } else {
          spawn(term, ['-e', `bash -c "cd '${workspacePath}' && acli; exec bash"`], {
            detached: true,
            stdio: 'ignore'
          });
        }
        launched = true;
        break;
      } catch {
        continue;
      }
    }

    if (!launched) {
      vscode.window.showErrorMessage(
        'Could not find a terminal emulator. Please install gnome-terminal, konsole, or xterm.'
      );
    }
  }
}
