import { computed, ref } from 'vue'
import { loadImage, releaseImage } from '@/lib/image'

const MAX_HISTORY = 20

const items = ref([])
const current = ref(0)
const error = ref('')
const draft = ref(null)
const history = ref([])

const source = computed(() => items.value[current.value] || null)
const count = computed(() => items.value.length)
const canUndo = computed(() => history.value.length > 0)

export function useImageSource() {
  function clearHistory() {
    history.value.forEach((item) => releaseImage(item))
    history.value = []
  }

  function pushHistory(item) {
    if (!item) return
    const next = [...history.value, item]
    while (next.length > MAX_HISTORY) {
      releaseImage(next.shift())
    }
    history.value = next
  }

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
      clearDraft()
      clearHistory()
    } catch {
      error.value = 'Could not read one of the images.'
    }
  }

  async function replaceFile(file, { remember = false } = {}) {
    error.value = ''
    if (!file || !file.type.startsWith('image/')) {
      error.value = 'Please choose a valid image file.'
      return
    }
    try {
      const loaded = await loadImage(file)
      const next = [...items.value]
      const prev = next[current.value]
      if (remember && prev) pushHistory(prev)
      else if (prev) releaseImage(prev)

      if (next.length) {
        next[current.value] = loaded
        items.value = next
      } else {
        items.value = [loaded]
        current.value = 0
      }
      clearDraft()
    } catch {
      error.value = 'Could not read that image.'
    }
  }

  async function replaceWithBlob(blob, name = 'image', { remember = true } = {}) {
    if (!blob?.type?.startsWith('image/')) return
    const ext = blob.type.includes('png')
      ? 'png'
      : blob.type.includes('webp')
        ? 'webp'
        : blob.type.includes('avif')
          ? 'avif'
          : 'jpg'
    await replaceFile(new File([blob], `${name}.${ext}`, { type: blob.type }), { remember })
  }

  function setDraft(blob, name = 'image') {
    draft.value = blob ? { blob, name } : null
  }

  function clearDraft() {
    draft.value = null
  }

  async function commitDraft() {
    const pending = draft.value
    if (!pending) return
    draft.value = null
    await replaceWithBlob(pending.blob, pending.name, { remember: true })
  }

  function undo() {
    const prev = history.value[history.value.length - 1]
    if (!prev) return
    history.value = history.value.slice(0, -1)
    clearDraft()

    const next = [...items.value]
    const currentItem = next[current.value]
    if (currentItem) releaseImage(currentItem)

    if (next.length) {
      next[current.value] = prev
      items.value = next
    } else {
      items.value = [prev]
      current.value = 0
    }
  }

  function select(index) {
    if (index >= 0 && index < items.value.length) {
      current.value = index
      clearDraft()
      clearHistory()
    }
  }

  function removeCurrent() {
    const next = [...items.value]
    const [removed] = next.splice(current.value, 1)
    if (removed) releaseImage(removed)
    items.value = next
    current.value = Math.max(0, Math.min(current.value, next.length - 1))
    clearDraft()
    clearHistory()
  }

  function clear() {
    items.value.forEach((item) => releaseImage(item))
    items.value = []
    current.value = 0
    error.value = ''
    clearDraft()
    clearHistory()
  }

  return {
    items,
    current,
    source,
    count,
    error,
    canUndo,
    addFiles,
    replaceFile,
    replaceWithBlob,
    setDraft,
    clearDraft,
    commitDraft,
    undo,
    select,
    removeCurrent,
    clear,
  }
}
