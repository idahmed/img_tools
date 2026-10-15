<script setup>
defineProps({
  title: { type: String, default: 'Preview' },
  url: { type: String, default: '' },
  meta: { type: String, default: '' },
  empty: { type: String, default: 'No image yet' },
})
</script>

<template>
  <div class="preview">
    <div class="preview-head">
      <h3>{{ title }}</h3>
      <span v-if="meta">{{ meta }}</span>
    </div>
    <div class="preview-body">
      <img v-if="url" :src="url" alt="Preview">
      <p v-else>{{ empty }}</p>
    </div>
  </div>
</template>
