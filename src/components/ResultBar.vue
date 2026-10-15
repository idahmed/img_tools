<script setup>
import { useImageSource } from '@/composables/useImageSource'

defineProps({
  busy: { type: Boolean, default: false },
})

defineEmits(['download', 'clear'])

const { canUndo, undo } = useImageSource()
</script>

<template>
  <div class="actions">
    <button type="button" class="btn primary" :disabled="busy" @click="$emit('download')">
      Download
    </button>
    <button type="button" class="btn" :disabled="busy || !canUndo" @click="undo">
      Undo
    </button>
    <button type="button" class="btn" @click="$emit('clear')">New</button>
  </div>
</template>
