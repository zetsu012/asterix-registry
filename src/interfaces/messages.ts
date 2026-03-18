import type { Bookmark } from './state';

// Message from webview to extension
export type FromWebviewMessage =
  | { type: 'addBookmark' }
  | { type: 'openFolderNewWindow'; path: string }
  | { type: 'openFolderCurrentWindow'; path: string }
  | { type: 'openTerminalWithCli'; path: string }
  | { type: 'removeBookmark'; path: string };

// Message from extension to webview
export interface ToWebviewMessage {
  bookmarks?: Bookmark[];
}
