<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const links = computed(() =>
  [
    { path: '/convert', label: 'Convert' },
    { path: '/resize', label: 'Resize' },
    { path: '/enhance', label: 'Enhance' },
  ].filter((item) => item.path !== route.path),
)
</script>

<template>
  <div class="cross">
    <span>Continue with this image</span>
    <div class="cross-actions">
      <button
        v-for="link in links"
        :key="link.path"
        type="button"
        class="chip"
        @click="router.push(link.path)"
      >
        {{ link.label }}
      </button>
    </div>
  </div>
</template>
