"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/store";

export function HeroSection() {
  const { setAuthModalOpen, setAuthMode } = useUIStore();

  const openSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="dot-grid absolute inset-0 opacity-[0.03]" />
        <motion.div 
          animate={{ 
            y: [-20, 20],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-accent-primary/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            y: [20, -20],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-accent-warm/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Animated Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[72px] font-styrene font-semibold leading-[1.05] tracking-tight text-text-primary mb-8"
        >
          Your notes. <br className="hidden md:block" />
          Your exam. <span className="text-accent-primary">Your pace.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Upload any study material and BookToPaper generates realistic exam papers, evaluates your answers, and builds a personalised study plan.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button 
            onClick={openSignup}
            className="w-full sm:w-auto px-8 h-14 text-lg rounded-2xl flex items-center justify-center gap-2 group"
          >
            Start for free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="ghost" 
            className="w-full sm:w-auto px-8 h-14 text-lg rounded-2xl flex items-center justify-center gap-2 border-border/50 hover:bg-white hover:border-border shadow-sm group"
          >
            <Play size={18} className="fill-text-primary group-hover:scale-110 transition-transform" />
            Watch demo
          </Button>
        </motion.div>

        {/* Trust Line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="py-6 border-t border-border/50 inline-flex items-center gap-6 text-sm font-medium text-text-secondary"
        >
          <span>Used by 2,400+ students</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="font-berkeley">KTU</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="font-berkeley">CBSE</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span>Custom formats</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-secondary/40"
      >
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
          <motion.div className="w-1 h-1.5 bg-current rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
