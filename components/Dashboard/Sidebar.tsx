"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Library, 
  Search,
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Database,
  BarChart3,
  Code,
  Menu,
  X,
  ChevronLeft,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLayout } from "@/lib/context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Library, label: "Library", href: "/dashboard/library" },
  { icon: Database, label: "Data Sources", href: "/dashboard/data-sources" },
  { icon: Search, label: "Knowledge Search", href: "/dashboard/search" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
  { icon: BarChart3, label: "Data Chat", href: "/dashboard/data-chat" },
  { icon: Code, label: "Chat Widget", href: "/dashboard/widget" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, isSidebarCollapsed, toggleSidebar, setSidebarOpen } = useLayout();

  const handleLogout = () => {
    Cookies.remove("rhexa_token");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#050505] border-r border-white/5 flex flex-col z-50 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isSidebarCollapsed ? "w-20" : "w-64",
          !isSidebarOpen && "lg:w-20 lg:translate-x-0" // Always show collapsed on desktop if closed
        )}
      >
        {/* Toggle Button for Desktop */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg z-50 hover:scale-110 transition-transform hidden lg:flex"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={cn("p-6 mb-8 flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-20 h-20 shrink-0">
              <Image src="/Tlogo.png" alt="RheXa Logo" fill className="object-contain" />
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isSidebarCollapsed ? item.label : ""}
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted hover:bg-white/5 hover:text-foreground",
                  isSidebarCollapsed ? "justify-center" : "justify-between"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-muted group-hover:text-primary")} />
                  {!isSidebarCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-semibold text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
                {!isSidebarCollapsed && isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                
                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-surface border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] shadow-2xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center px-4 py-3 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group",
              isSidebarCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
            {!isSidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
