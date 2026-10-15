<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  beforeUrl: { type: String, required: true },
  afterUrl: { type: String, required: true },
})

const position = ref(50)
const frame = ref(null)
const frameWidth = ref(0)

function measure() {
  frameWidth.value = frame.value?.clientWidth || 0
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
})

onUnmounted(() => {
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <div class="compare">
    <div ref="frame" class="compare-frame">
      <img :src="beforeUrl" alt="Before" class="compare-img">
      <div class="compare-after" :style="{ width: `${position}%` }">
        <img
          :src="afterUrl"
          alt="After"
          class="compare-img"
          :style="{ width: `${frameWidth}px` }"
        >
      </div>
    </div>
    <label class="compare-control">
      <span>Compare</span>
      <input v-model.number="position" type="range" min="0" max="100" step="1">
    </label>
  </div>
</template>
