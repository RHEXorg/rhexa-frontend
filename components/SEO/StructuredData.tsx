import Script from "next/script"

interface StructuredDataProps {
  data: Record<string, unknown>
  id?: string
}

/**
 * Component to inject structured data (JSON-LD) into the page
 * Improves SEO and rich snippets in search results
 */
export function StructuredData({ data, id = "structured-data" }: StructuredDataProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: BreadcrumbItem[]
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <StructuredData data={breadcrumbData} id="breadcrumb-schema" />
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQStructuredData({ faqs }: { faqs: FAQItem[] }) {
  const faqData = {
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
  }

  return <StructuredData data={faqData} id="faq-schema" />
}

export function ProductStructuredData({
  name,
  description,
  price,
  image,
  url,
}: {
  name: string
  description: string
  price: string
  image: string
  url: string
}) {
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }

  return <StructuredData data={productData} id="product-schema" />
}

export function ArticleStructuredData({
  headline,
  description,
  image,
  url,
  author,
  datePublished,
  dateModified,
}: {
  headline: string
  description: string
  image: string
  url: string
  author: string
  datePublished: string
  dateModified: string
}) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    url,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished,
    dateModified,
  }

  return <StructuredData data={articleData} id="article-schema" />
}
