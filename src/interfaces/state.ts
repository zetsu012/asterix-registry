/**
 * Interface representing the extension's global state
 */
export interface ExtensionState {
  clickCount: number;
}

/**
 * Default state values
 */
export const DEFAULT_STATE: ExtensionState = {
  clickCount: 0
};
