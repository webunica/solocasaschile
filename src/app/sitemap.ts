import { MetadataRoute } from 'next'
import { sanityServerClient } from '@/lib/sanity.server'

const BASE_URL = 'https://www.solocasaschile.com'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SanitySlugItem {
    slug: string
    _updatedAt?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(value?: string): Date {
    return value ? new Date(value) : new Date()
}

// ─── Sitemap Principal ────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // ── 0. Diagnóstico (visible en logs del servidor) ────────────────────────
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'placeholder'
    console.log(`[sitemap] Sanity projectId: ${projectId}`)

    // ── 1. Slugs de Blog Posts desde Sanity ─────────────────────────────────
    let blogPosts: SanitySlugItem[] = []
    try {
        blogPosts = await sanityServerClient.fetch<SanitySlugItem[]>(
            `*[_type == "blogPost" && defined(slug.current)] | order(_updatedAt desc) {
                "slug": slug.current,
                _updatedAt
            }`
        )
    } catch (err) {
        console.error('[sitemap] Error fetching blogPosts:', err)
        // Fallback estático si Sanity no está disponible
        blogPosts = [
            { slug: 'ahorrar-calefaccion-paneles-sip' },
            { slug: 'top-10-casas-modulares-chile-2026' },
            { slug: 'modelos-casas-sip-tendencias' },
            { slug: 'prefabricadas-vs-tradicional' },
            { slug: 'ventajas-casas-sip-chile' },
            { slug: 'financiamiento-casas-prefabricadas-chile' },
            { slug: 'eficiencia-energetica-vivienda-chile' },
            { slug: 'permisos-municipales-construccion-chile' },
        ]
    }

    // ── 2. Slugs de Modelos de Casas desde Sanity ────────────────────────────
    let houseModels: SanitySlugItem[] = []
    try {
        houseModels = await sanityServerClient.fetch<SanitySlugItem[]>(
            `*[_type == "houseModel" && is_active != false && defined(slug.current)] | order(_updatedAt desc) {
                "slug": slug.current,
                _updatedAt
            }`
        )
    } catch (err) {
        console.error('[sitemap] Error fetching houseModels:', err)
        houseModels = []
    }

    // ── 3. Categorías disponibles ─────────────────────────────────────────────
    let categories: string[] = []
    try {
        categories = await sanityServerClient.fetch<string[]>(
            `array::unique(*[_type == "houseModel" && is_active != false && defined(category)].category)`
        )
    } catch (err) {
        console.error('[sitemap] Error fetching categories:', err)
        categories = []
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Construcción del Sitemap
    // ─────────────────────────────────────────────────────────────────────────

    // Páginas estáticas principales
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/terminos`,
            lastModified: new Date('2026-03-02'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Posts de blog dinámicos
    const blogUrls: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: toDate(post._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Páginas de modelo/producto individuales
    const modelUrls: MetadataRoute.Sitemap = (houseModels || []).map((model) => ({
        url: `${BASE_URL}/modelo/${model.slug}`,
        lastModified: toDate(model._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Páginas de búsqueda por categoría (filtros semánticos)
    const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
        url: `${BASE_URL}/?categoria=${encodeURIComponent(cat)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    console.log(`[sitemap] Total URLs: ${staticPages.length + modelUrls.length + blogUrls.length + categoryUrls.length} (modelos: ${modelUrls.length}, blog: ${blogUrls.length}, categorias: ${categoryUrls.length})`)

    return [
        ...staticPages,
        ...modelUrls,
        ...blogUrls,
        ...categoryUrls,
    ]
}
