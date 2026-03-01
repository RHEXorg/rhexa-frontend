"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center bg-fixed">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-40 h-40">
              <Image src="/Tlogo.png" alt="RheXa Logo" fill className="object-contain brightness-110" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted mt-2">{subtitle}</p>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Subtle Red glow on top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};
