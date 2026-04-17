"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Layout, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    label: "Smart Ingestion",
    description: "Multi-format OCR for typed or handwritten notes.",
  },
  {
    icon: Brain,
    label: "AI Questions",
    description: "Realistic exam questions mapped to your syllabus.",
  },
  {
    icon: Layout,
    label: "Exam Mode",
    description: "Simulated environment with timer and full navigator.",
  },
  {
    icon: Target,
    label: "Weak Area Detection",
    description: "Identifies gaps and generates targeted practice.",
  },
];

export function FeatureStrip() {
  return (
    <section className="py-12 border-t border-border bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-primary/5 flex items-center justify-center text-accent-primary">
                <feature.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{feature.label}</h3>
                <p className="text-xs leading-relaxed text-text-secondary">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload",
      description: "Securely upload your PDFs, images, or notes. Our AI shreds and analyzes the content instantly.",
    },
    {
      number: "02",
      title: "Process",
      description: "We identify key topics and map them to your chosen exam format (KTU, CBSE, etc.).",
    },
    {
      number: "03",
      title: "Evaluate",
      description: "Take the exam in a realistic environment and get detailed AI feedback on every answer.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-bg-base overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-styrene font-semibold mb-4">How it works</h2>
          <p className="text-text-secondary max-w-lg">Three steps from study materials to exam mastery.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 relative">
          <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] border-t border-dashed border-border" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-accent-primary font-berkeley text-white flex items-center justify-center mb-8 shadow-xl shadow-accent-primary/20">
                {step.number}
              </div>
              <h3 className="text-2xl font-styrene font-medium mb-4">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
