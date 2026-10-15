import { HUB_URL } from '@/lib/sites'

const SITE_NAME = 'sessea Image Tools'

export function useSeo() {
  function updateMeta(name, content, property = false) {
    const attr = property ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  function updateCanonical(path) {
    let el = document.querySelector('link[rel="canonical"]')
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      document.head.appendChild(el)
    }
    el.setAttribute('href', `${HUB_URL}${path}`)
  }

  function setPageSeo({ title, description, path }) {
    const fullTitle = `${title} | ${SITE_NAME}`

    document.title = fullTitle
    updateMeta('description', description)
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:url', `${HUB_URL}${path}`, true)
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    updateCanonical(path)
  }

  return { setPageSeo }
}
