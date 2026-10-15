const THEME_KEY = 'img-tools-theme'

export function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function saveTheme(value) {
  localStorage.setItem(THEME_KEY, value)
}
