"use client";

import React, { useState } from "react";
import { Search, Send, FileText, ExternalLink, Sparkles, Loader2, Database } from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text;
  
  // Split query into words (>2 chars) for highlighting
  const words = highlight.trim().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return text;

  // Create case-insensitive regex for all words
  const regex = new RegExp(`(${words.join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-primary text-white rounded px-1 py-0.5 font-bold shadow-sm shadow-primary/20 bg-opacity-70">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface SearchResult {
  content: string;
  score: number;
  metadata: {
    filename?: string;
    source?: string;
    type?: string;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await api.post("/api/search/query", {
        query,
        limit: 10
      });
      
      // Strict filtering: Only show results that actually contain the searched words
      const words = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const searchTerms = words.length > 0 ? words : [query.trim().toLowerCase()];
      
      const filteredResults = response.data.filter((result: SearchResult) => {
        const contentLower = result.content.toLowerCase();
        return searchTerms.some(term => contentLower.includes(term));
      });
      
      setResults(filteredResults);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-black tracking-tight">Semantic Knowledge Search</h1>
        <p className="text-muted text-lg">Query your organization's total knowledge base with natural language.</p>
      </div>

      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-x-0 -bottom-2 h-full bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative glass p-2 rounded-[2rem] border border-white/10 flex items-center gap-2 focus-within:border-primary/50 transition-all">
          <div className="pl-4 text-muted group-focus-within:text-primary transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            placeholder="Describe what you're looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none py-4 text-lg font-medium placeholder:text-muted/50"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-accent text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </form>

      <div className="space-y-6 pt-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <p className="text-muted font-bold tracking-widest uppercase text-xs">Parsing Vectors & Context...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <div key="results" className="space-y-6">
              <h2 className="text-sm font-black text-muted uppercase tracking-widest pl-2">Semantic Matches</h2>
              {results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        {result.metadata.source?.includes('postgres') || result.metadata.source?.includes('mysql') || result.metadata.type === 'database' ? (
                          <Database className="w-5 h-5 text-primary" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground truncate max-w-[400px]">
                          {result.metadata.filename || result.metadata.source || "Unknown Source"}
                        </p>
                        <p className="text-[10px] text-muted font-black tracking-widest uppercase">
                          Score: {(1 - result.score).toFixed(4)} • Relevance: High
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-muted hover:text-white transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <p className="text-muted-foreground text-sm leading-relaxed italic">
                      "...{highlightText(result.content, query)}..."
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : hasSearched && (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 bg-white/2 rounded-[3rem] border border-white/5"
            >
              <p className="text-muted text-lg font-bold">No semantic matches found</p>
              <p className="text-muted/60 text-sm mt-1">Try rephrasing your search or uploading more documents.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
