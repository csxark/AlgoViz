
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  ArrowRight, 
  Code2, 
  Zap, 
  Layers, 
  Share2, 
  ChevronRight, 
  RefreshCw,
  Terminal,
  ExternalLink,
  Plus,
  Box,
  Binary,
  FileText
} from 'lucide-react';
import { ViewType } from '../../shared/types';
import { DATA_STRUCTURES } from '../../shared/constants';

// --- Types & Constants ---
const PRIMARY_CYAN = '#00f5ff';
const DEEP_BLACK = '#0a0a0a';

// --- Custom Hook: Algorithmic Particles ---
const useAlgorithmicParticles = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = Math.min(window.innerWidth / 15, 80);
    const connectionDistance = 150;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = PRIMARY_CYAN;
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle(canvas.width, canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = DEEP_BLACK;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update(canvas.width, canvas.height);
        p1.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);
};

// --- Sub-components: Interactive Demo ---
const DemoVisualizer = () => {
  const [elements, setElements] = useState([80, 45, 20, 90, 35, 60, 10, 75, 55, 30]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...elements];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await new Promise(r => setTimeout(r, 100));
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setElements([...arr]);
        }
      }
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  const shuffle = () => {
    setElements([...elements].sort(() => Math.random() - 0.5));
    setActiveIndices([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-3xl p-8 border-[#00f5ff]/20 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#00f5ff]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00f5ff]/70">Sorting Protocol v2.5</span>
        </div>
        <div className="flex space-x-3">
          <button onClick={shuffle} className="p-2 hover:bg-[#00f5ff]/10 rounded-full transition-colors">
            <RefreshCw className={`w-4 h-4 text-[#00f5ff]/80 ${isSorting ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={bubbleSort} disabled={isSorting} className="px-4 py-1.5 bg-[#00f5ff] text-black text-xs font-black rounded-full hover:bg-white transition-all disabled:opacity-50">
            {isSorting ? 'RUNNING...' : 'EXECUTE'}
          </button>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-40 gap-2">
        {elements.map((h, i) => (
          <motion.div
            key={i}
            layout
            animate={{ 
              height: `${h}%`,
              backgroundColor: activeIndices.includes(i) ? '#00f5ff' : 'rgba(0, 245, 255, 0.2)',
              boxShadow: activeIndices.includes(i) ? '0 0 15px rgba(0, 245, 255, 0.5)' : 'none'
            }}
            className="flex-1 rounded-t-sm"
          />
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---
export const LandingPage: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAlgorithmicParticles(canvasRef);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fefcfb] selection:bg-[#00f5ff] selection:text-black overflow-x-hidden">
      
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center group-hover:bg-[#00f5ff]/20 transition-all">
            <Layers className="w-4 h-4 text-[#00f5ff]" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Algo<span className="text-[#00f5ff]">Viz</span></span>
        </div>
        {/* <button 
          onClick={() => onNavigate('binary-search')}
          className="text-xs font-bold uppercase tracking-widest text-[#00f5ff] border-b border-[#00f5ff]/0 hover:border-[#00f5ff] transition-all"
        >
          Initialize Sandbox
        </button> */}
      </header>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="h-[90vh] flex flex-col items-center justify-center text-center px-4">
          <motion.div style={{ opacity, scale }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center space-x-2 bg-[#00f5ff]/10 border border-[#00f5ff]/20 px-4 py-1.5 rounded-full"
            >
              <Zap className="w-3 h-3 text-[#00f5ff] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f5ff]">
                NEW PROTOCOLS LIVE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase mb-12"
            >
              Visualize.<br />
              Understand.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-white">Master.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-12 py-5 bg-[#00f5ff] text-black font-black text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,245,255,0.4)]"
              >
                <span className="relative z-10 flex items-center uppercase tracking-tighter">
                  OPEN PROTOCOL DIRECTORY <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button 
                onClick={() => onNavigate('documentation')}
                className="group relative px-12 py-5 border-2 border-[#00f5ff]/30 text-[#00f5ff] font-black text-lg rounded-full overflow-hidden transition-all hover:border-[#00f5ff] hover:bg-[#00f5ff]/5"
              >
                <span className="relative z-10 flex items-center uppercase tracking-tighter">
                  NEURAL DOCUMENTATION <FileText className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#00f5ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* PROTOCOLS SECTION */}
        <section id="protocols" className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-4">
                  <Box className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Protocol Directory</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                  Select <span className="text-[#00f5ff]">Structure</span>
                </h2>
                <p className="text-[#fefcfb]/50 text-lg">
                  Access specialized environments designed for high-fidelity spatial reasoning and algorithmic mastery.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#00f5ff]/40 uppercase tracking-widest mb-1">System Load</div>
                  <div className="flex space-x-1 justify-end mb-4">
                    {[1, 1, 1, 0, 0].map((v, i) => (
                      <div key={i} className={`h-1 w-4 rounded-full ${v ? 'bg-[#00f5ff]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DATA_STRUCTURES.map((ds, i) => (
                <motion.div
                  key={ds.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onNavigate(ds.id)}
                  className="group relative cursor-pointer"
                >
                  <div className="h-full glass-card rounded-2xl p-8 border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-500 group-hover:border-[#00f5ff]/40 group-hover:bg-[#00f5ff]/5 group-hover:-translate-y-1">
                    <div className="mb-8 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#00f5ff]/20 group-hover:border-[#00f5ff]/30 transition-all">
                      <ds.icon className="w-6 h-6 text-white/40 group-hover:text-[#00f5ff] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tighter mb-3 group-hover:text-[#00f5ff] transition-colors">{ds.title}</h3>
                    <p className="text-sm text-[#fefcfb]/40 leading-relaxed mb-8 group-hover:text-[#fefcfb]/70 transition-colors">
                      {ds.description}
                    </p>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#00f5ff] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                      Initialize <ChevronRight className="ml-1 w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO SECTION */}
        {/* <section className="py-32 px-8 bg-gradient-to-b from-transparent to-[#0a0a0a]/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Real-Time Labs</h2>
              <p className="text-[#00f5ff]/70 font-medium max-w-xl mx-auto">Interactive simulations allow you to step through code and watch logic execute frame-by-frame.</p>
            </div>
            <DemoVisualizer />
          </div>
        </section> */}

        {/* TEACHSTACK INTEGRATION SECTION */}
        <section className="py-40 px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f5ff]/5 rounded-full blur-[120px]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="glass-card rounded-[3rem] p-12 md:p-20 border-white/5 bg-white/[0.02] backdrop-blur-2xl text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-white/10">
                <Code2 className="w-8 h-8 text-[#00f5ff]" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Embed  AlgoViz directly into your  <span className="text-[#00f5ff]">TeachStack</span> course.
              </h2>
              <p className="text-xl text-[#fefcfb]/60 mb-12 leading-relaxed">
                Provide your students with interactive labs without leaving your curriculum. No setup. No code overhead. Pure educational acceleration.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center text-[#00f5ff]"><Plus className="w-4 h-4 mr-2" /> 1-Click Integration</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
                <span className="flex items-center opacity-60">LTI Compliant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
                <span className="flex items-center opacity-60">Auto-Grading Labs</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-[#00f5ff]/10 to-transparent" />
          <div className="text-center relative z-10">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-16 leading-none">
              READY TO<br /><span className="text-[#00f5ff]">DECODE?</span>
            </h2>
            <button 
              onClick={() => onNavigate('sorting')}
              className="group relative inline-flex items-center px-20 py-10 bg-white text-black font-black text-2xl uppercase tracking-tighter rounded-2xl hover:scale-105 hover:bg-[#00f5ff] transition-all duration-500"
            >
              Start Visualizing Now
              <ExternalLink className="ml-4 w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="mt-12 flex items-center justify-center space-x-8 opacity-40 text-[10px] font-bold uppercase tracking-[0.4em]">
              <span>OS Powered</span>
              <span>Privacy First</span>
              <span>LMS Ready</span>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/5 bg-black text-center text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
        &copy; 2025 ALGOVIZ x TEACHSTACK • ARCHITECTED FOR THE FUTURE OF LEARNING
      </footer>

      {/* Global Inline Styles for specific effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scan-line {
          height: 2px;
          background: linear-gradient(to right, transparent, #00f5ff, transparent);
          animation: scan 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
