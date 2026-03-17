import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExtensionState, DEFAULT_STATE, Bookmark } from '../interfaces/state';

export class StateManager {
  private bookmarkFilePath: string;

  constructor() {
    const configDir = path.join(os.homedir(), '.athena-config');
    this.bookmarkFilePath = path.join(configDir, 'bookmark-file.json');
    this.ensureConfigDir();
  }

  /**
   * Ensure config directory exists
   */
  private ensureConfigDir(): void {
    const configDir = path.dirname(this.bookmarkFilePath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
  }

  /**
   * Load bookmarks from file
   */
  loadBookmarks(): Bookmark[] {
    try {
      if (fs.existsSync(this.bookmarkFilePath)) {
        const data = fs.readFileSync(this.bookmarkFilePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
    return DEFAULT_STATE.bookmarks;
  }

  /**
   * Save bookmarks to file
   */
  async saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
      this.ensureConfigDir();
      fs.writeFileSync(this.bookmarkFilePath, JSON.stringify(bookmarks, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      throw error;
    }
  }
}
