"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, 
  Plus, 
  XCircle, 
  Loader2, 
  Trash2, 
  RefreshCcw, 
  Eye, 
  Terminal,
  MessageSquare,
  BarChart3,
  Server,
  Key,
  Globe,
  Lock,
  X
} from "lucide-react";
import { databaseApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DatabaseManagementPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [isViewingSchema, setIsViewingSchema] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    db_type: "postgresql",
    host: "",
    port: 5432,
    username: "",
    password: "",
    database_name: ""
  });

  const fetchConnections = async () => {
    try {
      const res = await databaseApi.list();
      setConnections(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load database connections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await databaseApi.test(formData);
      toast.success("Connection test successful!");
    } catch (err) {
      toast.error("Connection test failed. Please check your credentials.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await databaseApi.connect(formData);
      toast.success("Database connection saved!");
      setShowAddForm(false);
      setFormData({
        name: "",
        db_type: "postgresql",
        host: "",
        port: 5432,
        username: "",
        password: "",
        database_name: ""
      });
      fetchConnections();
    } catch (err) {
      toast.error("Failed to save connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    try {
      await databaseApi.delete(id);
      toast.success("Connection deleted");
      fetchConnections();
    } catch (err) {
      toast.error("Failed to delete connection");
    }
  };

  const viewSchema = async (id: number) => {
    setIsViewingSchema(true);
    try {
      const res = await databaseApi.getSchema(id);
      setSelectedSchema(res.data.schema);
    } catch (err) {
      toast.error("Failed to fetch database schema");
    } finally {
      setIsViewingSchema(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Schema Modal */}
      {selectedSchema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Database Schema</h3>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Tables & Columns discovered by AI</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSchema(null)}
                className="p-3 rounded-xl hover:bg-white/5 text-muted transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {selectedSchema.map((table: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center">
                      <TableIcon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold">{table.table}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {table.columns.map((col: any, j: number) => (
                      <div key={j} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold">{col.name}</p>
                          <p className="text-[10px] text-muted font-black uppercase tracking-widest">{col.type}</p>
                        </div>
                        {!col.nullable && (
                          <span className="text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">NOT NULL</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
            <Database className="w-10 h-10 text-primary" />
            Database Connections
          </h1>
          <p className="text-muted text-lg">Manage your relational databases and enable AI-powered insights.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          {showAddForm ? <RefreshCcw className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? "Cancel" : "Add Connection"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-300">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted uppercase tracking-wider">Display Name</label>
                  <div className="relative">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Production Analytics"
                      className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-semibold"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted uppercase tracking-wider">Database Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, db_type: 'postgresql', port: 5432})}
                      className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold ${formData.db_type === 'postgresql' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-muted hover:bg-white/10'}`}
                    >
                      <Database className="w-5 h-5" />
                      PostgreSQL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, db_type: 'mysql', port: 3306})}
                      className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold ${formData.db_type === 'mysql' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-muted hover:bg-white/10'}`}
                    >
                      <Server className="w-5 h-5" />
                      MySQL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-bold text-muted uppercase tracking-wider">Host</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input 
                        required
                        type="text" 
                        placeholder="db.example.com"
                        className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-mono text-sm"
                        value={formData.host}
                        onChange={(e) => setFormData({...formData, host: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted uppercase tracking-wider">Port</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 px-4 outline-none transition-all text-center font-mono"
                      value={formData.port}
                      onChange={(e) => setFormData({...formData, port: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Credentials */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted uppercase tracking-wider">Database Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="production_db"
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 px-4 outline-none transition-all font-semibold"
                    value={formData.database_name}
                    onChange={(e) => setFormData({...formData, database_name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input 
                      required
                      type="text" 
                      placeholder="admin_readonly"
                      className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-semibold"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <p className="text-[10px] text-muted flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3" />
                    Encrypted with AES-256 before storage
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
              <button 
                type="button"
                onClick={handleTest}
                disabled={isTesting || isSaving}
                className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isTesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                Test Connection
              </button>
              <button 
                type="submit"
                disabled={isTesting || isSaving}
                className="px-10 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Save Connection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          ))
        ) : connections.length === 0 ? (
          <div className="col-span-full py-20 bg-surface/30 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 rounded-full bg-white/5 text-muted">
              <Database className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No active connections</h3>
              <p className="text-muted">Add your first database to start analyzing your data.</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all"
            >
              Add Connection
            </button>
          </div>
        ) : (
          connections.map((conn) => (
            <div key={conn.id} className="group relative p-8 rounded-3xl bg-surface/30 border border-white/5 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">{conn.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] uppercase font-black text-primary">
                        {conn.db_type}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{conn.host}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(conn.id)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/5 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link 
                  href={`/dashboard/data-sources/database/${conn.id}/chat`}
                  className="p-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                >
                  <BarChart3 className="w-5 h-5" />
                  Data Chat
                </Link>
                <button 
                   onClick={() => viewSchema(conn.id)}
                   disabled={isViewingSchema}
                   className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {isViewingSchema ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                  View Schema
                </button>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3v18"/><path d="M3 12h18"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
  );
}
