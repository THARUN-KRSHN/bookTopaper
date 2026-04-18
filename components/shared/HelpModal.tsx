"use client";

import { useState } from "react";
import { X, PlayCircle, Send, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useUIStore, useAuthStore } from "@/lib/store";
import { toast } from "@/lib/toast";

const demoSteps = [
  {
    title: "Upload Materials",
    description: "Upload your PDFs, class notes or textbook snapshots. Our AI extracts the core content immediately.",
    icon: PlayCircle,
  },
  {
    title: "Generate Papers",
    description: "Configure your exam pattern (KTU, CBSE, etc.) and difficulty. Watch AI draft a balanced question paper.",
    icon: CheckCircle2,
  },
  {
    title: "Take Mock Exams",
    description: "Switch to Exam Mode for a focused, timed environment to test your knowledge.",
    icon: ArrowRight,
  },
  {
    title: "AI Evaluations",
    description: "Submit your answers and get instant, detailed feedback on your performance with weak area analysis.",
    icon: MessageSquare,
  }
];

export function HelpModal() {
  const { helpModalOpen, setHelpModalOpen } = useUIStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.full_name || "",
    message: "",
  });

  if (!helpModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Concern submitted successfully. We'll get back to you soon!");
      setFormData(prev => ({ ...prev, message: "" }));
      setHelpModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setHelpModalOpen(false)}
      />
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-bg-base rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] lg:h-auto lg:max-h-[80vh]"
      >
        {/* Left Side: Demo Steps */}
        <div className="flex-1 bg-accent-primary p-8 lg:p-12 text-white overflow-y-auto">
          <div className="space-y-2 mb-10">
            <h2 className="text-3xl font-styrene font-bold">Quick Start Guide</h2>
            <p className="text-white/70 text-sm">Master BookToPaper in four easy steps.</p>
          </div>

          <div className="space-y-8">
            {demoSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <step.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base">{step.title}</h4>
                  <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">Pro Tip</p>
            <p className="text-sm">Use the "Study Session" feature to revise specific weak topics identified during evaluations.</p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full lg:w-[400px] p-8 lg:p-12 bg-white dark:bg-bg-raised flex flex-col justify-between overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
               <h3 className="text-xl font-styrene font-bold">Share Concerns</h3>
               <p className="text-sm text-text-secondary">Have a problem or a suggestion?</p>
            </div>
            <button 
              onClick={() => setHelpModalOpen(false)} 
              className="lg:hidden p-2 hover:bg-bg-raised rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Name" 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              required
            />
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Message</label>
              <textarea 
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none resize-none transition-all dark:bg-bg-base"
                placeholder="What's on your mind?"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 gap-2 shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : <>Send Message <Send size={16} /></>}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border hidden lg:block">
            <button 
              onClick={() => setHelpModalOpen(false)}
              className="w-full h-11 bg-bg-raised rounded-xl text-sm font-semibold hover:bg-bg-raised flex items-center justify-center gap-2 text-text-secondary transition-colors"
            >
              <X size={16} /> Close Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
