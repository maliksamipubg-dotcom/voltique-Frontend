import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DEFAULT_BACKEND_URL = 'https://voltiquebackend.vercel.app'
const SITE_URL = 'https://voltiquehub.vercel.app'
const SITE_NAME = 'Voltique Hub'
const CURRENCY = 'Rs'
const CURRENCY_ISO = 'PKR'

const backendApiUrl = () => {
  const base = (process.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL)
    .trim()
    .replace(/\/+$/, '')
  return `${base}/api/product/single`
}

const distIndexPath = () =>
  join(process.cwd(), 'dist', 'index.html')

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const extractProductId = (param) => {
  const value = String(param || '').trim().replace(/\/+$/, '')
  if (/^[0-9a-fA-F]{24}$/.test(value)) return value
  const match = value.match(/[0-9a-fA-F]{24}$/)
  return match ? match[0] : ''
}

const truncate = (text, max = 158) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

const buildProductDescription = (product) => {
  if (!product) return ''
  const headline = [
    product.name,
    product.subCategory ? `by ${product.subCategory}` : '',
    product.category || '',
    typeof product.price === 'number' ? `${CURRENCY} ${product.price}` : '',
  ].filter(Boolean).join(' · ')
  const body = truncate(product.description, 110)
  return truncate(`${headline}. ${body}`)
}

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const getProductImage = (product) => {
  const image = Array.isArray(product.image) ? product.image.find(Boolean) : product.image
  return image || ''
}

const productUrl = (product) => {
  const id = product._id || product.id
  if (!id) return ''
  return `${SITE_URL}/product/${slugify(product.name)}-${id}`
}

const productSchema = (product) => {
  const id = product._id || product.id || ''
  const url = productUrl(product)
  const outOfStock =
    typeof product.stock === 'string' && product.stock.toLowerCase() !== 'in stock'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: Array.isArray(product.image) ? product.image.filter(Boolean) : [product.image].filter(Boolean),
    description: truncate(product.description, 300) || product.name,
    category: product.category,
    sku: id ? `VLT-${String(id).slice(-8).toUpperCase()}` : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: CURRENCY_ISO,
      price: product.price,
      availability: outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  }
  if (product.subCategory) {
    schema.brand = { '@type': 'Brand', name: product.subCategory }
  }
  Object.keys(schema).forEach((key) => {
    if (schema[key] === undefined) delete schema[key]
  })
  return schema
}

const breadcrumbSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/collections` },
    { '@type': 'ListItem', position: 3, name: product.name, item: productUrl(product) },
  ],
})

const injectIntoRoot = (html, product) => {
  const image = getProductImage(product)
  const productHtml = `
      <div class="ssr-product">
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(truncate(product.description, 160))}</p>
        <p class="ssr-price">${escapeHtml(CURRENCY)} ${escapeHtml(Number(product.price) || '')}</p>
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />` : ''}
      </div>`
  return html.replace('<div id="root"></div>', `<div id="root">${productHtml}</div>`)
}

const injectSeo = (html, product) => {
  const title = `${product.name} | ${SITE_NAME}`
  const description = buildProductDescription(product)
  const url = productUrl(product)
  const image = getProductImage(product)

  const replaceAll = (input, pattern, replacement) =>
    input.replace(new RegExp(pattern, 'g'), replacement)

  let out = html
  out = replaceAll(out, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  out = replaceAll(
    out,
    /<meta name="description"[^>]*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  )
  out = replaceAll(
    out,
    /<meta name="robots"[^>]*\/?>/,
    '<meta name="robots" content="index, follow" />',
  )
  out = replaceAll(
    out,
    /<meta property="og:title"[^>]*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  )
  out = replaceAll(
    out,
    /<meta property="og:description"[^>]*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  )
  out = replaceAll(
    out,
    /<meta property="og:url"[^>]*\/?>/,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
  )
  if (image) {
    out = replaceAll(
      out,
      /<meta property="og:image"[^>]*\/?>/,
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
    )
  }
  out = replaceAll(
    out,
    /<meta name="twitter:title"[^>]*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  )
  out = replaceAll(
    out,
    /<meta name="twitter:description"[^>]*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  )
  if (image) {
    out = replaceAll(
      out,
      /<meta name="twitter:image"[^>]*\/?>/,
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    )
  }

  const canonicalLink = `<link rel="canonical" href="${escapeHtml(url)}" />`
  const jsonLd = [productSchema(product), breadcrumbSchema(product)]
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join('\n    ')

  out = out.replace('</head>', `    ${canonicalLink}\n    ${jsonLd}\n  </head>`)
  return out
}

const injectHtml = (html, product) => {
  let out = html
  out = injectSeo(out, product)
  out = injectIntoRoot(out, product)
  return out
}

export default async function handler(req, res) {
  const pathParam = req.query.path || ''
  const productId = extractProductId(pathParam)
  const originalHtml = async () => {
    try {
      return await readFile(distIndexPath(), 'utf8')
    } catch {
      return null
    }
  }
  const sendOriginal = async () => {
    const html = await originalHtml()
    if (html) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, no-cache, no-store, must-revalidate')
      res.send(html)
    } else {
      res.status(502).send('Bad Gateway')
    }
  }

  if (!productId) return sendOriginal()

  let response
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    response = await fetch(backendApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
  } catch {
    return sendOriginal()
  }

  if (!response.ok) return sendOriginal()

  let data
  try {
    data = await response.json()
  } catch {
    return sendOriginal()
  }

  if (!data || data.success !== true || !data.product) return sendOriginal()

  const product = data.product
  let html = await originalHtml()
  if (!html) return sendOriginal()

  html = injectHtml(html, product)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  res.send(html)
}