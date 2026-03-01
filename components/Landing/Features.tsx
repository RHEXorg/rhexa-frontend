"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  MessageSquareShare, 
  Database, 
  Layers, 
  Users 
} from "lucide-react";

const featureList = [
  {
    icon: FileText,
    id: "01",
    title: "Multi-Format Ingestion",
    description: "High-velocity extraction for PDF, CSV, TXT, and Excel. Automated pipeline processing."
  },
  {
    icon: Search,
    id: "02",
    title: "Semantic Search",
    description: "Vector-based similarity indexing. Neural retrieval beyond simple keyword matching."
  },
  {
    icon: MessageSquareShare,
    id: "03",
    title: "Insightful Chat",
    description: "Direct interface with isolated knowledge bases. Full contextual history retention."
  },
  {
    icon: Database,
    id: "04",
    title: "Isolated Vector DB",
    description: "Proprietary FAISS indexing per organization. Zero-leakage data architecture."
  },
  {
    icon: Layers,
    id: "05",
    title: "Smart Chunking",
    description: "Recursive semantic splitting. Preserving context integrity through deep-layer analysis."
  },
  {
    icon: Users,
    id: "06",
    title: "Admin Dashboard",
    description: "Enterprise-grade governance. Centralized control of users and global data libraries."
  }
];

export const Features = () => {
  return (
    <section id="features" className="relative py-32 bg-black border-t border-zinc-900">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header Module */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-red-600" />
              <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.5em]">System Capabilities</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
              Core <br />
              <span className="text-zinc-800">Protocols</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm uppercase tracking-widest max-w-sm text-left md:text-right leading-relaxed font-light">
            Engineered for high-throughput intelligence. Converting raw data into structural dominance.
          </p>
        </div>

        {/* The Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-zinc-900">
          {featureList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative p-10 border-r border-b border-zinc-900 hover:bg-zinc-950/50 transition-all duration-500 overflow-hidden"
            >
              {/* Feature ID */}
              <span className="absolute top-6 right-10 text-[10px] font-mono text-zinc-800 group-hover:text-red-900 transition-colors">
                // {feature.id}
              </span>

              {/* Icon & Title */}
              <div className="relative z-10">
                <div className="mb-8 relative inline-block">
                  <feature.icon className="w-8 h-8 text-white group-hover:text-red-600 transition-colors duration-500" />
                  <div className="absolute -inset-2 bg-red-600/0 group-hover:bg-red-600/10 rounded-full blur-xl transition-all" />
                </div>
                
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 group-hover:translate-x-2 transition-transform duration-500">
                  {feature.title}
                </h3>
                
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed uppercase tracking-tighter group-hover:text-zinc-300 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Hover Interactive Elements */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-700" />
              <div className="absolute top-0 right-0 h-0 w-[1px] bg-red-600 group-hover:h-full transition-all duration-700" />
              
              {/* Subtle Scanline Effect on Hover */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(153,27,27,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};