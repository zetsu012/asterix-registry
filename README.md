# Dummy VSCode Extension

A VSCode extension demonstrating frontend-backend communication and state persistence using Vue.js webview.

## Features

- Bidirectional Communication Example:
  - Frontend: Vue.js webview with "Let's Go" button
  - Backend: VSCode extension handling messages
  - State: Click counter persisted in VSCode storage

## Implementation Details

1. Frontend-Backend Communication:
   - Vue.js webview sends messages to extension
   - Extension processes messages and updates state
   - State changes reflected back in webview UI
   - Type-safe messaging using TypeScript interfaces

2. State Management:
   - Click counter stored in VSCode's global state
   - Persists between extension reloads
   - State management abstracted through StateManager service
   - Type-safe state updates

3. UI Components:
   - Vue.js with TypeScript
   - VSCode theming integration
   - Responsive to state changes
   - Clean component architecture

## Getting Started

1. Install Dependencies:
   ```bash
   npm run install:all
   ```

2. Start Development:
   - Press F5 in VSCode
   - Look for smiley icon in activity bar
   - Click "Let's Go" to test communication

## Building & Packaging

1. Development Build:
   ```bash
   npm run build
   ```

2. Create VSIX:
   ```bash
   npm run package
   ```

## Available Commands

- `npm run install:all` - Install all dependencies
- `npm run build` - Build extension and webview
- `npm run watch` - Development mode with hot reload
- `npm run package` - Create VSIX package

## Architecture Documentation

For detailed information about the codebase architecture, patterns, and guidelines, please refer to the documentation in the `.clinerules` directory.
