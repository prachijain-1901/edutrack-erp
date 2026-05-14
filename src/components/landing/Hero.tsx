"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-30 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>

      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Modern ERP for Coaching Institutes</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight md:leading-tight"
        >
          Manage your institute with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">zero chaos.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Automate attendance, track fee payments instantly, and communicate with parents effortlessly. EduTrack replaces WhatsApp groups and spreadsheets with one beautiful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="h-14 px-8 text-base rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-2" asChild>
            <Link href="/dashboard">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full w-full sm:w-auto bg-background/50 backdrop-blur-sm" asChild>
            <Link href="#demo">
              Book a Demo
            </Link>
          </Button>
        </motion.div>

        {/* Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 md:mt-24 relative mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            {/* Mac Window Header */}
            <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            {/* The Image (Placeholder representing dashboard) */}
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-background to-muted p-8 flex items-center justify-center relative overflow-hidden">
               {/* Abstract Dashboard shapes */}
               <div className="absolute inset-4 border border-border/50 rounded-xl bg-background/80 shadow-sm flex flex-col p-4 gap-4">
                  <div className="flex gap-4">
                    <div className="w-48 h-8 rounded-md bg-muted animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-muted ml-auto animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-xl bg-primary/5 border border-primary/10"></div>)}
                  </div>
                  <div className="flex-1 flex gap-4 mt-2">
                    <div className="flex-[2] rounded-xl bg-card border border-border"></div>
                    <div className="flex-1 rounded-xl bg-card border border-border"></div>
                  </div>
               </div>
            </div>
          </div>
          {/* Floating UI Elements */}
          <div className="absolute -right-12 top-32 w-64 p-4 rounded-xl glass-panel hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">₹</div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Fee Collected</p>
                <p className="text-sm font-bold text-foreground">₹45,000 today</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-12 bottom-20 w-64 p-4 rounded-xl glass-panel hidden lg:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">95%</div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Attendance</p>
                <p className="text-sm font-bold text-foreground">Batch A marked</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
