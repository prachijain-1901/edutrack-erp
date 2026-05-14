"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            EduTrack
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
          <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden"
          >
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Features</Link>
            <Link href="#benefits" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Benefits</Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Pricing</Link>
            <div className="h-px bg-border my-2" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-muted rounded-md">Log in</Link>
            <Button asChild className="w-full justify-center">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
