import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.solocasaschile.com'

    // Here we would ideally map over all blog posts, but we'll include a few
    const blogPosts = [
        'ahorrar-calefaccion-paneles-sip',
        'top-10-casas-modulares-chile-2026',
        'modelos-casas-sip-tendencias',
        'prefabricadas-vs-tradicional',
        'ventajas-casas-sip-chile',
        'financiamiento-casas-prefabricadas-chile',
        'eficiencia-energetica-vivienda-chile',
        'permisos-municipales-construccion-chile'
    ]

    const blogUrls: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...blogUrls
    ]
}
