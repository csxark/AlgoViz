
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, X, ChevronRight } from 'lucide-react';

interface ConceptWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  concept: string;
  pseudocode: string;
}

export const ConceptWindow: React.FC<ConceptWindowProps> = ({
  isOpen,
  onClose,
  title,
  concept,
  pseudocode
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-24 right-6 bottom-32 w-full max-w-[400px] z-40"
        >
          <div className="h-full glass-card rounded-[2rem] border-white/10 overflow-hidden flex flex-col bg-black/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-teal/10 rounded-xl border border-brand-teal/20">
                  <BookOpen className="w-4 h-4 text-brand-teal" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-light">
                  {title} <span className="text-brand-teal/50">Module</span>
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Concept Section */}
              <section>
                <div className="flex items-center space-x-2 text-brand-teal/70 mb-3">
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Theoretical Logic</span>
                </div>
                <p className="text-sm text-brand-light/70 leading-relaxed font-medium italic">
                  "{concept}"
                </p>
              </section>

              {/* Pseudocode Section */}
              <section className="space-y-3">
                <div className="flex items-center space-x-2 text-brand-teal/70">
                  <Code2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logic Script (Pseudocode)</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-brand-teal/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <pre className="relative p-5 bg-black/40 border border-white/5 rounded-2xl font-mono text-[11px] text-brand-teal/90 leading-relaxed overflow-x-auto custom-scrollbar">
                    <code>{pseudocode}</code>
                  </pre>
                </div>
              </section>
            </div>

            {/* Footer Tip */}
            <div className="p-4 bg-brand-teal/5 border-t border-white/5">
               <p className="text-[9px] font-bold text-center uppercase tracking-widest text-brand-teal/40">
                 Reference Code: ISO-702-ALGO-2025
               </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
