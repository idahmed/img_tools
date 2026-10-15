/**
 * Registry for image tools.
 * Add new tools here + a view file, then they appear in nav automatically.
 */
export const tools = [
  {
    path: '/convert',
    name: 'convert',
    label: 'Convert',
    title: 'Free Image Converter - PNG, JPG, WebP, AVIF',
    description:
      'Convert images between PNG, JPG, WebP, and AVIF formats for free. Adjust quality, compress files, and strip metadata. No upload required.',
    shortcut: '1',
  },
  {
    path: '/resize',
    name: 'resize',
    label: 'Resize',
    title: 'Free Image Resizer - Resize Photos Online',
    description:
      'Resize images to any dimension for free. Scale by percentage or exact pixels while maintaining aspect ratio. Works in your browser.',
    shortcut: '2',
  },
  {
    path: '/enhance',
    name: 'enhance',
    label: 'Enhance',
    title: 'Free Image Enhancer - Adjust Brightness & Contrast',
    description:
      'Enhance images by adjusting brightness, contrast, and saturation. Improve photo quality instantly in your browser for free.',
    shortcut: '3',
  },
  {
    path: '/rotate',
    name: 'rotate',
    label: 'Rotate',
    title: 'Free Image Rotator - Rotate & Flip Photos',
    description:
      'Rotate images 90° or any custom angle. Flip photos horizontally or vertically. Free browser-based tool with instant preview.',
    shortcut: '4',
  },
  {
    path: '/crop',
    name: 'crop',
    label: 'Crop',
    title: 'Free Image Cropper - Crop Photos Online',
    description:
      'Crop images to any size or aspect ratio for free. Remove unwanted areas from photos instantly. No software installation needed.',
    shortcut: '5',
  },
  {
    path: '/watermark',
    name: 'watermark',
    label: 'Mark',
    title: 'Free Image Watermark - Add Text or Logo',
    description:
      'Add text or image watermarks to protect your photos. Customize position, opacity, and size. Free and private watermarking tool.',
    shortcut: '6',
  },
]
