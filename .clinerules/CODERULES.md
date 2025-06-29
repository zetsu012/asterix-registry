# Code Architecture Rules

This document defines the architectural rules and organization of the VSCode extension codebase.

## Directory Structure

```
src/
├── interfaces/           # Type definitions and interfaces
│   ├── messages.ts      # Message types for webview communication
│   └── state.ts         # Extension state interface
├── services/            # Business logic and state management
│   ├── messageHandler.ts # Handles webview communication
│   └── stateManager.ts  # Manages extension state
└── utilities/           # Helper functions
    └── getUri.ts        # URI handling for webview resources

webview-ui/             # Vue.js based UI
├── src/
│   ├── components/     # Vue components
│   └── App.vue        # Root Vue component
└── dist/              # Built webview files
```

## Component Responsibilities

### Interfaces

1. `messages.ts`
   - Defines type-safe message formats for webview communication
   - `FromWebviewMessage`: Messages from webview to extension
   - `ToWebviewMessage`: Messages from extension to webview

2. `state.ts`
   - Defines extension's global state interface
   - Provides default state values
   - Single source of truth for state structure

### Services

1. `MessageHandler`
   - Handles all communication between extension and webview
   - Processes incoming messages from webview
   - Updates state through StateManager
   - Sends responses back to webview

2. `StateManager`
   - Manages extension's global state
   - Handles state persistence using VSCode storage
   - Provides methods for loading/saving/resetting state
   - Ensures type safety for state operations

### Utilities

1. `getUri`
   - Handles webview resource URI resolution
   - Ensures proper loading of webview assets

### Webview UI

1. Components follow these rules:
   - One component per file
   - Use TypeScript for type safety
   - Import interfaces from extension
   - Use VSCode theme variables for styling

## Communication Flow

1. Webview to Extension:
   ```typescript
   vscode.postMessage(message: FromWebviewMessage)
   ```

2. Extension to Webview:
   ```typescript
   webview.postMessage(message: ToWebviewMessage)
   ```

## State Management Rules

1. All state changes must go through `StateManager`
2. State interface must be defined in `state.ts`
3. Default values provided for all state properties
4. Use type-safe operations for state updates

## Styling Rules

1. Use VSCode theme variables:
   ```css
   var(--vscode-editor-foreground)
   var(--vscode-button-background)
   ```

2. Follow VSCode's visual language:
   - Button styles
   - Color schemes
   - Typography

## Development Workflow

1. Build System:
   - Uses esbuild for extension
   - Uses Vite for webview
   - Watch mode for development
   - Production builds for packaging

2. VSCode Tasks:
   - `watch`: Main task coordinating all watchers
   - `build:webview`: Builds Vue application
   - `watch:tsc`: TypeScript type checking
   - `watch:esbuild`: Fast bundling with esbuild
   - All tasks configured for background execution
   - Grouped under "watch" presentation

3. Commands:
   - `npm run install:all`: Install all dependencies
   - `npm run build`: Build extension and webview
   - `npm run watch`: Development mode
   - `npm run package`: Create VSIX package

4. Debug Configuration:
   - Launches with preLaunchTask "watch"
   - Coordinates all watch processes
   - Enables breakpoint debugging
   - Hot reload for webview changes
