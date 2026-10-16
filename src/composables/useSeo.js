import { SITE_NAME, SITE_URL } from '@/lib/sites'

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
    el.setAttribute('href', `${SITE_URL}${path}`)
  }

  function setPageSeo({ title, description, path }) {
    const fullTitle = `${title} | ${SITE_NAME}`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle
    updateMeta('description', description)
    updateMeta('og:type', 'website', true)
    updateMeta('og:site_name', SITE_NAME, true)
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:url', url, true)
    updateMeta('twitter:card', 'summary')
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    updateMeta('twitter:url', url)
    updateCanonical(path)
  }

  return { setPageSeo }
}
