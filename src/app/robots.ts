import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Permitir todos los bots en páginas públicas
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',      // Panel de administración B2B
                    '/api/',            // Endpoints de API internos
                    '/studio/',         // Sanity Studio CMS
                    '/(auth)/',         // Páginas de login/registro
                    '/_next/',          // Archivos internos de Next.js
                ],
            },
            {
                // Bloquear Googlebot completamente en áreas privadas
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/api/',
                    '/studio/',
                ],
            },
        ],
        sitemap: 'https://www.solocasaschile.com/sitemap.xml',
        host: 'https://www.solocasaschile.com',
    }
}
