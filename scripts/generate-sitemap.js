/**
 * Generates a sitemap.xml file for the Next.js application
 * This script should be run as part of the build process
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://rhexa.com';

const pages = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
  '/integrations',
];

const generateSitemapXml = () => {
  const entries = pages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${getChangeFrequency(page)}</changefreq>
    <priority>${getPriority(page)}</priority>
  </url>
    `
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};

const getChangeFrequency = (page) => {
  const frequencyMap = {
    '/': 'weekly',
    '/pricing': 'weekly',
    '/integrations': 'weekly',
    '/about': 'monthly',
    '/contact': 'monthly',
    '/security': 'monthly',
    '/privacy': 'yearly',
    '/terms': 'yearly',
  };

  return frequencyMap[page] || 'monthly';
};

const getPriority = (page) => {
  const priorityMap = {
    '/': 1.0,
    '/login': 0.9,
    '/signup': 0.9,
    '/pricing': 0.8,
    '/about': 0.7,
    '/contact': 0.7,
    '/integrations': 0.7,
    '/security': 0.6,
    '/privacy': 0.5,
    '/terms': 0.5,
  };

  return priorityMap[page] || 0.5;
};

try {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const sitemapContent = generateSitemapXml();

  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log('✓ Sitemap.xml generated successfully');
} catch (error) {
  console.error('✗ Error generating sitemap:', error);
  process.exit(1);
}
