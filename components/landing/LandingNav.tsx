"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/store";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setAuthModalOpen, setAuthMode } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 flex items-center px-6 lg:px-12",
        isScrolled ? "bg-bg-base/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <BookOpen size={20} />
          </div>
          <span className="font-styrene font-semibold text-lg text-accent-primary">
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => openAuth("login")} className="px-4 py-2 border-none hover:bg-black/5">Sign In</Button>
            <Button onClick={() => openAuth("signup")} className="px-5 py-2">Get Started</Button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden p-2 text-text-primary"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-bg-base z-[60] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-white">
                <BookOpen size={24} />
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
