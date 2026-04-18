"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/store";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setAuthModalOpen, setAuthMode, theme, setTheme } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "h-14 md:h-16 bg-white/80 dark:bg-bg-base/80 backdrop-blur-md border-b border-border shadow-sm" : "h-16 md:h-20 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white shadow-lg shadow-accent-primary/20 group-hover:scale-105 transition-transform">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-4 h-4 md:w-5 md:h-5 object-contain"
            />
          </div>

          <span className="font-styrene font-bold text-base md:text-xl text-text-primary tracking-tight">
            BookToPaper
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors">How it works</Link>
          </nav>
          <div className="h-4 w-px bg-border mx-2" />
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => openAuth("login")} 
              className="h-9 md:h-11 px-3 md:px-5 text-sm font-bold border-none hover:bg-bg-raised"
            >
              Log in
            </Button>
            <Button 
              onClick={() => openAuth("signup")} 
              className="h-9 md:h-11 px-4 md:px-6 text-sm font-bold shadow-lg shadow-accent-primary/20"
            >
              Join free
            </Button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <button
            className="p-2 text-text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-base z-[60] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-white">
                <img src="/images/logo.png" className="w-6 h-6 object-contain" alt="Logo" />
              </div>
              <span className="font-styrene font-bold text-xl text-accent-primary">BookToPaper</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-8 text-2xl font-styrene font-medium">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
            <hr className="border-border" />
            <button onClick={() => openAuth("login")} className="text-left">Sign In</button>
            <Button onClick={() => openAuth("signup")} className="w-full py-4 text-lg">Get Started</Button>
          </nav>
        </div>
      )}
    </nav>
  );
}
