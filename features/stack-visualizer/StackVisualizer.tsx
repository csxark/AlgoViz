
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlayCircle, Layers } from 'lucide-react';
import { useStack } from './hooks/useStack';
import { StackBlock } from './components/StackBlock';
import { StackControls } from './components/StackControls';
import { StackSidebar } from './components/StackSidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface StackVisualizerProps {
  onBack: () => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ onBack }) => {
  const { 
    stack, 
    operation, 
    message, 
    peekIndex,
    push, 
    pop, 
    peek, 
    clear,
    scenarios 
  } = useStack();

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
            
            <div className="flex flex-wrap gap-2">
              {['Browser', 'Recursion', '( ) Balance'].map((s, i) => (
                <Button key={i} size="sm" variant="secondary" onClick={Object.values(scenarios)[i]} disabled={isBusy} className="rounded-full">
                  <PlayCircle className="w-3 h-3 mr-2" /> {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative">
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
            
            <div className="w-full max-w-2xl mx-auto p-8 z-20 shrink-0">
              <div className="glass-card p-6 rounded-[2rem] border-white/5">
                <StackControls 
                  onPush={push}
                  onPop={pop}
                  onPeek={peek}
                  onClear={clear}
                  operation={operation}
                />
              </div>
            </div>

            <div className="flex-1 flex items-end justify-center pb-16 overflow-auto relative min-h-[400px]">
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-30">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-block px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl ${
                    operation === 'overflow' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#00f5ff]/10 border-[#00f5ff]/20 text-[#00f5ff]'
                  }`}
                >
                  {message}
                </motion.div>
              </div>

              <div className="flex flex-col-reverse items-center gap-3 p-10 min-w-[320px] rounded-t-[3rem] border-x-2 border-t-0 border-white/5 bg-white/[0.02] relative shadow-inner">
                <div className="absolute bottom-0 w-full h-2 bg-[#00f5ff]/20 blur-sm" />
                
                <AnimatePresence mode="popLayout">
                  {stack.map((item, index) => (
                    <StackBlock 
                      key={item.id}
                      item={item}
                      index={index}
                      isTop={index === stack.length - 1}
                      isPeeking={index === peekIndex}
                    />
                  ))}
                </AnimatePresence>

                {stack.length === 0 && (
                  <div className="h-40 flex items-center justify-center text-white/10 font-black uppercase tracking-[0.4em] text-xs italic">
                    Void State
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <StackSidebar />

        {/* <ChatPanel 
          context="Stack Data Structure. LIFO. O(1) ops. Applications: Undo, Call Stack, Parsing." 
          onHighlightNode={(val) => push(val.toString())} 
        /> */}
      </div>
    </div>
  );
};
