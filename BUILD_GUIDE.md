# RheXa Frontend - Build & Deployment Guide

## 🚀 Production Build Guide

This document provides comprehensive instructions for building and deploying the RheXa frontend application with professional optimizations and SEO enhancements.

### Prerequisites

- Node.js 18+ and npm 9+
- Environment variables configured (see `.env.example`)
- Backend API running and accessible

### Environment Setup

1. **Copy and configure environment variables:**
```bash
cp .env.example .env.local
```

2. **Update `.env.local` with your values:**
```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_WIDGET_KEY=your-widget-key
NEXT_PUBLIC_GA_ID=your-ga-tracking-id
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
```

### Installation

Install dependencies:
```bash
npm install
```

### Validation & Testing

Before building, validate your code quality:

1. **Type checking:**
```bash
npm run type-check
```

2. **Linting:**
```bash
npm run lint
```

3. **Fix linting issues:**
```bash
npm run lint:fix
```

4. **Development mode:**
```bash
npm run dev
```

Visit `http://localhost:3000` to test locally.

### Production Build

Build the application for production:

```bash
npm run build
```

This command will:
- Compile TypeScript
- Optimize and minify JavaScript and CSS
- Generate optimized images
- Generate sitemap.xml
- Create production-ready output in `.next/` directory

### Build Optimization Features

The build process includes:

✓ **Image Optimization**
  - Automatic WebP/AVIF format conversion
  - Responsive image sizing
  - Lazy loading by default

✓ **Code Optimization**
  - Tree-shaking unused code
  - Code splitting for smaller chunks
  - Package import optimization

✓ **Performance**
  - SWC compiler for faster builds
  - CSS and JS minification
  - Source maps removed in production

✓ **Security**
  - Content Security Policy headers
  - XSS protection headers
  - Frame options protection
  - Referrer policy enforcement

✓ **SEO**
  - Dynamic sitemap generation
  - robots.txt configuration
  - Canonical URLs
  - Structured data (JSON-LD)
  - OpenGraph and Twitter cards

### Running Production Server

After building, start the production server:

```bash
npm start
```

The application will be available at `http://localhost:3000` (or your configured port).

### Bundle Analysis

Analyze your bundle size:

```bash
npm run analyze
```

This will show you which packages are consuming the most space.

### Performance Monitoring

The application includes:

- **Web Vitals Tracking** - Core Web Vitals are automatically tracked
- **Google Analytics Integration** - Metrics are sent to your GA account
- **Performance Observer** - Monitors resource loading times

Configure in `.env.local`:
```
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### SEO Checklist

- [ ] Metadata configured for all pages
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] robots.txt configured (`/robots.txt`)
- [ ] Structured data implemented (JSON-LD)
- [ ] OpenGraph images optimized
- [ ] Canonical URLs set
- [ ] Mobile meta tags configured
- [ ] Page descriptions are unique
- [ ] Heading hierarchy is correct
- [ ] Images have alt text

### Deployment

#### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
vercel deploy --prod
```

#### Docker

A Dockerfile for containerized deployment:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t rhexa-frontend .
docker run -p 3000:3000 rhexa-frontend
```

#### AWS, Google Cloud, or Other Platforms

Configure according to platform requirements, ensuring:
- Node.js 18+ runtime
- Environment variables are set
- Static assets are cached appropriately

### Monitoring & Logging

Set up monitoring for:

- Page load times
- API response times
- Error rates
- User analytics
- Search Console indexing status

### Troubleshooting

**Build fails with image optimization errors:**
```bash
npm run build -- --experimental-app-only
```

**Port already in use:**
```bash
npm start -- -p 3001
```

**Clear cache and rebuild:**
```bash
rm -rf .next
npm run build
```

### Performance Targets

Optimize for these metrics:

- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Contentful Paint (FCP):** < 1.8s
- **Time to First Byte (TTFB):** < 600ms

Monitor these in Google PageSpeed Insights and Search Console.

### Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Google Search Central](https://developers.google.com/search)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

For questions or issues, check the project documentation or contact the development team.
