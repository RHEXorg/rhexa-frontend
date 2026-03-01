"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart3, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Database,
  Terminal,
  ChevronLeft,
  Settings,
  Table as TableIcon,
  Download,
  Search
} from "lucide-react";
import { databaseApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DataChatPage() {
  const params = useParams();
  const router = useRouter();
  const dbId = parseInt(params.id as string);
  
  const [dbName, setDbName] = useState("Database");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch DB name for the header
    const fetchDb = async () => {
      try {
        const res = await databaseApi.list();
        const db = res.data.find((d: any) => d.id === dbId);
        if (db) setDbName(db.name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDb();
  }, [dbId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const tempInput = input;
    setInput("");
    setIsSending(true);

    try {
      const response = await databaseApi.chat(dbId, tempInput);
      
      const aiMsg = { 
        role: "assistant", 
        content: response.data.answer,
        success: response.data.success
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      toast.error("Failed to query the database.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass rounded-[2.5rem] border border-white/5 overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight">{dbName} • Data Chat</h2>
            <p className="text-[10px] text-primary font-black flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              AI-Powered SQL Analytics Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold transition-all">
            <Download className="w-4 h-4" />
            Export Results
          </button>
          <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-transparent to-primary/5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
              <div className="relative p-8 rounded-full bg-surface border border-white/10 shadow-2xl">
                <Search className="w-16 h-16 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-foreground">Talk to your data</h3>
              <p className="text-muted text-lg leading-relaxed">
                Connect your database and ask questions in plain English. We'll generate the SQL, analyze the results, and explain them to you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              {[
                "Who are the top 5 customers by revenue?",
                "How many orders were placed last week?",
                "Get all active subscriptions with unpaid invoices",
                "Average order value for users in USA"
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-semibold text-left transition-all hover:border-primary/50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg",
                m.role === "user" ? "bg-secondary/20" : "bg-primary text-white"
              )}>
                {m.role === "user" ? <User className="w-5 h-5" /> : <Database className="w-5 h-5" />}
              </div>
              <div className="space-y-3">
                <div className={cn(
                  "p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl",
                  m.role === "user" 
                    ? "bg-white/5 rounded-tr-none text-foreground border border-white/5" 
                    : cn(
                        "bg-surface border border-white/10 rounded-tl-none text-foreground font-medium",
                        !m.success && "border-red-500/20 bg-red-500/5"
                      )
                )}>
                  {m.content}
                </div>
                {m.role === "assistant" && m.success && (
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      SQL Generated Successfully
                    </span>
                    <button className="text-[10px] font-black bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-muted uppercase tracking-widest hover:border-primary/50 transition-all flex items-center gap-1.5">
                      <TableIcon className="w-3 h-3" />
                      View Raw Results
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
        {isSending && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 animate-pulse text-white shadow-lg">
              <Database className="w-5 h-5" />
            </div>
            <div className="bg-surface p-6 rounded-[2rem] rounded-tl-none border border-white/5 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-muted uppercase tracking-widest">Querying Engine</span>
                <p className="text-[10px] text-primary font-bold animate-pulse">GENERATING SQL & FETCHING DATA...</p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 border-t border-white/5 bg-white/[0.01]">
        <form onSubmit={handleSendMessage} className="relative group max-w-4xl mx-auto">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
             <div className="p-2 rounded-lg bg-surface border border-white/5">
               <Terminal className="w-4 h-4 text-primary" />
             </div>
          </div>
          <input 
            type="text" 
            placeholder="Ask a question about your database (e.g. 'Show me top sales last month')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-surface border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-[2rem] pl-20 pr-20 py-6 text-sm font-semibold transition-all outline-none"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isSending}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-5 bg-primary hover:bg-primary-hover text-white rounded-[1.5rem] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-8 mt-4">
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Secure read-only execution
          </p>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Dynamic SQL Agent
          </p>
        </div>
      </div>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );
}
