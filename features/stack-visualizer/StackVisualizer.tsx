
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlayCircle, Layers, BookOpen, Sliders, Cpu, Brain } from 'lucide-react';
import { useStack } from './hooks/useStack';
import { StackBlock } from './components/StackBlock';
import { StackControls } from './components/StackControls';
import { StackSidebar } from './components/StackSidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface StackVisualizerProps {
  onBack: () => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ onBack }) => {
  const { 
    stack, operation, message, peekIndex, push, pop, peek, clear, speed, setSpeed, scenarios 
  } = useStack();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['stack'] || { concept: '', pseudocode: '' };
  const isBusy = operation !== 'idle';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FEFCFB] flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-24 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl gap-6 shrink-0">
            <div className="flex items-center space-x-6">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">LIFO Protocol</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Linear <span className="text-[#00f5ff]">Stack</span></h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsConceptOpen(!isConceptOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isConceptOpen ? 'bg-brand-teal text-black border-brand-teal' : 'bg-white/5 border-white/10 text-brand-teal/70 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
              </button>
              <Button size="sm" variant="secondary" onClick={scenarios.browser} disabled={isBusy} className="rounded-full">
                <PlayCircle className="w-3 h-3 mr-2" /> Browser History
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                   <div className="glass-card p-6 rounded-[2rem] border-white/5">
                      <StackControls onPush={push} onPop={pop} onPeek={peek} onClear={clear} operation={operation} />
                   </div>
                </div>

                <div className="bg-brand-dark p-6 rounded-2xl border border-brand-blue/30 shadow-2xl flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-brand-teal" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/70">System Hz</span>
                    </div>
                    <span className="text-xs font-mono text-brand-teal font-bold">{speed}ms</span>
                  </div>
                  <input
                    type="range" min="100" max="1500" step="50"
                    value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-brand-blue/30 rounded-lg appearance-none cursor-pointer accent-brand-teal mb-2"
                  />
                  <div className="flex justify-between text-[8px] font-black uppercase text-white/20 tracking-widest">
                    <span>Fast</span>
                    <span>Educational</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 min-h-[500px] flex items-end justify-center pb-16 relative overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
                <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-30">
                  <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`inline-block px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl ${
                      operation === 'overflow' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#00f5ff]/10 border-[#00f5ff]/20 text-[#00f5ff]'
                    }`}
                  >
                    {message}
                  </motion.div>
                </div>

                <div className="flex flex-col-reverse items-center gap-3 p-10 min-w-[320px] rounded-t-[3rem] border-x-2 border-t-0 border-white/5 bg-white/[0.02] relative">
                  <AnimatePresence mode="popLayout">
                    {stack.map((item, index) => (
                      <StackBlock key={item.id} item={item} index={index} isTop={index === stack.length - 1} isPeeking={index === peekIndex} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>

        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="Stack" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context="Stack LIFO logic." /> */}
      </div>
    </div>
  );
};
