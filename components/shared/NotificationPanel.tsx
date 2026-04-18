"use client";

import { X, Bell, Trash2, CheckCircle2, Info, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, clearNotifications, markNotificationAsRead } = useUIStore();

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end md:items-stretch overflow-hidden p-4 md:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative w-full max-w-[400px] md:max-w-sm bg-white dark:bg-bg-base border border-border md:border-none md:border-l h-auto max-h-[85vh] md:h-full shadow-2xl flex flex-col rounded-[32px] md:rounded-none overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 md:slide-in-from-right md:zoom-in-100 duration-300 ring-1 ring-black/5"
      )}>
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-bg-surface dark:bg-bg-raised">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/10 text-accent-primary rounded-xl shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-styrene font-bold md:text-lg">Notifications</h3>
              <p className="text-[10px] md:text-xs text-text-secondary font-medium tracking-tight">
                {unreadCount > 0 ? `You have ${unreadCount} unread messages` : "You're all caught up"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg-raised rounded-xl transition-colors text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-bg-surface/50 dark:bg-bg-base custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-primary/5 flex items-center justify-center text-accent-primary/20">
                <Bell size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-text-primary">No notifications yet</p>
                <p className="text-xs md:text-sm text-text-secondary max-w-[200px] mx-auto">We'll notify you when your materials are processed.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={cn(
                    "p-4 md:p-5 transition-all cursor-pointer hover:bg-accent-primary/[0.03] group relative",
                    !n.read && "bg-accent-primary/[0.01]"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5",
                      n.type === "success" ? "bg-green-50 text-green-500 dark:bg-green-500/10" :
                      n.type === "warning" ? "bg-amber-50 text-amber-500 dark:bg-amber-500/10" :
                      n.type === "error" ? "bg-red-50 text-red-500 dark:bg-red-500/10" :
                      "bg-accent-primary/10 text-accent-primary"
                    )}>
                      {n.type === "success" ? <CheckCircle2 size={18} /> :
                       n.type === "warning" ? <AlertTriangle size={18} /> :
                       n.type === "error" ? <AlertCircle size={18} /> :
                       <Info size={18} />}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-bold truncate tracking-tight",
                          !n.read ? "text-text-primary" : "text-text-secondary"
                        )}>
                          {n.title}
                        </h4>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-accent-primary shrink-0 animate-pulse" />}
                      </div>
                      <p className="text-xs md:text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">
                        <Clock size={10} />
                        <span>{formatDate(n.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-border bg-bg-surface dark:bg-bg-raised">
            <Button 
              variant="ghost" 
              onClick={clearNotifications}
              className="w-full h-11 gap-2 text-text-secondary hover:text-red-500 border-border text-xs md:text-sm font-bold transition-all"
            >
              <Trash2 size={16} /> Clear All Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
