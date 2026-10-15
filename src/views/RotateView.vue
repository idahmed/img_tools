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
  transformImage,
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

const rotate = ref(0)
const flipX = ref(false)
const flipY = ref(false)
const busy = ref(false)
const status = ref('')
const resultUrl = ref('')
const resultSize = ref(0)
const resultBlob = ref(null)
const resultSizeLabel = ref('')

const originalMeta = computed(() => {
  if (!source.value) return ''
  return `${source.value.width}×${source.value.height} · ${formatBytes(source.value.size)}`
})

const resultMeta = computed(() => {
  if (!resultUrl.value) return ''
  return `${resultSizeLabel.value} · ${formatBytes(resultSize.value)}`
})

const seoPoints = [
  'Rotate images by 90° steps or flip them horizontally and vertically.',
  'Preview updates instantly — nothing is uploaded.',
  'Download keeps PNG when the source is PNG, otherwise JPEG.',
]

let timer

watch(source, () => {
  rotate.value = 0
  flipX.value = false
  flipY.value = false
})

watch([source, rotate, flipX, flipY], () => {
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
  resultSizeLabel.value = ''
}

function buildCanvas(item) {
  return transformImage(item, {
    rotate: rotate.value,
    flipX: flipX.value,
    flipY: flipY.value,
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
    resultSizeLabel.value = `${canvas.width}×${canvas.height}`
  } catch {
    revokeResult()
    status.value = 'Could not transform image.'
  } finally {
    busy.value = false
  }
}

async function download() {
  if (!source.value) return
  busy.value = true
  try {
    const canvas = buildCanvas(source.value)
    const type = exportTypeFor(source.value)
    const blob = resultBlob.value || (await canvasToBlob(canvas, type, 0.92))
    downloadBlob(blob, `${source.value.name}-rotate.${extFor(type)}`)
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

function turn(delta) {
  rotate.value = (rotate.value + delta + 360) % 360
}
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Rotate</h2>
      <p>Rotate and flip images in your browser.</p>
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
          <button type="button" class="chip" @click="turn(-90)">−90°</button>
          <button type="button" class="chip" :class="{ active: rotate === 0 }" @click="rotate = 0">
            0°
          </button>
          <button type="button" class="chip" @click="turn(90)">+90°</button>
          <button type="button" class="chip" :class="{ active: rotate === 180 }" @click="rotate = 180">
            180°
          </button>
        </div>

        <div class="chips">
          <button type="button" class="chip" :class="{ active: flipX }" @click="flipX = !flipX">
            Flip H
          </button>
          <button type="button" class="chip" :class="{ active: flipY }" @click="flipY = !flipY">
            Flip V
          </button>
        </div>

        <p class="status">Angle · {{ rotate }}°</p>

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
    <SeoBlurb title="Rotate images online" :points="seoPoints" />
  </section>
</template>
