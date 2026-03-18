import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import { FromWebviewMessage, ToWebviewMessage } from '../interfaces/messages';
import { Bookmark } from '../interfaces/state';
import { StateManager } from './stateManager';
import { detectEditor } from '../utilities/editorDetection';

export class MessageHandler {
  private bookmarks: Bookmark[];
  private stateManager: StateManager;

  constructor(private readonly webview: vscode.Webview) {
    this.stateManager = new StateManager();
    this.bookmarks = this.stateManager.loadBookmarks();
    this.sendToWebview({ bookmarks: this.bookmarks });
  }

  async handleMessage(message: FromWebviewMessage): Promise<void> {
    switch (message.type) {
      case 'addBookmark':
        const uris = await vscode.window.showOpenDialog({
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: false,
          openLabel: 'Add Bookmark'
        });
        if (!uris || uris.length === 0) {
          break; // user cancelled
        }
        const folderPath = uris[0].fsPath;
        const bookmark: Bookmark = {
          path: folderPath,
          name: path.basename(folderPath),
          addedAt: Date.now()
        };
        this.bookmarks = [bookmark, ...this.bookmarks]; // prepend for most recent first
        await this.stateManager.saveBookmarks(this.bookmarks);
        this.sendToWebview({ bookmarks: this.bookmarks });
        break;

      case 'openFolderNewWindow':
        try {
          const uri = vscode.Uri.file(message.path);
          await vscode.commands.executeCommand('vscode.openFolder', uri, true);
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to open folder in new window: ${error}`);
        }
        break;

      case 'openFolderCurrentWindow':
        try {
          const uri = vscode.Uri.file(message.path);
          await vscode.commands.executeCommand('vscode.openFolder', uri, false);
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to open folder in current window: ${error}`);
        }
        break;

      case 'openTerminalWithCli':
        try {
          // Determine the platform and open external terminal with acli
          const platform = process.platform;
          
          if (platform === 'win32') {
            // Windows: Use cmd or Windows Terminal
            spawn('cmd', ['/c', 'start', 'cmd', '/k', `cd /d "${message.path}" && acli`], {
              detached: true,
              shell: true
            });
          } else if (platform === 'darwin') {
            // macOS: Use Terminal.app or iTerm2
            const script = `tell application "Terminal" to do script "cd '${message.path.replace(/'/g, "'\\''")}' && acli"`;
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
                  spawn(term, ['--', 'bash', '-c', `cd "${message.path}" && acli; exec bash`], {
                    detached: true,
                    stdio: 'ignore'
                  });
                } else if (term === 'konsole') {
                  spawn(term, ['--workdir', message.path, '-e', 'bash', '-c', 'acli; exec bash'], {
                    detached: true,
                    stdio: 'ignore'
                  });
                } else {
                  spawn(term, ['-e', `bash -c "cd '${message.path}' && acli; exec bash"`], {
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
              vscode.window.showErrorMessage('Could not find a terminal emulator. Please install gnome-terminal, konsole, or xterm.');
            }
          }
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to open external terminal: ${error}`);
        }
        break;

      case 'removeBookmark':
        try {
          this.bookmarks = this.bookmarks.filter(b => b.path !== message.path);
          await this.stateManager.saveBookmarks(this.bookmarks);
          this.sendToWebview({ bookmarks: this.bookmarks });
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to remove workspace: ${error}`);
        }
        break;
    }
  }

  private sendToWebview(message: ToWebviewMessage): void {
    this.webview.postMessage(message);
  }
}
