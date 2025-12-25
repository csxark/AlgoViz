
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle, BookOpen, Sliders, ListEnd } from 'lucide-react';
import { useQueue } from './hooks/useQueue';
import { QueueCanvas } from './components/QueueCanvas';
import { QueueControls } from './components/QueueControls';
import { QueueSidebar } from './components/QueueSidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';

interface QueueVisualizerProps {
  onBack: () => void;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ onBack }) => {
  const { 
    items,
    circularBuffer,
    head,
    tail,
    mode,
    changeMode,
    operation,
    message,
    peekIndex,
    enqueue,
    dequeue,
    peek,
    clear,
    scenarios
  } = useQueue();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // Inverse of Hz
  const isBusy = operation !== 'idle';
  const conceptData = CONCEPTS['queue'];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
                  <ListEnd className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Buffer Control</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">LINEAR QUEUE</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsConceptOpen(!isConceptOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isConceptOpen ? 'bg-[#00f5ff] text-black border-[#00f5ff]' : 'bg-white/5 border-white/10 text-[#00f5ff]/70 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
              </button>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={scenarios.restaurant} disabled={isBusy}>
                  <PlayCircle className="w-4 h-4 mr-2" /> Restaurant
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            <div className="w-full max-w-5xl mx-auto p-4 z-20 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <QueueControls onEnqueue={enqueue} onDequeue={dequeue} onPeek={peek} onClear={clear} mode={mode} onModeChange={changeMode} operation={operation} />
              </div>
              <div className="bg-brand-dark p-6 rounded-2xl border border-brand-blue/30 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-3 h-3 text-[#00f5ff]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Clock Rate</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00f5ff]">{playbackSpeed}ms</span>
                </div>
                <input type="range" min="200" max="1500" step="100" value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="w-full h-1 accent-[#00f5ff] appearance-none bg-white/5 rounded" />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto relative min-h-[300px]">
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-30">
                <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-6 py-2 rounded-full border shadow-xl backdrop-blur font-bold text-[10px] uppercase tracking-widest bg-gray-800/80 border-gray-600 text-gray-200">
                  {message}
                </motion.div>
              </div>
              <QueueCanvas items={items} circularBuffer={circularBuffer} head={head} tail={tail} mode={mode} peekIndex={peekIndex} />
            </div>
          </div>
        </main>

        <QueueSidebar mode={mode} />
        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="Queue" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context={`Queue Mode: ${mode}. FIFO Principle.`} /> */}
      </div>
    </div>
  );
};
