import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative w-28 h-28">
            <Image 
              src="/Tlogo.png" 
              alt="RheXa Logo" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex gap-8 text-sm text-muted">
          <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
        </div>

        <div className="text-sm text-muted/50">
          © {new Date().getFullYear()} RHEXA_MARK. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
