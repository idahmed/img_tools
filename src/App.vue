<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HubLinks from '@/components/HubLinks.vue'
import { useImageSource } from '@/composables/useImageSource'
import { loadTheme, saveTheme } from '@/lib/prefs'
import { tools } from '@/tools'

const route = useRoute()
const router = useRouter()
const { clear, addFiles, undo, canUndo } = useImageSource()
const theme = ref(loadTheme())
const isDark = computed(() => theme.value === 'dark')
const activePath = computed(() => route.path)

watch(theme, (value) => {
  saveTheme(value)
  document.documentElement.dataset.theme = value
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = value === 'dark' ? '#141414' : '#1c1c1c'
}, { immediate: true })

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function onKeydown(event) {
  const tag = document.activeElement?.tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

  if (event.key.toLowerCase() === 'z' && !event.altKey && !event.shiftKey) {
    if (event.metaKey || event.ctrlKey) event.preventDefault()
    if (canUndo.value) undo()
    return
  }

  if (event.metaKey || event.ctrlKey || event.altKey) return

  const match = tools.find((tool) => tool.shortcut === event.key)
  if (match) router.push(match.path)
  if (event.key === 'o' || event.key === 'O') {
    event.preventDefault()
    document.getElementById('global-open')?.click()
  }
  if (event.key === 'Escape') clear()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="shell">
    <aside class="ad ad-rail" aria-label="Advertisement">
      <div class="ad-slot ad-slot-rail">Ad</div>
    </aside>

    <div class="app">
      <main class="page">
        <header class="brand">
          <button
            type="button"
            class="theme-toggle"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path
                d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <h1>{{ route.meta.title || 'Image tools' }}</h1>
          <HubLinks />
        </header>

        <nav class="tabs" aria-label="Tools">
          <button
            v-for="tool in tools"
            :key="tool.path"
            type="button"
            class="tab"
            :class="{ active: activePath === tool.path }"
            :title="`Shortcut ${tool.shortcut}`"
            @click="router.push(tool.path)"
          >
            {{ tool.label }}
          </button>
        </nav>

        <p class="tips">
          Shortcuts: 1–6 tools · O Open · Z Undo · Esc Clear
        </p>

        <RouterView />
      </main>

      <div class="ad ad-banner" aria-label="Advertisement">
        <div class="ad-slot ad-slot-banner">Ad</div>
      </div>
    </div>

    <aside class="ad ad-rail" aria-label="Advertisement">
      <div class="ad-slot ad-slot-rail">Ad</div>
    </aside>

    <label class="sr-only">
      Open images
      <input
        id="global-open"
        type="file"
        accept="image/*"
        multiple
        @change="(event) => {
          const files = event.target.files
          if (files?.length) addFiles(files)
          event.target.value = ''
        }"
      >
    </label>
  </div>
</template>
