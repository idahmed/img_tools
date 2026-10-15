<script setup>
defineProps({
  items: { type: Array, required: true },
  current: { type: Number, required: true },
})

const emit = defineEmits(['select', 'remove'])
</script>

<template>
  <div v-if="items.length > 1" class="queue">
    <button
      v-for="(item, index) in items"
      :key="item.id"
      type="button"
      class="queue-item"
      :class="{ active: index === current }"
      @click="emit('select', index)"
    >
      <img :src="item.url" :alt="item.name">
      <span>{{ index + 1 }}</span>
    </button>
    <button type="button" class="btn ghost" @click="emit('remove')">
      Remove
    </button>
  </div>
</template>
