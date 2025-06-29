<script setup lang="ts">
import { ref } from 'vue';
import type { FromWebviewMessage, ToWebviewMessage } from '../../../src/interfaces/messages';

const vscode = acquireVsCodeApi();
const response = ref('');
const clickCount = ref(0);

function handleClick() {
  const message: FromWebviewMessage = {
    type: 'letsGo'
  };
  vscode.postMessage(message);
}

function handleClear() {
  const message: FromWebviewMessage = {
    type: 'clear'
  };
  vscode.postMessage(message);
}

window.addEventListener('message', (event: MessageEvent<ToWebviewMessage>) => {
  response.value = event.data.text;
  if (event.data.clickCount !== undefined) {
    clickCount.value = event.data.clickCount;
  }
});
</script>

<template>
  <div class="hello-container">
    <h1>Hello World</h1>
    <button @click="handleClick">Let's Go</button>
    <p v-if="response" class="response">{{ response }}</p>
    <p v-if="clickCount > 0" class="click-count">You have clicked {{ clickCount }} times</p>
    <button v-if="clickCount > 0" @click="handleClear" class="clear-button">Clear</button>
  </div>
</template>

<style>
.hello-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-size: 1.5em;
  color: var(--vscode-editor-foreground);
}

button {
  width: fit-content;
  padding: 8px 16px;
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  cursor: pointer;
}

button:hover {
  background: var(--vscode-button-hoverBackground);
}

.response {
  color: var(--vscode-editor-foreground);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.click-count {
  color: var(--vscode-editor-foreground);
  margin-bottom: 1rem;
}

.clear-button {
  background-color: var(--vscode-errorForeground);
}

.clear-button:hover {
  background-color: var(--vscode-testing-iconFailed);
}
</style>
