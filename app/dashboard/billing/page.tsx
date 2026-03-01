"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, Zap, ArrowRight, Shield, AlertCircle, Loader2 } from "lucide-react";
import { billingApi } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface BillingInfo {
  tier: string;
  usage: {
    widgets: number;
    files: number;
    databases: number;
  };
  limits: {
    widgets: number;
    files: number;
    databases: number;
  };
  is_expired: boolean;
  trial_ends_at: string | null;
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      const res = await billingApi.getStatus();
      setBillingInfo(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load billing status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);
    try {
      const res = await billingApi.upgrade(planName);
      
      // If the backend returned a Lemon Squeezy payment link, redirect instantly!
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        toast.success(res.data.message || "Upgrade initiated");
        await fetchBillingInfo();
      }
    } catch (err) {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const tier = billingInfo?.tier || 'free_trial';
  const usage = billingInfo?.usage || { widgets: 0, files: 0, databases: 0 };
  const limits = billingInfo?.limits || { widgets: 1, files: 1, databases: 0 };
  const is_expired = billingInfo?.is_expired || false;
  const trial_ends_at = billingInfo?.trial_ends_at || null;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Billing & Subscriptions</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Choose Your Power.</h1>
        <p className="text-muted text-lg max-w-2xl">
          Upgrade your plan to unlock higher limits for files, databases, and custom widgets. Payments are processed globally and billed every 2 months.
        </p>
      </div>

      {is_expired && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-red-500 font-bold">Free Trial Expired</h3>
            <p className="text-red-500/80 text-sm mt-1">Your 2-day free trial has expired. Uploads and Chatbot creation have been restricted. Please select a plan below to restore full access to your organization.</p>
          </div>
        </div>
      )}

      {/* Usage Overview */}
      <div className="glass p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-muted tracking-widest">Current Plan</p>
          <div className="flex items-center gap-3 mt-2">
            <h2 className="text-3xl font-bold text-white capitalize">{tier.replace('_', ' ')}</h2>
            {tier === "free_trial" && !is_expired && trial_ends_at && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                Ends {new Date(trial_ends_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase text-muted font-bold tracking-widest">Widgets</p>
            <p className="text-xl font-black mt-1">{usage?.widgets} <span className="text-muted text-sm font-medium">/ {limits?.widgets === Infinity ? "∞" : limits?.widgets}</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-muted font-bold tracking-widest">Files</p>
            <p className="text-xl font-black mt-1">{usage?.files} <span className="text-muted text-sm font-medium">/ {limits?.files === Infinity ? "∞" : limits?.files}</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase text-muted font-bold tracking-widest">Databases</p>
            <p className="text-xl font-black mt-1">{usage?.databases} <span className="text-muted text-sm font-medium">/ {limits?.databases === Infinity ? "∞" : limits?.databases}</span></p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Free Plan */}
        <div className={`p-8 rounded-[2rem] border transition-all ${tier === 'free_trial' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'glass border-white/5'}`}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Free Trial</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">$0</span>
              <span className="text-sm text-muted font-bold">/ 2 days</span>
            </div>
            <p className="text-sm text-muted-foreground pt-4">Test out the platform before committing.</p>
          </div>
          <ul className="space-y-4 py-8">
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> 1 AI Widget
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> 1 Document Upload
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground line-through">
              <XIcon className="w-5 h-5 opacity-50" /> Connect SQL Databases
            </li>
          </ul>
          <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-white/5 text-white/50 cursor-not-allowed">
            {tier === "free_trial" ? "Current Plan" : "Unavailable"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`p-8 rounded-[2rem] border transition-all relative ${tier === 'pro' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'glass border-white/10'}`}>
          {tier !== 'pro' && tier !== 'enterprise' && (
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
               Recommended
             </div>
          )}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Professional</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">$6</span>
              <span className="text-sm text-muted font-bold">/ 2 Months</span>
            </div>
            <p className="text-sm text-muted-foreground pt-4">For growing businesses needing real power.</p>
          </div>
          <ul className="space-y-4 py-8">
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> 6 AI Widgets
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> 10 Document Uploads
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> 2 SQL Database Connections
            </li>
          </ul>
          {tier === 'pro' ? (
            <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-primary/20 text-primary border border-primary/20 cursor-default">
              Current Plan
            </button>
          ) : (
            <button 
              onClick={() => handleUpgrade('pro')}
              className="w-full py-4 rounded-xl font-bold text-sm bg-primary text-white hover:bg-red-500 transition-colors shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
            >
              Upgrade to Pro <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Enterprise Plan */}
        <div className={`p-8 rounded-[2rem] border transition-all ${tier === 'enterprise' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'glass border-white/5'}`}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">Enterprise <Zap className="w-4 h-4 text-primary" /></h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">$13</span>
              <span className="text-sm text-muted font-bold">/ 2 Months</span>
            </div>
            <p className="text-sm text-muted-foreground pt-4">Unlimited everything for global agency scaling.</p>
          </div>
          <ul className="space-y-4 py-8">
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> Unlimited AI Widgets
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> Unlimited Document Uploads
            </li>
            <li className="flex items-center gap-3 text-sm font-medium">
              <Check className="w-5 h-5 text-primary" /> Unlimited SQL Databases
            </li>
          </ul>
          {tier === 'enterprise' ? (
            <button disabled className="w-full py-4 rounded-xl font-bold text-sm bg-primary/20 text-primary border border-primary/20 cursor-default">
              Current Plan
            </button>
          ) : (
             <button 
              onClick={() => handleUpgrade('enterprise')}
              className="w-full py-4 rounded-xl font-bold text-sm glass hover:bg-white/10 border border-white/10 transition-colors flex justify-center items-center gap-2 text-white"
            >
              Upgrade to Enterprise
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
