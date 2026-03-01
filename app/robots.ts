import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/'],
                disallow: [
                    '/api/',
                    '/admin/',
                    '/*.json$',
                    '/dashboard/',
                    '/auth/',
                ],
                crawlDelay: 1,
            },
            {
                userAgent: 'AhrefsBot',
                disallow: ['/'],
            },
            {
                userAgent: 'SemrushBot',
                disallow: ['/'],
            },
        ],
        sitemap: 'https://rhexa.com/sitemap.xml',
        host: 'https://rhexa.com',
    }
}
