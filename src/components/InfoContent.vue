<script setup>
defineProps({
  kind: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="info-content">
    <template v-if="kind === 'docs'">
      <article>
        <h3>Getting started</h3>
        <ol>
          <li>Select a tool from the tabs.</li>
          <li>Drop an image or click to browse.</li>
          <li>Adjust settings, then download.</li>
        </ol>
      </article>
      <article>
        <h3>Keyboard shortcuts</h3>
        <ul>
          <li><kbd>1</kbd>–<kbd>6</kbd> Tools</li>
          <li><kbd>O</kbd> Open</li>
          <li><kbd>Z</kbd> Undo</li>
          <li><kbd>Esc</kbd> Clear</li>
        </ul>
      </article>
      <article>
        <h3>Tools</h3>
        <ul>
          <li><strong>Convert</strong> — PNG, JPG, WebP, AVIF</li>
          <li><strong>Resize</strong> — pixels or percent</li>
          <li><strong>Enhance</strong> — brightness, contrast, saturation</li>
          <li><strong>Rotate</strong> — rotate and flip</li>
          <li><strong>Crop</strong> — free or aspect presets</li>
          <li><strong>Mark</strong> — text or logo watermark</li>
        </ul>
      </article>
      <article>
        <h3>Privacy</h3>
        <p>All processing stays in your browser. Images are never uploaded.</p>
      </article>
    </template>

    <template v-else-if="kind === 'terms'">
      <article>
        <h3>1. Acceptance of Terms</h3>
        <p>By using this website, you accept these Terms of Service.</p>
      </article>
      <article>
        <h3>2. Description of Service</h3>
        <p>
          Free browser-based image tools. Processing runs locally. Images are not
          uploaded to our servers.
        </p>
      </article>
      <article>
        <h3>3. User Responsibilities</h3>
        <ul>
          <li>Use the service only for lawful purposes</li>
          <li>Only process images you have rights to modify</li>
          <li>Respect intellectual property rights</li>
        </ul>
      </article>
      <article>
        <h3>4. Intellectual Property</h3>
        <p>You retain full ownership of images you process.</p>
      </article>
      <article>
        <h3>5. Disclaimer</h3>
        <p>The service is provided “as is” without warranties of any kind.</p>
      </article>
      <article>
        <h3>6. Advertising</h3>
        <p>Ads from Google Ads and partners may appear to support the free service.</p>
      </article>
      <article>
        <h3>7. Contact</h3>
        <p>
          Questions:
          <a href="https://tools.sessea.com" target="_blank" rel="noopener">tools.sessea.com</a>
        </p>
      </article>
      <p class="info-date">Last updated: October 2026</p>
    </template>

    <template v-else-if="kind === 'privacy'">
      <article class="highlight">
        <h3>Short version</h3>
        <p>
          <strong>We do not collect personal data.</strong>
          Image processing happens entirely in your browser.
        </p>
      </article>
      <article>
        <h3>Local processing</h3>
        <p>Images never leave your device. Closing the tab clears them from memory.</p>
      </article>
      <article>
        <h3>Local storage</h3>
        <p>Preferences (format, quality, theme) may be saved in localStorage only.</p>
      </article>
      <article>
        <h3>Third-party advertising</h3>
        <p>
          Advertising partners may use cookies. Manage ads at
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">
            Google Ads Settings
          </a>.
        </p>
      </article>
      <article>
        <h3>Contact</h3>
        <p>
          Privacy questions:
          <a href="https://tools.sessea.com" target="_blank" rel="noopener">tools.sessea.com</a>
        </p>
      </article>
      <p class="info-date">Last updated: October 2026</p>
    </template>
  </div>
</template>
