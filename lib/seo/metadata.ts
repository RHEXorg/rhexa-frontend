import type { Metadata } from "next"

interface SEOMetadataProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  author?: string
  publishedTime?: string
  updatedTime?: string
}

/**
 * Generates SEO metadata for a page
 * Ensures consistency across all pages
 */
export function generatePageMetadata(props: SEOMetadataProps): Metadata {
  const {
    title,
    description,
    image = "https://rhexa.com/Tlogo.png",
    url = "https://rhexa.com",
    type = "website",
    author = "RheXa Team",
    publishedTime,
    updatedTime,
  } = props

  return {
    title,
    description,
    keywords: [
      "RheXa",
      "AI Chatbot",
      "Knowledge Base",
      "Enterprise AI",
      "RAG Platform",
    ],
    authors: [{ name: author }],
    creator: "RheXa",
    openGraph: {
      type,
      locale: "en_US",
      url,
      title,
      description,
      siteName: "RheXa",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(updatedTime && { modifiedTime: updatedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@rhexa_ai",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generates structured data (JSON-LD) for a page
 */
export function generateStructuredData(
  type: "Organization" | "LocalBusiness" | "Article" | "Product",
  data: Record<string, unknown>
) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  }

  return JSON.stringify({ ...baseSchema, ...data })
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumb(items: Array<{ name: string; url: string }>) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  })
}

/**
 * Generates FAQPage structured data
 */
export function generateFAQ(
  faqs: Array<{ question: string; answer: string }>
) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  })
}
