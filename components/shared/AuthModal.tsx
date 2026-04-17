"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Mail, Lock, User } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode } = useUIStore();

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAuthModalOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[900px] min-h-[560px] bg-bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Panel - Illustration / Brand */}
        <div className="hidden md:flex w-1/2 bg-accent-primary p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="font-styrene font-bold text-3xl mb-4">BookToPaper</h2>
            <p className="text-white/80 font-sohne text-lg leading-relaxed max-w-xs">
              {authMode === "login" 
                ? "Welcome back to your personalized learning engine."
                : "Join thousands of students building the future of study."}
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <BenefitItem text="Smart Syllabus Analysis" />
            <BenefitItem text="Realistic Mock Exams" />
            <BenefitItem text="Personalized Study Plans" />
          </div>

          <div className="relative z-10 text-xs text-white/40 font-berkeley">
            VERSION 1.0.4 // CORE
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 md:p-12 bg-bg-surface flex flex-col overflow-hidden">
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-text-secondary hover:text-accent-primary transition-colors h-10 w-10 flex items-center justify-center"
          >
            <X size={24} />
          </button>

          <div className="mb-8">
            <div className="flex bg-bg-raised p-1 rounded-xl w-fit">
              <button 
                onClick={() => setAuthMode("login")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                  authMode === "login" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode("signup")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                  authMode === "signup" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Sign Up
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={authMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col items-stretch"
            >
              <h3 className="text-2xl font-styrene font-semibold mb-8 text-text-primary">
                {authMode === "login" ? "Sign in to Dashboard" : "Create your account"}
              </h3>

              <div className="space-y-4">
                {authMode === "signup" && (
                  <Input label="Full Name" placeholder="John Doe" icon={<User size={18} />} />
                )}
                <Input label="Email Address" placeholder="alex@university.edu" icon={<Mail size={18} />} />
                <div className="relative">
                  <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••" 
                    icon={<Lock size={18} />} 
                  />
                  {authMode === "login" && (
                    <button className="absolute right-0 top-0 text-[11px] font-bold text-accent-primary hover:underline uppercase tracking-wider">
                      Forgot?
                    </button>
                  )}
                </div>
              </div>

              {authMode === "signup" && (
                <div className="mt-4 flex gap-1 items-center">
                   {[1, 1, 1, 0].map((v, i) => (
                     <div key={i} className={cn("h-1 flex-1 rounded-full", v ? "bg-green-500" : "bg-bg-raised")} />
                   ))}
                   <span className="text-[10px] uppercase font-bold text-green-500 ml-2">Secure</span>
                </div>
              )}

              <Button className="mt-8 h-12 text-lg rounded-xl">
                {authMode === "login" ? "Sign In →" : "Create Account →"}
              </Button>

              <div className="relative my-8 text-center">
                <hr className="border-border" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-bg-surface text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                  or continue with
                </span>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1 h-12 flex items-center justify-center gap-2 border-border/50">
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                   </svg>
                   Google
                </Button>
                <Button variant="ghost" className="flex-1 h-12 flex items-center justify-center gap-2 border-border/50">
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                   </svg>
                   GitHub
                </Button>
              </div>

              <p className="mt-auto text-center text-xs text-text-secondary">
                {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                  className="ml-1 text-accent-primary font-bold hover:underline"
                >
                  {authMode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

