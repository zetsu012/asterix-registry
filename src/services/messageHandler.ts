import * as vscode from 'vscode';
import { FromWebviewMessage, ToWebviewMessage } from '../interfaces/messages';
import { ExtensionState } from '../interfaces/state';
import { StateManager } from './stateManager';

export class MessageHandler {
  private state: ExtensionState;
  private stateManager: StateManager;

  constructor(
    private readonly webview: vscode.Webview,
    private readonly context: vscode.ExtensionContext
  ) {
    this.stateManager = new StateManager(context);
    this.state = this.stateManager.loadState();
    this.sendToWebview({ text: '', clickCount: this.state.clickCount });
  }

  async handleMessage(message: FromWebviewMessage): Promise<void> {
    switch (message.type) {
      case 'letsGo':
        this.state.clickCount++;
        await this.stateManager.saveState(this.state);
        this.sendToWebview({
          text: 'Yes sir!',
          clickCount: this.state.clickCount
        });
        break;

      case 'clear':
        await this.stateManager.resetState();
        this.state = this.stateManager.loadState();
        this.sendToWebview({
          text: '',
          clickCount: this.state.clickCount
        });
        break;
    }
  }

  private sendToWebview(message: ToWebviewMessage): void {
    this.webview.postMessage(message);
  }
}
