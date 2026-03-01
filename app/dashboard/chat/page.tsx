"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MessageSquare,
  Send,
  Trash2,
  Plus,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Database,
  FileText,
  ChevronUp,
  Check,
  MessageCircle,
} from "lucide-react";
import api, { databaseApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MAX_SESSIONS = 200;

export default function ChatPage() {
  /* ─── State ─── */
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);

  /* Data Sources */
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [availableDbs, setAvailableDbs] = useState<any[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [selectedDbs, setSelectedDbs] = useState<number[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);

  /* Slide-up source picker */
  const [pickerOpen, setPickerOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  /* ─── Data Fetching ─── */
  const fetchSessions = useCallback(async () => {
    setIsSessionsLoading(true);
    try {
      const response = await api.get("/api/chat/sessions");
      const loadedSessions = response.data || [];
      setSessions(loadedSessions.slice(0, MAX_SESSIONS));
    } catch (error: any) {
      console.error("Failed to fetch sessions", error);
      if (error.response?.status === 401) {
        console.log("[RAG Chat] Authentication required, sessions not loaded");
      }
    } finally {
      setIsSessionsLoading(false);
    }
  }, []);

  const fetchSources = useCallback(async () => {
    setIsLoadingSources(true);
    try {
      const [docsRes, dbsRes] = await Promise.all([
        api.get("/api/documents").catch(() => ({ data: { documents: [] } })),
        databaseApi.list().catch(() => ({ data: [] })),
      ]);
      setAvailableDocs(docsRes.data?.documents || []);
      setAvailableDbs(dbsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch sources", error);
    } finally {
      setIsLoadingSources(false);
    }
  }, []);

  const fetchHistory = useCallback(async (sessionId: number) => {
    setIsHistoryLoading(true);
    try {
      const response = await api.get(`/api/chat/sessions/${sessionId}/messages`);
      setMessages(response.data || []);
    } catch (error: any) {
      // If session not found (404), it might have been deleted
      if (error.response?.status === 404) {
        console.log("[RAG Chat] Session not found, clearing...");
        toast.error("Chat session not found. Starting new chat.");
        setCurrentSessionId(null);
        localStorage.removeItem("rhexa_chat_session_id");
        setMessages([]);
      } else if (error.response?.status === 401) {
        console.log("[RAG Chat] Auth required for history");
        setMessages([]);
      } else {
        toast.error("Could not load chat history.");
        setMessages([]);
      }
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // 1. Initialize State and Load LocalStorage strictly on Mount
  useEffect(() => {
    fetchSessions();
    fetchSources();
    
    try {
      // Load session ID from localStorage
      const savedId = localStorage.getItem("rhexa_chat_session_id");
      if (savedId) {
        const parsed = parseInt(savedId, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setCurrentSessionId(parsed);
        }
      }
      
      // Load selected sources from localStorage
      const savedDocs = localStorage.getItem("rhexa_selected_docs");
      if (savedDocs) {
        try {
          const parsedDocs = JSON.parse(savedDocs);
          if (Array.isArray(parsedDocs)) setSelectedDocs(parsedDocs);
        } catch {}
      }
      const savedDbs = localStorage.getItem("rhexa_selected_dbs");
      if (savedDbs) {
        try {
          const parsedDbs = JSON.parse(savedDbs);
          if (Array.isArray(parsedDbs)) setSelectedDbs(parsedDbs);
        } catch {}
      }
    } catch (e) {
      console.error("[RAG Chat] Local storage error:", e);
    }
  }, [fetchSessions, fetchSources]);

  // 1.5 Safety check: session existence in sessions list
  useEffect(() => {
    if (currentSessionId && sessions.length > 0 && !isSessionsLoading) {
      const exists = sessions.find((s: any) => s.id === currentSessionId);
      if (!exists) {
        console.log("[RAG Chat] Current session not found in list, clearing...");
        setCurrentSessionId(null);
        localStorage.removeItem("rhexa_chat_session_id");
        setMessages([]);
      }
    }
  }, [currentSessionId, sessions, isSessionsLoading]);

  // 2. Persist State and Eager Fetch whenever currentSessionId successfully shifts
  useEffect(() => {
    if (currentSessionId) {
      console.log("[RAG Chat] Saving session & fetching history:", currentSessionId);
      localStorage.setItem("rhexa_chat_session_id", String(currentSessionId));
      fetchHistory(currentSessionId);
    }
  }, [currentSessionId, fetchHistory]);

  // Persist selected documents to localStorage
  useEffect(() => {
    if (selectedDocs.length > 0) {
      localStorage.setItem("rhexa_selected_docs", JSON.stringify(selectedDocs));
    } else {
      localStorage.removeItem("rhexa_selected_docs");
    }
  }, [selectedDocs]);

  // Persist selected databases to localStorage
  useEffect(() => {
    if (selectedDbs.length > 0) {
      localStorage.setItem("rhexa_selected_dbs", JSON.stringify(selectedDbs));
    } else {
      localStorage.removeItem("rhexa_selected_dbs");
    }
  }, [selectedDbs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  /* Close picker when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    if (pickerOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  /* ─── Handlers ─── */
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput("");
    localStorage.removeItem("rhexa_chat_session_id");
    // Note: We keep selectedDocs and selectedDbs - user may want to continue with same sources
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSessionSelect = (id: number) => {
    if (id === currentSessionId) return;
    setCurrentSessionId(id);
    setPickerOpen(false);
    // On mobile close sidebar after selecting
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSendMessage = async (
    e?: React.FormEvent,
    retryContent?: string
  ) => {
    if (e) e.preventDefault();
    const messageText = retryContent || input.trim();
    if (!messageText || isSending) return;

    if (selectedDocs.length === 0 && selectedDbs.length === 0) {
      setPickerOpen(true);
      toast("Select a file or database first", { icon: "📂" });
      return;
    }

    setPickerOpen(false);

    if (!retryContent) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: messageText, status: "sent" },
      ]);
      setInput("");
    }

    if (retryContent) {
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length > 0 && copy[copy.length - 1].status === "failed") {
          copy.pop();
        }
        return copy;
      });
    }

    setIsSending(true);

    try {
      const response = await api.post(
        "/api/chat/",
        {
          message: messageText,
          session_id: currentSessionId,
          document_ids: selectedDocs.length > 0 ? selectedDocs : null,
          database_ids: selectedDbs.length > 0 ? selectedDbs : null,
        },
        { timeout: 30000 }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
          citations: response.data.citations,
          status: "success",
        },
      ]);

      if (!currentSessionId) {
        const newId = response.data.session_id;
        setCurrentSessionId(newId);
        // Optimistically add to sidebar immediately — no wait
        const newTitle = input.trim().slice(0, 50) + (input.trim().length > 50 ? "..." : "");
        setSessions((prev) => [
          { id: newId, title: newTitle || messageText.slice(0, 50), updated_at: new Date().toISOString() },
          ...prev,
        ].slice(0, MAX_SESSIONS));
        // Then refresh to get accurate server data
        fetchSessions();
      }
    } catch (error: any) {
      let errorMessage = "Server busy. Please try again.";
      if (
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout")
      ) {
        errorMessage = "AI is taking too long. Please try again.";
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
          status: "failed",
          retryQuery: messageText,
        },
      ]);
      toast.error("Failed to get response");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const confirmDeleteSession = (id: number) => setShowDeleteConfirm(id);

  const executeDelete = async (id: number) => {
    try {
      await api.delete(`/api/chat/sessions/${id}`);
      toast.success("Chat deleted.");
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
        localStorage.removeItem("rhexa_chat_session_id");
      }
      fetchSessions();
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Session already deleted on server, just update local state
        toast.success("Chat already deleted.");
        if (currentSessionId === id) {
          setCurrentSessionId(null);
          setMessages([]);
          localStorage.removeItem("rhexa_chat_session_id");
        }
        fetchSessions();
      } else {
        toast.error("Could not delete chat.");
      }
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const totalSelected = selectedDocs.length + selectedDbs.length;
  const sourceLabel =
    totalSelected > 0
      ? `${selectedDocs.length > 0 ? `${selectedDocs.length} Doc${selectedDocs.length !== 1 ? "s" : ""}` : ""}${selectedDocs.length > 0 && selectedDbs.length > 0 ? " & " : ""}${selectedDbs.length > 0 ? `${selectedDbs.length} DB${selectedDbs.length !== 1 ? "s" : ""}` : ""}`
      : "No sources selected";

  /* ─── Render ─── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --red: #e11d48;
          --red-dim: #9f1239;
          --red-glow: rgba(225,29,72,0.15);
          --red-subtle: rgba(225,29,72,0.07);
          --black: #080808;
          --black2: #0f0f0f;
          --black3: #161616;
          --black4: #1e1e1e;
          --border: rgba(255,255,255,0.06);
          --border-red: rgba(225,29,72,0.25);
          --text: #f0f0f0;
          --text-dim: #7a7a7a;
          --text-mid: #b0b0b0;
          --text-muted: #3a3a3a;
          --mono: 'Space Mono', monospace;
          --sans: 'Syne', sans-serif;
          --r6: 6px;
          --r10: 10px;
          --r14: 14px;
          --r16: 16px;
        }

        /* ─── ROOT ─── */
        .cr {
          display: flex;
          height: calc(100vh - 140px);
          background: var(--black);
          font-family: var(--sans);
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid var(--border);
          position: relative;
        }

        /* ─── SIDEBAR ─── */
        .csb {
          width: 272px;
          min-width: 272px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, var(--black2) 0%, var(--black3) 100%);
          border-right: 1px solid var(--border);
          transition: width 0.28s cubic-bezier(.4,0,.2,1),
                      min-width 0.28s cubic-bezier(.4,0,.2,1),
                      opacity 0.2s ease;
          overflow: hidden;
        }

        .csb.collapsed {
          width: 0;
          min-width: 0;
          opacity: 0;
          pointer-events: none;
        }

        .csb-head {
          padding: 18px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }

        .csb-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text);
          white-space: nowrap;
        }

        .csb-actions {
          display: flex;
          gap: 4px;
        }

        .ib {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r6);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          flex-shrink: 0;
        }

        .ib:hover {
          border-color: var(--red);
          color: var(--red);
          background: var(--red-subtle);
        }

        .csb-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          scrollbar-width: thin;
          scrollbar-color: var(--black4) transparent;
        }

        .csb-list::-webkit-scrollbar { width: 4px; }
        .csb-list::-webkit-scrollbar-thumb { background: var(--black4); border-radius: 2px; }

        .si {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: var(--r10);
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .si::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--red);
          opacity: 0;
          transition: opacity 0.15s;
          border-radius: 0 2px 2px 0;
        }

        .si:hover { background: var(--black4); border-color: var(--border); }

        .si.active {
          background: var(--red-subtle);
          border-color: var(--border-red);
        }

        .si.active::before { opacity: 1; }

        .si-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--text-muted);
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .si.active .si-dot {
          background: var(--red);
          box-shadow: 0 0 6px var(--red);
        }

        .si-title {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-dim);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          transition: color 0.12s;
        }

        .si.active .si-title { color: var(--text); font-weight: 700; }

        .si-del {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s;
          flex-shrink: 0;
          opacity: 0;
        }

        .si:hover .si-del { opacity: 1; color: var(--text-muted); }
        .si-del:hover { background: rgba(225,29,72,0.12) !important; color: var(--red) !important; }

        .csb-foot {
          padding: 10px 16px;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .csb-foot-text {
          font-family: var(--mono);
          font-size: 8px;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .csb-empty, .csb-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          gap: 10px;
          opacity: 0.5;
          user-select: none;
        }

        .csb-empty-text {
          font-size: 10px;
          font-family: var(--mono);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          text-align: center;
          line-height: 1.6;
        }

        /* ─── MAIN ─── */
        .cm {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--black);
          min-width: 0;
          position: relative;
        }

        /* ─── TOPBAR ─── */
        .ctb {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--black2);
          flex-shrink: 0;
        }

        .ctb-toggle {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r6);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .ctb-toggle:hover { border-color: var(--red); color: var(--red); background: var(--red-subtle); }

        .ai-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--red);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .ai-badge::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 13px;
          border: 1px solid var(--border-red);
          opacity: 0.7;
        }

        .ai-info { flex: 1; min-width: 0; }

        .ai-name {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .ai-sub {
          font-family: var(--mono);
          font-size: 8.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ai-sub.has-sources { color: var(--red); }

        /* ─── MESSAGES ─── */
        .cmsgs {
          flex: 1;
          overflow-y: auto;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          scrollbar-width: thin;
          scrollbar-color: var(--black4) transparent;
        }

        .cmsgs::-webkit-scrollbar { width: 4px; }
        .cmsgs::-webkit-scrollbar-thumb { background: var(--black4); border-radius: 2px; }

        .cempty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px 24px;
          gap: 14px;
          opacity: 0.4;
          user-select: none;
        }

        .cempty-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--red-subtle);
          border: 1px solid var(--border-red);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red);
        }

        .cempty-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .cempty-sub {
          font-size: 11.5px;
          color: var(--text-dim);
          line-height: 1.7;
          max-width: 300px;
          font-family: var(--mono);
          letter-spacing: 0.02em;
        }

        /* Message rows */
        .mr {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          max-width: 82%;
          animation: msgIn 0.25s ease-out;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mr.ur { flex-direction: row-reverse; margin-left: auto; }

        .mav {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mav.ai { background: var(--red); color: #fff; }
        .mav.user { background: var(--black4); border: 1px solid var(--border); color: var(--text-dim); }

        .mbw { display: flex; flex-direction: column; gap: 6px; min-width: 0; }

        .mb {
          padding: 12px 16px;
          font-size: 13.5px;
          line-height: 1.75;
          border-radius: 14px;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .mb.ai {
          background: var(--black3);
          border: 1px solid var(--border);
          color: #d0d0d0;
          border-top-left-radius: 3px;
        }

        .mb.ai.failed {
          border-color: rgba(239,68,68,0.18);
          background: rgba(239,68,68,0.04);
          color: #dd6666;
        }

        .mb.user {
          background: var(--red);
          color: #fff;
          border-top-right-radius: 3px;
          font-weight: 500;
        }

        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 7px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.15);
          color: #ef4444;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--mono);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.12s;
        }

        .retry-btn:hover { background: rgba(239,68,68,0.14); }

        .cits {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .cit {
          font-family: var(--mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--black4);
          border: 1px solid var(--border);
          color: var(--text-dim);
          padding: 3px 9px;
          border-radius: 20px;
          transition: all 0.12s;
        }

        .cit:hover { border-color: var(--red); color: var(--red); }

        /* Typing */
        .trow {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .tbbl {
          padding: 14px 18px;
          background: var(--black3);
          border: 1px solid var(--border);
          border-radius: 14px;
          border-top-left-radius: 3px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tlbl {
          font-family: var(--mono);
          font-size: 8.5px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .tdots { display: flex; gap: 4px; align-items: center; }

        .tdot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red);
          animation: bdot 1.2s infinite;
        }

        .tdot:nth-child(2) { animation-delay: 0.2s; }
        .tdot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bdot {
          0%,80%,100% { transform: translateY(0); opacity: 0.3; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }

        /* ─── INPUT WRAPPER ─── */
        .cia {
          padding: 12px 20px 18px;
          border-top: 1px solid var(--border);
          background: var(--black2);
          flex-shrink: 0;
          position: relative;
        }

        /* ─── SLIDE-UP SOURCE PICKER ─── */
        .sp-wrap {
          position: absolute;
          bottom: 100%;
          left: 20px;
          right: 20px;
          z-index: 40;
          pointer-events: none;
        }

        .sp-wrap.open { pointer-events: auto; }

        .sp-box {
          background: linear-gradient(160deg, #111118 0%, #0d0d10 60%, #0a0a0d 100%);
          border: 1px solid rgba(225,29,72,0.28);
          border-bottom: none;
          border-radius: 16px 16px 0 0;
          padding: 18px 18px 0;
          box-shadow:
            0 -12px 48px rgba(0,0,0,0.7),
            0 0 0 1px rgba(225,29,72,0.06) inset,
            0 0 32px var(--red-glow);
          max-height: 360px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--black4) transparent;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sp-box::-webkit-scrollbar { width: 4px; }
        .sp-box::-webkit-scrollbar-thumb { background: var(--black4); border-radius: 2px; }

        .sp-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(225,29,72,0.15);
          margin-bottom: 2px;
        }

        .sp-header-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--red-subtle);
          border: 1px solid var(--border-red);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red);
          flex-shrink: 0;
        }

        .sp-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text);
          flex: 1;
        }

        .sp-title-sub {
          font-family: var(--mono);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .sp-section { display: flex; flex-direction: column; gap: 10px; }

        .sp-sec-title {
          font-family: var(--mono);
          font-size: 8.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
          padding: 6px 10px;
          background: rgba(255,255,255,0.025);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 7px;
        }

        .sp-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(.4,0,.2,1);
          user-select: none;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-dim);
          overflow: hidden;
          position: relative;
        }

        .sp-card span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .sp-card:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: var(--text);
          transform: translateY(-1px);
        }

        .sp-card.sel {
          border-color: rgba(225,29,72,0.5);
          background: linear-gradient(135deg, rgba(225,29,72,0.1), rgba(225,29,72,0.06));
          color: #fff;
          box-shadow: 0 0 12px rgba(225,29,72,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .sp-chk {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .sp-card.sel .sp-chk {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
          box-shadow: 0 0 6px rgba(225,29,72,0.4);
        }

        .sp-nosrc {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-muted);
          padding: 4px 0;
          letter-spacing: 0.08em;
          grid-column: 1 / -1;
        }

        .sp-confirm {
          border-top: 1px solid rgba(225,29,72,0.12);
          padding: 12px 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-shrink: 0;
        }

        .sp-done-btn {
          padding: 8px 22px;
          border-radius: 9px;
          background: linear-gradient(135deg, #e11d48, #be123c);
          border: none;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          font-family: var(--sans);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(225,29,72,0.35);
        }

        .sp-done-btn:hover {
          background: linear-gradient(135deg, #f43f5e, #e11d48);
          box-shadow: 0 6px 20px rgba(225,29,72,0.45);
          transform: translateY(-1px);
        }
        .sp-done-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; }

        /* ─── INPUT FORM ─── */
        .ifrm {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        /* Source pill above input */
        .src-pill-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .src-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px 4px 8px;
          background: var(--black3);
          border: 1px solid var(--border-red);
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--red);
          cursor: pointer;
          transition: all 0.12s;
          flex-shrink: 0;
        }

        .src-pill:hover {
          background: var(--red-subtle);
          border-color: var(--red);
          box-shadow: 0 0 10px var(--red-glow);
        }

        .src-pill.empty {
          border-color: var(--border);
          color: var(--text-dim);
          background: var(--black4);
        }

        .src-pill.empty:hover {
          border-color: var(--text-dim);
          color: var(--text);
          background: var(--black3);
          box-shadow: none;
        }

        .src-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .ibox {
          width: 100%;
          background: var(--black3);
          border: 1px solid var(--border);
          border-radius: var(--r14);
          padding: 14px 56px 14px 18px;
          font-family: var(--sans);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text);
          outline: none;
          resize: none;
          line-height: 1.6;
          min-height: 52px;
          max-height: 160px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          display: block;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--black4) transparent;
        }

        .ibox::placeholder { color: var(--text-muted); }

        .ibox:focus {
          border-color: var(--border-red);
          box-shadow: 0 0 0 3px var(--red-glow);
        }

        .sbtn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: var(--red);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .sbtn:hover:not(:disabled) { background: #be123c; transform: scale(1.04); }
        .sbtn:disabled { opacity: 0.35; cursor: not-allowed; }

        .ihint {
          font-family: var(--mono);
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-align: center;
          margin-top: 8px;
        }

        /* ─── DELETE MODAL ─── */
        .del-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .del-modal {
          background: var(--black3);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 30px;
          max-width: 360px;
          width: 90%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .del-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .del-desc { font-size: 12.5px; color: var(--text-dim); line-height: 1.65; }

        .del-actions { display: flex; gap: 8px; justify-content: flex-end; }

        .db {
          padding: 9px 18px;
          border-radius: 9px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.12s;
          border: 1px solid var(--border);
          font-family: var(--sans);
        }

        .db.cancel { background: transparent; color: var(--text-dim); }
        .db.cancel:hover { background: var(--black4); color: var(--text); }
        .db.confirm { background: var(--red); color: #fff; border-color: var(--red); }
        .db.confirm:hover { background: #be123c; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .cr { height: calc(100vh - 80px); border-radius: 0; border-left: none; border-right: none; }

          .csb {
            position: absolute;
            top: 0; left: 0; bottom: 0;
            z-index: 50;
            width: 260px;
            min-width: 260px;
            box-shadow: 8px 0 32px rgba(0,0,0,0.5);
          }

          .csb.collapsed { width: 0; min-width: 0; }

          .cmsgs { padding: 18px 14px; gap: 18px; }
          .mr { max-width: 92%; }
          .ctb { padding: 12px 14px; }
          .cia { padding: 10px 12px 14px; }

          .ibox {
            font-size: 14px;
            padding: 12px 52px 12px 14px;
            border-radius: 12px;
            min-height: 46px;
          }

          .sbtn { width: 32px; height: 32px; right: 8px; bottom: 8px; }
          .ai-name { font-size: 12.5px; }
          .sp-wrap { left: 12px; right: 12px; }
          .src-pill-row { margin-bottom: 7px; }

          .del-modal { padding: 22px 20px; }
        }

        @media (max-width: 480px) {
          .cia { padding: 8px 8px 12px; }
          .ctb { padding: 10px 12px; gap: 10px; }
          .sp-wrap { left: 8px; right: 8px; }
          .mr { max-width: 95%; }
          .mb { font-size: 13px; padding: 10px 13px; }
          .ai-name { font-size: 12px; }
          .ai-sub { font-size: 7.5px; }
          .ai-badge { width: 30px; height: 30px; }
          .ctb-toggle { width: 28px; height: 28px; }
          .cempty-title { font-size: 15px; }
          .cempty-sub { font-size: 10.5px; }
        }

        @media (min-width: 1920px) {
          .cmsgs { padding: 44px 36px; gap: 28px; }
          .mr { max-width: 72%; }
          .mb { font-size: 15px; padding: 16px 22px; }
          .ibox { font-size: 15px; padding: 16px 64px 16px 22px; }
          .ai-name { font-size: 15px; }
        }
      `}</style>

      <div className="cr">
        {/* ─── SIDEBAR ─── */}
        <div className={`csb ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="csb-head">
            <span className="csb-label">Chat History</span>
            <div className="csb-actions">
              <button
                className="ib"
                onClick={fetchSessions}
                title="Refresh history"
                style={{ marginRight: 6 }}
              >
                <RefreshCw size={13} className={isSessionsLoading ? "animate-spin" : ""} />
              </button>
              <button
                className="ib"
                onClick={handleNewChat}
                title="New Chat"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="csb-list">
            {isSessionsLoading ? (
              <div className="csb-loading">
                 <RefreshCw size={18} className="animate-spin" style={{ color: "var(--red)", opacity: 0.6 }} />
                 <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Loading history...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="csb-empty">
                <MessageCircle size={20} color="var(--text-muted)" />
                <span className="csb-empty-text">
                  No chats yet · Press + to start
                </span>
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`si ${currentSessionId === s.id ? "active" : ""}`}
                  onClick={() => handleSessionSelect(s.id)}
                >
                  <span className="si-dot" />
                  <span className="si-title">{s.title}</span>
                  <button
                    className="si-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeleteSession(s.id);
                    }}
                    title="Delete chat"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="csb-foot">
            <p className="csb-foot-text">{sessions.length} / {MAX_SESSIONS} chats</p>
          </div>
        </div>

        {/* ─── DELETE CONFIRMATION ─── */}
        <AnimatePresence>
          {showDeleteConfirm !== null && (
            <motion.div
              className="del-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                className="del-modal"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="del-title">
                  <AlertCircle size={17} color="var(--red)" />
                  Delete this chat?
                </div>
                <p className="del-desc">
                  This permanently removes the conversation and all its messages.
                  This action cannot be undone.
                </p>
                <div className="del-actions">
                  <button className="db cancel" onClick={() => setShowDeleteConfirm(null)}>
                    Cancel
                  </button>
                  <button className="db confirm" onClick={() => executeDelete(showDeleteConfirm!)}>
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── MAIN ─── */}
        <div className="cm">
          {/* Topbar */}
          <div className="ctb">
            <button
              className="ctb-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              title="Toggle sidebar"
            >
              <MessageSquare size={14} />
            </button>

            <div className="ai-badge">
              <Bot size={15} color="#fff" />
            </div>

            <div className="ai-info">
              <div className="ai-name">
                RheXa AI
                {currentSessionId && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 9,
                      fontFamily: "var(--mono)",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Session #{currentSessionId}
                  </span>
                )}
              </div>
              <div className={`ai-sub ${totalSelected > 0 ? "has-sources" : ""}`}>
                {totalSelected > 0 ? `✓ ${sourceLabel}` : "No sources selected · click pill below"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="cmsgs" ref={scrollRef}>
            {isHistoryLoading ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: "2px solid var(--border)",
                    borderTopColor: "var(--red)",
                    animation: "bdot 0.8s linear infinite",
                  }}
                />
              </div>
            ) : messages.length === 0 ? (
              <div className="cempty">
                <div className="cempty-icon">
                  <Sparkles size={22} />
                </div>
                <div className="cempty-title">
                  {currentSessionId ? "No messages yet" : "Start a conversation"}
                </div>
                <div className="cempty-sub">
                  {totalSelected > 0
                    ? `${sourceLabel} active. Ask anything about your data.`
                    : "Select a file or database from the pill below to begin chatting with your AI."}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mr ${m.role === "user" ? "ur" : ""}`}
                >
                  <div className={`mav ${m.role === "user" ? "user" : "ai"}`}>
                    {m.role === "user" ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className="mbw">
                    <div
                      className={`mb ${m.role === "user" ? "user" : "ai"} ${
                        m.status === "failed" ? "failed" : ""
                      }`}
                    >
                      {m.content}
                    </div>

                    {m.status === "failed" && m.retryQuery && (
                      <button
                        className="retry-btn"
                        onClick={() => handleSendMessage(undefined, m.retryQuery)}
                        disabled={isSending}
                      >
                        <RefreshCw size={11} />
                        Try Again
                      </button>
                    )}

                    {m.citations && m.citations.length > 0 && (
                      <div className="cits">
                        {Array.from(
                          new Set(m.citations.map((c: any) => c.filename))
                        ).map((filename: any, i: number) => (
                          <span key={i} className="cit">
                            {filename}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {isSending && (
              <div className="trow">
                <div className="mav ai">
                  <Bot size={13} />
                </div>
                <div className="tbbl">
                  <span className="tlbl">Thinking</span>
                  <div className="tdots">
                    <span className="tdot" />
                    <span className="tdot" />
                    <span className="tdot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="cia">
            {/* Slide-up Source Picker */}
            <AnimatePresence>
              {pickerOpen && (
                <div 
                  className="sp-wrap open" 
                  ref={pickerRef}
                >
                  <motion.div
                    className="sp-box"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="sp-header">
                      <div className="sp-header-icon">
                        <Database size={13} />
                      </div>
                      <div>
                        <div className="sp-title">Knowledge Base</div>
                        <div className="sp-title-sub">Select sources to chat with</div>
                      </div>
                    </div>

                    {isLoadingSources ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          color: "var(--text-dim)",
                          fontSize: 11,
                          padding: "12px 0",
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            border: "2px solid var(--border)",
                            borderTopColor: "var(--red)",
                            borderRadius: "50%",
                            animation: "bdot 0.8s linear infinite",
                          }}
                        />
                        Loading sources...
                      </div>
                    ) : (
                      <>
                        {/* Documents */}
                        <div className="sp-section">
                          <div className="sp-sec-title">
                            <FileText size={9} />
                            Documents
                          </div>
                          <div className="sp-grid">
                            {availableDocs.length === 0 ? (
                              <span className="sp-nosrc">No documents uploaded</span>
                            ) : (
                              availableDocs.map((doc) => (
                                <div
                                  key={doc.id}
                                  className={`sp-card ${
                                    selectedDocs.includes(doc.id) ? "sel" : ""
                                  }`}
                                  onClick={() =>
                                    setSelectedDocs((prev) =>
                                      prev.includes(doc.id)
                                        ? prev.filter((id) => id !== doc.id)
                                        : [...prev, doc.id]
                                    )
                                  }
                                >
                                  <div className="sp-chk">
                                    <Check size={9} strokeWidth={3} />
                                  </div>
                                  <FileText size={11} style={{ flexShrink: 0 }} />
                                  <span>{doc.filename}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Databases */}
                        <div className="sp-section">
                          <div className="sp-sec-title">
                            <Database size={9} />
                            Databases
                          </div>
                          <div className="sp-grid">
                            {availableDbs.length === 0 ? (
                              <span className="sp-nosrc">No databases connected</span>
                            ) : (
                              availableDbs.map((db) => (
                                <div
                                  key={db.id}
                                  className={`sp-card ${
                                    selectedDbs.includes(db.id) ? "sel" : ""
                                  }`}
                                  onClick={() =>
                                    setSelectedDbs((prev) =>
                                      prev.includes(db.id)
                                        ? prev.filter((id) => id !== db.id)
                                        : [...prev, db.id]
                                    )
                                  }
                                >
                                  <div className="sp-chk">
                                    <Check size={9} strokeWidth={3} />
                                  </div>
                                  <Database size={11} style={{ flexShrink: 0 }} />
                                  <span>{db.name}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="sp-confirm">
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 8.5,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: totalSelected > 0 ? "var(--red)" : "var(--text-muted)",
                        }}
                      >
                        {totalSelected > 0
                          ? `${totalSelected} source${totalSelected !== 1 ? "s" : ""} selected`
                          : "None selected"}
                      </span>
                      <button
                        className="sp-done-btn"
                        onClick={() => setPickerOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Source Pill + Form */}
            <div className="src-pill-row">
              <button
                className={`src-pill ${totalSelected === 0 ? "empty" : ""}`}
                onClick={() => !pickerOpen && setPickerOpen(true)}
                disabled={pickerOpen}
                title="Select knowledge sources"
                style={pickerOpen ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                <ChevronUp
                  size={12}
                  style={{
                    transform: pickerOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
                {totalSelected > 0 ? sourceLabel : "Select Source"}
              </button>
            </div>

            <form className="ifrm" onSubmit={handleSendMessage}>
              <textarea
                ref={inputRef}
                className="ibox"
                placeholder={
                  totalSelected > 0
                    ? "Ask anything about your data..."
                    : "Select a source above, then start typing..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                type="submit"
                className="sbtn"
                disabled={!input.trim() || isSending}
              >
                <Send size={14} />
              </button>
            </form>
            <p className="ihint">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </>
  );
}