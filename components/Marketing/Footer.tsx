import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 px-6 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm font-bold uppercase tracking-widest">
        <div className="md:col-span-1 space-y-6">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm text-white">R</div>
            RHEXA
          </Link>
          <p className="text-[10px] text-muted normal-case font-bold leading-relaxed pr-8 opacity-60">
            The AI-powered knowledge layer for modern businesses. Built for security, speed, and accuracy. Transform your documentation into a conversational intelligence hub.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-white">Product</h4>
          <nav className="flex flex-col gap-3 text-muted lowercase first-letter:uppercase">
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Roadmap</Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="text-white">Company</h4>
          <nav className="flex flex-col gap-3 text-muted lowercase first-letter:uppercase">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Careers</Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="text-white">Legal</h4>
          <nav className="flex flex-col gap-3 text-muted lowercase first-letter:uppercase">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Trust Center</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center pt-20 text-[10px] text-muted font-black uppercase tracking-[0.2em] opacity-30">
        &copy; {new Date().getFullYear()} RheXa Org. All Rights Reserved.
      </div>
    </footer>
  );
}
