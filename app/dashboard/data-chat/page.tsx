"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Database,
  FileText,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Play,
  Activity,
  File,
  X,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Layers,
  Hash,
  Table2,
  PieChart as PieChartIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Eye
} from "lucide-react";
import { databaseApi, analysisApi, documentsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   MULTI-COLOR PALETTE — Each chart gets its own accent color
   ═══════════════════════════════════════════════════════════ */
const CHART_PALETTES = [
  // Electric Blue
  { accent: "#3b82f6", gradient: ["#3b82f6", "#1d4ed8"], bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)",
    colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#1e40af", "#bfdbfe"] },
  // Emerald Green
  { accent: "#10b981", gradient: ["#10b981", "#047857"], bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)",
    colors: ["#10b981", "#34d399", "#6ee7b7", "#059669", "#047857", "#a7f3d0"] },
  // Vivid Purple
  { accent: "#8b5cf6", gradient: ["#8b5cf6", "#6d28d9"], bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)",
    colors: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#5b21b6", "#ddd6fe"] },
  // Amber Orange
  { accent: "#f59e0b", gradient: ["#f59e0b", "#d97706"], bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)",
    colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#d97706", "#b45309", "#fde68a"] },
  // Rose Pink
  { accent: "#f43f5e", gradient: ["#f43f5e", "#e11d48"], bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.25)",
    colors: ["#f43f5e", "#fb7185", "#fda4af", "#e11d48", "#be123c", "#fecdd3"] },
  // Cyan Teal
  { accent: "#06b6d4", gradient: ["#06b6d4", "#0891b2"], bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.25)",
    colors: ["#06b6d4", "#22d3ee", "#67e8f9", "#0891b2", "#0e7490", "#a5f3fc"] },
  // Indigo
  { accent: "#6366f1", gradient: ["#6366f1", "#4f46e5"], bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)",
    colors: ["#6366f1", "#818cf8", "#a5b4fc", "#4f46e5", "#4338ca", "#c7d2fe"] },
  // Lime
  { accent: "#84cc16", gradient: ["#84cc16", "#65a30d"], bg: "rgba(132,204,22,0.08)", border: "rgba(132,204,22,0.25)",
    colors: ["#84cc16", "#a3e635", "#bef264", "#65a30d", "#4d7c0f", "#d9f99d"] },
];

const FILE_TYPE_ICONS: Record<string, any> = {
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  pdf: FileText,
  txt: FileText,
};

const CHART_TYPE_LABELS: Record<string, string> = {
  bar: "Bar Chart",
  line: "Line Chart",
  pie: "Donut Chart",
  area: "Area Chart",
  scatter: "Scatter Plot",
};

export default function DataChatDashboard() {
  const [databases, setDatabases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDbs, setSelectedDbs] = useState<number[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dashboardData, setDashboardData] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<"databases" | "files">("databases");
  const [expandedChart, setExpandedChart] = useState<number | null>(null);

  useEffect(() => { fetchSources(); }, []);

  const fetchSources = async () => {
    try {
      const [dbRes, docRes] = await Promise.all([
        databaseApi.list(),
        documentsApi.list()
      ]);
      setDatabases(dbRes.data);
      const docsList = docRes.data.documents || docRes.data || [];
      setDocuments(docsList);
    } catch (err) {
      toast.error("Failed to fetch data sources");
    }
  };

  const toggleDbSelection = (id: number) => {
    setSelectedDbs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleDocSelection = (id: number) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalSelected = selectedDbs.length + selectedDocs.length;

  const handleGenerateDashboard = async () => {
    if (totalSelected === 0) {
      toast.error("Please select at least one source");
      return;
    }
    setIsGenerating(true);
    setDashboardData(null);
    try {
      const res = await analysisApi.generateDashboard(selectedDbs, selectedDocs);
      if (res.data.success && res.data.charts?.length > 0) {
        setDashboardData(res.data.charts);
        toast.success(`Dashboard ready — ${res.data.charts.length} insights generated!`);
      } else {
        toast.error("No charts were generated. Please try different data sources.");
      }
    } catch (err) {
      toast.error("Dashboard generation failed. Check your data sources.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Compute stats from dashboard data ── */
  const dashboardStats = useMemo(() => {
    if (!dashboardData) return null;
    let totalDataPoints = 0;
    let totalSources = new Set<string>();
    let chartTypes = new Set<string>();
    dashboardData.forEach(c => {
      totalDataPoints += c.data?.length || 0;
      chartTypes.add(c.type);
      if (c.database_name) totalSources.add(c.database_name);
      if (c.source_file) totalSources.add(c.source_file);
    });
    return {
      totalCharts: dashboardData.length,
      totalDataPoints,
      totalSources: totalSources.size,
      chartTypes: chartTypes.size,
    };
  }, [dashboardData]);

  const isTabularFile = (ft: string) => ["csv", "xlsx", "xls"].includes(ft);
  const getFileIcon = (ft: string) => FILE_TYPE_ICONS[ft] || File;
  const formatFileSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

  /* ═══════════════════════════════════════════
     CHART RENDERER — Professional, multi-color
     ═══════════════════════════════════════════ */
  const renderChart = (chart: any, idx: number, height: number = 320) => {
    const palette = CHART_PALETTES[idx % CHART_PALETTES.length];

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload?.length) {
        return (
          <div style={{
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${palette.accent}40`,
            borderRadius: "16px",
            padding: "14px 18px",
            boxShadow: `0 8px 32px ${palette.accent}20`
          }}>
            <p style={{ color: palette.accent, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{`${label}`}</p>
            {payload.map((entry: any, i: number) => (
              <p key={i} style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "monospace", margin: "2px 0" }}>
                <span style={{ color: entry.color || palette.accent }}>●</span>{" "}
                {entry.name}: <span style={{ color: "#999" }}>{typeof entry.value === "number" ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}</span>
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    const axisProps = {
      stroke: "transparent",
      tick: { fill: "#666", fontSize: 11, fontWeight: 600 },
      axisLine: false,
      tickLine: false,
    };

    switch (chart.type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={chart.xAxisKey} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: `${palette.accent}08` }} />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              {chart.dataKeys.map((key: string, i: number) => (
                <Bar key={key} dataKey={key} fill={palette.colors[i % palette.colors.length]}
                  radius={[6, 6, 0, 0]} maxBarSize={56}
                  animationBegin={i * 100} animationDuration={800} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chart.data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={chart.xAxisKey} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              {chart.dataKeys.map((key: string, i: number) => (
                <Line key={key} type="monotone" dataKey={key}
                  stroke={palette.colors[i % palette.colors.length]}
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#0a0a0a", stroke: palette.colors[i % palette.colors.length], strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2, fill: palette.colors[i % palette.colors.length] }}
                  animationDuration={1200} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chart.data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <defs>
                {chart.dataKeys.map((key: string, i: number) => (
                  <linearGradient key={`grad-${idx}-${key}`} id={`grad-${idx}-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.colors[i % palette.colors.length]} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={palette.colors[i % palette.colors.length]} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={chart.xAxisKey} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              {chart.dataKeys.map((key: string, i: number) => (
                <Area key={key} type="monotone" dataKey={key}
                  stroke={palette.colors[i % palette.colors.length]}
                  strokeWidth={2.5}
                  fill={`url(#grad-${idx}-${key})`}
                  animationDuration={1000} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} iconType="circle" />
              <Pie data={chart.data} dataKey={chart.dataKeys[0]} nameKey={chart.xAxisKey}
                cx="50%" cy="50%" innerRadius="55%" outerRadius="85%"
                paddingAngle={4} stroke="transparent"
                animationBegin={0} animationDuration={1200}>
                {chart.data.map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_PALETTES[i % CHART_PALETTES.length].accent} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey={chart.xAxisKey} name={chart.xAxisKey} {...axisProps} />
              <YAxis dataKey={chart.dataKeys[0]} name={chart.dataKeys[0]} {...axisProps} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              <Scatter name={chart.dataKeys[0]} data={chart.data} animationDuration={800}>
                {chart.data.map((_: any, i: number) => (
                  <Cell key={i} fill={palette.colors[i % palette.colors.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="flex items-center justify-center h-64 text-muted">Unsupported type</div>;
    }
  };

  /* ═══════════════════
     MAIN RENDER
     ═══════════════════ */
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-32 px-2">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ff0f39] flex items-center justify-center shadow-lg shadow-[#ff0f39]/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Data Analytics</h1>
              <p className="text-muted text-sm font-semibold">AI-powered insights from your databases & files</p>
            </div>
          </div>
        </div>
        {totalSelected > 0 && !dashboardData && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 px-5 py-2.5 rounded-2xl">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold"><span className="text-blue-400">{totalSelected}</span> source{totalSelected !== 1 ? 's' : ''} selected</span>
          </div>
        )}
      </div>

      {/* ═══ SOURCE SELECTION ═══ */}
      {!dashboardData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/[0.06] rounded-3xl overflow-hidden relative">

          {/* Loading Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-[#050505]/90 backdrop-blur-lg flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-[3px] border-transparent animate-spin"
                    style={{ borderImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #f43f5e, #f59e0b) 1" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-[#ff0f39]">
                    Analyzing Your Data...
                  </h3>
                  <p className="text-sm text-muted font-bold tracking-wide animate-pulse">
                    Profiling columns • Selecting best charts • Crunching numbers
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Bar */}
          <div className="flex items-center gap-1 p-2 border-b border-white/[0.04] bg-white/[0.01]">
            {[
              { key: "databases" as const, icon: Database, label: "Databases", count: selectedDbs.length },
              { key: "files" as const, icon: FileSpreadsheet, label: "Uploaded Files", count: selectedDocs.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-white/[0.08] text-white"
                    : "text-muted hover:text-white hover:bg-white/[0.03]"
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 bg-[#ff0f39] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* DATABASE TAB */}
            {activeTab === "databases" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {databases.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-muted space-y-3">
                      <Database className="w-10 h-10 mx-auto opacity-20" />
                      <p className="font-bold">No databases connected</p>
                      <p className="text-xs">Go to Data Sources to add one.</p>
                    </div>
                  ) : databases.map(db => {
                    const sel = selectedDbs.includes(db.id);
                    return (
                      <button key={db.id} onClick={() => toggleDbSelection(db.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                          sel ? "bg-[#ff0f39]/10 border-[#ff0f39]/40" : "bg-white/[0.02] border-white/[0.04] hover:border-white/10"
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sel ? "bg-[#ff0f39] text-white" : "bg-white/5 text-muted"}`}>
                          <Database className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{db.name}</h3>
                          <p className="text-xs text-muted font-mono truncate">{db.db_type}</p>
                        </div>
                        {sel && <CheckCircle2 className="w-5 h-5 text-[#ff0f39] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* FILES TAB */}
            {activeTab === "files" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted bg-white/[0.03] px-4 py-3 rounded-xl border border-white/[0.04]">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  Charts work best with <strong className="text-white">CSV</strong> and <strong className="text-white">Excel</strong> files containing tabular data.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {documents.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-muted space-y-3">
                      <FileText className="w-10 h-10 mx-auto opacity-20" />
                      <p className="font-bold">No files uploaded</p>
                      <p className="text-xs">Upload CSV/Excel files in the Library.</p>
                    </div>
                  ) : documents.map((doc: any) => {
                    const sel = selectedDocs.includes(doc.id);
                    const tabular = isTabularFile(doc.file_type);
                    const Icon = getFileIcon(doc.file_type);
                    return (
                      <button key={doc.id} onClick={() => tabular && toggleDocSelection(doc.id)}
                        disabled={!tabular}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                          !tabular ? "opacity-30 cursor-not-allowed bg-white/[0.01] border-white/[0.03]"
                            : sel ? "bg-[#ff0f39]/10 border-[#ff0f39]/40" : "bg-white/[0.02] border-white/[0.04] hover:border-white/10"
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sel ? "bg-[#ff0f39] text-white" : "bg-white/5 text-muted"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{doc.filename}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${tabular ? "bg-[#ff0f39]/10 text-[#ff0f39]" : "bg-white/5"}`}>
                              {doc.file_type}
                            </span>
                            <span>{formatFileSize(doc.file_size)}</span>
                          </div>
                        </div>
                        {sel && <CheckCircle2 className="w-5 h-5 text-[#ff0f39] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Generate */}
            <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {totalSelected > 0
                  ? <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span><strong className="text-white">{selectedDbs.length}</strong> DB{selectedDbs.length !== 1 ? "s" : ""} + <strong className="text-white">{selectedDocs.length}</strong> file{selectedDocs.length !== 1 ? "s" : ""}</span></span>
                  : "Select at least one data source"
                }
              </p>
              <button onClick={handleGenerateDashboard}
                disabled={totalSelected === 0 || isGenerating}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#ff0f39] to-[#c9184a] hover:from-[#ff4d6d] hover:to-[#ff0f39] text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-[#ff0f39]/20 hover:shadow-[#ff0f39]/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 active:scale-[0.97]">
                Generate Dashboard
                <Play className="w-5 h-5 fill-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════
         DASHBOARD RESULTS
         ═══════════════════════════════════════ */}
      {dashboardData && dashboardStats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Charts", value: dashboardStats.totalCharts, icon: BarChart3, color: "#3b82f6" },
              { label: "Data Points", value: dashboardStats.totalDataPoints, icon: Hash, color: "#10b981" },
              { label: "Sources", value: dashboardStats.totalSources, icon: Layers, color: "#8b5cf6" },
              { label: "Chart Types", value: dashboardStats.chartTypes, icon: PieChartIcon, color: "#f59e0b" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] flex items-center gap-4 group hover:border-white/10 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight">{stat.value.toLocaleString()}</p>
                  <p className="text-[11px] text-muted font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#ff0f39]" />
              Analytics Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => { setDashboardData(null); handleGenerateDashboard(); }}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold transition-all flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button onClick={() => setDashboardData(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-bold transition-all flex items-center gap-2">
                <X className="w-3.5 h-3.5" /> New Analysis
              </button>
            </div>
          </div>

          {/* Charts Grid — responsive masonry-like layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {dashboardData.map((chart, idx) => {
              const palette = CHART_PALETTES[idx % CHART_PALETTES.length];
              const isExpanded = expandedChart === idx;
              const chartHeight = isExpanded ? 480 : 320;

              return (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`bg-[#0a0a0a] border border-white/[0.06] rounded-3xl overflow-hidden group hover:border-white/10 transition-all duration-300 ${
                    isExpanded ? "lg:col-span-2" : ""
                  }`}>

                  {/* Chart Header */}
                  <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md"
                          style={{ background: `${palette.accent}15`, color: palette.accent }}>
                          {CHART_TYPE_LABELS[chart.type] || chart.type}
                        </span>
                        {chart.database_name && (
                          <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Database className="w-3 h-3" /> {chart.database_name}
                          </span>
                        )}
                        {chart.source_file && (
                          <span className="text-[10px] uppercase font-black tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <FileSpreadsheet className="w-3 h-3" /> {chart.source_file}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black truncate pr-4">{chart.title}</h3>
                      <p className="text-[11px] text-muted font-semibold mt-0.5">
                        {chart.data?.length || 0} data points • {chart.dataKeys?.join(", ")}
                      </p>
                    </div>
                    <button onClick={() => setExpandedChart(isExpanded ? null : idx)}
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] transition-all shrink-0"
                      title={isExpanded ? "Collapse" : "Expand"}>
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Accent line */}
                  <div className="mx-6 h-[2px] rounded-full opacity-30" style={{ background: `linear-gradient(to right, ${palette.gradient[0]}, ${palette.gradient[1]}, transparent)` }} />

                  {/* Chart Body */}
                  <div className="p-4 md:p-6">
                    {renderChart(chart, idx, chartHeight)}
                  </div>

                  {/* Chart Footer */}
                  <div className="px-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {chart.dataKeys?.slice(0, 4).map((key: string, i: number) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: palette.colors[i % palette.colors.length] }} />
                          <span className="text-[11px] font-semibold text-muted">{key}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider opacity-50">
                      AI Generated
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
