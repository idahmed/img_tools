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
  copyBlob,
  downloadBlob,
  exportTypeFor,
  extFor,
  formatBytes,
  openBlob,
  watermarkImage,
} from '@/lib/image'

const {
  items,
  current,
  source,
  error,
  addFiles,
  replaceFile,
  select,
  removeCurrent,
  clear,
} = useImageSource()

const text = ref('sessea')
const position = ref('br')
const opacity = ref(0.5)
const scale = ref(0.06)
const busy = ref(false)
const status = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const resultBlob = ref(null)

const originalMeta = computed(() => {
  if (!source.value) return ''
  return `${source.value.width}×${source.value.height} · ${formatBytes(source.value.size)}`
})

const resultMeta = computed(() => {
  if (!resultUrl.value) return ''
  return formatBytes(resultSize.value)
})

const seoPoints = [
  'Add a simple text watermark in the corner or center.',
  'Adjust size and opacity to keep it subtle or bold.',
  'Runs locally — your images never leave this device.',
]

const positions = [
  { id: 'tl', label: 'Top left' },
  { id: 'tr', label: 'Top right' },
  { id: 'bl', label: 'Bottom left' },
  { id: 'br', label: 'Bottom right' },
  { id: 'center', label: 'Center' },
]

let timer

watch([source, text, position, opacity, scale], () => {
  clearTimeout(timer)
  if (!source.value) {
    revokeResult()
    return
  }
  timer = setTimeout(updatePreview, 160)
})

onUnmounted(() => {
  clearTimeout(timer)
  revokeResult()
})

function revokeResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  resultBlob.value = null
}

function buildCanvas(item) {
  return watermarkImage(item, {
    text: text.value,
    position: position.value,
    opacity: opacity.value,
    scale: scale.value,
  })
}

async function updatePreview() {
  if (!source.value) return
  busy.value = true
  status.value = ''
  try {
    const canvas = buildCanvas(source.value)
    const type = exportTypeFor(source.value)
    const blob = await canvasToBlob(canvas, type, 0.92)
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultBlob.value = blob
    resultUrl.value = URL.createObjectURL(blob)
    resultSize.value = blob.size
  } catch {
    revokeResult()
    status.value = 'Could not add watermark.'
  } finally {
    busy.value = false
  }
}

async function download() {
  if (!source.value) return
  busy.value = true
  try {
    const type = exportTypeFor(source.value)
    const blob = resultBlob.value || (await canvasToBlob(buildCanvas(source.value), type, 0.92))
    downloadBlob(blob, `${source.value.name}-mark.${extFor(type)}`)
  } finally {
    busy.value = false
  }
}

async function copy() {
  if (!resultBlob.value) return
  try {
    await copyBlob(resultBlob.value)
    status.value = 'Copied to clipboard.'
  } catch {
    status.value = 'Copy is not supported in this browser.'
  }
}

function openResult() {
  if (resultBlob.value) openBlob(resultBlob.value)
}
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Watermark</h2>
      <p>Stamp simple text on your image.</p>
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
        <label class="field">
          <span>Text</span>
          <input v-model="text" type="text" maxlength="48" placeholder="sessea">
        </label>

        <label class="field">
          <span>Position</span>
          <select v-model="position">
            <option v-for="item in positions" :key="item.id" :value="item.id">
              {{ item.label }}
            </option>
          </select>
        </label>

        <div class="row">
          <label class="field">
            <span>Opacity · {{ Math.round(opacity * 100) }}%</span>
            <input v-model.number="opacity" type="range" min="0.15" max="1" step="0.05">
          </label>
          <label class="field">
            <span>Size · {{ Math.round(scale * 100) }}</span>
            <input v-model.number="scale" type="range" min="0.03" max="0.14" step="0.01">
          </label>
        </div>

        <ResultBar
          :busy="busy"
          @download="download"
          @copy="copy"
          @open="openResult"
          @replace="replaceFile"
          @clear="clear"
        />
        <CrossToolLinks />
        <p v-if="status" class="status">{{ status }}</p>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <SeoBlurb title="Watermark images online" :points="seoPoints" />
  </section>
</template>
