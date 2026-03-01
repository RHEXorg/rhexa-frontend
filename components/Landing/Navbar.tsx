"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -120, opacity: 0 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-0"
    >
      {/* Brand Identity Module */}
      <div className="flex items-center gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-32 h-32 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/Tlogo.png" 
              alt="RheXa Logo" 
              fill 
              className="object-contain p-2 brightness-125"
            />
          </div>
        </Link>
      </div>

      {/* Strategic Navigation Array */}
      <div className="hidden lg:flex items-center gap-10">
        {[
          { name: "Features", href: "#features" },
          { name: "Protocol", href: "#about" },
          { name: "Interface", href: "#contact" }
        ].map((item) => (
          <Link 
            key={item.name}
            href={item.href} 
            className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 transition-colors py-2 group"
          >
            {item.name}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Terminal Access Controls */}
      <div className="flex items-center gap-2 md:gap-6">
        <Link 
          href="/login" 
          className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
        >
          Auth.Login
        </Link>
        
        <Link 
          href="/signup" 
          className="relative px-6 py-2 group overflow-hidden"
        >
          {/* Background Layer */}
          <div className="absolute inset-0 bg-red-600 skew-x-[-15deg] group-hover:bg-red-700 transition-colors" />
          
          {/* Label */}
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Initialize_System
          </span>
          
          {/* Subtle Glow */}
          <div className="absolute inset-0 shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-shadow" />
        </Link>
      </div>
    </motion.nav>
  );
};