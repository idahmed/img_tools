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

export const FORMATS = [
  { id: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { id: 'image/png', label: 'PNG', ext: 'png' },
  { id: 'image/webp', label: 'WebP', ext: 'webp' },
]

export function extFor(type) {
  return FORMATS.find((item) => item.id === type)?.ext || 'img'
}
