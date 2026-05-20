import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, getSiteOrigin, SITE_NAME } from '../../utils/siteMeta'

export type JsonLd = Record<string, unknown> | Record<string, unknown>[]

type Props = {
  title: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  canonicalPath?: string
  jsonLd?: JsonLd
  noindex?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${CSS.escape(key)}"]`
  let el = document.querySelector(sel) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  el.setAttribute('data-seo', '1')
}

function upsertLink(rel: string, href: string) {
  const sel = `link[rel="${CSS.escape(rel)}"]`
  let el = document.querySelector(sel) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  el.setAttribute('data-seo', '1')
}

/** Заголовок, description, Open Graph / Twitter, canonical, JSON-LD */
export function SeoHead({
  title,
  description,
  ogImage,
  ogType = 'website',
  canonicalPath,
  jsonLd,
  noindex,
}: Props) {
  const { pathname } = useLocation()
  const path = canonicalPath ?? pathname
  const pageUrl = absoluteUrl(path)
  const origin = getSiteOrigin()

  useEffect(() => {
    document.title = title

    if (description) {
      upsertMeta('name', 'description', description)
    }

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow')
    }

    if (origin) {
      upsertLink('canonical', pageUrl)
      upsertMeta('property', 'og:site_name', SITE_NAME)
      upsertMeta('property', 'og:title', title)
      if (description) upsertMeta('property', 'og:description', description)
      upsertMeta('property', 'og:url', pageUrl)
      upsertMeta('property', 'og:type', ogType)
      upsertMeta('property', 'og:locale', 'ru_RU')
      if (ogImage) upsertMeta('property', 'og:image', ogImage)

      upsertMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
      upsertMeta('name', 'twitter:title', title)
      if (description) upsertMeta('name', 'twitter:description', description)
      if (ogImage) upsertMeta('name', 'twitter:image', ogImage)
    }

    const prev = document.getElementById('app-jsonld-seo')
    if (prev) prev.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = 'app-jsonld-seo'
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', '1')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.querySelectorAll('[data-seo="1"]').forEach((n) => n.remove())
    }
  }, [title, description, ogImage, ogType, pageUrl, origin, jsonLd, noindex])

  return null
}
