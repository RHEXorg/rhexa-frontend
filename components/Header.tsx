"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Cookies from "js-cookie";
import { useSession, signOut } from "next-auth/react";

export const Header = () => {
  const { data: session, status } = useSession();
  const [hasCookieToken, setHasCookieToken] = useState(false);
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

  useEffect(() => {
    const token = Cookies.get("rhexa_token");
    setHasCookieToken(!!token);
  }, []);

  const isLoggedIn = status === "authenticated" || hasCookieToken;

  const handleSignOut = async () => {
    Cookies.remove("rhexa_token");
    await signOut({ callbackUrl: "/" });
  };

  return (
    <motion.header 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -120, opacity: 0 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-0"
    >
      {/* Abstract Background Element - Reduced opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[100%] left-1/2 -translate-x-1/2 w-1/2 h-[200%] bg-red-600/2 blur-[120px] rounded-full" />
      </div>

      {/* Logo Section */}
      <div className="flex items-center z-10">
        <Link href="/" className="group relative flex items-center gap-3">
          <div className="relative w-28 h-28 md:w-32 md:h-32 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/Tlogo.png" 
              alt="RheXa Logo" 
              fill 
              priority
              className="object-contain filter brightness-125"
            />
          </div>
        </Link>
      </div>

      {/* Action Module */}
      <div className="flex items-center gap-6 md:gap-8 z-10">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden xs:block">
              <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">System Active</span>
              <span className="text-[11px] text-white/50 lowercase">{session?.user?.name || "User"}</span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-red-600 rounded-full opacity-20 group-hover:opacity-100 transition duration-500 blur-sm"></div>
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="User Profile" 
                  width={38} 
                  height={38} 
                  className="relative rounded-full border border-red-500/50 object-cover bg-black"
                />
              ) : (
                <div className="relative w-9 h-9 rounded-full border border-red-500/50 bg-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                </div>
              )}
            </div>


          </div>
        ) : (
          <Link 
            href="/login" 
            className="group relative flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full transition-all hover:bg-red-600 hover:text-white"
          >
            <span className="text-xs font-black uppercase tracking-widest">
              Access Terminal
            </span>
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
      </div>
    </motion.header>
  );
};