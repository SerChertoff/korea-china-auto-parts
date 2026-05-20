import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'node:fs'

const SEO_ROUTES = [
  '/',
  '/catalog',
  '/about',
  '/contact',
  '/brands',
  '/compare',
  '/account',
  '/search',
]

function seoFilesPlugin(siteOrigin: string) {
  const origin = siteOrigin.replace(/\/$/, '')
  return {
    name: 'seo-files',
    closeBundle() {
      const dist = path.resolve('dist')
      const urls = SEO_ROUTES.map(
        (r) => `  <url>\n    <loc>${origin}${r}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
      ).join('\n')
      const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      writeFileSync(path.join(dist, 'sitemap.xml'), sm, 'utf8')
      writeFileSync(
        path.join(dist, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /checkout\nDisallow: /cart\n\nSitemap: ${origin}/sitemap.xml\n`,
        'utf8',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = env.VITE_SITE_URL || 'http://localhost:5173'
  const rootDir = path.dirname(fileURLToPath(import.meta.url))
  return {
    plugins: [react(), seoFilesPlugin(site)],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
