import * as vscode from 'vscode';
import { getUri } from './utilities/getUri';
import { MessageHandler } from './services/messageHandler';
import { FromWebviewMessage } from './interfaces/messages';

class HelloWorldViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    // Setup webview
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    // Set webview HTML
    const webviewUri = getUri(webviewView.webview, this._extensionUri, ["webview-ui", "dist"]);
    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" crossorigin href="${webviewUri}/index.css">
          <script type="module" crossorigin src="${webviewUri}/index.js"></script>
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>
    `;

    // Initialize message handler
    const messageHandler = new MessageHandler(webviewView.webview);

    // Handle messages
    webviewView.webview.onDidReceiveMessage(async (message: FromWebviewMessage) => {
      await messageHandler.handleMessage(message);
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new HelloWorldViewProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('dummy-extension-hello-world', provider)
  );
}
