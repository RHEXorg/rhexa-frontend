"use client";

import React from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  FileText, 
  UserCheck, 
  ArrowLeft,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Data Acquisition",
      content: "We ingest only the essential telemetry required for neural processing: authentication vectors, organizational metadata, and proprietary documents destined for your private RAG instances."
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Synthesis",
      content: "Your intellectual property is siloed. We utilize zero-knowledge architecture ensuring your documents never bleed into public training sets or global LLM weights."
    },
    {
      icon: Eye,
      title: "Encrypted Transit",
      content: "All data streams are secured via TLS 1.3 and AES-256-GCM. We treat every bit of information as a high-value asset, shielded from external interception."
    },
    {
      icon: UserCheck,
      title: "Sovereign Rights",
      content: "Full compliance with GDPR and CCPA is our baseline. You maintain absolute command over your data—export, scrub, or incinerate your records instantly via the command console."
    },
    {
      icon: Fingerprint,
      title: "Identity Protection",
      content: "We do not engage in cross-site tracking or behavioral fingerprinting. Our cookies exist solely to maintain session integrity and workspace state."
    }
  ];

  return (
    <main className="min-h-screen bg-[#000000] text-white selection:bg-red-950 selection:text-red-500">
      <Header />
      
      {/* 1. High-Authority Header */}
      <section className="relative pt-44 pb-24 px-6">
        {/* Deep Red Ambient Pulse */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-red-900/10 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-red-800 hover:text-red-500 mb-16 transition-all group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Exit to Workspace
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-12 bg-red-900" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Confidentiality Protocol</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85]">
              Privacy <br />
              <span className="italic font-serif text-red-900">Architecture.</span>
            </h1>

            <div className="max-w-2xl pt-8">
              <p className="text-xl md:text-2xl text-white/40 font-light leading-relaxed">
                At RheXa, we don't just "store" data—we <span className="text-white font-medium">fortify</span> it. Our privacy systems are engineered to ensure your organization’s intelligence remains entirely yours.
              </p>
            </div>

            <div className="flex gap-12 border-t border-red-950/40 pt-12 mt-12">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Protocol Version</p>
                <p className="text-sm font-mono text-red-600/60">v1.2 // ALPHA</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Effective Date</p>
                <p className="text-sm font-mono text-red-600/60">FEB.05.2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Tactical Clause List */}
      <section className="max-w-5xl mx-auto px-6 pb-44">
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-12 hover:bg-red-950/5 transition-all duration-500 rounded-[40px] border border-transparent hover:border-red-900/20"
            >
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center gap-4">
                   <section.icon className="w-5 h-5 text-red-700 group-hover:text-red-500 transition-colors" />
                   <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors">{section.title}</h2>
                </div>
              </div>
              
              <div className="md:col-span-8">
                <p className="text-lg text-white/40 leading-relaxed font-light group-hover:text-white/80 transition-all">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. DPO / Security Brief Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-40 p-1 bg-gradient-to-br from-red-900/40 to-black rounded-[50px]"
        >
          <div className="bg-black p-12 md:p-20 rounded-[48px] relative overflow-hidden">
            {/* Subtle background radar effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-900/10 rounded-full animate-ping opacity-20" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Security Clearance</span>
                </div>
                <h3 className="text-4xl font-bold tracking-tighter">Secure Inquiries.</h3>
                <p className="text-white/40 text-lg leading-relaxed">
                  For formal Data Processing Agreements (DPA) or deep-dive security audits, contact our specialized Security Architect team.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a 
                  href="mailto:rhexorg@gmail.com" 
                  className="w-full py-6 bg-white text-black text-center font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                >
                  Direct Email
                </a>
                <Link 
                  href="/contact" 
                  className="w-full py-6 bg-transparent border border-red-900/40 text-red-500 text-center font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-red-950/20 transition-all"
                >
                  Submit Official Request
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="py-20 text-center border-t border-red-950/20">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-red-950">
          RHX PROTECT // END-TO-END SOVEREIGNTY
        </p>
      </footer>
    </main>
  );
}