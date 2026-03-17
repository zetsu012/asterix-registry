/**
 * Bookmark for a repository folder
 */
export interface Bookmark {
  path: string;     // absolute folder path
  name: string;     // display name (basename of path)
  addedAt: number;  // timestamp when added
}

/**
 * Interface representing the extension's global state
 */
export interface ExtensionState {
  bookmarks: Bookmark[];
}

/**
 * Default state values
 */
export const DEFAULT_STATE: ExtensionState = {
  bookmarks: []
};
