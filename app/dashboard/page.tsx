"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Database,
  TrendingUp,
  Clock,
  Plus
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    docs: 0,
    chats: 0,
    storage: "0 MB"
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let docs = [];
        let sessions = [];

        try {
          const docsRes = await api.get("/api/documents");
          docs = docsRes.data.documents || [];
        } catch {}

        try {
          const sessionsRes = await api.get("/api/chat/sessions");
          sessions = sessionsRes.data || [];
        } catch {}

        setStats({
          docs: docs.length,
          chats: sessions.length,
          storage: `${(
            docs.reduce((acc: number, d: any) => acc + d.file_size, 0) /
            (1024 * 1024)
          ).toFixed(2)} MB`
        });

        const docActivities = docs.map((d: any) => ({
          type: "document",
          title: `Document added — ${d.filename}`,
          time: new Date(d.created_at),
          icon: FileText
        }));

        const chatActivities = sessions.map((s: any) => ({
          type: "chat",
          title: `Chat updated — ${s.title}`,
          time: new Date(s.updated_at || s.created_at),
          icon: MessageSquare
        }));

        setActivities(
          [...docActivities, ...chatActivities]
            .sort((a, b) => b.time.getTime() - a.time.getTime())
            .slice(0, 5)
        );
      } catch {}
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Uploaded Documents", value: stats.docs, icon: FileText },
    { label: "Total Data Used", value: stats.storage, icon: Database },
    { label: "Active Chat History", value: stats.chats, icon: MessageSquare },
    { label: "Response Quality", value: "99.2%", icon: TrendingUp }
  ];

  return (
    <div className="relative space-y-14">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            System Overview
          </h1>
          <p className="text-sm text-white/50 max-w-xl">
            A quick look at your current documents, chat activity, and system status.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/data-sources/database"
            className="relative px-6 py-3 rounded-xl border border-red-500/20 text-sm font-semibold text-red-400 hover:bg-red-500/5 transition"
          >
            <Database className="w-4 h-4 inline-block mr-2" />
            Connect Database
          </Link>

          <Link
            href="/dashboard/library"
            className="relative px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-black font-bold transition shadow-[0_0_40px_rgba(255,0,0,0.35)]"
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            Add Files
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, ease: "easeOut" }}
            className="relative p-6 rounded-2xl bg-black border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> live
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  {card.label}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {card.value}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Analytics Placeholder */}
        <div className="xl:col-span-2 relative rounded-3xl bg-black border border-white/10 p-10 flex flex-col justify-center">
          <TrendingUp className="w-20 h-20 text-red-500/10 absolute top-10 right-10" />
          <h2 className="text-2xl font-bold text-white">
            Data Growth
          </h2>
          <p className="text-sm text-white/50 max-w-md mt-3">
            Track how your documents and database connections grow over time.
          </p>
        </div>

        {/* Activity */}
        <div className="rounded-3xl bg-black border border-white/10 p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Recent Activity
          </h2>

          <div className="space-y-5">
            {activities.length > 0 ? (
              activities.map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <act.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {act.title}
                    </p>
                    <p className="text-xs text-white/40">
                      {act.time.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40 italic">
                No activity detected.
              </p>
            )}
          </div>

          <Link
            href="/dashboard/library"
            className="block mt-8 text-sm font-semibold text-red-500 hover:text-red-400 transition"
          >
            Manage Your Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
