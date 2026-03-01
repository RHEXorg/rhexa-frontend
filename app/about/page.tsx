"use client";

import React from "react";
import { 
  Target, 
  ShieldCheck, 
  Heart,
  Globe,
  Database,
  Search,
  Cpu,
  ChevronRight,
  Fingerprint,
  Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Privacy_Vault",
      desc: "Enterprise-grade isolation. Zero-training policy on proprietary datasets. Your intelligence remains yours."
    },
    {
      icon: Target,
      title: "Precision_Engine",
      desc: "Retrieval accuracy prioritized over generic speed. Minimizing hallucinations through structural RAG mapping."
    },
    {
      icon: Fingerprint,
      title: "Neural_Partnership",
      desc: "We don't sell tools; we architect intelligence hubs. A dedicated partnership for knowledge liberation."
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600/30 font-sans overflow-x-hidden">
      <Header />
      
      {/* 1. Hero Dossier - Impact Header */}
      <section className="relative pt-40 pb-24 px-6 md:px-12 border-b border-zinc-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(153,27,27,0.08),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.6em]">System_Manifesto_v4.0</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-16">
              Data <br /> 
              <span className="text-red-600">Liberation</span> <br /> 
              Protocols.
            </h1>
            
            <div className="flex flex-col md:flex-row gap-12 items-start md:items-end justify-between">
              <p className="max-w-xl text-zinc-500 text-sm md:text-base uppercase tracking-widest leading-relaxed font-light border-l border-zinc-800 pl-8">
                RheXa exists to bridge the terminal gap between static documentation and enterprise action. 
                We engineer the neural infrastructure that powers the world's most secure intelligence hubs.
              </p>
              <div className="text-right">
                <span className="block text-[10px] text-zinc-700 font-mono tracking-widest uppercase mb-2">Build_ID: 2026.02.05</span>
                <span className="block text-[10px] text-red-900 font-mono tracking-widest uppercase">Location: Encryption_Cloud_01</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Tactical Directive - The Architecture */}
      <section className="py-40 px-6 md:px-12 bg-zinc-950/20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative aspect-square border border-zinc-900 group"
          >
            {/* The "Brain" UI - Abstract Representation */}
            <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
               <div className="relative w-2/3 h-2/3 border border-red-900/30 rounded-full flex items-center justify-center">
                  <div className="w-full h-[1px] bg-red-600/20 absolute rotate-45" />
                  <div className="w-full h-[1px] bg-red-600/20 absolute -rotate-45" />
                  <Cpu className="w-16 h-16 text-red-600 animate-pulse" />
               </div>
            </div>
            {/* Structural UI Markers */}
            <div className="absolute top-4 left-4 text-[9px] font-mono text-zinc-700 uppercase">Process_Mapping_Enabled</div>
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-zinc-700 uppercase tracking-widest">v4.0_Neural_Grid</div>
          </motion.div>

          <div className="space-y-12">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] text-white">
              Bridge the <br /> <span className="text-red-600">Latency</span> <br /> Between <br /> Knowledge & Result.
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed uppercase tracking-tighter max-w-xl">
              Static data is dead data. RheXa revives organizational memory through advanced RAG architecture, 
              ensuring that proprietary information is never hidden behind a search bar, but always present in the conversation.
            </p>
            <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 mt-8">
                <div className="p-6 bg-black flex flex-col gap-2">
                    <span className="text-red-600 text-xs font-black uppercase">99.9%</span>
                    <span className="text-zinc-600 text-[9px] uppercase tracking-widest">Retrieval_Precision</span>
                </div>
                <div className="p-6 bg-black flex flex-col gap-2">
                    <span className="text-white text-xs font-black uppercase">AES_256</span>
                    <span className="text-zinc-600 text-[9px] uppercase tracking-widest">Data_Isolation</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Structural Values Matrix */}
      <section className="py-40 px-6 md:px-12 border-t border-zinc-900 bg-black">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <h2 className="text-3xl font-black uppercase tracking-widest italic">Core_Values</h2>
            <div className="flex-1 h-[1px] bg-zinc-900" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {values.map((v) => (
              <div key={v.title} className="group border-l border-zinc-900 pl-10 hover:border-red-600 transition-all duration-700 cursor-crosshair">
                <div className="mb-10 text-zinc-800 group-hover:text-red-600 transition-colors">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4 text-white">{v.title}</h3>
                <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-tighter leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Terminal Initialization (CTA) */}
      <section className="relative py-48 px-6 overflow-hidden border-t border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,27,27,0.12)_0%,transparent_75%)]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-12 flex items-center justify-center gap-3">
             <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
             <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.5em]">Auth_Sequence_Ready</span>
          </div>
          
          <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-20">
            Start <br /> <span className="text-red-600">Execution.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              href="/dashboard" 
              className="group relative px-14 py-6 bg-red-600 text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all hover:bg-red-700 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Initalize_System <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/contact" 
              className="px-14 py-6 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-400 transition-all font-black uppercase tracking-[0.3em] text-[11px]"
            >
              Request_Access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}