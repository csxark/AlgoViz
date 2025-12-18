import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/Button';
import { ArrowRight, Sparkles, Orbit } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToGrid = () => {
    document.getElementById('visualizers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen pt-40 pb-32 flex items-center overflow-hidden bg-brand-darkest">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid animate-grid-move opacity-40" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[150px] animate-pulse-glow delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-brand-teal/10 rounded-full px-4 py-2 mb-8 border border-brand-teal/20 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-brand-teal animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-light/80">Deep Learning Simulation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black text-brand-light leading-[0.9] mb-8 tracking-tighter"
            >
              MASTER THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-light to-brand-teal">
                INFRASTRUCTURE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-brand-teal/90 mb-10 leading-relaxed max-w-xl font-medium"
            >
              Interactive data structures optimized for 2025. Powered by high-fidelity AI reasoning and Deep Ocean mechanics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto" onClick={scrollToGrid}>
                Initialize Sandbox
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-blue/50 text-brand-light">
                Documentation
              </Button>
            </motion.div>
          </div>

          {/* 3D Visual Element */}
          <div className="hidden lg:block perspective-2000">
            <motion.div
              initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: -10, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              whileHover={{ rotateY: 0, scale: 1.05 }}
              className="relative preserve-3d"
            >
              <div className="glass-card w-[500px] h-[500px] rounded-[40px] flex items-center justify-center border-brand-teal/20 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent" />
                <Orbit className="w-64 h-64 text-brand-teal/20 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            y: [0, -10, 0],
                            opacity: [0.2, 0.6, 0.2] 
                          }}
                          transition={{ 
                            duration: 2 + (i*0.4), 
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          className="w-12 h-12 glass-card rounded-xl border-brand-teal/30"
                        />
                      ))}
                   </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border-white/5 text-center">
                  <div className="flex justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-brand-light animate-pulse delay-150" />
                  </div>
                  <span className="text-xs font-mono text-brand-teal/50 tracking-widest uppercase">Ocean Sync Active • v2.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};