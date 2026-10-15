<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>How to Use</h2>
      <p>Learn how to use our free browser-based image tools.</p>
    </header>

    <div class="docs">
      <article class="doc-section">
        <h3>Getting Started</h3>
        <ol>
          <li>Select a tool from the navigation tabs (Convert, Resize, Enhance, Rotate, Crop, or Mark)</li>
          <li>Drop your image onto the upload area or click to browse files</li>
          <li>Adjust settings as needed</li>
          <li>Download your processed image</li>
        </ol>
      </article>

      <article class="doc-section">
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li><kbd>1</kbd> – <kbd>6</kbd> Switch between tools</li>
          <li><kbd>O</kbd> Open file picker</li>
          <li><kbd>Z</kbd> Undo last action</li>
          <li><kbd>Esc</kbd> Clear current image</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Convert</h3>
        <p>Change image format between PNG, JPG, WebP, and AVIF. Adjust quality to reduce file size.</p>
        <ul>
          <li>Select output format from the dropdown</li>
          <li>Use the quality slider for lossy formats</li>
          <li>Enable target file size to auto-adjust quality</li>
          <li>Strip metadata removes EXIF data</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Resize</h3>
        <p>Scale images to specific dimensions or percentage.</p>
        <ul>
          <li>Enter width and height in pixels</li>
          <li>Lock aspect ratio to maintain proportions</li>
          <li>Use percentage mode for relative scaling</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Enhance</h3>
        <p>Adjust brightness, contrast, and saturation.</p>
        <ul>
          <li>Use sliders to fine-tune each parameter</li>
          <li>Preview changes in real-time</li>
          <li>Reset to original values anytime</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Rotate</h3>
        <p>Rotate or flip images.</p>
        <ul>
          <li>Rotate 90° clockwise or counter-clockwise</li>
          <li>Flip horizontally or vertically</li>
          <li>Custom angle rotation available</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Crop</h3>
        <p>Remove unwanted areas from images.</p>
        <ul>
          <li>Drag to select crop area</li>
          <li>Use preset aspect ratios for common sizes</li>
          <li>Enter exact dimensions manually</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Watermark</h3>
        <p>Add text or image watermarks to protect your work.</p>
        <ul>
          <li>Enter custom text or upload a logo</li>
          <li>Position watermark anywhere on the image</li>
          <li>Adjust opacity and size</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Batch Processing</h3>
        <p>Process multiple images at once.</p>
        <ul>
          <li>Drop multiple files to create a queue</li>
          <li>Click thumbnails to switch between images</li>
          <li>Download all as ZIP when finished</li>
        </ul>
      </article>

      <article class="doc-section">
        <h3>Privacy</h3>
        <p>All processing happens in your browser. Your images never leave your device and are not uploaded to any server.</p>
      </article>

      <div class="doc-actions">
        <button type="button" class="btn primary" @click="router.push('/convert')">
          Start Using Tools
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.docs {
  display: grid;
  gap: 1.5rem;
}

.doc-section {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--line);
}

.doc-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.doc-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

.doc-section p {
  margin: 0 0 0.65rem;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.doc-section ul,
.doc-section ol {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

.doc-section li {
  margin-bottom: 0.35rem;
}

kbd {
  display: inline-block;
  min-width: 1.5rem;
  padding: 0.15rem 0.45rem;
  border: 1px solid var(--line);
  border-radius: 0.35rem;
  background: var(--key);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-align: center;
}

.doc-actions {
  padding-top: 0.5rem;
}
</style>
