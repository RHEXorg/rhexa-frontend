"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { CosmicPlasma } from "./CosmicPlasma";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Cosmic Plasma Interactive Background */}
      <CosmicPlasma />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 pointer-events-none z-[1]" />
      
      {/* Floating Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-[10%] w-64 h-64 md:w-96 md:h-96 bg-accent/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          {/* Main Headline */}
          <motion.h1 
            variants={fadeInUp}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-5xl"
          >
            <span className="text-foreground">Transform Your Data with</span>
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                RheXa AI Intelligence
              </span>
              {/* Underline decoration */}
              <motion.svg
                viewBox="0 0 400 12"
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/40"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 8 Q100 2, 200 8 T398 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-muted max-w-3xl leading-relaxed font-light"
          >
            The definitive <span className="text-foreground font-medium">RheXa (Rhex)</span> AI foundation. This system orchestrates fragmented 
            data into unified, high-fidelity intelligence. Build your custom 
            <span className="text-foreground font-medium"> AI Chatbot</span> engineered for 
            absolute precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link 
              href="/signup" 
              className="group relative px-10 py-5 bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold rounded-2xl flex items-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
              {/* Button shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Start Your Transformation</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-28 grid grid-cols-1 gap-8 px-2 md:grid-cols-3 lg:mt-40"
        >
          {/* Card 1 - High-Velocity Ingestion */}
          <motion.div 
            variants={scaleIn}
            className="group relative h-full"
          >
            <div className="relative flex h-full flex-col items-start overflow-hidden rounded-[2rem] p-10 transition-all duration-500">
              {/* Minimalist Abstract Graphic instead of icon */}
              <div className="relative mb-10 flex h-20 w-20 items-center justify-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-primary/20"
                />
                <motion.div 
                  initial={{ rotate: 360 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-t border-r border-primary/40"
                />
                <div className="relative h-[2px] w-8 bg-primary transition-all duration-500 group-hover:w-12" />
                <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_#991b1b]" />
              </div>

              <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">High-Velocity Ingestion</h3>
              <p className="flex-grow text-base font-normal leading-relaxed text-slate-300">
                Engineer your competitive advantage with millisecond-latency ingestion pipelines, optimized for massive real-time data orchestration.
              </p>
              
              <div className="mt-10 flex w-full items-center justify-between border-t border-white/5 pt-8">
                <div>
                  <span className="block text-4xl font-extrabold tracking-tighter text-white transition-all group-hover:text-primary">10x</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Peak Velocity</span>
                </div>
                <div className="text-right">
                  <span className="uppercase tracking-widest text-[11px] font-medium text-slate-400">Architecture</span>
                  <p className="text-sm font-semibold text-white">Edge-Optimized</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Cognitive Synthesis */}
          <motion.div 
            variants={scaleIn}
            className="group relative h-full"
          >
            <div className="relative flex h-full flex-col items-start overflow-hidden rounded-[2rem] p-10 transition-all duration-500">
              {/* Minimalist Abstract Graphic - Synthesis Metaphor */}
              <div className="relative mb-10 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute h-16 w-16 border border-primary/20 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="h-10 w-10 border border-primary/40 rounded-full"
                  />
                </div>
                {/* Converging lines metaphor */}
                {[0, 90, 180, 270].map((rot) => (
                  <motion.div
                    key={rot}
                    initial={{ rotate: rot }}
                    animate={{ rotate: rot, x: [0, 4, 0] }}
                    transition={{ duration: 3, delay: rot/90 * 0.5, repeat: Infinity }}
                    className="absolute h-[1px] w-6 bg-gradient-to-r from-primary to-transparent"
                    style={{ transformOrigin: 'center left', left: '50%' }}
                  />
                ))}
              </div>

              <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">Cognitive Synthesis</h3>
              <p className="flex-grow text-base font-normal leading-relaxed text-slate-300">
                Fusing disparate neural patterns into a single cohesive stream of high-fidelity insight, eliminating data silos through advanced algorithmic cross-referencing.
              </p>
              
              <div className="mt-10 flex w-full items-center justify-between border-t border-white/5 pt-8">
                <div>
                  <span className="block text-4xl font-extrabold tracking-tighter text-white transition-all group-hover:text-primary">99.2%</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Synthesis Fidelity</span>
                </div>
                <div className="text-right">
                  <span className="uppercase tracking-widest text-[11px] font-medium text-slate-400 font-mono">Kernel</span>
                  <p className="text-sm font-semibold text-white">Neural-Sync</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Sovereign Architecture */}
          <motion.div 
            variants={scaleIn}
            className="group relative h-full"
          >
            <div className="relative flex h-full flex-col items-start overflow-hidden rounded-[2rem] p-10 transition-all duration-500">
              {/* Minimalist Abstract Graphic - Sovereignty Metaphor */}
              <div className="relative mb-10 flex h-20 w-20 items-center justify-center">
                <div className="relative h-12 w-12 flex items-center justify-center">
                   <motion.div 
                      animate={{ height: ["20%", "60%", "20%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-[2px] bg-primary mx-1"
                   />
                   <motion.div 
                      animate={{ height: ["60%", "100%", "60%"] }}
                      transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
                      className="w-[2px] bg-primary mx-1"
                   />
                   <motion.div 
                      animate={{ height: ["40%", "80%", "40%"] }}
                      transition={{ duration: 3, delay: 1, repeat: Infinity }}
                      className="w-[2px] bg-primary mx-1 shadow-[0_0_15px_rgba(153,27,27,0.8)]"
                   />
                </div>
                <div className="absolute inset-0 border border-white/5 rounded-xl group-hover:border-primary/20 transition-colors" />
              </div>

              <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">Sovereign Architecture</h3>
              <p className="flex-grow text-base font-normal leading-relaxed text-slate-300">
                Uncompromising data autonomy engineered for highly regulated ecosystems. Complete isolation of intellectual property within your exclusive neural enclave.
              </p>
              
              <div className="mt-10 flex w-full items-center justify-between border-t border-white/5 pt-8">
                <div>
                  <span className="block text-4xl font-extrabold tracking-tighter text-white transition-all group-hover:text-primary">Grade A</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Sovereignty Rating</span>
                </div>
                <div className="text-right">
                  <span className="uppercase tracking-widest text-[11px] font-medium text-slate-400 font-mono">Infrastructure</span>
                  <p className="text-sm font-semibold text-white">Zero-Trust VNET</p>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>


      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
};
