"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Copy, Check, ArrowLeft, ExternalLink, Shield, Zap, Code, Database } from "lucide-react";
import Link from "next/link";

export default function WooCommerceIntegrationPage() {
  const [copied, setCopied] = useState(false);

  const phpCode = `<?php
// Add to your theme's footer.php or functions.php
add_action('wp_footer', function() {
  echo '<script src="https://widget.rhexa.ai/agent.js" data-widget-key="YOUR_WIDGET_KEY"><\/script>';
});
?>`;

  const scriptTag = `<script src="https://widget.rhexa.ai/agent.js" data-widget-key="YOUR_WIDGET_KEY"></script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Choose Your Integration Method",
      description: "WooCommerce offers multiple ways to add custom code.",
      substeps: [
        "Method A: Use a plugin (recommended for beginners)",
        "Method B: Edit theme files directly (for developers)",
        "Method C: Use WordPress hooks in functions.php"
      ]
    },
    {
      number: "02",
      title: "Method A - Install Header/Footer Plugin",
      description: "Using a plugin is the safest way to add scripts.",
      substeps: [
        "Go to WordPress Admin > Plugins > Add New",
        "Search for 'Header and Footer Scripts'",
        "Install and activate the plugin",
        "Navigate to Settings > Header/Footer Scripts"
      ]
    },
    {
      number: "03",
      title: "Method B - Edit Footer.php",
      description: "For developers comfortable editing theme files.",
      substeps: [
        "Go to Appearance > Theme File Editor",
        "Find and open footer.php from the list",
        "Scroll to the bottom, before closing &lt;/body&gt; tag",
        "Add the RheXa script tag"
      ]
    },
    {
      number: "04",
      title: "Method C - Use functions.php",
      description: "Add the script via WordPress hooks.",
      substeps: [
        "Go to Appearance > Theme File Editor",
        "Open functions.php",
        "Paste the PHP code at the end",
        "Your bot will load on every page"
      ]
    },
    {
      number: "05",
      title: "Get Your Widget Key",
      description: "Retrieve your unique widget key from RheXa.",
      substeps: [
        "Log in to your RheXa dashboard",
        "Navigate to Widgets > Your Store",
        "Copy your widget-key",
        "Replace 'YOUR_WIDGET_KEY' in the script"
      ]
    },
    {
      number: "06",
      title: "Save & Test",
      description: "Activate and verify your bot on your store.",
      substeps: [
        "Click Save/Publish in your chosen method",
        "Visit your WooCommerce store homepage",
        "You should see the chat widget in the corner",
        "Test by sending a message"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Header />
      <div className="pt-24"></div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/integrations" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary mb-8 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Integrations
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] opacity-10 pointer-events-none" />
        
        <div className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
              <Database className="w-4 h-4" /> Integration Guide
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              WooCommerce & <span className="text-primary italic">CMS Platforms</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl font-medium leading-relaxed">
              Seamlessly integrate your RheXa AI bot into WooCommerce stores, WordPress sites, and other CMS platforms. Multiple setup methods available.
            </p>
          </motion.div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Zap, label: "Quick Setup", desc: "5-10 minute installation" },
              { icon: Code, label: "Flexible", desc: "Multiple integration options" },
              { icon: Shield, label: "Safe", desc: "Works with auto-updates" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
              >
                <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">{feature.label}</p>
                  <p className="text-xs text-muted">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Sections */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Script Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
        >
          <h2 className="text-2xl font-black mb-4">Simple Script Tag</h2>
          <p className="text-muted mb-6">Use this for header/footer plugins:</p>
          
          <div className="relative">
            <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5">
              <code className="text-sm font-mono text-green-400">{scriptTag}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(scriptTag)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* PHP Code */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20"
        >
          <h2 className="text-2xl font-black mb-4">PHP Code (functions.php)</h2>
          <p className="text-muted mb-6">Use this if editing theme files directly:</p>
          
          <div className="relative">
            <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5">
              <code className="text-sm font-mono text-blue-400">{phpCode}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(phpCode)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-16">Step-by-Step Setup</h2>
        
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start"
            >
              {/* Step Number */}
              <div className="md:col-span-1">
                <div className="text-6xl font-black text-primary/30 leading-none">{step.number}</div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-8 rounded-2xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                <p className="text-muted mb-6 font-medium">{step.description}</p>
                
                <div className="space-y-3">
                  {step.substeps.map((substep, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted/90">{substep}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended Plugins */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-12 max-w-6xl mx-auto">Recommended Plugins</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Header and Footer Scripts",
              desc: "Most popular header/footer plugin",
              features: ["Easy UI", "No coding", "Works with all themes"],
              url: "https://wordpress.org/plugins/header-footer-scripts/"
            },
            {
              name: "WPCode",
              desc: "Powerful code snippets manager",
              features: ["Conditional logic", "Safe execution", "Backup/restore"],
              url: "https://wpcode.com"
            },
            {
              name: "Code Snippets",
              desc: "Lightweight snippet manager",
              features: ["Simple UI", "No conflicts", "Safe storage"],
              url: "https://wordpress.org/plugins/code-snippets/"
            }
          ].map((plugin, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-white/5 hover:border-primary/20 transition-colors flex flex-col"
            >
              <h3 className="text-xl font-black mb-2 text-primary">{plugin.name}</h3>
              <p className="text-sm text-muted mb-6 flex-grow">{plugin.desc}</p>
              <ul className="space-y-2 mb-6">
                {plugin.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted/90">
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plugin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-bold text-sm hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
              >
                Learn More
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-12">Integration Methods Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 font-black">Method</th>
                <th className="text-center p-4 font-black">Difficulty</th>
                <th className="text-center p-4 font-black">Time</th>
                <th className="text-center p-4 font-black">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  method: "Plugin (Recommended)",
                  difficulty: "Easy",
                  time: "5 min",
                  bestFor: "Beginners & non-developers"
                },
                {
                  method: "Edit footer.php",
                  difficulty: "Medium",
                  time: "10 min",
                  bestFor: "Developers with theme access"
                },
                {
                  method: "Edit functions.php",
                  difficulty: "Medium",
                  time: "10 min",
                  bestFor: "Theme-independent solution"
                },
                {
                  method: "WooCommerce Block",
                  difficulty: "Medium",
                  time: "15 min",
                  bestFor: "Full Site Editing setups"
                }
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{row.method}</td>
                  <td className="p-4 text-center text-muted">{row.difficulty}</td>
                  <td className="p-4 text-center text-muted">{row.time}</td>
                  <td className="p-4 text-center text-muted/80">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-12 max-w-6xl mx-auto">Troubleshooting</h2>
        
        <div className="max-w-6xl mx-auto space-y-6">
          {[
            {
              issue: "Script not loading after saving?",
              solution: "Clear WordPress cache using your caching plugin. If using server-side caching, purge it from admin panel. Wait 2-3 minutes for changes to propagate."
            },
            {
              issue: "PHP errors after adding code?",
              solution: "Make sure closing PHP tag ?> is not included. Enable debug mode in wp-config.php to see error messages in debug.log"
            },
            {
              issue: "Widget appears but not working?",
              solution: "Check browser console (F12) for JavaScript errors. Verify your widget-key is correct and documents are uploaded to your RheXa dashboard."
            },
            {
              issue: "Theme update broke integration?",
              solution: "Use the plugin method instead - plugins persist through theme updates. Or use a child theme to edit footer.php."
            }
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-white/5"
            >
              <h3 className="text-lg font-black mb-3 text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {faq.issue}
              </h3>
              <p className="text-muted/90 leading-relaxed">{faq.solution}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full scale-50 opacity-30" />
        
        <div className="relative space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to Add Your AI Bot?
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto font-medium">
            Choose your integration method above and follow the steps. Your bot will be live in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent shadow-lg shadow-primary/20 transition-all"
            >
              Get Widget Key
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
