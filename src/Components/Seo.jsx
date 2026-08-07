import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../utils/seo'

const MANAGED_META =
  'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]'
const MANAGED_LINK = 'link[rel="canonical"]'
const MANAGED_JSONLD = 'script[type="application/ld+json"]'

const clearManagedTags = () => {
  const head = document.head
  head.querySelectorAll(MANAGED_META).forEach((el) => el.remove())
  head.querySelectorAll(MANAGED_LINK).forEach((el) => el.remove())
  head.querySelectorAll(MANAGED_JSONLD).forEach((el) => el.remove())
}

const appendMeta = (head, attr, key, value) => {
  const el = document.createElement('meta')
  el.setAttribute(attr, key)
  el.setAttribute('content', value)
  head.appendChild(el)
}

const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  robots = 'index, follow',
  jsonLd = [],
}) => {
  const location = useLocation()
  const canonicalUrl = `${SITE_URL}${path || location.pathname}`
  const jsonLdKey = JSON.stringify(jsonLd)

  useEffect(() => {
    const head = document.head
    clearManagedTags()
    if (title) document.title = title
    if (description) appendMeta(head, 'name', 'description', description)
    if (robots) appendMeta(head, 'name', 'robots', robots)

    const canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', canonicalUrl)
    head.appendChild(canonical)

    appendMeta(head, 'property', 'og:site_name', SITE_NAME)
    appendMeta(head, 'property', 'og:title', title || document.title)
    appendMeta(head, 'property', 'og:description', description || '')
    appendMeta(head, 'property', 'og:image', image)
    appendMeta(head, 'property', 'og:url', canonicalUrl)
    appendMeta(head, 'property', 'og:type', type)

    appendMeta(head, 'name', 'twitter:card', 'summary_large_image')
    appendMeta(head, 'name', 'twitter:title', title || document.title)
    appendMeta(head, 'name', 'twitter:description', description || '')
    appendMeta(head, 'name', 'twitter:image', image)

    ;(jsonLd || []).filter(Boolean).forEach((data) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'application/ld+json')
      script.textContent = JSON.stringify(data)
      head.appendChild(script)
    })

    return () => clearManagedTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, robots, canonicalUrl, jsonLdKey])

  return null
}

export default Seo
