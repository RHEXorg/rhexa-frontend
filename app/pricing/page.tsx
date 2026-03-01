"use client";

import React, { useState } from "react";
import { 
  Check, 
  ArrowRight,
  Globe,
  ShieldCheck,
  Zap,
  Info,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";

const FAQ_DATA = [
  {
    q: "Can I upgrade or downgrade my plan at any time?",
    a: "Yes. You can adjust your subscription within your account settings. Changes to higher tiers are processed immediately, while downgrades take effect at the end of your current billing cycle."
  },
  {
    q: "How secure is my proprietary data?",
    a: "We employ banking-grade AES-256 encryption. Your data is isolated in private silos and is never utilized for training public models. We prioritize your intellectual property above all else."
  },
  {
    q: "Do you offer custom enterprise integrations?",
    a: "Our Enterprise tier includes a dedicated engineering partner to help build custom connectors for your specific legacy systems and internal databases."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: 0,
      description: "Experience the power of RheXa intelligence.",
      features: ["1 Knowledge Base", "50 Monthly Queries", "Standard Support", "Basic Analytics"],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Professional",
      price: isAnnual ? 9 : 12,
      description: "The standard for growing teams and researchers.",
      features: ["10 Knowledge Bases", "Unlimited Queries", "Priority Email Support", "Advanced RAG Engine", "Custom Widget Themes"],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Architect",
      price: isAnnual ? 18 : 24,
      description: "For power users requiring deep API integration.",
      features: ["100 Knowledge Bases", "Unlimited Queries", "API Access", "Full White-labeling", "Priority Engineering Support"],
      cta: "Go Architect",
      featured: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored infrastructure for global organizations.",
      features: ["Unlimited Knowledge", "Dedicated Instance", "SSO & SAML", "99.9% Uptime SLA", "On-premise Options"],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30">
      <Header />
      
      {/* 1. Elegant Header */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-red-600/5 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block"
          >
            Flexible Investment
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Invest in your <br />
            <span className="italic font-serif text-zinc-400">Collective Intelligence.</span>
          </motion.h1>
          
          {/* Refined Toggle */}
          <div className="flex items-center justify-center gap-5 mt-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-zinc-500'} transition-colors`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-16 h-8 bg-zinc-900 rounded-full border border-zinc-800 p-1 relative flex items-center shadow-inner"
            >
              <motion.div 
                animate={{ x: isAnnual ? 32 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-xl"
              />
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-zinc-500'} transition-colors`}>Annually</span>
              <span className="bg-red-500/10 text-red-500 text-[10px] px-2.5 py-1 rounded-full border border-red-500/20 font-bold">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Pricing Matrix */}
      <section className="max-w-[1400px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[32px] border transition-all duration-500 group ${
                plan.featured 
                ? 'bg-zinc-900/40 border-red-500/30 shadow-[0_20px_50px_rgba(153,27,27,0.1)]' 
                : 'bg-zinc-950/20 border-white/5 hover:border-white/10'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-xl font-bold mb-3">{plan.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-zinc-500 text-sm font-medium">/mo</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href={plan.name === "Enterprise" ? "/contact" : "/dashboard"}
                className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plan.featured 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Integration Showcase - Clean & Visual */}
      <section className="py-32 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Integrates with your <br /> 
              existing <span className="text-red-500">ecosystem.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl">
              RheXa was built to be invisible. Deploy your intelligent agent via a single line of code across any platform in minutes.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {['E-Commerce', 'SaaS Apps', 'Internal Wikis', 'Static Blogs'].map((item) => (
                <div key={item} className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/30 p-2 rounded-[40px] border border-white/5 backdrop-blur-sm">
            <div className="bg-[#050505] rounded-[32px] p-10 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">One-Line Integration</span>
              </div>
              <div className="bg-zinc-950 p-6 rounded-2xl font-mono text-sm text-zinc-400 border border-white/5 overflow-x-auto">
                <span className="text-red-500">&lt;script</span> <br />
                &nbsp;&nbsp;src="https://rhexa.ai/widget.js" <br />
                &nbsp;&nbsp;data-id="YOUR_KEY" <br />
                <span className="text-red-500">&gt;&lt;/script&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Elegant FAQ */}
      <section className="py-32 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="group pb-6 border-b border-white/5">
              <h4 className="text-lg font-semibold flex items-center justify-between cursor-pointer group-hover:text-red-500 transition-colors">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:rotate-180 transition-all" />
              </h4>
              <p className="mt-4 text-zinc-500 text-sm leading-relaxed max-w-2xl">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}