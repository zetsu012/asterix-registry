// Message from webview to extension
export type FromWebviewMessage = 
  | { type: 'letsGo' }
  | { type: 'clear' };

// Message from extension to webview
export interface ToWebviewMessage {
  text: string;
  clickCount?: number;
}
