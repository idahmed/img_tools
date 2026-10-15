<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { path: '/docs', label: 'How to Use' },
  { path: '/terms', label: 'Terms' },
  { path: '/privacy', label: 'Privacy' },
]
</script>

<template>
  <footer class="footer">
    <nav class="footer-links">
      <button
        v-for="link in links"
        :key="link.path"
        type="button"
        class="footer-link"
        @click="router.push(link.path)"
      >
        {{ link.label }}
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-link {
  padding: 0;
  border: none;
  background: none;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--ink);
}
</style>
