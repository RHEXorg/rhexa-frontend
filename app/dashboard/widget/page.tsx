"use client";

import React, { useState, useEffect } from "react";
import { 
  Code, 
  Copy, 
  Check, 
  RefreshCcw, 
  Monitor, 
  Smartphone, 
  Settings2, 
  Eye,
  Type,
  Palette,
  MessageSquare,
  Bot,
  Globe,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  ExternalLink,
  Laptop,
  X,
  PlusCircle,
  HelpCircle,
  Database,
  Sun,
  Moon,
  MessageCircle,
  Sparkles,
  Zap
} from "lucide-react";
import { widgetApi, databaseApi } from "@/lib/api";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WidgetManagementPage() {
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");

  const [documents, setDocuments] = useState<any[]>([]);
  const [databases, setDatabases] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resWidgets, resDocs, resDbs] = await Promise.all([
        widgetApi.list(),
        api.get("/api/documents").catch((e) => ({ data: { documents: [] } })),
        databaseApi.list().catch((e) => ({ data: [] }))
      ]);
      
      setWidgets(resWidgets.data);
      setDocuments(resDocs.data?.documents || []);
      setDatabases(resDbs.data || []);
    } catch (err) {
      toast.error("Failed to load widget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWidget = async (name: string) => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      const res = await widgetApi.create({ name });
      setWidgets([...widgets, res.data]);
      setSelectedWidget(res.data);
      setShowCreateModal(false);
      setNewWidgetName("");
      toast.success("Widget created!");
    } catch (err) {
      toast.error("Failed to create widget");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWidget = async (id: number) => {
    if (!confirm("Delete this widget? This will disable it on any website where it is embedded.")) return;
    try {
      await widgetApi.delete(id);
      setWidgets(widgets.filter(w => w.id !== id));
      if (selectedWidget?.id === id) setSelectedWidget(null);
      toast.success("Widget deleted");
    } catch (err) {
      toast.error("Failed to delete widget");
    }
  };

  const handleUpdate = async (updatedData: any) => {
    if (!selectedWidget) return;
    const oldWidget = {...selectedWidget};
    setSelectedWidget(updatedData); // Optimistic update
    
    try {
      setSaving(true);
      await widgetApi.update(selectedWidget.id, updatedData);
      // Update in list
      setWidgets(widgets.map(w => w.id === selectedWidget.id ? updatedData : w));
    } catch (err) {
      setSelectedWidget(oldWidget);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleRotateKey = async () => {
    if (!selectedWidget) return;
    if (!confirm("Rotate key? Existing embeds will stop working.")) return;
    try {
      setRotating(true);
      const res = await widgetApi.rotateKey(selectedWidget.id);
      setSelectedWidget(res.data);
      setWidgets(widgets.map(w => w.id === selectedWidget.id ? res.data : w));
      toast.success("Key regenerated!");
    } catch (err) {
      toast.error("Failed to rotate key");
    } finally {
      setRotating(false);
    }
  };

  const copyEmbedCode = () => {
    if (!selectedWidget) return;
    const apiBase = typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? 'http://127.0.0.1:8000' : window.location.origin) : '';
    const code = `<script 
  src="${apiBase}/static/widget.js" 
  data-widget-key="${selectedWidget.widget_key}" 
  data-api-url="${apiBase}"
  async
></script>`;
    
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && widgets.length === 0) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Create Widget Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Deploy Assistant</h3>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Setup a new external agent</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl text-muted-foreground transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-muted uppercase tracking-widest px-1">Friendly Widget Name</label>
                  <div className="relative">
                    <Bot className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g., Global Support Bot"
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-lg text-white placeholder:text-white/30"
                      value={newWidgetName}
                      onChange={(e) => setNewWidgetName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateWidget(newWidgetName)}
                    />
                  </div>
                  <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground font-medium">
                     <HelpCircle className="w-3 h-3" />
                     This name is for your internal organization.
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-5 rounded-[1.5rem] bg-white/5 hover:bg-white/10 border border-white/5 font-bold transition-all text-muted-foreground"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleCreateWidget(newWidgetName)}
                    disabled={!newWidgetName.trim() || loading}
                    className="flex-1 py-5 rounded-[1.5rem] bg-primary hover:bg-primary-hover text-white font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                    Launch Widget
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Widget Management</h1>
          <p className="text-muted text-lg">Deploy AI assistants to your external websites & apps.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Widget
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Widget List Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black text-muted uppercase tracking-widest px-2">Your Widgets</h3>
          <div className="space-y-2">
            {widgets.length === 0 ? (
               <div className="p-8 text-center bg-surface/30 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-xs font-bold text-muted italic">No widgets created yet.</p>
               </div>
            ) : widgets.map((w) => (
              <div 
                key={w.id}
                onClick={() => setSelectedWidget(w)}
                className={cn(
                  "group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                  selectedWidget?.id === w.id 
                    ? "bg-primary/10 border-primary/30 text-foreground" 
                    : "bg-surface/50 border-white/5 text-muted hover:border-white/10 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    w.is_enabled ? "bg-green-500" : "bg-white/10"
                  )} />
                  <span className="font-bold text-sm truncate">{w.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteWidget(w.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <AnimatePresence mode="wait">
          {selectedWidget ? (
            <motion.div 
              key={selectedWidget.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-2 gap-8"
            >
              {/* Settings Form */}
              <div className="space-y-6">
                <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Settings2 className="w-5 h-5" />
                      </div>
                      <input 
                        className="text-2xl font-black bg-transparent border-none outline-none focus:ring-0 w-full text-white placeholder:text-white/30"
                        value={selectedWidget.name}
                        onChange={(e) => setSelectedWidget({...selectedWidget, name: e.target.value})}
                        onBlur={() => handleUpdate(selectedWidget)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                       {saving && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
                       <button 
                        onClick={() => handleUpdate({...selectedWidget, is_enabled: !selectedWidget.is_enabled})}
                        className={cn(
                            "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                            selectedWidget.is_enabled ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-white/5 border-white/10 text-muted"
                        )}
                       >
                         {selectedWidget.is_enabled ? "Live" : "Disabled"}
                       </button>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Bot Identity</label>
                              <input 
                                type="text"
                                value={selectedWidget.bot_name}
                                onChange={(e) => setSelectedWidget({...selectedWidget, bot_name: e.target.value})}
                                onBlur={() => handleUpdate(selectedWidget)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white placeholder:text-white/30"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Widget Icon</label>
                              <div className="flex flex-wrap gap-2">
                                {['MessageSquare', 'MessageCircle', 'Bot', 'Sparkles', 'Zap'].map((iconName) => {
                                  const IconComponent = { MessageSquare, MessageCircle, Bot, Sparkles, Zap }[iconName] as React.ElementType;
                                  const isSelected = (selectedWidget.bubble_icon || 'MessageSquare') === iconName;
                                  return (
                                    <button 
                                      key={iconName}
                                      onClick={() => handleUpdate({...selectedWidget, bubble_icon: iconName})}
                                      className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2",
                                        isSelected 
                                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                                      )}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </button>
                                  );
                                })}
                              </div>
                           </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Theme Color</label>
                          <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg">
                            <input 
                              type="color"
                              value={selectedWidget.theme_color}
                              onChange={(e) => setSelectedWidget({...selectedWidget, theme_color: e.target.value})}
                              onBlur={() => handleUpdate(selectedWidget)}
                              className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer p-0 m-0 border-none outline-none appearance-none"
                            />
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all font-bold text-white text-xs uppercase tracking-widest">
                               <Palette className="w-6 h-6 mb-1 drop-shadow-lg" />
                               Click to pick
                            </div>
                          </div>
                          <p className="text-[9px] text-muted-foreground font-bold px-1 text-center mt-2">Click the box to select a brand color</p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h4 className="text-[10px] font-black text-muted uppercase tracking-widest px-1 flex items-center gap-2">
                         <Database className="w-3 h-3" /> Connect Data Sources (Optional)
                      </h4>
                      <p className="text-xs text-muted-foreground px-1 mb-2">Select specific files or databases. Leave empty to let the widget access all your organization's data.</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5 h-48 overflow-y-auto custom-scrollbar">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Available Documents</label>
                            {documents.length === 0 ? <p className="text-xs text-muted">No documents uploaded.</p> : documents.map((doc: any) => {
                               const isSelected = selectedWidget.selected_sources?.documents?.includes(doc.id) || false;
                               return (
                                  <label key={doc.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors border-b border-white/5 last:border-0">
                                     <input 
                                       type="checkbox" 
                                       checked={isSelected}
                                       onChange={(e) => {
                                          const prevDocs = selectedWidget.selected_sources?.documents || [];
                                          const newDocs = e.target.checked 
                                            ? [...prevDocs, doc.id] 
                                            : prevDocs.filter((id: number) => id !== doc.id);
                                          
                                          const newSources = { ...(selectedWidget.selected_sources || {}), documents: newDocs };
                                          const updated = { ...selectedWidget, selected_sources: newSources };
                                          setSelectedWidget(updated);
                                          handleUpdate(updated);
                                       }}
                                       className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-black"
                                     />
                                     <span className="text-xs text-white/80 font-medium truncate">{doc.filename}</span>
                                  </label>
                               )
                            })}
                         </div>

                         <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5 h-48 overflow-y-auto custom-scrollbar">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Available Databases</label>
                            {databases.length === 0 ? <p className="text-xs text-muted">No databases connected.</p> : databases.map((db: any) => {
                               const isSelected = selectedWidget.selected_sources?.databases?.includes(db.id) || false;
                               return (
                                  <label key={db.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors border-b border-white/5 last:border-0">
                                     <input 
                                       type="checkbox" 
                                       checked={isSelected}
                                       onChange={(e) => {
                                          const prevDbs = selectedWidget.selected_sources?.databases || [];
                                          const newDbs = e.target.checked 
                                            ? [...prevDbs, db.id] 
                                            : prevDbs.filter((id: number) => id !== db.id);
                                          
                                          const newSources = { ...(selectedWidget.selected_sources || {}), databases: newDbs };
                                          const updated = { ...selectedWidget, selected_sources: newSources };
                                          setSelectedWidget(updated);
                                          handleUpdate(updated);
                                       }}
                                       className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-black"
                                     />
                                     <span className="text-xs text-white/80 font-medium truncate">{db.name}</span>
                                  </label>
                               )
                            })}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Welcome Message</label>
                       <textarea 
                        rows={2}
                        value={selectedWidget.welcome_message}
                        onChange={(e) => setSelectedWidget({...selectedWidget, welcome_message: e.target.value})}
                        onBlur={() => handleUpdate(selectedWidget)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none text-white placeholder:text-white/30"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Position</label>
                          <select 
                            value={selectedWidget.position}
                            onChange={(e) => handleUpdate({...selectedWidget, position: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold outline-none text-white"
                          >
                             <option value="bottom-right" className="bg-[#1a1414] text-white">Bottom Right</option>
                             <option value="bottom-left" className="bg-[#1a1414] text-white">Bottom Left</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Branding</label>
                          <button 
                            onClick={() => handleUpdate({...selectedWidget, show_branding: !selectedWidget.show_branding})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold flex items-center justify-between text-white"
                          >
                            <span>"Powered by RheXa"</span>
                            {selectedWidget.show_branding ? <Check className="w-4 h-4 text-primary" /> : <Loader2 className="w-4 h-4 text-white/5" />}
                          </button>
                       </div>
                    </div>

                    {/* Dark / Light Mode Toggle */}
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1 flex items-center gap-2">
                          <Palette className="w-3 h-3" /> Widget Default Theme
                       </label>
                       <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleUpdate({...selectedWidget, default_theme: 'light'})}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                              (!selectedWidget.default_theme || selectedWidget.default_theme === 'light')
                                ? "border-primary bg-primary/10 text-white shadow-lg shadow-primary/10"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center",
                              (!selectedWidget.default_theme || selectedWidget.default_theme === 'light')
                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                                : "bg-white/10 text-white/40"
                            )}>
                              <Sun className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-black">Light Mode</p>
                              <p className="text-[10px] font-medium opacity-60">Clean & bright</p>
                            </div>
                            {(!selectedWidget.default_theme || selectedWidget.default_theme === 'light') && (
                              <div className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-widest">
                                <Check className="w-3 h-3" /> Active
                              </div>
                            )}
                          </button>
                          <button
                            onClick={() => handleUpdate({...selectedWidget, default_theme: 'dark'})}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                              selectedWidget.default_theme === 'dark'
                                ? "border-primary bg-primary/10 text-white shadow-lg shadow-primary/10"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center",
                              selectedWidget.default_theme === 'dark'
                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                                : "bg-white/10 text-white/40"
                            )}>
                              <Moon className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-black">Dark Mode</p>
                              <p className="text-[10px] font-medium opacity-60">Sleek & modern</p>
                            </div>
                            {selectedWidget.default_theme === 'dark' && (
                              <div className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-widest">
                                <Check className="w-3 h-3" /> Active
                              </div>
                            )}
                          </button>
                       </div>
                       <p className="text-[10px] text-white/30 font-medium px-1 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> Users can still toggle theme using the icon in the widget header.
                       </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <h4 className="text-xs font-black text-muted uppercase tracking-widest">Authentication Key</h4>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-black/30 border border-white/5 rounded-2xl p-4 font-mono text-xs flex items-center justify-between overflow-hidden">
                          <span className="truncate opacity-50">{selectedWidget.widget_key}</span>
                          <button onClick={copyEmbedCode} className="p-2 hover:bg-white/10 rounded-lg text-primary"><Copy className="w-4 h-4" /></button>
                       </div>
                       <button 
                        onClick={handleRotateKey}
                        disabled={rotating}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                       >
                         {rotating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                       </button>
                    </div>
                  </div>
                </div>

                {/* Embed Tab */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 rounded-[2.5rem] p-8 space-y-4 shadow-xl shadow-primary/10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                         <Code className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-black text-lg">One-Line Embed</h3>
                         <p className="text-xs text-muted-foreground font-medium">Add this script before your closing body tag.</p>
                      </div>
                   </div>
                   <div className="relative group">
                      <pre className="bg-black/40 backdrop-blur-3xl rounded-3xl p-6 text-[11px] font-mono text-green-400/90 leading-relaxed overflow-x-auto custom-scrollbar">
{`<script 
  src="${typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? 'http://127.0.0.1:8000' : window.location.origin) : ''}/static/widget.js" 
  data-widget-key="${selectedWidget.widget_key}" 
  data-api-url="${typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? 'http://127.0.0.1:8000' : window.location.origin) : ''}"
  async
></script>`}
                      </pre>
                      <button 
                        onClick={copyEmbedCode}
                        className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                      </button>
                   </div>
                </div>
              </div>

              {/* Preview Side */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-xs font-black text-muted uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Professional Preview
                   </h3>
                   <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setPreviewMode("desktop")}
                        className={cn("p-2 rounded-lg transition-all", previewMode === "desktop" ? "bg-primary text-white" : "text-muted hover:text-foreground")}
                      >
                        <Laptop className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => setPreviewMode("mobile")}
                         className={cn("p-2 rounded-lg transition-all", previewMode === "mobile" ? "bg-primary text-white" : "text-muted hover:text-foreground")}
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className={cn(
                  "mx-auto transition-all duration-500 relative bg-white shadow-2xl overflow-hidden border-[10px] border-surface",
                  previewMode === "desktop" ? "w-full aspect-video rounded-[3rem]" : "w-[320px] h-[600px] rounded-[3.5rem]"
                )}>
                  {/* Site Simulation */}
                  <div className="absolute inset-0 bg-[#f8fafc] flex flex-col">
                    <div className="h-8 bg-gray-100 flex items-center px-4 gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                       <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                    <div className="p-8 space-y-6">
                       <div className="flex justify-between items-center">
                          <div className="w-20 h-4 bg-gray-200 rounded" />
                          <div className="flex gap-4">
                             <div className="w-10 h-2 bg-gray-100 rounded" />
                             <div className="w-10 h-2 bg-gray-100 rounded" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="w-full h-2 bg-gray-100 rounded" />
                          <div className="w-[90%] h-2 bg-gray-100 rounded" />
                          <div className="w-[95%] h-2 bg-gray-100 rounded" />
                       </div>
                       <div className="w-full aspect-video bg-gray-50 border border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                          [ Website Hero Content ]
                       </div>
                    </div>

                    {/* Widget Preview Overlay */}
                    <div className={cn(
                        "absolute inset-4 transition-all flex flex-col justify-end",
                        selectedWidget.position === "bottom-right" ? "items-end" : "items-start"
                    )}>
                        <motion.div 
                          layout
                          className={cn(
                            "w-[280px] bg-white shadow-2xl border border-gray-100 overflow-hidden mb-4",
                            selectedWidget.position === "bottom-right" ? "rounded-[1.5rem] rounded-br-[0.2rem]" : "rounded-[1.5rem] rounded-bl-[0.2rem]"
                          )}
                        >
                          <div className="p-4 flex items-center justify-between text-white" style={{ background: selectedWidget.theme_color }}>
                             <div>
                                <h5 className="text-[12px] font-black leading-none">{selectedWidget.bot_name}</h5>
                                <p className="text-[8px] font-bold opacity-80 mt-1 uppercase tracking-widest">Always Online</p>
                             </div>
                             <RefreshCcw className="w-3 h-3 opacity-50" />
                          </div>
                          <div className="p-4 min-h-[140px] flex flex-col gap-3">
                             <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none text-[10px] leading-relaxed text-gray-700 font-medium">
                               {selectedWidget.welcome_message}
                             </div>
                             <div className="p-3 self-end rounded-2xl rounded-tr-none text-[10px] leading-relaxed text-white font-medium" style={{ background: selectedWidget.theme_color }}>
                               Hello! How does it work?
                             </div>
                          </div>
                          <div className="p-4 border-t border-gray-50 flex gap-2">
                             <div className="flex-1 h-8 bg-gray-50 rounded-xl" />
                             <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: selectedWidget.theme_color }}>
                                <MessageSquare className="w-3 h-3" />
                             </div>
                          </div>
                          {selectedWidget.show_branding && (
                             <p className="text-[8px] text-center p-2 font-black text-gray-300 uppercase tracking-widest bg-gray-50 border-t border-gray-100">
                                Powered by <span style={{ color: selectedWidget.theme_color }}>RHEXA AI</span>
                             </p>
                          )}
                        </motion.div>
                        
                        <div 
                          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95"
                          style={{ background: selectedWidget.theme_color }}
                        >
                           <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-surface/30 rounded-3xl border border-white/5 space-y-4">
                   <h4 className="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-widest">
                      <Monitor className="w-4 h-4" /> Deployment Guide
                   </h4>
                   <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                      The RheXa widget is designed to be high-performance. It loads asynchronously, meaning it won't slow down your page speed. It automatically handles CSS isolation to avoid conflicts with your site's styles.
                   </p>
                   <div className="flex gap-4">
                      <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase transition-all tracking-widest">Documentation</button>
                      <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase transition-all tracking-widest">Support</button>
                   </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-9 h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-surface/20"
            >
               <div className="p-6 rounded-full bg-white/5 mb-6">
                  <Monitor className="w-12 h-12 text-muted" />
               </div>
               <h3 className="text-xl font-bold mb-2">Select a widget to edit</h3>
               <p className="text-muted text-sm max-w-xs text-center leading-relaxed">Choose one from the left or create a new one to customize your AI deployment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
