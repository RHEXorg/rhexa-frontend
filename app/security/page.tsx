"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Zap, 
  EyeOff, 
  ArrowRight,
  Code,
  Terminal,
  Cpu,
  Activity
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      desc: "All neural assets are encrypted at rest via 256-bit Advanced Encryption Standard. In-transit packets are secured through enforced TLS 1.3 protocols."
    },
    {
      icon: ShieldCheck,
      title: "Governance & Audits",
      desc: "Architected for GDPR/CCPA sovereignty. SOC 2 Type II audit pathways are integrated into our core infrastructure roadmap."
    },
    {
      icon: Cpu,
      title: "Isolated Compute",
      desc: "Hosted on air-gapped AWS/GCP clusters with logical multi-tenant separation. Your intelligence never leaks across organizational boundaries."
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      desc: "24/7 threat detection and automated redundancy across 3 global regions. We maintain a hardware-level 99.9% availability SLA."
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-500">
      <Header />
      
      {/* 1. Hero: The Security Shield */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Cinematic Red Radial */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-red-900/10 blur-[180px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-950/20 border border-red-900/30 rounded-full">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Tier-1 Protection Enforced</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold tracking-[ -0.06em] leading-[0.85]">
              Sovereign <br />
              <span className="italic font-serif text-red-900">Security.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
              We fortify your organizational intelligence with military-grade protocols. Trust isn't requested—it is <span className="text-white">engineered.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Tactical Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-44 grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-12 rounded-[40px] bg-[#050000] border border-red-950/30 hover:border-red-600/50 transition-all duration-700"
          >
            <div className="w-14 h-14 rounded-2xl bg-black border border-red-900/20 flex items-center justify-center mb-8 group-hover:shadow-[0_0_30px_rgba(153,0,0,0.1)] transition-all">
              <f.icon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight mb-4">{f.title}</h3>
            <p className="text-white/40 text-lg font-light leading-relaxed group-hover:text-white/70 transition-colors">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 3. Deployment: The Engineering Suite */}
      <section className="bg-[#050000] border-y border-red-950/50 py-44 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            
            {/* Left: Deployment Logic */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold tracking-tighter">Instant <br /><span className="text-red-900 italic font-serif">Deployment.</span></h2>
                <p className="text-white/40 text-lg font-light">Zero-latency integration for any stack.</p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "No-Code CMS", sub: "Shopify, Wix, WordPress, Webflow" },
                  { title: "Enterprise Web", sub: "React, Next.js, Vue, Angular" },
                  { title: "Native Systems", sub: "Direct API & WebSocket Hooks" }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <span className="text-sm font-mono text-red-900 font-bold">0{idx+1}</span>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold">{step.title}</h4>
                      <p className="text-sm text-white/30 tracking-wide uppercase font-black">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: The Terminal Terminal */}
            <div className="lg:col-span-7">
              <div className="bg-black border border-red-900/30 rounded-[32px] overflow-hidden shadow-2xl shadow-red-900/10">
                <div className="flex items-center justify-between px-8 py-4 bg-red-950/10 border-b border-red-950/30">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-900" />
                    <div className="w-2 h-2 rounded-full bg-red-900" />
                    <div className="w-2 h-2 rounded-full bg-red-900" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-900">global_init.sh</span>
                </div>
                <div className="p-10 font-mono text-sm md:text-base leading-relaxed">
                  <p className="text-red-900/50 mb-2">// Initialize RheXa Intelligence</p>
                  <code className="text-red-500">
                    &lt;script <br />
                    &nbsp;&nbsp;src="https://rhexa.ai/agent.js" <br />
                    &nbsp;&nbsp;data-widget-key="<span className="text-white underline decoration-red-600">RHX_ALPHA_99</span>" <br />
                    &nbsp;&nbsp;async <br />
                    &gt;&lt;/script&gt;
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Global Infrastructure Diagram Placeholder */}
      <section className="py-44 max-w-5xl mx-auto px-6 text-center">
        <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-red-900 mb-20">Hardware Distribution Network</h3>
        
        
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
          <span className="text-xl font-bold tracking-[0.2em]">AWS</span>
          <span className="text-xl font-bold tracking-[0.2em]">GCP</span>
          <span className="text-xl font-bold tracking-[0.2em]">AZURE</span>
          <span className="text-xl font-bold tracking-[0.2em]">NVIDIA</span>
        </div>
      </section>

      {/* 5. Terminal CTA */}
      <section className="py-44 px-6 relative overflow-hidden text-center bg-red-950">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 space-y-12">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">Initialize <br /> <span className="text-black italic font-serif leading-none">Protection.</span></h2>
          <div className="flex justify-center">
            <Link href="/dashboard" className="px-16 py-8 bg-black text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group">
              Command Center
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-red-900/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-red-900/50">SECURED BY RHEXA ENCRYPTION LAYER v4.0</p>
      </footer>
    </main>
  );
}