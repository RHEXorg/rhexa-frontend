"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Copy, Check, ArrowLeft, ExternalLink, Shield, Zap, Code } from "lucide-react";
import Link from "next/link";

export default function ShopifyIntegrationPage() {
  const [copied, setCopied] = useState(false);

  const scriptTag = `<script src="https://widget.rhexa.ai/agent.js" data-widget-key="YOUR_WIDGET_KEY"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Access Your Store Settings",
      description: "Log in to your Shopify admin dashboard and navigate to the settings.",
      substeps: [
        "Click on 'Settings' in the bottom left corner",
        "Select 'Checkout' or 'Online Store' (depending on your Shopify plan)",
        "Look for 'Additional scripts' or 'Custom code' section"
      ]
    },
    {
      number: "02",
      title: "Find the Footer/Header Section",
      description: "Locate where you can add custom scripts to your store.",
      substeps: [
        "For Shopify: Go to Online Store > Themes > Actions > Edit code",
        "For Wix: Go to Settings > Website > Tracking & Analytics or Edit Site",
        "For WordPress: Use a plugin like 'Header and Footer Scripts' or edit footer.php"
      ]
    },
    {
      number: "03",
      title: "Get Your Widget Key",
      description: "Retrieve your unique widget key from the RheXa dashboard.",
      substeps: [
        "Log in to your RheXa dashboard",
        "Navigate to 'Widgets' or 'Integration Settings'",
        "Copy your unique widget-key",
        "Keep this key safe as it identifies your AI bot"
      ]
    },
    {
      number: "04",
      title: "Paste the Script",
      description: "Add the RheXa script to your store with your widget key.",
      substeps: [
        "Replace 'YOUR_WIDGET_KEY' with your actual key from step 03",
        "Paste the complete script before the closing &lt;/body&gt; tag",
        "Click 'Save' or 'Publish'",
        "Your AI bot will appear on your store within 2 minutes"
      ]
    },
    {
      number: "05",
      title: "Customize & Test",
      description: "Configure your bot's appearance and behavior.",
      substeps: [
        "Go to RheXa Dashboard > Widget Settings",
        "Customize colors, position, and greeting message",
        "Test on your live store by opening a chat",
        "Monitor analytics from your RheXa dashboard"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Header />
      <div className="pt-24"></div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/integrations" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary mb-8 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Integrations
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] opacity-10 pointer-events-none" />
        
        <div className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
              <Zap className="w-4 h-4" /> Integration Guide
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Shopify, Wix & <span className="text-primary italic">WordPress</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl font-medium leading-relaxed">
              Add your RheXa AI bot to your store in minutes. No coding required. Perfect for e-commerce platforms and content websites.
            </p>
          </motion.div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Zap, label: "Lightning Fast", desc: "Deploy in under 5 minutes" },
              { icon: Code, label: "No Coding", desc: "Copy-paste integration" },
              { icon: Shield, label: "Secure", desc: "Isolated CSS & JS" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
              >
                <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{feature.label}</p>
                  <p className="text-xs text-muted">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Script Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
        >
          <h2 className="text-2xl font-black mb-4">Your Integration Script</h2>
          <p className="text-muted mb-6">Copy this script and paste it to your store footer:</p>
          
          <div className="relative">
            <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5">
              <code className="text-sm font-mono text-green-400">{scriptTag}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-16">Step-by-Step Setup</h2>
        
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start"
            >
              {/* Step Number */}
              <div className="md:col-span-1">
                <div className="text-6xl font-black text-primary/30 leading-none">{step.number}</div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-8 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                <p className="text-muted mb-6 font-medium">{step.description}</p>
                
                <div className="space-y-3">
                  {step.substeps.map((substep, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted/90">{substep}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform-Specific Tips */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-12 max-w-6xl mx-auto">Platform-Specific Tips</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Shopify",
              tips: [
                "Use theme.liquid file for global placement",
                "Script will load even with checkout.liquid",
                "CSS automatically isolates from theme styles",
                "Works with all Shopify plans"
              ]
            },
            {
              name: "Wix",
              tips: [
                "Use 'Custom Elements' for embed",
                "Works with Wix Editor and ADI",
                "Responsive design auto-adjusts",
                "No Wix code knowledge needed"
              ]
            },
            {
              name: "WordPress",
              tips: [
                "Use plugins: Header Footer Code Manager",
                "Or edit theme footer.php directly",
                "Works with all WordPress themes",
                "Compatible with WooCommerce stores"
              ]
            }
          ].map((platform, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-white/5 hover:border-primary/20 transition-colors"
            >
              <h3 className="text-xl font-black mb-6 text-primary">{platform.name}</h3>
              <ul className="space-y-4">
                {platform.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted/90">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-12">Troubleshooting</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              issue: "Widget not appearing?",
              solutions: [
                "Clear your browser cache and refresh",
                "Verify widget-key is correct",
                "Check if script is before closing body tag",
                "Wait 2-3 minutes after saving"
              ]
            },
            {
              issue: "Styling conflicts?",
              solutions: [
                "RheXa uses CSS isolation automatically",
                "Try adding CSS specificity rules",
                "Contact support if styles persist",
                "Check browser console for errors"
              ]
            },
            {
              issue: "Script not loading?",
              solutions: [
                "Verify CDN is accessible (no firewall blocks)",
                "Check for Content Security Policy (CSP) headers",
                "Test on incognito/private mode",
                "Review RheXa documentation"
              ]
            },
            {
              issue: "Bot not responding?",
              solutions: [
                "Ensure documents are uploaded to dashboard",
                "Check API keys are valid in settings",
                "Verify organization has credits",
                "Contact our support team"
              ]
            }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-surface/50 border border-white/5"
            >
              <h3 className="text-lg font-black mb-4 text-primary">{faq.issue}</h3>
              <ul className="space-y-3">
                {faq.solutions.map((solution, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted/90">{solution}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full scale-50 opacity-30" />
        
        <div className="relative space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to Deploy?
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto font-medium">
            Follow the steps above, paste the script, and your AI bot will be live in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent shadow-lg shadow-primary/20 transition-all"
            >
              Get Your Widget Key
            </Link>
            <a
              href="https://docs.rhexa.ai/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              View Full Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
