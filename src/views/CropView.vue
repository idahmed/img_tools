<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import CompareSlider from '@/components/CompareSlider.vue'
import CrossToolLinks from '@/components/CrossToolLinks.vue'
import DropZone from '@/components/DropZone.vue'
import PreviewPane from '@/components/PreviewPane.vue'
import QueueBar from '@/components/QueueBar.vue'
import ResultBar from '@/components/ResultBar.vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { useImageSource } from '@/composables/useImageSource'
import {
  canvasToBlob,
  cropImage,
  downloadBlob,
  exportTypeFor,
  extFor,
  formatBytes,
} from '@/lib/image'

const {
  items,
  current,
  source,
  error,
  addFiles,
  setDraft,
  clearDraft,
  select,
  removeCurrent,
  clear,
} = useImageSource()

const left = ref(0)
const top = ref(0)
const right = ref(0)
const bottom = ref(0)
const aspect = ref('free')
const busy = ref(false)
const status = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const resultBlob = ref(null)
const outLabel = ref('')

let alive = true
let timer

const originalMeta = computed(() => {
  if (!source.value) return ''
  return `${source.value.width}×${source.value.height} · ${formatBytes(source.value.size)}`
})

const resultMeta = computed(() => {
  if (!resultUrl.value) return ''
  return `${outLabel.value} · ${formatBytes(resultSize.value)}`
})

const seoPoints = [
  'Crop by trimming edges — keep what matters.',
  'Use aspect presets for square, 4:3, or 16:9 frames.',
  'Everything runs locally in your browser.',
]

watch(source, () => {
  left.value = 0
  top.value = 0
  right.value = 0
  bottom.value = 0
  aspect.value = 'free'
})

watch([source, left, top, right, bottom, aspect], () => {
  clearTimeout(timer)
  if (!source.value) {
    revokeResult()
    return
  }
  timer = setTimeout(updatePreview, 160)
})

onUnmounted(() => {
  alive = false
  clearTimeout(timer)
  revokeResult()
})

function revokeResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  resultBlob.value = null
  outLabel.value = ''
  clearDraft()
}

function cropBox(item) {
  const leftPct = Math.min(left.value, 90)
  const topPct = Math.min(top.value, 90)
  const rightPct = Math.min(right.value, 90 - leftPct)
  const bottomPct = Math.min(bottom.value, 90 - topPct)

  let x = Math.round((leftPct / 100) * item.width)
  let y = Math.round((topPct / 100) * item.height)
  let width = Math.max(1, Math.round(item.width * (1 - (leftPct + rightPct) / 100)))
  let height = Math.max(1, Math.round(item.height * (1 - (topPct + bottomPct) / 100)))

  if (aspect.value !== 'free') {
    const ratio = aspect.value === '1:1' ? 1 : aspect.value === '4:3' ? 4 / 3 : 16 / 9
    const currentRatio = width / height
    if (currentRatio > ratio) {
      const next = Math.max(1, Math.round(height * ratio))
      x += Math.floor((width - next) / 2)
      width = next
    } else {
      const next = Math.max(1, Math.round(width / ratio))
      y += Math.floor((height - next) / 2)
      height = next
    }
  }

  return { x, y, width, height }
}

async function updatePreview() {
  if (!source.value) return
  busy.value = true
  status.value = ''
  try {
    const box = cropBox(source.value)
    const canvas = cropImage(source.value, box)
    const type = exportTypeFor(source.value)
    const blob = await canvasToBlob(canvas, type, 0.92)
    if (!alive) return
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultBlob.value = blob
    resultUrl.value = URL.createObjectURL(blob)
    resultSize.value = blob.size
    outLabel.value = `${canvas.width}×${canvas.height}`
    setDraft(blob, source.value.name)
  } catch {
    if (!alive) return
    revokeResult()
    status.value = 'Could not crop image.'
  } finally {
    if (alive) busy.value = false
  }
}

async function download() {
  if (!source.value) return
  busy.value = true
  try {
    const type = exportTypeFor(source.value)
    const blob = resultBlob.value
      || (await canvasToBlob(cropImage(source.value, cropBox(source.value)), type, 0.92))
    downloadBlob(blob, `${source.value.name}-crop.${extFor(type)}`)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Crop</h2>
      <p>Trim edges and lock a common aspect ratio.</p>
    </header>

    <DropZone v-if="!source" @files="addFiles" />

    <div v-else class="workspace">
      <QueueBar
        :items="items"
        :current="current"
        @select="select"
        @remove="removeCurrent"
      />

      <CompareSlider
        v-if="resultUrl"
        :before-url="source.url"
        :after-url="resultUrl"
      />
      <div v-else class="previews">
        <PreviewPane title="Original" :url="source.url" :meta="originalMeta" />
        <PreviewPane title="Result" empty="Processing…" />
      </div>
      <p class="meta-line">{{ originalMeta }} → {{ resultMeta || '…' }}</p>

      <div class="controls">
        <div class="chips">
          <button type="button" class="chip" :class="{ active: aspect === 'free' }" @click="aspect = 'free'">
            Free
          </button>
          <button type="button" class="chip" :class="{ active: aspect === '1:1' }" @click="aspect = '1:1'">
            1:1
          </button>
          <button type="button" class="chip" :class="{ active: aspect === '4:3' }" @click="aspect = '4:3'">
            4:3
          </button>
          <button type="button" class="chip" :class="{ active: aspect === '16:9' }" @click="aspect = '16:9'">
            16:9
          </button>
        </div>

        <div class="row">
          <label class="field">
            <span>Left · {{ left }}%</span>
            <input v-model.number="left" type="range" min="0" max="45" step="1">
          </label>
          <label class="field">
            <span>Right · {{ right }}%</span>
            <input v-model.number="right" type="range" min="0" max="45" step="1">
          </label>
        </div>
        <div class="row">
          <label class="field">
            <span>Top · {{ top }}%</span>
            <input v-model.number="top" type="range" min="0" max="45" step="1">
          </label>
          <label class="field">
            <span>Bottom · {{ bottom }}%</span>
            <input v-model.number="bottom" type="range" min="0" max="45" step="1">
          </label>
        </div>

        <ResultBar :busy="busy" @download="download" @clear="clear" />
        <CrossToolLinks />
        <p v-if="status" class="status">{{ status }}</p>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <SeoBlurb title="Crop images online" :points="seoPoints" />
  </section>
</template>
