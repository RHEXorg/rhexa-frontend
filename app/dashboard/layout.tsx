"use client";

import React from "react";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { TopBar } from "@/components/Dashboard/TopBar";

import { useLayout } from "@/lib/context/LayoutContext";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useLayout();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          "lg:ml-64", 
          isSidebarCollapsed && "lg:ml-20"
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
