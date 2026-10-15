import { computed, ref } from 'vue'
import { loadImage, releaseImage } from '@/lib/image'

const items = ref([])
const current = ref(0)
const error = ref('')

const source = computed(() => items.value[current.value] || null)
const count = computed(() => items.value.length)

export function useImageSource() {
  async function addFiles(fileList) {
    error.value = ''
    const files = [...fileList].filter((file) => file.type.startsWith('image/'))
    if (!files.length) {
      error.value = 'Please choose valid image files.'
      return
    }

    try {
      const loaded = await Promise.all(files.map((file) => loadImage(file)))
      const start = items.value.length
      items.value = [...items.value, ...loaded]
      current.value = start
    } catch {
      error.value = 'Could not read one of the images.'
    }
  }

  async function replaceFile(file) {
    error.value = ''
    if (!file || !file.type.startsWith('image/')) {
      error.value = 'Please choose a valid image file.'
      return
    }
    try {
      const loaded = await loadImage(file)
      const next = [...items.value]
      if (next[current.value]) releaseImage(next[current.value])
      if (next.length) {
        next[current.value] = loaded
        items.value = next
      } else {
        items.value = [loaded]
        current.value = 0
      }
    } catch {
      error.value = 'Could not read that image.'
    }
  }

  function select(index) {
    if (index >= 0 && index < items.value.length) current.value = index
  }

  function removeCurrent() {
    const next = [...items.value]
    const [removed] = next.splice(current.value, 1)
    if (removed) releaseImage(removed)
    items.value = next
    current.value = Math.max(0, Math.min(current.value, next.length - 1))
  }

  function clear() {
    items.value.forEach((item) => releaseImage(item))
    items.value = []
    current.value = 0
    error.value = ''
  }

  return {
    items,
    current,
    source,
    count,
    error,
    addFiles,
    replaceFile,
    select,
    removeCurrent,
    clear,
  }
}
