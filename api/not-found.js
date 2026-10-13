import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const distIndexPath = () => join(process.cwd(), 'dist', 'index.html')

// Client routes defined in src/App.jsx. Anything outside this set (and the
// product/track patterns below) is a genuine not-found and must answer 404.
const EXACT_ROUTES = new Set([
  '/',
  '/collections',
  '/about',
  '/contact',
  '/cart',
  '/login',
  '/placeOrder',
  '/orders',
  '/profile',
  '/change-password',
])

const normalizePath = (param) => {
  const raw = String(param || '').split('?')[0]
  const trimmed = raw.replace(/^\/+/, '').replace(/\/+$/, '')
  return trimmed ? `/${trimmed}` : '/'
}

const isKnownRoute = (path) => {
  if (EXACT_ROUTES.has(path)) return true
  if (/^\/product(\/|$)/.test(path)) return true
  if (/^\/track(\/|$)/.test(path)) return true
  return false
}

const setMeta = (html, attr, key, content) => {
  const pattern = new RegExp(`<meta\\s+[^>]*${attr}\\s*=\\s*["']${key}["'][^>]*>`, 'i')
  const tag = `<meta ${attr}="${key}" content="${content}" />`
  if (pattern.test(html)) return html.replace(new RegExp(pattern.source, 'gi'), tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

const withNoindex = (html) => setMeta(html, 'name', 'robots', 'noindex, follow')

const readIndexHtml = async () => {
  try {
    return await readFile(distIndexPath(), 'utf8')
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  const path = normalizePath(req.query.path)
  const html = await readIndexHtml()

  if (!html) {
    res.status(502).send('Bad Gateway')
    return
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  // Known SPA routes that reached this catch-all (for example a trailing-slash
  // variant) still render normally; everything else is a real 404.
  if (isKnownRoute(path)) {
    res.setHeader('Cache-Control', 'public, no-cache, no-store, must-revalidate')
    res.send(html)
    return
  }

  res.status(404)
  res.setHeader('Cache-Control', 'public, no-cache, no-store, must-revalidate')
  res.send(withNoindex(html))
}
