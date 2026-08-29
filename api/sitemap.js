const DEFAULT_BACKEND_URL = 'https://voltiquebackend.vercel.app'

const backendSitemapUrl = () => {
  const base = (process.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL)
    .trim()
    .replace(/\/+$/, '')
  return `${base}/sitemap.xml`
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
  try {
    const upstream = await fetch(backendSitemapUrl(), { headers: { Accept: 'application/xml' } })
    if (!upstream.ok) {
      throw new Error(`Upstream sitemap responded with HTTP ${upstream.status}`)
    }
    res.send(await upstream.text())
  } catch (error) {
    res.status(502).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')
  }
}