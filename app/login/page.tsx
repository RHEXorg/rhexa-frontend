"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error === "account_exists_locally") {
      toast.error("Security Conflict: This email is already registered with a password. Please sign in via your credentials.");
    } else if (error === "account_exists_other_provider") {
      toast.error("Identity mismatch: This email uses a different login method. Please check your provider.");
    } else if (error) {
      toast.error(`Authentication Protocol Failure: ${error}`);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = `${API_URL}/api/auth/google/login`;
  };

  const handleGithubLogin = () => {
    setIsGithubLoading(true);
    window.location.href = `${API_URL}/api/auth/github/login`;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token } = response.data;
      Cookies.set("rhexa_token", access_token, { expires: 1 });
      
      toast.success("Welcome back! Redirecting to your dashboard...");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Logo SVG Component
  const GoogleLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const GithubLogo = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85v2.74c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#000000] text-white flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 selection:bg-red-600 selection:text-white overflow-hidden relative">
      
      {/* ABSTRACT BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] sm:w-[40%] h-[50%] sm:h-[40%] bg-red-600/5 blur-[100px] sm:blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] sm:w-[40%] h-[50%] sm:h-[40%] bg-red-900/10 blur-[100px] sm:blur-[150px] rounded-full" />
        {/* Futuristic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] grid lg:grid-cols-2 gap-0 border border-white/5 bg-black/40 backdrop-blur-3xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(255,0,0,0.1)]"
      >
        
        {/* LEFT SIDE: BRANDING/ABSTRACT (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-8 lg:p-12 xl:p-16 2xl:p-20 border-r border-white/5 relative bg-[url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
          <div className="absolute inset-0 bg-black/80 backdrop-static" />
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 lg:gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <Image 
                src="/Tlogo.png" 
                alt="RheXa Logo" 
                width={200} 
                height={200}
                className="w-28 h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 2xl:w-52 2xl:h-52 object-contain"
              />
            </Link>
          </div>

          <div className="relative z-10 space-y-4 lg:space-y-6">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-tight uppercase tracking-tighter">
              Ask . <span className="text-red-600">Know.</span> <br />Grow.
            </h2>
            <p className="text-white/50 max-w-sm lg:max-w-md xl:max-w-lg text-sm lg:text-base xl:text-lg font-medium leading-relaxed">
              Ask your data anything. Get answers backed by your documents.
            </p>
          </div>

          <div className="relative z-10" />
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="p-5 sm:p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-24 flex flex-col justify-center relative min-h-[500px] sm:min-h-[600px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8 sm:mb-10">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <Image 
                src="/Tlogo.png" 
                alt="RheXa Logo" 
                width={160} 
                height={160}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
            </Link>
          </div>

          <div className="max-w-[360px] sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto w-full space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="text-center lg:text-left">
              <p className="text-white/50 text-sm sm:text-base lg:text-lg">Sign in to continue to your dashboard</p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Social Auth Row */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="group flex items-center justify-center gap-3 py-3 px-4 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all duration-200 rounded-xl"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                  ) : (
                    <>
                      <GoogleLogo />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Google</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleGithubLogin}
                  disabled={isGithubLoading}
                  className="group flex items-center justify-center gap-3 py-3 px-4 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all duration-200 rounded-xl"
                >
                  {isGithubLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                  ) : (
                    <>
                      <GithubLogo />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">GitHub</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-xs sm:text-sm font-medium text-white/30">or sign in with email</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white/60 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.08] border border-white/10 rounded-lg sm:rounded-xl py-3.5 sm:py-4 lg:py-5 pl-11 sm:pl-12 lg:pl-14 pr-4 text-sm sm:text-base text-white focus:outline-none focus:border-red-600/50 focus:bg-white/[0.12] transition-all placeholder:text-white/30"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-white/60 block">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.08] border border-white/10 rounded-lg sm:rounded-xl py-3.5 sm:py-4 lg:py-5 pl-11 sm:pl-12 lg:pl-14 pr-12 text-sm sm:text-base text-white focus:outline-none focus:border-red-600/50 focus:bg-white/[0.12] transition-all placeholder:text-white/30"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-xs sm:text-sm text-red-500/80 hover:text-red-400 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-red-600/50 disabled:to-red-500/50 transition-all duration-300 rounded-lg font-medium text-sm sm:text-base shadow-lg shadow-red-600/20 hover:shadow-red-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="pt-4 sm:pt-6 flex flex-col items-center gap-4 sm:gap-5">
                <p className="text-xs sm:text-sm text-white/40 text-center">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-red-500 hover:text-red-400 font-semibold transition-colors">Sign up for free</Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        </div>
      </motion.div>

      {/* Footer Meta - Hidden on very small screens */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 hidden sm:block">
        <p className="text-[8px] sm:text-[9px] font-medium text-white/20">© 2026 RheXa. All rights reserved.</p>
      </div>
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 hidden sm:block">
        <p className="text-[8px] sm:text-[9px] font-medium text-white/20">Privacy Policy • Terms of Service</p>
      </div>
    </div>
  );
}