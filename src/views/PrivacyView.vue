<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Privacy Policy</h2>
      <p>Your privacy matters to us. Here's how we handle your data.</p>
    </header>

    <div class="legal">
      <article class="legal-section highlight">
        <h3>The Short Version</h3>
        <p>
          <strong>We do not collect any personal data from you.</strong> All image processing 
          happens entirely in your browser. Your images are never uploaded to our servers.
        </p>
      </article>

      <article class="legal-section">
        <h3>1. Data We Collect</h3>
        <p>
          We do not collect, store, or process any personal information. We do not require 
          account creation, login, or any form of registration to use our tools.
        </p>
        <ul>
          <li>No personal information collected</li>
          <li>No email addresses collected</li>
          <li>No images uploaded to our servers</li>
          <li>No user tracking by us</li>
        </ul>
      </article>

      <article class="legal-section">
        <h3>2. Local Processing</h3>
        <p>
          All image processing is performed locally in your web browser using JavaScript. 
          Your images never leave your device. When you close the browser tab, all processed 
          images are removed from memory.
        </p>
      </article>

      <article class="legal-section">
        <h3>3. Local Storage</h3>
        <p>
          We use your browser's local storage to save your preferences (such as preferred 
          output format and quality settings) to improve your experience. This data stays 
          on your device and is never transmitted to us.
        </p>
      </article>

      <article class="legal-section">
        <h3>4. Third-Party Advertising</h3>
        <p>
          Our website displays advertisements from Google Ads and other third-party advertising 
          networks. These third parties may use cookies, web beacons, and similar technologies 
          to collect information about your browsing activities across different websites to 
          provide you with personalized advertisements.
        </p>
        <p class="legal-note">
          <strong>Important:</strong> While we do not collect your data, these advertising 
          partners may collect:
        </p>
        <ul>
          <li>IP address</li>
          <li>Browser type and settings</li>
          <li>Device information</li>
          <li>Browsing history across websites</li>
          <li>Ad interaction data</li>
        </ul>
      </article>

      <article class="legal-section">
        <h3>5. Google Ads</h3>
        <p>
          Google uses cookies to serve ads based on your prior visits to our website and 
          other sites. You can opt out of personalized advertising by visiting 
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>.
        </p>
      </article>

      <article class="legal-section">
        <h3>6. Managing Cookies</h3>
        <p>
          You can control cookies through your browser settings. Most browsers allow you to:
        </p>
        <ul>
          <li>View and delete cookies</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies from specific sites</li>
          <li>Clear all cookies when closing the browser</li>
        </ul>
        <p>
          Note that blocking cookies may affect the functionality of advertisements but will 
          not affect the image processing tools.
        </p>
      </article>

      <article class="legal-section">
        <h3>7. Children's Privacy</h3>
        <p>
          Our service is not directed at children under 13. We do not knowingly collect 
          information from children.
        </p>
      </article>

      <article class="legal-section">
        <h3>8. Changes to This Policy</h3>
        <p>
          We may update this privacy policy from time to time. Any changes will be posted 
          on this page with an updated revision date.
        </p>
      </article>

      <article class="legal-section">
        <h3>9. Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us through our website.
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

.legal-section.highlight {
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  background: var(--key);
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

.legal-section p + p {
  margin-top: 0.5rem;
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

.legal-note {
  margin-top: 0.75rem !important;
}

.legal-date {
  margin: 0.5rem 0 0;
  color: var(--soft);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
