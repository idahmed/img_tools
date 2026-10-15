<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tools } from '@/tools'

const route = useRoute()
const router = useRouter()

const links = computed(() => tools.filter((tool) => tool.path !== route.path))
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
