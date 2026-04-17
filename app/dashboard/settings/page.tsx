"use client";

import { useState } from "react";
import { 
  User, 
  Settings2, 
  Bell, 
  Palette, 
  ShieldCheck, 
  CreditCard,
  CloudUpload,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "exam", label: "Exam Preferences", icon: Settings2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account & Privacy", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-styrene font-semibold mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and app preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeSection === s.id ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" : "text-text-secondary hover:bg-bg-raised"
              )}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-8 space-y-10 border-none shadow-xl bg-white">
            {activeSection === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-xl font-styrene font-bold">Profile Settings</h2>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                       <div className="w-24 h-24 rounded-full bg-bg-raised overflow-hidden border-2 border-border group-hover:border-accent-primary transition-colors">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Avatar" />
                       </div>
                       <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-border text-text-secondary hover:text-accent-primary transition-colors">
                          <CloudUpload size={14} />
                       </button>
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                       <h3 className="font-bold">Alexander Hall</h3>
                       <p className="text-sm text-text-secondary">alexander@example.edu</p>
                       <Button variant="ghost" className="h-8 px-3 text-xs mt-2 border-border shadow-sm">Remove Avatar</Button>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <Input label="Full Name" defaultValue="Alexander Hall" />
                    <Input label="Email Address" defaultValue="alexander@example.edu" readOnly />
                 </div>
                 
                 <div className="pt-6 border-t border-border flex justify-end">
                    <Button className="h-11 px-8 shadow-lg">Save Changes</Button>
                 </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-xl font-styrene font-bold">Appearance</h2>
                 
                 <div className="space-y-6">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                       <ThemeOption icon={Sun} label="Light" active />
                       <ThemeOption icon={Moon} label="Dark" />
                       <ThemeOption icon={Monitor} label="System" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Typography Scale</h3>
                    <div className="flex items-center gap-4 bg-bg-raised p-4 rounded-2xl">
                       <span className="text-sm font-bold opacity-40">A</span>
                       <div className="flex-1 h-2 bg-white rounded-full relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent-primary rounded-full shadow-lg cursor-pointer" />
                       </div>
                       <span className="text-2xl font-bold">A</span>
                    </div>
                    <p className="text-[10px] text-text-secondary text-center font-bold tracking-widest uppercase italic">This affects body font size only</p>
                 </div>
              </div>
            )}
            
            {activeSection !== "profile" && activeSection !== "appearance" && (
               <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-bg-raised flex items-center justify-center text-text-secondary/20">
                    <Settings2 size={32} />
                  </div>
                  <h3 className="font-styrene font-bold text-lg">Settings section: {activeSection}</h3>
                  <p className="text-sm text-text-secondary max-w-xs">This configuration page is part of the MVP specification and will be fully interactive in the next update.</p>
               </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({ icon: Icon, label, active = false }: any) {
  return (
    <button className={cn(
      "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
      active ? "border-accent-primary bg-accent-primary/5 text-accent-primary" : "border-border hover:border-accent-primary/30 text-text-secondary"
    )}>
       <Icon size={24} className={active ? "text-accent-primary" : "text-text-secondary group-hover:text-accent-primary"} />
       <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
