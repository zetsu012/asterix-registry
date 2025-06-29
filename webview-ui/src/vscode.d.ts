import type { FromWebviewMessage, ToWebviewMessage } from '../../../src/interfaces/messages';

declare global {
  // Interface for the VS Code webview API
  interface WebviewApi<T> {
    postMessage(message: FromWebviewMessage): void;
    onDidReceiveMessage(callback: (message: ToWebviewMessage) => void): void;
    getState(): unknown;
    setState(newState: unknown): void;
  }

  function acquireVsCodeApi(): WebviewApi<unknown>;
}

export {};
