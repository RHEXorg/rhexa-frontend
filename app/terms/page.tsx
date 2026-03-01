"use client";

import React from "react";
import { 
  Scale, 
  AlertTriangle, 
  CreditCard, 
  Copyright,
  ArrowLeft,
  Gavel,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

export default function TermsPage() {
  const sections = [
    {
      icon: Scale,
      title: "Acceptance of Terms",
      content: "By accessing the RheXa Intelligence suite, you enter into a binding legal covenant. Usage constitutes irrevocable acceptance of these governance protocols."
    },
    {
      icon: ShieldAlert,
      title: "Prohibited Directives",
      content: "Platform exploitation, unauthorized cryptographic extraction, and the bypassing of safety synthesis layers are strictly forbidden. Violation results in immediate terminal suspension."
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      content: "Client-uploaded data remains under exclusive client sovereignty. RheXa retains proprietary rights to all neural architectures, codebases, and synthetic logic systems."
    },
    {
      icon: CreditCard,
      title: "Fiscal Protocols",
      content: "Enterprise and Premium access are facilitated via recurring cycles. Cancellation is permitted at any stage; however, existing synthetic compute allocations remain non-refundable."
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Risk",
      content: "RheXa provides high-probability synthetic outputs. We assume no liability for institutional decisions. AI is a tool for augmentation, not a substitute for human oversight."
    },
    {
      icon: Gavel,
      title: "Jurisdiction",
      content: "These terms are governed by the highest legal standards of our registered domain. Any dispute shall be settled through confidential arbitration."
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-500">
      <Header />
      
      {/* 1. Cinematic Header */}
      <section className="relative pt-44 pb-24 px-6">
        {/* Deep Crimson Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-red-700 hover:text-red-500 mb-16 transition-all group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Return to Command
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-[ -0.06em] leading-tight">
              Governance <br />
              <span className="italic font-serif text-red-900">& Protocols.</span>
            </h1>
            
            <div className="mt-12 flex flex-col md:flex-row md:items-center gap-8 border-b border-red-950 pb-12">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-red-800 font-bold">Document ID</p>
                <p className="text-sm font-mono tracking-tighter text-red-600/60">RHX-2026-TERMS-ALPHA</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-red-800 font-bold">Last Updated</p>
                <p className="text-sm font-mono tracking-tighter text-red-600/60">FEBRUARY 05, 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. The Clauses - Ultra Deep Aesthetic */}
      <section className="max-w-5xl mx-auto px-6 pb-44">
        <div className="grid grid-cols-1 gap-4">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative p-10 rounded-[40px] bg-gradient-to-b from-red-950/5 to-transparent border border-red-950/20 hover:border-red-600/30 transition-all duration-700"
            >
              {/* Vertical accent line that appears on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-red-600 group-hover:h-1/2 transition-all duration-500" />
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-14 h-14 rounded-2xl bg-black border border-red-900/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_30px_rgba(153,0,0,0.2)] transition-all">
                  <section.icon className="w-6 h-6 text-red-600" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight text-red-500/90">{section.title}</h2>
                  <p className="text-lg text-white/50 leading-relaxed font-light max-w-3xl group-hover:text-white/80 transition-colors">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Final Legal Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-16 rounded-[60px] bg-[#050000] border border-red-950 text-center relative overflow-hidden"
        >
          {/* Subtle Red Pulse in background */}
          <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
          
          <div className="relative z-10 space-y-8">
            <h3 className="text-3xl font-bold tracking-tighter">Clarification Required?</h3>
            <p className="text-red-900 font-medium tracking-[0.2em] uppercase text-xs">Direct Line to Legal Counsel</p>
            
            <div className="flex justify-center">
              <Link href="/contact" className="group relative flex items-center gap-4 px-12 py-6 bg-red-600 text-white rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10">Initialize Inquiry</span>
                <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Footer Branding */}
      <footer className="py-12 text-center border-t border-red-950/30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-950">
          RheXa Neural Systems — 2026 Legal Framework
        </p>
      </footer>
    </main>
  );
}