"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, Key, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      toast.success("Security sequence initiated. Check your email for the code.");
      setStep(2);
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Failed to initiate reset sequence.";
      toast.error(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/api/auth/verify-reset-code", { email, code });
      toast.success("Identity verified. You may now override your password.");
      setStep(3);
    } catch (error: any) {
      toast.error("Invalid or expired transmission code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Security mismatch: Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/api/auth/reset-password", { email, code, new_password: newPassword });
      toast.success("Password reset successful. Access protocols updated.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#000000] text-white flex items-center justify-center p-4 sm:p-6 selection:bg-red-600 selection:text-white overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link href="/login">
            <Image src="/Tlogo.png" alt="RheXa" width={120} height={120} className="w-24 h-24 object-contain" />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Reset Password</h1>
                <p className="text-white/50 text-sm">Enter your email to receive a security code.</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 block uppercase tracking-tighter">Email Identity</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600/50 transition-all"
                      placeholder="user@rhex.intelligence"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold uppercase tracking-widest text-sm hover:from-red-500 hover:to-red-400 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Reset Sequence"}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Key className="w-12 h-12 text-red-600 mx-auto mb-2" />
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Verify Code</h1>
                <p className="text-white/50 text-sm">Code transmitted to <span className="text-white font-medium">{email}</span></p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 block uppercase tracking-tighter">Secure Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600/50" />
                    <input 
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-center tracking-[10px] text-xl font-bold focus:outline-none focus:border-red-600/50 transition-all"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold uppercase tracking-widest text-sm hover:from-red-500 hover:to-red-400 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Reset"}
                </button>

                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-full text-white/40 text-xs hover:text-white transition-colors"
                >
                  Incorrect email? Go back.
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">New Password</h1>
                <p className="text-white/50 text-sm">Update your access protocols.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 block uppercase tracking-tighter">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600/50 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 block uppercase tracking-tighter">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-600/50 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold uppercase tracking-widest text-sm hover:from-red-500 hover:to-red-400 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalize Reset"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link href="/login" className="text-white/40 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
        </div>
      </motion.div>
      
      {/* Footer Meta */}
      <div className="fixed bottom-6 w-full text-center pointer-events-none">
        <p className="text-[10px] font-medium text-white/20 tracking-widest uppercase">© 2026 RheXa Security Protocol • All rights reserved.</p>
      </div>
    </div>
  );
}
