<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Bookmark } from '../../../src/interfaces/state';
import type { ToWebviewMessage } from '../../../src/interfaces/messages';
import vscode from '../vscode';

const bookmarks = ref<Bookmark[]>([]);
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedBookmark = ref<Bookmark | null>(null);

function handleAddBookmark() {
  vscode.postMessage({ type: 'addBookmark' });
}

function showContextMenu(event: MouseEvent, bookmark: Bookmark) {
  event.preventDefault();
  event.stopPropagation();
  
  // Calculate position with boundary checking
  const menuWidth = 220;
  const menuHeight = 180;
  let x = event.clientX;
  let y = event.clientY;
  
  // Check right boundary
  if (x + menuWidth > window.innerWidth) {
    x = window.innerWidth - menuWidth - 5;
  }
  
  // Check bottom boundary
  if (y + menuHeight > window.innerHeight) {
    y = window.innerHeight - menuHeight - 5;
  }
  
  // Ensure minimum position
  x = Math.max(5, x);
  y = Math.max(5, y);
  
  contextMenuPosition.value = { x, y };
  selectedBookmark.value = bookmark;
  contextMenuVisible.value = true;
}

function closeContextMenu() {
  contextMenuVisible.value = false;
  selectedBookmark.value = null;
}

function openInNewWindow() {
  if (selectedBookmark.value) {
    vscode.postMessage({ type: 'openFolderNewWindow', path: selectedBookmark.value.path });
    closeContextMenu();
  }
}

function openInCurrentWindow() {
  if (selectedBookmark.value) {
    vscode.postMessage({ type: 'openFolderCurrentWindow', path: selectedBookmark.value.path });
    closeContextMenu();
  }
}

function openTerminalWithCli() {
  if (selectedBookmark.value) {
    vscode.postMessage({ type: 'openTerminalWithCli', path: selectedBookmark.value.path });
    closeContextMenu();
  }
}

function removeWorkspace() {
  if (selectedBookmark.value) {
    vscode.postMessage({ type: 'removeBookmark', path: selectedBookmark.value.path });
    closeContextMenu();
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu') && !target.closest('.list-item')) {
    closeContextMenu();
  }
}

onMounted(() => {
  window.addEventListener('message', (event: MessageEvent<ToWebviewMessage>) => {
    if (event.data.bookmarks !== undefined) {
      bookmarks.value = event.data.bookmarks;
    }
  });
  
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="section" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
    <div class="section-header">
      <h2>Workspace Manager</h2>
      <div class="section-actions">
        <button @click="handleAddBookmark" class="btn-small">+</button>
      </div>
    </div>

    <div v-if="bookmarks.length === 0" class="empty-state">
      <p>No workspaces yet</p>
    </div>

    <div v-else class="list-container">
      <div 
        v-for="bookmark in bookmarks" 
        :key="bookmark.addedAt" 
        class="list-item"
        @click="showContextMenu($event, bookmark)"
        @contextmenu="showContextMenu($event, bookmark)"
      >
        <div class="list-item-title">{{ bookmark.name }}</div>
      </div>
    </div>

    <!-- Context Menu -->
    <div 
      v-if="contextMenuVisible" 
      class="context-menu"
      :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
    >
      <div class="context-menu-item" @click="openInNewWindow">
        <span class="codicon codicon-window"></span>
        <span>Open in New Window</span>
      </div>
      <div class="context-menu-item" @click="openInCurrentWindow">
        <span class="codicon codicon-replace"></span>
        <span>Open in Current Window</span>
      </div>
      <div class="context-menu-item" @click="openTerminalWithCli">
        <span class="codicon codicon-terminal"></span>
        <span>Open Terminal with CLI</span>
      </div>
      <div class="context-menu-separator"></div>
      <div class="context-menu-item context-menu-item-danger" @click="removeWorkspace">
        <span class="codicon codicon-trash"></span>
        <span>Remove from Workspace Manager</span>
      </div>
    </div>
  </div>
</template>
