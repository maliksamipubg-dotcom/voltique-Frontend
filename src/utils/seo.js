export const SITE_URL = 'https://voltiquehub.vercel.app'
export const SITE_NAME = 'Voltique Hub'
export const DEFAULT_TITLE = 'Voltique Hub | Battery Chargers, Stabilizers & Inverters'
export const DEFAULT_DESCRIPTION =
  'Shop battery chargers, voltage stabilizers, power inverters and charging accessories in Pakistan. Genuine, warranty-backed power solutions from Voltique Hub with cash on delivery.'
export const ORG_EMAIL = 'voltiquehubsupport@gmail.com'
export const ORG_PHONE = '+923063720139'
export const ORG_WHATSAPP = 'https://wa.me/923063720139'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/voltique-icon-512x512.png`
export const LOGO_URL = DEFAULT_OG_IMAGE
export const THEME_COLOR = '#2456e6'
export const CURRENCY = 'Rs'
export const CURRENCY_ISO = 'PKR'

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const getProductSlug = (name) => slugify(name)

export const getProductUrl = (product) => {
  if (!product) return '/'
  const id = product._id || product.id
  if (!id) return '/'
  const slug = getProductSlug(product.name)
  return `/product/${slug}-${id}`
}

export const extractProductId = (param) => {
  const value = String(param || '').trim()
  if (!value) return value
  if (/^[0-9a-fA-F]{24}$/.test(value)) return value
  const match = value.match(/[0-9a-fA-F]{24}$/)
  return match ? match[0] : value
}

export const truncate = (text, max = 158) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

export const buildProductDescription = (product) => {
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

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  email: ORG_EMAIL,
  telephone: ORG_PHONE,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: ORG_PHONE,
    contactType: 'customer support',
    availableLanguage: ['en', 'ur'],
  },
  sameAs: [ORG_WHATSAPP],
})

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: (items || []).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.path && item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path || ''}`,
  })),
})

export const productSchema = (product) => {
  if (!product) return null
  const id = product._id || product.id || ''
  const url = `${SITE_URL}${getProductUrl(product)}`
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
  if (Number(product.avgRating) > 0 && Number(product.reviewCount) > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.avgRating),
      reviewCount: Number(product.reviewCount),
    }
  }
  Object.keys(schema).forEach((key) => {
    if (schema[key] === undefined) delete schema[key]
  })
  return schema
}
