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
  Monitor,
  ArrowRight,
  Trash2,
  X
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUIStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account & Privacy", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useAuthStore();
  const { theme, setTheme, typographyScale, setTypographyScale } = useUIStore();
  
  const [name, setName] = useState(user?.full_name || "");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-styrene font-semibold mb-1 md:mb-2 text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary opacity-70">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        {/* Sidebar / Tabs */}
        <div className="w-full lg:w-64 shrink-0 overflow-x-auto">
          <div className="flex lg:flex-col gap-1 md:gap-2 pb-2 lg:pb-0">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap lg:w-full",
                  activeSection === s.id 
                    ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" 
                    : "text-text-secondary hover:bg-bg-raised bg-bg-surface md:bg-transparent border border-border md:border-none"
                )}
              >
                <s.icon size={16} className="md:w-[18px] md:h-[18px]" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Card className="p-4 md:p-8 lg:p-10 space-y-8 md:space-y-10 border-none shadow-xl bg-white dark:bg-bg-base/40">
            {activeSection === "profile" && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-lg md:text-xl font-styrene font-bold text-text-primary">Profile Settings</h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-accent-primary/10 flex items-center justify-center border-4 border-white dark:border-bg-base shadow-xl text-accent-primary text-3xl font-bold shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : initials}
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-text-primary">{name || "User"}</h3>
                    <p className="text-sm text-text-secondary">{user?.email}</p>
                    <Button variant="ghost" className="h-8 px-3 text-xs mt-2 border-border shadow-sm">Remove Avatar</Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Full Name</label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-raised dark:bg-bg-base border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1 opacity-50">Email Address (Read Only)</label>
                    <input 
                      value={user?.email || ""} 
                      readOnly
                      className="w-full bg-bg-raised dark:bg-bg-base border border-border rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border flex justify-end">
                  <Button onClick={handleSave} className="h-11 px-8 shadow-lg">Save Changes</Button>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 className="text-xl font-styrene font-bold">Appearance</h2>
                 
                 <div className="space-y-6">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                       <ThemeOption 
                          icon={Sun} label="Light" 
                          active={theme === "light"} 
                          onClick={() => setTheme("light")} 
                       />
                       <ThemeOption 
                          icon={Moon} label="Dark" 
                          active={theme === "dark"} 
                          onClick={() => setTheme("dark")} 
                       />
                       <ThemeOption 
                          icon={Monitor} label="System" 
                          active={theme === "system"} 
                          onClick={() => setTheme("system")} 
                       />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Typography Scale</h3>
                    <div className="flex items-center gap-6 bg-bg-raised dark:bg-bg-base p-6 rounded-3xl">
                       <span className="text-sm font-bold opacity-40">A</span>
                       <input 
                          type="range" min={80} max={120} step={5}
                          value={typographyScale}
                          onChange={(e) => setTypographyScale(+e.target.value)}
                          className="flex-1 accent-accent-primary h-1.5 bg-border rounded-full appearance-none cursor-pointer"
                       />
                       <span className="text-2xl font-bold">A</span>
                    </div>
                    <p className="text-[10px] text-text-secondary text-center font-bold tracking-widest uppercase italic">Current Scale: {typographyScale}% (Affects interface elements)</p>
                 </div>
              </div>
            )}

            {activeSection === "account" && (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-xl font-styrene font-bold">Account & Privacy</h2>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-5 rounded-2xl bg-bg-raised dark:bg-bg-base border border-border space-y-2">
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Storage Status</p>
                        <div className="flex items-center justify-between">
                           <span className="text-lg font-bold">14.2 MB used</span>
                           <span className="text-xs text-text-secondary">of 500 MB</span>
                        </div>
                        <div className="h-1.5 bg-white dark:bg-bg-raised rounded-full overflow-hidden">
                           <div className="h-full bg-accent-primary w-[3%]" />
                        </div>
                     </div>
                     <div className="p-5 rounded-2xl bg-bg-raised dark:bg-bg-base border border-border space-y-2">
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Security Level</p>
                        <div className="flex items-center gap-2 text-green-500">
                           <ShieldCheck size={20} />
                           <span className="text-lg font-bold">Advanced</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Data Management</h3>
                     <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-bg-raised transition-colors group">
                           <div className="text-left">
                              <p className="text-sm font-bold">Export My JSON Data</p>
                              <p className="text-xs text-text-secondary">Download all your materials and study sessions.</p>
                           </div>
                           <ArrowRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-red-200 hover:bg-red-50 transition-colors group">
                           <div className="text-left">
                              <p className="text-sm font-bold text-red-500">Delete Account</p>
                              <p className="text-xs text-text-secondary text-red-400">Permanently remove all data and papers.</p>
                           </div>
                           <Trash2 size={18} className="text-red-300 group-hover:scale-110 transition-transform" />
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSection === "notifications" && (
               <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-bg-raised flex items-center justify-center text-accent-primary shadow-inner">
                    <Bell size={32} />
                  </div>
                  <h3 className="font-styrene font-bold text-lg">Push Notifications</h3>
                  <p className="text-sm text-text-secondary max-w-xs">Browser push notifications are currently being enabled for critical processing updates.</p>
                  <Button variant="ghost" className="border-border">Enable in Browser</Button>
               </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
        active ? "border-accent-primary bg-accent-primary/5 text-accent-primary shadow-lg shadow-accent-primary/5" : "border-border hover:border-accent-primary/30 text-text-secondary"
      )}
    >
       <Icon size={24} className={active ? "text-accent-primary" : "text-text-secondary group-hover:text-accent-primary"} />
       <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
