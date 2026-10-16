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
