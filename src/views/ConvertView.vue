<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import CompareSlider from '@/components/CompareSlider.vue'
import CrossToolLinks from '@/components/CrossToolLinks.vue'
import DropZone from '@/components/DropZone.vue'
import PreviewPane from '@/components/PreviewPane.vue'
import QueueBar from '@/components/QueueBar.vue'
import ResultBar from '@/components/ResultBar.vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { useImageSource } from '@/composables/useImageSource'
import { downloadZip } from '@/lib/batch'
import {
  BASE_FORMATS,
  availableFormats,
  canvasToBlob,
  downloadBlob,
  encodeToTarget,
  extFor,
  formatBytes,
  renderImage,
} from '@/lib/image'
import { loadPrefs, savePrefs } from '@/lib/prefs'

const {
  items,
  current,
  source,
  count,
  error,
  addFiles,
  setDraft,
  clearDraft,
  select,
  removeCurrent,
  clear,
} = useImageSource()

const prefs = loadPrefs()
const formats = ref([...BASE_FORMATS])
const format = ref(prefs.format || 'image/jpeg')
const quality = ref(prefs.quality ?? 0.9)
const useTarget = ref(!!prefs.useTarget)
const targetKb = ref(prefs.targetKb || 200)
const stripMeta = ref(prefs.stripMeta !== false)
const busy = ref(false)
const status = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const resultBlob = ref(null)

let alive = true
let previewTimer

const originalMeta = computed(() => {
  if (!source.value) return ''
  return `${source.value.width}×${source.value.height} · ${formatBytes(source.value.size)}`
})

const resultMeta = computed(() => {
  if (!resultUrl.value) return ''
  return formatBytes(resultSize.value)
})

const showQuality = computed(
  () => format.value !== 'image/png' && !useTarget.value,
)

const seoPoints = [
  'Convert PNG, JPG, WebP, and AVIF without uploading files to a server.',
  'Lower JPEG/WebP/AVIF quality to shrink file size for the web or email.',
  'Metadata is removed when images are re-encoded in your browser.',
]

onMounted(async () => {
  formats.value = await availableFormats()
  if (!formats.value.some((item) => item.id === format.value)) {
    format.value = 'image/jpeg'
  }
})

watch([format, quality, useTarget, targetKb, stripMeta], () => {
  savePrefs({
    format: format.value,
    quality: quality.value,
    useTarget: useTarget.value,
    targetKb: targetKb.value,
    stripMeta: stripMeta.value,
  })
})

watch([source, format, quality, useTarget, targetKb, stripMeta], () => {
  clearTimeout(previewTimer)
  if (!source.value) {
    revokeResult()
    return
  }
  previewTimer = setTimeout(updatePreview, 180)
})

onUnmounted(() => {
  alive = false
  clearTimeout(previewTimer)
  revokeResult()
})

function revokeResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  resultBlob.value = null
  clearDraft()
}

async function buildBlob(item) {
  if (!stripMeta.value && format.value === item.type) {
    return item.file
  }
  const canvas = renderImage(item)
  if (useTarget.value && format.value !== 'image/png') {
    return encodeToTarget(canvas, format.value, targetKb.value * 1024, quality.value)
  }
  return canvasToBlob(canvas, format.value, quality.value)
}

async function updatePreview() {
  if (!source.value) return
  busy.value = true
  status.value = ''
  try {
    const blob = await buildBlob(source.value)
    if (!alive) return
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultBlob.value = blob
    resultUrl.value = URL.createObjectURL(blob)
    resultSize.value = blob.size
    setDraft(blob, source.value.name)
  } catch {
    if (!alive) return
    revokeResult()
    status.value = 'Could not process image.'
  } finally {
    if (alive) busy.value = false
  }
}

async function download() {
  if (!source.value) return
  busy.value = true
  try {
    const blob = resultBlob.value || (await buildBlob(source.value))
    downloadBlob(blob, `${source.value.name}.${extFor(format.value)}`)
  } finally {
    busy.value = false
  }
}

async function downloadAll() {
  if (!items.value.length) return
  busy.value = true
  status.value = 'Preparing zip…'
  try {
    const files = []
    for (const item of items.value) {
      const blob = await buildBlob(item)
      files.push({ name: `${item.name}.${extFor(format.value)}`, blob })
    }
    await downloadZip(files, 'converted-images.zip')
    status.value = `Zip ready · ${files.length} files`
  } catch {
    status.value = 'Could not create zip.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Convert</h2>
      <p>Change image format in your browser. Nothing is uploaded.</p>
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
          <span>Format</span>
          <select v-model="format">
            <option v-for="item in formats" :key="item.id" :value="item.id">
              {{ item.label }}
            </option>
          </select>
        </label>

        <label v-if="showQuality" class="field">
          <span>Quality · {{ Math.round(quality * 100) }}%</span>
          <input v-model.number="quality" type="range" min="0.4" max="1" step="0.01">
        </label>

        <label class="check">
          <input v-model="useTarget" type="checkbox">
          <span>Aim for target file size</span>
        </label>

        <label v-if="useTarget" class="field">
          <span>Target · {{ targetKb }} KB</span>
          <input v-model.number="targetKb" type="range" min="50" max="2000" step="10">
        </label>

        <label class="check">
          <input v-model="stripMeta" type="checkbox">
          <span>Strip metadata (recommended)</span>
        </label>

        <ResultBar :busy="busy" @download="download" @clear="clear" />

        <button
          v-if="count > 1"
          type="button"
          class="btn"
          :disabled="busy"
          @click="downloadAll"
        >
          Download all as ZIP
        </button>

        <CrossToolLinks />
        <p v-if="status" class="status">{{ status }}</p>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <SeoBlurb title="Convert images online" :points="seoPoints" />
  </section>
</template>
