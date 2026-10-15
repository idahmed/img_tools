<script setup>
defineProps({
  busy: { type: Boolean, default: false },
  canCopy: { type: Boolean, default: true },
})

defineEmits(['download', 'copy', 'open', 'replace', 'clear'])
</script>

<template>
  <div class="actions">
    <button type="button" class="btn primary" :disabled="busy" @click="$emit('download')">
      Download
    </button>
    <button
      v-if="canCopy"
      type="button"
      class="btn"
      :disabled="busy"
      @click="$emit('copy')"
    >
      Copy
    </button>
    <button type="button" class="btn" :disabled="busy" @click="$emit('open')">
      Open
    </button>
    <label class="btn file-btn">
      Replace
      <input
        type="file"
        accept="image/*"
        hidden
        @change="$emit('replace', $event.target.files?.[0]); $event.target.value = ''"
      >
    </label>
    <button type="button" class="btn" @click="$emit('clear')">New</button>
  </div>
</template>
