const THEME_KEY = 'img-tools-theme'
const PREFS_KEY = 'img-tools-prefs'

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

export function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

export function savePrefs(patch) {
  const next = { ...loadPrefs(), ...patch }
  localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  return next
}
