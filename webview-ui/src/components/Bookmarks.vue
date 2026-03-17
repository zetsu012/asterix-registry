<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Bookmark } from '../../../src/interfaces/state';
import type { ToWebviewMessage } from '../../../src/interfaces/messages';
import vscode from '../vscode';

const bookmarks = ref<Bookmark[]>([]);

function handleAddBookmark() {
  vscode.postMessage({ type: 'addBookmark' });
}

onMounted(() => {
  window.addEventListener('message', (event: MessageEvent<ToWebviewMessage>) => {
    if (event.data.bookmarks !== undefined) {
      bookmarks.value = event.data.bookmarks;
    }
  });
});
</script>

<template>
  <div class="section" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
    <div class="section-header">
      <h2>Bookmarks</h2>
      <div class="section-actions">
        <button @click="handleAddBookmark" class="btn-small">+</button>
      </div>
    </div>

    <div v-if="bookmarks.length === 0" class="empty-state">
      <p>No bookmarks yet</p>
    </div>

    <div v-else class="list-container">
      <div v-for="bookmark in bookmarks" :key="bookmark.addedAt" class="list-item">
        <div class="list-item-title">{{ bookmark.name }}</div>
        <div class="list-item-subtitle">{{ bookmark.path }}</div>
      </div>
    </div>
  </div>
</template>
