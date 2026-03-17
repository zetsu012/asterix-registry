import * as vscode from 'vscode';
import * as path from 'path';
import { FromWebviewMessage, ToWebviewMessage } from '../interfaces/messages';
import { Bookmark } from '../interfaces/state';
import { StateManager } from './stateManager';

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
    }
  }

  private sendToWebview(message: ToWebviewMessage): void {
    this.webview.postMessage(message);
  }
}
