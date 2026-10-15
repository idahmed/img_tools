<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Terms of Service</h2>
      <p>Please read these terms carefully before using our service.</p>
    </header>

    <div class="legal">
      <article class="legal-section">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and using this website, you accept and agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our service.
        </p>
      </article>

      <article class="legal-section">
        <h3>2. Description of Service</h3>
        <p>
          We provide free browser-based image processing tools including format conversion, resizing, 
          enhancement, rotation, cropping, and watermarking. All image processing occurs locally in 
          your browser. We do not upload, store, or process your images on our servers.
        </p>
      </article>

      <article class="legal-section">
        <h3>3. User Responsibilities</h3>
        <p>You agree to:</p>
        <ul>
          <li>Use the service only for lawful purposes</li>
          <li>Not process images that you do not have rights to modify</li>
          <li>Not use the service to create illegal or harmful content</li>
          <li>Respect intellectual property rights of others</li>
        </ul>
      </article>

      <article class="legal-section">
        <h3>4. Intellectual Property</h3>
        <p>
          The website design, code, and branding are our intellectual property. You retain full 
          ownership of any images you process using our tools. We claim no rights to your content.
        </p>
      </article>

      <article class="legal-section">
        <h3>5. Disclaimer of Warranties</h3>
        <p>
          The service is provided "as is" without warranties of any kind. We do not guarantee that 
          the service will be uninterrupted, error-free, or meet your specific requirements. 
          Processing results may vary depending on your browser and device capabilities.
        </p>
      </article>

      <article class="legal-section">
        <h3>6. Limitation of Liability</h3>
        <p>
          We shall not be liable for any indirect, incidental, special, or consequential damages 
          arising from the use or inability to use our service, including but not limited to loss 
          of data or image quality degradation.
        </p>
      </article>

      <article class="legal-section">
        <h3>7. Third-Party Advertising</h3>
        <p>
          Our website displays advertisements served by Google Ads and other third-party advertising 
          networks. These advertisers may use cookies and similar technologies to collect information 
          about your browsing activities to provide personalized advertisements. We do not control 
          the data collection practices of these third parties. Please refer to our 
          <a href="/privacy" @click.prevent="router.push('/privacy')">Privacy Policy</a> 
          for more information about advertising and your data.
        </p>
      </article>

      <article class="legal-section">
        <h3>8. Changes to Terms</h3>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service 
          after changes constitutes acceptance of the modified terms.
        </p>
      </article>

      <article class="legal-section">
        <h3>9. Contact</h3>
        <p>
          If you have questions about these Terms of Service, please contact us through our website.
        </p>
      </article>

      <p class="legal-date">Last updated: October 2026</p>
    </div>
  </section>
</template>

<style scoped>
.legal {
  display: grid;
  gap: 1.25rem;
}

.legal-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
}

.legal-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.legal-section h3 {
  margin: 0 0 0.6rem;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.legal-section p {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.legal-section ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.legal-section li {
  margin-bottom: 0.25rem;
}

.legal-section a {
  color: var(--ink);
  text-decoration: underline;
}

.legal-section a:hover {
  text-decoration: none;
}

.legal-date {
  margin: 0.5rem 0 0;
  color: var(--soft);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
