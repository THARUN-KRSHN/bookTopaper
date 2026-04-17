"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "12,000+", label: "Papers generated" },
  { value: "94%", label: "Positive feedback" },
  { value: "8", label: "Exam formats" },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-bg-raised overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="text-5xl md:text-7xl font-styrene font-bold text-accent-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-text-secondary uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-bg-raised border-t border-border py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2 lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-5 h-5 object-contain"
              />
            </div>

            <span className="font-styrene font-bold text-xl text-accent-primary">BookToPaper</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
            The world's first AI-powered study companion that turns your notes into realistic exam papers.
          </p>
        </div>

        <div>
          <h4 className="font-styrene font-bold text-sm mb-6 uppercase tracking-wider">Product</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-primary transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">Demo</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-styrene font-bold text-sm mb-6 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-primary transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">Guides</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-styrene font-bold text-sm mb-6 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-primary transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-accent-primary transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-6 text-sm text-text-secondary">
        <p>© 2025 BookToPaper. Build for students, by educators.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-accent-primary transition-colors">Discord</a>
          <a href="#" className="hover:text-accent-primary transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
