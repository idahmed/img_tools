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
import {
  canvasToBlob,
  downloadBlob,
  extFor,
  formatBytes,
  renderImage,
  resizeToTarget,
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

const width = ref(0)
const height = ref(0)
const lock = ref(true)
const quality = ref(0.9)
const useTarget = ref(false)
const targetKb = ref(200)
const busy = ref(false)
const status = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const resultBlob = ref(null)
const outWidth = ref(0)
const outHeight = ref(0)

let alive = true
let previewTimer

const exportType = computed(() => {
  if (!source.value) return 'image/jpeg'
  return source.value.type.includes('png') ? 'image/png' : 'image/jpeg'
})

const originalMeta = computed(() => {
  if (!source.value) return ''
  return `${source.value.width}×${source.value.height} · ${formatBytes(source.value.size)}`
})

const resultMeta = computed(() => {
  if (!resultUrl.value) return ''
  return `${outWidth.value}×${outHeight.value} · ${formatBytes(resultSize.value)}`
})

const seoPoints = [
  'Compress and resize photos for websites, forms, and messaging apps.',
  'Keep aspect ratio locked to avoid stretched images.',
  'Use target file size when you need an image under a KB limit.',
]

watch(source, (value) => {
  revokeResult()
  if (!value) return
  width.value = value.width
  height.value = value.height
})

watch([width, height, quality, useTarget, targetKb, source], () => {
  clearTimeout(previewTimer)
  if (!source.value) return
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

function onWidth(value) {
  width.value = Math.max(1, value)
  if (lock.value && source.value) {
    const ratio = source.value.height / source.value.width
    height.value = Math.max(1, Math.round(width.value * ratio))
  }
}

function onHeight(value) {
  height.value = Math.max(1, value)
  if (lock.value && source.value) {
    const ratio = source.value.width / source.value.height
    width.value = Math.max(1, Math.round(height.value * ratio))
  }
}

function setScale(scale) {
  if (!source.value) return
  width.value = Math.max(1, Math.round(source.value.width * scale))
  height.value = Math.max(1, Math.round(source.value.height * scale))
}

async function buildResult(item) {
  if (useTarget.value) {
    const type = item.type.includes('png') ? 'image/jpeg' : exportType.value
    const packed = await resizeToTarget(item, type, targetKb.value * 1024, quality.value)
    return {
      blob: packed.blob,
      width: packed.width,
      height: packed.height,
      type,
    }
  }

  const canvas = renderImage(item, { width: width.value, height: height.value })
  const type = item.type.includes('png') ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, type, quality.value)
  return { blob, width: width.value, height: height.value, type }
}

async function updatePreview() {
  if (!source.value) return
  busy.value = true
  status.value = ''
  try {
    const result = await buildResult(source.value)
    if (!alive) return
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultBlob.value = result.blob
    resultUrl.value = URL.createObjectURL(result.blob)
    resultSize.value = result.blob.size
    outWidth.value = result.width
    outHeight.value = result.height
    setDraft(result.blob, source.value.name)
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
  downloadBlob(
    resultBlob.value,
    `${source.value.name}-${outWidth.value}x${outHeight.value}.${extFor(resultBlob.value.type || exportType.value)}`,
  )
}

async function downloadAll() {
  if (!items.value.length) return
  busy.value = true
  status.value = 'Preparing zip…'
  try {
    const files = []
    for (const item of items.value) {
      const result = await buildResult(item)
      files.push({
        name: `${item.name}-${result.width}x${result.height}.${extFor(result.type)}`,
        blob: result.blob,
      })
    }
    await downloadZip(files, 'resized-images.zip')
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
      <h2>Resize</h2>
      <p>Scale images down or up. Processing stays on your device.</p>
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
        <div class="row">
          <label class="field">
            <span>Width</span>
            <input
              type="number"
              min="1"
              :value="width"
              :disabled="useTarget"
              @input="onWidth(Number($event.target.value))"
            >
          </label>
          <label class="field">
            <span>Height</span>
            <input
              type="number"
              min="1"
              :value="height"
              :disabled="useTarget"
              @input="onHeight(Number($event.target.value))"
            >
          </label>
        </div>

        <label class="check">
          <input v-model="lock" type="checkbox" :disabled="useTarget">
          <span>Keep aspect ratio</span>
        </label>

        <div v-if="!useTarget" class="chips">
          <button type="button" class="chip" @click="setScale(1)">100%</button>
          <button type="button" class="chip" @click="setScale(0.75)">75%</button>
          <button type="button" class="chip" @click="setScale(0.5)">50%</button>
          <button type="button" class="chip" @click="setScale(0.25)">25%</button>
        </div>

        <label class="check">
          <input v-model="useTarget" type="checkbox">
          <span>Aim for target file size</span>
        </label>

        <label v-if="useTarget" class="field">
          <span>Target · {{ targetKb }} KB</span>
          <input v-model.number="targetKb" type="range" min="50" max="2000" step="10">
        </label>

        <label v-else class="field">
          <span>JPEG quality · {{ Math.round(quality * 100) }}%</span>
          <input v-model.number="quality" type="range" min="0.4" max="1" step="0.01">
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
    <SeoBlurb title="Resize and compress images" :points="seoPoints" />
  </section>
</template>
