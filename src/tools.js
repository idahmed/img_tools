/**
 * Registry for image tools.
 * Add new tools here + a view file, then they appear in nav automatically.
 */
export const tools = [
  {
    path: '/convert',
    name: 'convert',
    label: 'Convert',
    heading: 'Convert images',
    title: 'Free Image Converter - PNG, JPG, WebP, AVIF',
    description:
      'Convert images between PNG, JPG, WebP, and AVIF formats for free. Adjust quality, compress files, and strip metadata. No upload required.',
    lede: 'Convert photos between common web formats without uploading them to a remote converter.',
    points: ['Switch between PNG, JPG, WebP, and AVIF when supported.', 'Tune quality for smaller files before you download.', 'Conversion runs locally in your browser.'],
    steps: ['Open or drop an image.', 'Choose an output format and quality.', 'Download the converted file to your device.'],
    note: 'Keep your original file; treat the download as an export.',
    shortcut: '1',
    faq: [
      { q: 'Is this image converter free?', a: 'Yes. Free with no account required.' },
      { q: 'Are my images uploaded?', a: 'No. Conversion runs locally in your browser.' },
      { q: 'Which formats are supported?', a: 'PNG, JPG, WebP, and AVIF, depending on browser support.' },
    ],
  },
  {
    path: '/resize',
    name: 'resize',
    label: 'Resize',
    heading: 'Resize images',
    title: 'Free Image Resizer - Resize Photos Online',
    description:
      'Resize images to any dimension for free. Scale by percentage or exact pixels while maintaining aspect ratio. Works in your browser.',
    lede: 'Change image dimensions by exact pixels or percentage while keeping work on your device.',
    points: ['Scale by pixels or percent.', 'Lock aspect ratio to avoid stretching.', 'No upload to sessea servers.'],
    steps: ['Open an image.', 'Set width, height, or scale.', 'Download the resized result.'],
    note: 'Very large images are limited by browser memory.',
    shortcut: '2',
    faq: [
      { q: 'Can I resize photos by pixels or percent?', a: 'Yes. Enter exact size or scale by percentage.' },
      { q: 'Does resizing upload my photos?', a: 'No. Everything stays on your device.' },
    ],
  },
  {
    path: '/enhance',
    name: 'enhance',
    label: 'Enhance',
    heading: 'Enhance photos',
    title: 'Free Image Enhancer - Adjust Brightness & Contrast',
    description:
      'Enhance images by adjusting brightness, contrast, and saturation. Improve photo quality instantly in your browser for free.',
    lede: 'Adjust brightness, contrast, and saturation for a quick local photo polish.',
    points: ['Preview slider changes instantly.', 'Download only when you like the result.', 'Edits stay in the browser tab.'],
    steps: ['Open a photo.', 'Move the enhance sliders.', 'Download the adjusted image.'],
    note: 'Enhancement is a simple correction tool, not a full studio.',
    shortcut: '3',
    faq: [
      { q: 'Can I adjust brightness and contrast online?', a: 'Yes. Use the sliders and download the result.' },
      { q: 'Is photo enhancement private?', a: 'Yes. Processing never leaves your browser.' },
    ],
  },
  {
    path: '/rotate',
    name: 'rotate',
    label: 'Rotate',
    heading: 'Rotate images',
    title: 'Free Image Rotator - Rotate & Flip Photos',
    description:
      'Rotate images 90° or any custom angle. Flip photos horizontally or vertically. Free browser-based tool with instant preview.',
    lede: 'Rotate or flip images locally for straight horizons and mirrored layouts.',
    points: ['Rotate by common angles or a custom degree.', 'Flip horizontally or vertically.', 'Processing stays on your device.'],
    steps: ['Open an image.', 'Choose rotate or flip.', 'Download the result.'],
    note: 'Combine with crop when you need a tighter frame.',
    shortcut: '4',
    faq: [
      { q: 'Can I rotate or flip images online?', a: 'Yes. Rotate by degrees or flip horizontally/vertically.' },
      { q: 'Are rotate edits uploaded?', a: 'No. Edits stay local in your browser.' },
    ],
  },
  {
    path: '/crop',
    name: 'crop',
    label: 'Crop',
    heading: 'Crop images',
    title: 'Free Image Cropper - Crop Photos Online',
    description:
      'Crop images to any size or aspect ratio for free. Remove unwanted areas from photos instantly. No software installation needed.',
    lede: 'Crop to a free region or common aspect ratios without sending the photo to a server.',
    points: ['Drag to select the region you need.', 'Use aspect presets when helpful.', 'Cropping is local and private.'],
    steps: ['Open an image.', 'Set the crop area.', 'Download the cropped image.'],
    note: 'Keep the original if you may need pixels outside the crop later.',
    shortcut: '5',
    faq: [
      { q: 'Can I crop to a custom aspect ratio?', a: 'Yes. Use free crop or common aspect presets.' },
      { q: 'Does cropping upload my image?', a: 'No. Cropping runs entirely in your browser.' },
    ],
  },
  {
    path: '/watermark',
    name: 'watermark',
    label: 'Mark',
    heading: 'Watermark images',
    title: 'Free Image Watermark - Add Text or Logo',
    description:
      'Add text or image watermarks to protect your photos. Customize position, opacity, and size. Free and private watermarking tool.',
    lede: 'Add text or a logo mark locally to discourage casual reuse of your photos.',
    points: ['Place text or a logo watermark.', 'Control opacity, size, and position.', 'Files never leave your browser for this step.'],
    steps: ['Open an image.', 'Add text or a logo and position it.', 'Download the watermarked file.'],
    note: 'Watermarks deter casual reuse; they are not strong DRM.',
    shortcut: '6',
    faq: [
      { q: 'Can I add a text or logo watermark?', a: 'Yes. Enter text or upload a logo, then place and download.' },
      { q: 'Is watermarking private?', a: 'Yes. Images never leave your browser.' },
    ],
  },
]

export function getTool(name) {
  return tools.find((tool) => tool.name === name)
}
