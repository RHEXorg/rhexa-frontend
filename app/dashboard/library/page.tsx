"use client";

import React, { useEffect, useState } from "react";
import { 
  Library, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink,
  FileText,
  Calendar,
  Layers,
  Info,
  Plus,
  X,
  Database,
  Loader2
} from "lucide-react";
import { FileUpload } from "@/components/Dashboard/FileUpload";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Full-screen overlay states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGlobalUploading, setIsGlobalUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/documents");
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This action is irreversible.")) return;
    try {
      setIsDeleting(true);
      await api.delete(`/api/documents/${id}`);
      toast.success("Document removed successfully");
      await fetchDocuments();
    } catch (error) {
      toast.error("Could not remove document");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8 relative">
      
      {/* FULL SCREEN ACTIONS OVERLAY */}
      <AnimatePresence>
        {(isGlobalUploading || isDeleting) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background red pulse */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-red-600/20 blur-[120px] rounded-full"
            />
            
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative flex flex-col items-center z-10"
            >
              <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
                <Loader2 className="w-24 h-24 text-white/10 animate-spin absolute" />
                {isGlobalUploading ? (
                  <Plus className="w-10 h-10 text-red-500 absolute" />
                ) : (
                  <Trash2 className="w-10 h-10 text-red-500 absolute" />
                )}
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white tracking-tighter italic">
                {isGlobalUploading ? "UPLOADING" : "DELETING"}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-red-600 ml-2"
                >
                  ...
                </motion.span>
              </h2>
              <p className="mt-6 text-red-600/60 font-black uppercase tracking-[0.4em] text-sm md:text-base">
                Please wait, do not close this page
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER: DYNAMIC & ATTRACTIVE */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Document Library</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-black uppercase tracking-tighter italic text-white">
            My <span className="text-red-600">Files</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">View and manage all the documents you've uploaded.</p>
        </div>

        <button 
          onClick={() => setShowUpload(!showUpload)}
          className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 ${
            showUpload 
            ? "bg-white/10 text-white" 
            : "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-105"
          }`}
        >
          {showUpload ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showUpload ? "Close Upload" : "Upload New Files"}
        </button>
      </div>

      {/* UPLOADER TRANSITION */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-red-600/20 shadow-2xl shadow-red-600/5"
          >
            <FileUpload 
              onUploadStart={() => setIsGlobalUploading(true)}
              onUploadSuccess={() => { setIsGlobalUploading(false); fetchDocuments(); setShowUpload(false); }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-600 transition-colors" />
          <input 
            type="text" 
            placeholder="SEARCH YOUR DOCUMENTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl focus:outline-none focus:border-red-600/50 transition-all text-[11px] font-black tracking-widest text-white placeholder:text-white/10"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 whitespace-nowrap">
            {filteredDocs.length} Total Documents
          </div>
        </div>
      </div>

      {/* DOCUMENT GRID (More Attractive than a Table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-32 flex flex-col items-center gap-6 opacity-20">
            <Layers className="w-16 h-16 animate-pulse stroke-[1px] text-white" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-white">Loading Library...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center gap-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10">
            <Database className="w-12 h-12 text-white/10" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 text-center leading-loose">
              No files found.<br/>Upload some documents to get started.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc, idx) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-red-600/30 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-red-600 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}/api/documents/${doc.id}`, '_blank')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-600/20 text-white/40 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-white/90 truncate group-hover:text-red-600 transition-colors">
                  {doc.filename}
                </h3>
                
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                    <Layers className="w-3 h-3" />
                    {(doc.file_size / 1024).toFixed(1)} KB
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                  <div className="ml-auto text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-600/10 px-2 py-1 rounded">
                    {doc.extension ? doc.extension.replace('.', '') : 'FILE'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}