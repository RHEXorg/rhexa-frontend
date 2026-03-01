"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLayout } from "@/lib/context/LayoutContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const GlobalFooter = () => {
  const currentYear = new Date().getFullYear();
  const { isSidebarCollapsed } = useLayout();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <footer 
      className={cn(
        "relative py-20 px-6 md:px-12 bg-black border-t border-zinc-900 transition-all duration-500 ease-in-out overflow-hidden",
        isDashboard ? (isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64") : "ml-0"
      )}
    >
      {/* Structural Accent */}
      <div className="absolute top-0 left-0 w-32 h-[1px] bg-red-600" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          
          {/* Logo & Status Section */}
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-28 grayscale brightness-200 transition-all hover:grayscale-0">
                <Image 
                  src="/Tlogo.png" 
                  alt="RheXa Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-[11px] leading-relaxed uppercase tracking-widest text-zinc-500 max-w-xs">
              Neural Network Document Intelligence. <br />
              <span className="text-red-900 font-bold tracking-normal">// Protocol 4.0 // Secure_Node</span>
            </p>
          </div>

          {/* Navigation Matrix */}
          {[
            {
              title: "Directory",
              links: [
                { name: "Home_Index", href: "/" },
                { name: "About_Us", href: "/about" },
                { name: "Pricing_Model", href: "/pricing" },
                { name: "Contact_Link", href: "/contact" }
              ]
            },
            {
              title: "Deployments",
              links: [
                { name: "Shopify.ext", href: "/integrations/shopify" },
                { name: "WooCommerce.ext", href: "/integrations/woocommerce" },
                { name: "NextJS.env", href: "/integrations/react-nextjs" }
              ]
            },
            {
              title: "Governance",
              links: [
                { name: "Terms_Of_Service", href: "/terms" },
                { name: "Privacy_Vault", href: "/privacy" },
                { name: "Security_Audit", href: "/security" }
              ]
            },
            {
              title: "Terminal",
              links: [
                { name: "Access.Login", href: "/login" },
                { name: "System.Register", href: "/signup" }
              ]
            }
          ].map((column) => (
            <div key={column.title} className="flex flex-col gap-5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-2">
                {column.title}
              </h3>
              <div className="flex flex-col gap-3 text-[11px] font-medium uppercase tracking-widest">
                {column.links.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-zinc-500 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-red-600 transition-all mr-0 group-hover:mr-2" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System Log / Bottom Bar */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] flex items-center gap-4">
            <span>[ SYSTEM: ACTIVE ]</span>
            <span>© {currentYear} RHEXA_MARK_SECURE</span>
          </div>

          <div className="flex gap-10">
            {["Twitter", "GitHub", "LinkedIn"].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Background Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </footer>
  );
};