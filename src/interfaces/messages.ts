import type { Bookmark } from './state';

// Message from webview to extension
export type FromWebviewMessage =
  | { type: 'addBookmark' };

// Message from extension to webview
export interface ToWebviewMessage {
  bookmarks?: Bookmark[];
}
