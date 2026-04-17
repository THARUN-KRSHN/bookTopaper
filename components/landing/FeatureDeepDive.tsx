"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const deepDives = [
  {
    title: "Smart Ingestion",
    description: "Our proprietary AI handles everything from polished PDFs to messy, handwritten chalkboard photos.",
    bullets: ["Text & Math symbol recognition", "Diagram preservation", "Implicit topic extraction"],
    image: "/mock-ui-1.png",
    reverse: false,
  },
  {
    title: "Exam Mode Simulator",
    description: "Simulate the pressure of a real exam with our distraction-free interface and precise timers.",
    bullets: ["Official syllabus mapping", "Timed sessions", "Sectional breakdown"],
    image: "/mock-ui-2.png",
    reverse: true,
  },
];

export function FeatureDeepDive() {
  return (
    <section id="features" className="py-24 bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-32">
          {deepDives.map((dive, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex flex-col lg:flex-items-center gap-16 lg:gap-24",
                dive.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: dive.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 space-y-8"
              >
                <h3 className="text-3xl md:text-5xl font-styrene font-semibold leading-tight">
                  {dive.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
                  {dive.description}
                </p>
                <div className="space-y-4">
                  {dive.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{bullet}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4">Learn more →</Button>
              </motion.div>

              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 relative"
              >
                <div className="aspect-[4/3] rounded-[24px] border border-border bg-bg-raised overflow-hidden shadow-2xl relative">
                   <div className="absolute inset-0 dot-grid opacity-[0.1]" />
                   <div className="absolute inset-8 rounded-xl border border-border/50 bg-white shadow-lg overflow-hidden flex items-center justify-center text-text-secondary/20">
                     {/* Place holder for mock UI */}
                     <span className="text-2xl font-styrene uppercase tracking-widest font-bold">Preview</span>
                   </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

