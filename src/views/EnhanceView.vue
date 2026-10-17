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
import { downloadZip } from '@/lib/batch'
import { getTool } from '@/tools'
import {
  canvasToBlob,
  downloadBlob,
  extFor,
  formatBytes,
  renderImage,
} from '@/lib/image'

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

const brightness = ref(100)
const contrast = ref(100)
const saturate = ref(100)
const sharpen = ref(0)
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

const tool = getTool('enhance')
const seoPoints = tool?.points ?? []
const seoFaq = tool?.faq ?? []
const seoLede = tool?.lede ?? ''
const seoSteps = tool?.steps ?? []
const seoNote = tool?.note ?? ''


watch(source, () => {
  revokeResult()
  resetControls()
})

watch([brightness, contrast, saturate, sharpen, source], () => {
  clearTimeout(previewTimer)
  if (!source.value) return
  previewTimer = setTimeout(updatePreview, 180)
})

onUnmounted(() => {
  alive = false
  clearTimeout(previewTimer)
  revokeResult()
})

function resetControls() {
  brightness.value = 100
  contrast.value = 100
  saturate.value = 100
  sharpen.value = 0
}

function revokeResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultSize.value = 0
  resultBlob.value = null
  clearDraft()
}

function options() {
  return {
    brightness: brightness.value,
    contrast: contrast.value,
    saturate: saturate.value,
    sharpen: sharpen.value,
  }
}

async function buildBlob(item) {
  const canvas = renderImage(item, options())
  const type = item.type.includes('png') ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, type, 0.92)
  return { blob, type }
}

async function updatePreview() {
  if (!source.value) return
  busy.value = true
  status.value = ''
  try {
    const { blob } = await buildBlob(source.value)
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

function download() {
  if (!source.value || !resultBlob.value) return
  const type = source.value.type.includes('png') ? 'image/png' : 'image/jpeg'
  downloadBlob(resultBlob.value, `${source.value.name}-enhanced.${extFor(type)}`)
}

async function downloadAll() {
  if (!items.value.length) return
  busy.value = true
  status.value = 'Preparing zip…'
  try {
    const files = []
    for (const item of items.value) {
      const { blob, type } = await buildBlob(item)
      files.push({ name: `${item.name}-enhanced.${extFor(type)}`, blob })
    }
    await downloadZip(files, 'enhanced-images.zip')
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
      <h2>Enhance</h2>
      <p>Adjust brightness, contrast, color, and sharpness locally.</p>
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
          <span>Brightness · {{ brightness }}%</span>
          <input v-model.number="brightness" type="range" min="50" max="150" step="1">
        </label>
        <label class="field">
          <span>Contrast · {{ contrast }}%</span>
          <input v-model.number="contrast" type="range" min="50" max="150" step="1">
        </label>
        <label class="field">
          <span>Saturation · {{ saturate }}%</span>
          <input v-model.number="saturate" type="range" min="0" max="200" step="1">
        </label>
        <label class="field">
          <span>Sharpen · {{ sharpen }}%</span>
          <input v-model.number="sharpen" type="range" min="0" max="100" step="1">
        </label>

        <ResultBar :busy="busy" @download="download" @clear="clear" />

        <div class="actions">
          <button type="button" class="btn" @click="resetControls">Reset edits</button>
          <button
            v-if="count > 1"
            type="button"
            class="btn"
            :disabled="busy"
            @click="downloadAll"
          >
            Download all as ZIP
          </button>
        </div>

        <CrossToolLinks />
        <p v-if="status" class="status">{{ status }}</p>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <SeoBlurb :faq="seoFaq" :title="tool?.heading || tool?.title || 'Tool'" :lede="seoLede" :points="seoPoints" :steps="seoSteps" :note="seoNote" />
  </section>
</template>
