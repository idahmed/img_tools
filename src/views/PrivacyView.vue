<script setup>
import { HUB_URL, SITE_URL } from '@/lib/sites'
</script>

<template>
  <article class="legal">
    <h2>Privacy Policy</h2>
    <p class="legal-meta">Last updated: October 2026 · {{ SITE_URL.replace('https://', '') }}</p>

    <section>
      <h3>Short version</h3>
      <p>
        Image tools run in your browser. Photos you open are decoded and edited locally. We do not require an account and we do not host your uploads on sessea servers.
      </p>
    </section>

    <section>
      <h3>Local processing</h3>
      <p>
        Convert, resize, crop, rotate, enhance, and watermark operations use browser APIs on your device. Downloads are saved only where you choose.
      </p>
    </section>

    <section>
      <h3>Advertising</h3>
      <p>
        Pages may show Google AdSense ads. Ad partners may use cookies or similar
        technologies. That is separate from your project files. Manage ads in
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.
      </p>
    </section>

    <section>
      <h3>Full policy</h3>
      <p>
        The complete hub policy is on
        <a :href="`${HUB_URL}/privacy`">sessea.com/privacy</a>.
        Contact:
        <a :href="`${HUB_URL}/contact`">sessea.com/contact</a>.
      </p>
    </section>
  </article>
</template>
