import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "RheXa | Professional AI Chatbot & Knowledge Base",
    template: "%s | RheXa"
  },
  description: "RheXa is the ultimate AI chatbot platform. Transform your documents and databases into a professional, intelligent AI assistant in minutes. Rhes, RHEXA, AI Chatbot, RAG solution.",
  keywords: ["RHEXA", "RheXa", "Rhex", "AI Chatbot", "Custom AI", "Knowledge Base AI", "Enterprise AI", "RAG Platform", "No-code AI", "Website Chatbot"],
  authors: [{ name: "RheXa Team" }],
  creator: "RheXa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rhexa.com",
    title: "RheXa | Professional AI Chatbot & Knowledge Base",
    description: "Build a trillion-dollar AI assistant for your business using your own files and databases. Simple, powerful, and futuristic.",
    siteName: "RheXa",
    images: [
      {
        url: "/Tlogo.png",
        width: 800,
        height: 600,
        alt: "RheXa AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RheXa | Professional AI Chatbot & Knowledge Base",
    description: "Build a trillion-dollar AI assistant for your business using your own files and databases.",
    images: ["/Tlogo.png"],
    creator: "@rhexa_ai",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LayoutProvider>
            <ProfileProvider>
            <Toaster position="top-right" />
            <div className="flex flex-col min-h-screen">
              <div className="flex-1">
                {children}
              </div>
              <GlobalFooter />
            </div>
            </ProfileProvider>
          </LayoutProvider>
        </AuthProvider>
        <script 
  src="http://127.0.0.1:8000/static/widget.js" 
  data-widget-key="dc49aead-97bd-4293-bb0c-f3b26b53387d" 
  data-api-url="http://127.0.0.1:8000"
  async
></script>
      </body>
    </html>
  );
}
