"use client";

import React, { useState } from "react";
import { 
  Send, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Mail,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/rhexorg@gmail.com", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...formData, _subject: `Partnership Inquiry: ${formData.name}` }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Inquiry Received.");
      } else { throw new Error(); }
    } catch {
      toast.error("Transmission error. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-red-600/30 font-sans">
      <Header />
      
      {/* 1. The "Billion Dollar" Hero */}
      <section className="relative pt-52 pb-32 px-6">
        {/* Soft, ultra-wide ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[400px] bg-red-600/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-[10rem] font-bold tracking-[ -0.05em] leading-[0.85] mb-12">
              Let’s build the <br />
              <span className="italic font-serif text-red-600">Future.</span>
            </h1>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-white/10 pt-12">
              <p className="max-w-xl text-zinc-400 text-xl md:text-2xl font-light leading-relaxed">
                Connect with our partnership team to architect your private intelligence ecosystem.
              </p>
              <div className="flex gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Inquiries</p>
                  <p className="text-lg font-medium">rhexorg@gmail.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Location</p>
                  <p className="text-lg font-medium">Global / Remote</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Focused Partnership Form */}
      <section className="max-w-7xl mx-auto px-6 pb-44">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Form Side - Minimal & Clean */}
              <div className="lg:col-span-8 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="Alexander Vance"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-6 px-8 outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all text-xl placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Work Email</label>
                    <input 
                      required
                      type="email"
                      placeholder="vance@corporation.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-6 px-8 outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all text-xl placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Organization</label>
                  <input 
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-6 px-8 outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all text-xl placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Brief</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell us about your objectives..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-[32px] py-8 px-8 outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all text-xl placeholder:text-zinc-700 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="group relative inline-flex items-center gap-6 px-16 py-8 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:pr-20 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        Start the Conversation
                        <ArrowUpRight className="w-6 h-6 absolute right-8 opacity-0 group-hover:opacity-100 transition-all" />
                        <ArrowRight className="w-6 h-6 group-hover:opacity-0 transition-all" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar Side - High End Detail */}
              <div className="lg:col-span-4 lg:pl-12 space-y-16">
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Security First</h4>
                  <p className="text-zinc-500 leading-relaxed font-light">
                    All partner communications are end-to-end encrypted and stored in isolated data silos. We never train on your proprietary inquiries.
                  </p>
                </div>
                
                <div className="p-8 border border-white/10 rounded-[32px] space-y-6">
                  <Globe className="w-8 h-8 text-zinc-400" />
                  <h4 className="text-xl font-bold italic font-serif">Global Availability</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Our architects operate across all time zones to ensure seamless deployment and constant support for international enterprises.
                  </p>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-40 text-center space-y-8"
            >
              <h2 className="text-7xl font-bold tracking-tighter">Transmission <br /> <span className="text-zinc-600 italic">Complete.</span></h2>
              <p className="text-zinc-400 text-xl max-w-md mx-auto">A partner will reach out to you within the next 12 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-white transition-colors"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}