"use client";

import React from "react";
import { Database, FileText, Globe, Server, Cloud, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DataSourcesPage() {
  const sources = [
    {
      id: "database",
      name: "Databases",
      description: "Connect your PostgreSQL, MySQL, or MongoDB databases to chat with your live data.",
      icon: Database,
      href: "/dashboard/data-sources/database",
      availability: "Available",
    },
    {
      id: "documents",
      name: "Documents",
      description: "Upload PDF, CSV, and Excel files to build your knowledge base.",
      icon: FileText,
      href: "/dashboard/library",
      availability: "Available",
    },
    {
      id: "website",
      name: "Websites",
      description: "Automatically scan and index information from any website or documentation.",
      icon: Globe,
      href: "#",
      availability: "Coming Soon",
    },
    {
      id: "notion",
      name: "Cloud Apps",
      description: "Sync data from Notion, Google Drive, and other cloud workspaces.",
      icon: Cloud,
      href: "#",
      availability: "Coming Soon",
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 px-4">
      
      {/* HEADER SECTION */}
      <div className="relative pt-8 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[1px] w-12 bg-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Connect Your Knowledge</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white">
              Data <span className="text-red-600">Sources</span>
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] max-w-xl leading-relaxed">
              Import your company's information. Connect your databases or upload documents to start chatting with your data using AI.
            </p>
          </div>
        </div>
      </div>

      {/* SOURCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sources.map((source, idx) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
          >
            <Link 
              href={source.href}
              className={`group relative block p-10 rounded-[2.5rem] bg-black border border-white/5 hover:border-red-600/30 transition-all duration-700 overflow-hidden ${source.availability === 'Coming Soon' ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-red-600/0 group-hover:from-red-600/[0.03] transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col h-full gap-8">
                <div className="flex items-start justify-between">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-red-600/50 group-hover:bg-red-600/5 transition-all duration-500">
                    <source.icon className="w-8 h-8 text-white group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-black uppercase tracking-tight italic group-hover:text-white transition-colors">
                    {source.name}
                  </h3>
                  <p className="text-white/40 text-xs font-medium leading-relaxed tracking-wide group-hover:text-white/60 transition-all">
                    {source.description}
                  </p>
                </div>

                <div className="mt-4 pt-8 border-t border-white/5 flex items-center justify-between text-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-red-600 transition-all">
                    {source.availability === 'Coming Soon' ? 'Coming Soon' : 'Connect Now'}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-red-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* FOOTER CALL-TO-ACTION */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative group overflow-hidden bg-white/[0.01] border border-white/5 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center group-hover:border-red-600/40 transition-all duration-500">
            <Server className="w-6 h-6 text-white/20 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="space-y-1 text-white">
            <h4 className="text-lg font-black uppercase tracking-tighter italic">Need something else?</h4>
            <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest max-w-md">
              We can build custom connections for your specific business needs. 
            </p>
          </div>
        </div>
        
        <button className="relative z-10 px-10 py-5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl">
          Contact Sales
        </button>

        <div className="absolute -left-20 bottom-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>
    </div>
  );
}