import * as vscode from 'vscode';
import { ExtensionState, DEFAULT_STATE } from '../interfaces/state';

export class StateManager {
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Load state from storage
   */
  loadState(): ExtensionState {
    return {
      clickCount: this.context.globalState.get<number>('clickCount', DEFAULT_STATE.clickCount)
    };
  }

  /**
   * Save state to storage
   */
  async saveState(state: ExtensionState): Promise<void> {
    await this.context.globalState.update('clickCount', state.clickCount);
  }

  /**
   * Reset state to defaults
   */
  async resetState(): Promise<void> {
    await this.saveState(DEFAULT_STATE);
  }
}
