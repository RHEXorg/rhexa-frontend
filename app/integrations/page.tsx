"use client";

import React from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Code, Layers } from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  const integrations = [
    {
      icon: ShoppingCart,
      title: "Shopify, Wix & WordPress",
      description: "E-commerce and content platforms",
      features: [
        "No coding required",
        "Copy-paste setup",
        "CSS isolation included",
        "Works on all plans"
      ],
      href: "/integrations/shopify",
      setupTime: "5 minutes",
      difficulty: "Easy",
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Code,
      title: "WooCommerce & CMS",
      description: "WordPress stores and content management",
      features: [
        "Multiple integration methods",
        "Plugin-based setup",
        "Theme-independent",
        "Auto-update compatible"
      ],
      href: "/integrations/woocommerce",
      setupTime: "5-10 minutes",
      difficulty: "Easy-Medium",
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Layers,
      title: "React, Next.js & Vue",
      description: "Modern JavaScript frameworks",
      features: [
        "Full TypeScript support",
        "High performance",
        "Deep customization",
        "Framework agnostic"
      ],
      href: "/integrations/react-nextjs",
      setupTime: "5-10 minutes",
      difficulty: "Medium",
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20"
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Header />
      <div className="pt-24"></div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] opacity-10 pointer-events-none" />
        
        <div className="relative space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
              <Layers className="w-4 h-4" /> Integration Guides
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Add RheXa to Your <span className="text-primary italic">Platform</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto font-medium leading-relaxed">
              Simple. Professional. Seamless. Get your AI bot live in minutes with our step-by-step integration guides for any platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integration Cards */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, i) => {
            const Icon = integration.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${integration.color} border ${integration.borderColor} hover:border-white/20 transition-all overflow-hidden`}
              >
                {/* Background glow */}
                <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
                
                <div className="relative space-y-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black mb-2">{integration.title}</h3>
                    <p className="text-sm text-muted/80 font-medium">{integration.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {integration.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted/90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs text-muted/60">
                      <p className="font-bold">{integration.difficulty}</p>
                      <p>{integration.setupTime}</p>
                    </div>
                    <Link
                      href={integration.href}
                      className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all flex items-center gap-2"
                    >
                      View Guide
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-16 max-w-6xl mx-auto text-center">Quick Start</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Choose Your Platform",
              desc: "Select the integration guide that matches your platform"
            },
            {
              step: "2",
              title: "Get Widget Key",
              desc: "Retrieve your unique widget key from RheXa Dashboard"
            },
            {
              step: "3",
              title: "Follow The Guide",
              desc: "Step-by-step instructions customized for your platform"
            },
            {
              step: "4",
              title: "Go Live",
              desc: "Your AI bot is live in minutes, start serving customers"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <span className="text-lg font-black text-primary">{item.step}</span>
              </div>
              <h3 className="font-black text-lg">{item.title}</h3>
              <p className="text-sm text-muted/80">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-16 text-center">Everything You Need</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Detailed Guides",
              desc: "Step-by-step instructions for every platform with screenshots"
            },
            {
              title: "Code Samples",
              desc: "Ready-to-use code snippets for all frameworks and platforms"
            },
            {
              title: "Troubleshooting",
              desc: "Common issues and solutions for quick problem resolution"
            },
            {
              title: "Platform Tips",
              desc: "Platform-specific best practices and optimization tips"
            },
            {
              title: "Video Tutorials",
              desc: "Video walkthrough for each integration method"
            },
            {
              title: "24/7 Support",
              desc: "Expert support team ready to help with your integration"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10"
            >
              <h3 className="font-black mb-2">{feature.title}</h3>
              <p className="text-sm text-muted/80">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-12 max-w-6xl mx-auto">Frequently Asked</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              q: "How long does integration take?",
              a: "Most integrations take 5-10 minutes with our step-by-step guides. Complex custom implementations may take longer."
            },
            {
              q: "Do I need coding knowledge?",
              a: "For Shopify/Wix/WordPress, no coding required. React/Vue integrations require basic JavaScript knowledge."
            },
            {
              q: "Will it affect my site performance?",
              a: "No. Our widget uses lazy loading and code splitting for minimal performance impact."
            },
            {
              q: "What if I get stuck?",
              a: "Each guide includes troubleshooting section. Contact our support team for personalized help."
            },
            {
              q: "Can I customize the widget?",
              a: "Yes! Customize colors, position, greeting message, and more in the RheXa Dashboard."
            },
            {
              q: "Is the integration mobile-friendly?",
              a: "Absolutely. The widget is fully responsive and works perfectly on all devices."
            }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-background border border-white/5"
            >
              <h3 className="font-black text-primary mb-3">{faq.q}</h3>
              <p className="text-sm text-muted/80 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full scale-50 opacity-30" />
        
        <div className="relative space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to Get <span className="text-primary italic">Started?</span>
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto font-medium">
            Choose your platform and follow our comprehensive guide to have your AI bot live in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#shopify"
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent shadow-lg shadow-primary/20 transition-all"
            >
              View All Integrations
            </a>
            <Link
              href="/contact"
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
