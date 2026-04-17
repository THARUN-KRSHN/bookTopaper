import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function Badge({ 
  className, 
  variant = "default", 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "accent" | "warm" | "outline" }) {
  const variants = {
    default: "bg-bg-raised text-text-secondary",
    accent: "bg-accent-primary/10 text-accent-primary",
    warm: "bg-accent-warm/10 text-accent-warm",
    outline: "border border-border text-text-secondary",
  };
  
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-berkeley",
        variants[variant],
        className
      )} 
      {...props} 
    />
  );
}
