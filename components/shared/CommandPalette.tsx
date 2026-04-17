"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, FileText, Files, Brain, Settings, Command, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="flex items-center px-6 py-4 border-b border-border">
          <Search className="text-text-secondary mr-4" size={20} />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent outline-none text-lg font-sohne"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1.5 ml-4">
             <kbd className="px-2 py-1 rounded bg-bg-raised border border-border text-[10px] font-berkeley font-bold text-text-secondary">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-6">
           <CommandGroup label="Suggestions">
              <CommandItem icon={Files} label="My Materials" shortcut="G M" onClick={() => navigate("/dashboard/materials")} />
              <CommandItem icon={FileText} label="Recent Papers" shortcut="G P" onClick={() => navigate("/dashboard/papers")} />
              <CommandItem icon={Brain} label="Start Study Session" shortcut="G S" onClick={() => navigate("/dashboard/study")} />
           </CommandGroup>

           <CommandGroup label="Quick Actions">
              <CommandItem icon={Plus} label="New Paper" onClick={() => navigate("/dashboard/papers")} />
              <CommandItem icon={Settings} label="Settings" shortcut="," onClick={() => navigate("/dashboard/settings")} />
           </CommandGroup>
        </div>

        <div className="bg-bg-raised/50 px-6 py-3 border-t border-border flex items-center justify-between text-[11px] font-bold text-text-secondary uppercase tracking-widest">
           <div className="flex gap-4">
              <span className="flex items-center gap-1"><Command size={10}/>K to Close</span>
              <span className="flex items-center gap-1">↑↓ to Navigate</span>
           </div>
           <span>BookToPaper v1.0</span>
        </div>
      </motion.div>
    </div>
  );
}

function CommandGroup({ label, children }: any) {
  return (
    <div className="space-y-2">
      <h3 className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">{label}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CommandItem({ icon: Icon, label, shortcut, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-bg-raised transition-colors text-left group"
    >
      <div className="flex items-center gap-4">
         <div className="w-8 h-8 rounded-lg bg-bg-raised group-hover:bg-white transition-colors flex items-center justify-center text-text-secondary group-hover:text-accent-primary">
            <Icon size={18} />
         </div>
         <span className="text-sm font-medium">{label}</span>
      </div>
      {shortcut && (
        <span className="text-[10px] font-berkeley font-bold text-text-secondary/30">{shortcut}</span>
      )}
    </button>
  );
}

function Plus({ size }: { size: number }) {
  return <div className="p-1 border-2 border-current rounded-md font-bold text-[10px]">+</div>;
}

