"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Copy, Check, ArrowLeft, ExternalLink, Shield, Zap, Code, Layers } from "lucide-react";
import Link from "next/link";

export default function ReactNextJsIntegrationPage() {
  const [copied, setCopied] = useState<number | null>(null);

  const codeExamples = {
    nextjs: `import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    // Load RheXa widget
    const script = document.createElement('script');
    script.src = 'https://widget.rhexa.ai/agent.js';
    script.setAttribute('data-widget-key', 'YOUR_WIDGET_KEY');
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div>{/* Your component content */}</div>;
}`,

    nextjs2: `import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://widget.rhexa.ai/agent.js"
          strategy="afterInteractive"
          data-widget-key="YOUR_WIDGET_KEY"
        />
      </body>
    </html>
  );
}`,

    react: `import { useEffect } from 'react';

function RheXaWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.rhexa.ai/agent.js';
    script.setAttribute('data-widget-key', 'YOUR_WIDGET_KEY');
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}

export default RheXaWidget;`,

    vue: `<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://widget.rhexa.ai/agent.js';
  script.setAttribute('data-widget-key', 'YOUR_WIDGET_KEY');
  script.type = 'text/javascript';
  script.async = true;
  document.body.appendChild(script);
});
</script>

<template>
  <div><!-- Your Vue component --></div>
</template>`,

    typescript: `import { FC, useEffect } from 'react';

interface RheXaWidgetProps {
  widgetKey: string;
}

const RheXaWidget: FC<RheXaWidgetProps> = ({ widgetKey }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.rhexa.ai/agent.js';
    script.setAttribute('data-widget-key', widgetKey);
    script.async = true;
    document.body.appendChild(script);
  }, [widgetKey]);

  return null;
};

export default RheXaWidget;`
  };

  const copyToClipboard = (key: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Install the Widget Script",
      description: "The RheXa widget is delivered as a JavaScript snippet.",
      substeps: [
        "No npm package installation required",
        "Widget loads dynamically via CDN",
        "Works with all React/Vue/Next.js versions",
        "Supports both SSR and client-side rendering"
      ]
    },
    {
      number: "02",
      title: "Create Widget Component",
      description: "Create a reusable component in your project.",
      substeps: [
        "Choose your framework (React, Vue, Next.js)",
        "Copy the appropriate code example below",
        "Create a new file: components/RheXaWidget.tsx",
        "Import and export the component"
      ]
    },
    {
      number: "03",
      title: "Get Your Widget Key",
      description: "Retrieve your unique widget key from RheXa.",
      substeps: [
        "Log in to RheXa Dashboard",
        "Go to Widgets section",
        "Copy your unique widget-key",
        "Replace 'YOUR_WIDGET_KEY' in the code"
      ]
    },
    {
      number: "04",
      title: "Import in Your Layout",
      description: "Add the component to your main layout file.",
      substeps: [
        "For Next.js: Import in app/layout.tsx or pages/_app.tsx",
        "For React: Import in your App.tsx or index.tsx",
        "For Vue: Import in main.js or App.vue",
        "The component will mount the widget globally"
      ]
    },
    {
      number: "05",
      title: "Test & Customize",
      description: "Verify the widget works and customize it.",
      substeps: [
        "Run your dev server: npm run dev",
        "Check if chat widget appears in corner",
        "Open browser console for any errors",
        "Customize in RheXa Dashboard > Widget Settings"
      ]
    },
    {
      number: "06",
      title: "Deploy to Production",
      description: "Deploy your application with the widget.",
      substeps: [
        "Build your project: npm run build",
        "Deploy to your hosting (Vercel, Netlify, etc.)",
        "Test on production URL",
        "Monitor analytics in RheXa Dashboard"
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
              <Layers className="w-4 h-4" /> Developer Integration
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              React, Next.js & <span className="text-primary italic">Vue</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl font-medium leading-relaxed">
              Integrate RheXa AI bot into your modern JavaScript frameworks. Full TypeScript support, optimal performance, and deep customization options.
            </p>
          </motion.div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Zap, label: "High Performance", desc: "Lazy loading & code splitting" },
              { icon: Code, label: "Full TypeScript", desc: "Type-safe integration" },
              { icon: Shield, label: "Framework Agnostic", desc: "Works with any version" }
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

      {/* Code Examples */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-16">Code Examples</h2>
        
        <div className="space-y-12">
          {/* Next.js Script Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <h3 className="text-2xl font-black mb-2 text-blue-400">Next.js (Recommended)</h3>
              <p className="text-muted mb-6">Using the Next.js Script component for optimal performance:</p>
              
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5 text-xs">
                  <code className="text-green-400">{codeExamples.nextjs2}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(0, codeExamples.nextjs2)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                >
                  {copied === 0 ? (
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
            </div>
          </motion.div>

          {/* React useEffect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h3 className="text-2xl font-black mb-2 text-purple-400">React with useEffect</h3>
              <p className="text-muted mb-6">Standard React component using useEffect hook:</p>
              
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5 text-xs">
                  <code className="text-green-400">{codeExamples.react}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(1, codeExamples.react)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                >
                  {copied === 1 ? (
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
            </div>
          </motion.div>

          {/* Vue 3 Composition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h3 className="text-2xl font-black mb-2 text-green-400">Vue 3 Composition API</h3>
              <p className="text-muted mb-6">Vue 3 with Composition API setup:</p>
              
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5 text-xs">
                  <code className="text-green-400">{codeExamples.vue}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(2, codeExamples.vue)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                >
                  {copied === 2 ? (
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
            </div>
          </motion.div>

          {/* TypeScript Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <h3 className="text-2xl font-black mb-2 text-orange-400">TypeScript Component</h3>
              <p className="text-muted mb-6">Fully typed React component with props:</p>
              
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto border border-white/5 text-xs">
                  <code className="text-green-400">{codeExamples.typescript}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(3, codeExamples.typescript)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                >
                  {copied === 3 ? (
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-surface/30 -mx-6 px-6">
        <h2 className="text-4xl font-black mb-16 max-w-6xl mx-auto">Step-by-Step Setup</h2>
        
        <div className="max-w-6xl mx-auto space-y-12">
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
              <div className="md:col-span-3 p-8 rounded-2xl bg-background border border-white/5 hover:border-white/10 transition-colors">
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

      {/* Framework Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-12">Framework Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Next.js",
              best: "Best for full-stack apps",
              setup: "Use Script component in layout.tsx",
              complexity: "Simple",
              performance: "Excellent",
              setup_time: "5 min"
            },
            {
              name: "React",
              best: "Best for SPA & web apps",
              setup: "useEffect in App or component",
              complexity: "Simple",
              performance: "Great",
              setup_time: "10 min"
            },
            {
              name: "Vue 3",
              best: "Best for lightweight projects",
              setup: "onMounted in Composition API",
              complexity: "Simple",
              performance: "Great",
              setup_time: "8 min"
            }
          ].map((framework, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-surface/50 border border-white/5 space-y-6"
            >
              <h3 className="text-2xl font-black text-primary">{framework.name}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Best For</p>
                  <p className="text-sm text-muted/90 mt-1">{framework.best}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Setup Method</p>
                  <p className="text-sm text-muted/90 mt-1">{framework.setup}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">Complexity</p>
                    <p className="text-sm text-primary mt-1 font-bold">{framework.complexity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">Setup Time</p>
                    <p className="text-sm text-primary mt-1 font-bold">{framework.setup_time}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Advanced Topics */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black mb-12">Advanced Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Environment Variables",
              desc: "Store your widget key securely in environment variables"
            },
            {
              title: "Dynamic Widget Loading",
              desc: "Load widget conditionally based on user state or routes"
            },
            {
              title: "Custom Styling",
              desc: "Override CSS variables for white-label customization"
            },
            {
              title: "Event Tracking",
              desc: "Listen to widget events and track user interactions"
            }
          ].map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
            >
              <h3 className="font-black text-lg mb-2">{topic.title}</h3>
              <p className="text-sm text-muted/90">{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full scale-50 opacity-30" />
        
        <div className="relative space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to Integrate?
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto font-medium">
            Choose your framework from the examples above and follow the step-by-step guide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-accent shadow-lg shadow-primary/20 transition-all"
            >
              Get Widget Key
            </Link>
            <a
              href="https://docs.rhexa.ai/developer"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Developer Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
