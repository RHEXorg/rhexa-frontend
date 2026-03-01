import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LayoutProvider } from "@/lib/context/LayoutContext";
import { ProfileProvider } from "@/lib/context/ProfileContext";
import { GlobalFooter } from "@/components/GlobalFooter";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: "RheXa - AI Chatbot Platform & Knowledge Base Solution",
    template: "%s | RheXa",
  },
  description: "RheXa is the ultimate AI-powered chatbot platform. Transform your documents and databases into a professional, intelligent AI assistant in minutes. Enterprise-grade RAG solution with no-code setup.",
  keywords: [
    "RHEXA",
    "RheXa",
    "AI Chatbot",
    "Custom AI Assistant",
    "Knowledge Base AI",
    "Enterprise AI",
    "RAG Platform",
    "Retrieval Augmented Generation",
    "No-code AI",
    "Website Chatbot",
    "AI Document Processing",
    "Conversational AI",
    "Business Intelligence",
    "AI Solutions"
  ],
  
  // Author and Creator Information
  authors: [{ name: "RheXa Team", url: "https://rhexa.com" }],
  creator: "RheXa",
  publisher: "RheXa Inc.",

  // SEO Tags
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: "https://rhexa.com",
    languages: {
      "en-US": "https://rhexa.com",
    },
  },

  // Open Graph for Social Sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rhexa.com",
    siteName: "RheXa",
    title: "RheXa - Professional AI Chatbot & Knowledge Base Solution",
    description: "Transform documents and databases into intelligent AI assistants. Enterprise-grade RAG platform with no-code setup. Start building in minutes.",
    images: [
      {
        url: "https://rhexa.com/Tlogo.png",
        width: 1200,
        height: 630,
        alt: "RheXa AI Platform Logo",
        type: "image/png",
      },
      {
        url: "https://rhexa.com/Tlogo.png",
        width: 800,
        height: 600,
        alt: "RheXa - AI Chatbot Platform",
        type: "image/png",
      },
    ],
  },

  // Twitter Card Optimization
  twitter: {
    card: "summary_large_image",
    title: "RheXa - AI Chatbot Platform & Knowledge Base",
    description: "Intelligence meets simplicity. Build sophisticated AI assistants from your data in minutes.",
    images: ["https://rhexa.com/Tlogo.png"],
    creator: "@rhexa_ai",
    site: "@rhexa_ai",
  },

  // Additional SEO Configuration
  category: "Technology",
  classification: "Business Software",
  
  // Verification and Analytics
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"} />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload Critical Resources */}
        <link rel="preload" as="script" href="/Tlogo.png" />

        {/* Favicon and Apple Icon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/Tlogo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Color Scheme */}
        <meta name="color-scheme" content="dark light" />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || ""}`}
          strategy="afterInteractive"
          async
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || ""}');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LayoutProvider>
            <ProfileProvider>
              <Toaster position="top-right" />
              <div className="flex flex-col min-h-screen">
                <main className="flex-1" role="main">
                  {children}
                </main>
                <footer role="contentinfo">
                  <GlobalFooter />
                </footer>
              </div>
            </ProfileProvider>
          </LayoutProvider>
        </AuthProvider>

        {/* RheXa Widget Script - Production Ready */}
        <Script 
          src={`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/static/widget.js`}
          data-widget-key={process.env.NEXT_PUBLIC_WIDGET_KEY || "dc49aead-97bd-4293-bb0c-f3b26b53387d"}
          data-api-url={process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}
          async
          strategy="lazyOnload"
        />

        {/* Structured Data - Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "RheXa",
              url: "https://rhexa.com",
              logo: "https://rhexa.com/Tlogo.png",
              description: "Professional AI chatbot and knowledge base platform",
              sameAs: [
                "https://twitter.com/rhexa_ai",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "support@rhexa.com",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
