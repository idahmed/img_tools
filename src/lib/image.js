export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        image,
        file,
        url,
        name: file.name.replace(/\.[^.]+$/, '') || 'image',
        width: image.naturalWidth,
        height: image.naturalHeight,
        size: file.size,
        type: file.type || 'image/png',
      })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image'))
    }
    image.src = url
  })
}

export function releaseImage(source) {
  if (source?.url) URL.revokeObjectURL(source.url)
}

export function renderImage(source, options = {}) {
  const width = Math.max(1, Math.round(options.width || source.width))
  const height = Math.max(1, Math.round(options.height || source.height))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: !!options.sharpen })

  const brightness = options.brightness ?? 100
  const contrast = options.contrast ?? 100
  const saturate = options.saturate ?? 100
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`
  ctx.drawImage(source.image, 0, 0, width, height)
  ctx.filter = 'none'

  if (options.sharpen && options.sharpen > 0) {
    sharpenCanvas(ctx, width, height, options.sharpen)
  }

  return canvas
}

/** rotate: 0 | 90 | 180 | 270 (clockwise). */
export function transformImage(source, { rotate = 0, flipX = false, flipY = false } = {}) {
  const turns = ((Math.round(rotate / 90) * 90) % 360 + 360) % 360
  const swap = turns === 90 || turns === 270
  const width = swap ? source.height : source.width
  const height = swap ? source.width : source.height
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, width)
  canvas.height = Math.max(1, height)
  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((turns * Math.PI) / 180)
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
  ctx.drawImage(source.image, -source.width / 2, -source.height / 2)
  return canvas
}

/** Crop in source pixels: x, y, width, height. */
export function cropImage(source, box) {
  const x = Math.max(0, Math.min(source.width - 1, Math.round(box.x || 0)))
  const y = Math.max(0, Math.min(source.height - 1, Math.round(box.y || 0)))
  const width = Math.max(1, Math.min(source.width - x, Math.round(box.width || source.width)))
  const height = Math.max(1, Math.min(source.height - y, Math.round(box.height || source.height)))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(source.image, x, y, width, height, 0, 0, width, height)
  return canvas
}

export function exportTypeFor(source) {
  return source.type.includes('png') ? 'image/png' : 'image/jpeg'
}

/** Text watermark. position: tl | tr | bl | br | center */
export function watermarkImage(source, {
  text = 'sessea',
  position = 'br',
  opacity = 0.5,
  scale = 0.06,
} = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(source.image, 0, 0)

  const label = String(text || 'sessea').slice(0, 48)
  const size = Math.max(14, Math.round(Math.min(source.width, source.height) * scale))
  const pad = size * 0.7
  ctx.font = `700 ${size}px Syne, sans-serif`
  ctx.textBaseline = 'middle'
  const width = ctx.measureText(label).width
  const height = size

  let x = pad
  let y = pad + height / 2
  if (position === 'tr' || position === 'br') x = source.width - pad - width
  if (position === 'bl' || position === 'br') y = source.height - pad - height / 2
  if (position === 'center') {
    x = (source.width - width) / 2
    y = source.height / 2
  }

  ctx.lineWidth = Math.max(1, size / 14)
  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.55})`
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
  ctx.strokeText(label, x, y)
  ctx.fillText(label, x, y)
  return canvas
}

function sharpenCanvas(ctx, width, height, amount) {
  const strength = Math.min(1, amount / 100)
  const weight = 1 + strength * 4
  const edge = -strength
  const src = ctx.getImageData(0, 0, width, height)
  const out = ctx.createImageData(width, height)
  const a = src.data
  const b = out.data

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        b[i] = a[i]
        b[i + 1] = a[i + 1]
        b[i + 2] = a[i + 2]
        b[i + 3] = a[i + 3]
        continue
      }
      for (let c = 0; c < 3; c += 1) {
        const value =
          a[i + c] * weight +
          a[i - 4 + c] * edge +
          a[i + 4 + c] * edge +
          a[i - width * 4 + c] * edge +
          a[i + width * 4 + c] * edge
        b[i + c] = Math.max(0, Math.min(255, value))
      }
      b[i + 3] = a[i + 3]
    }
  }

  ctx.putImageData(out, 0, 0)
}

export function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      type,
      quality,
    )
  })
}

export async function encodeToTarget(canvas, type, targetBytes, maxQuality = 0.92) {
  if (type === 'image/png' || !targetBytes) {
    return canvasToBlob(canvas, type, maxQuality)
  }

  let low = 0.4
  let high = maxQuality
  let best = await canvasToBlob(canvas, type, low)

  for (let i = 0; i < 8; i += 1) {
    const mid = (low + high) / 2
    const blob = await canvasToBlob(canvas, type, mid)
    if (blob.size <= targetBytes) {
      best = blob
      low = mid
    } else {
      high = mid
    }
  }

  return best
}

export async function resizeToTarget(source, type, targetBytes, quality = 0.85) {
  let scale = 1
  let best = null

  for (let i = 0; i < 10; i += 1) {
    const width = Math.max(1, Math.round(source.width * scale))
    const height = Math.max(1, Math.round(source.height * scale))
    const canvas = renderImage(source, { width, height })
    const blob = await canvasToBlob(canvas, type, quality)
    best = { blob, width, height }
    if (blob.size <= targetBytes || scale <= 0.15) break
    scale *= Math.sqrt(targetBytes / blob.size) * 0.98
    scale = Math.max(0.1, Math.min(1, scale))
  }

  return best
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function openBlob(blob) {
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function copyBlob(blob) {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Copy not supported')
  }
  const type = blob.type || 'image/png'
  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })])
}

export const BASE_FORMATS = [
  { id: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { id: 'image/png', label: 'PNG', ext: 'png' },
  { id: 'image/webp', label: 'WebP', ext: 'webp' },
]

const EXTRA_FORMATS = [
  { id: 'image/avif', label: 'AVIF', ext: 'avif' },
]

let cachedFormats

function canEncode(type) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    canvas.toBlob(
      (blob) => resolve(!!blob && blob.type === type),
      type,
      0.5,
    )
  })
}

/** Formats this browser can encode (AVIF only when supported). */
export async function availableFormats() {
  if (cachedFormats) return cachedFormats
  const list = [...BASE_FORMATS]
  if (await canEncode('image/avif')) list.push(EXTRA_FORMATS[0])
  cachedFormats = list
  return list
}

export function extFor(type) {
  return (
    [...BASE_FORMATS, ...EXTRA_FORMATS].find((item) => item.id === type)?.ext
    || 'img'
  )
}
