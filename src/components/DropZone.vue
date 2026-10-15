<script setup>
import { ref } from 'vue'

defineProps({
  multiple: { type: Boolean, default: true },
})

const emit = defineEmits(['files'])
const dragging = ref(false)

function onFiles(fileList) {
  const files = [...(fileList || [])]
  if (files.length) emit('files', files)
}

function onDrop(event) {
  dragging.value = false
  onFiles(event.dataTransfer?.files)
}
</script>

<template>
  <label
    class="drop"
    :class="{ dragging }"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <input
      type="file"
      accept="image/*"
      :multiple="multiple"
      hidden
      @change="onFiles($event.target.files); $event.target.value = ''"
    >
    <span class="drop-title">Drop images here</span>
    <span class="drop-sub">or click to browse — PNG, JPG, WebP · batch supported</span>
  </label>
</template>
