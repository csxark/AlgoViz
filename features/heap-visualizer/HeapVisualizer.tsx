
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Sliders, Cpu, Brain } from 'lucide-react';
import { useHeap } from './hooks/useHeap';
import { HeapCanvas } from './components/HeapCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface HeapVisualizerProps {
  onBack: () => void;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ onBack }) => {
  const { 
    heap, 
    visualNodes, 
    heapType, 
    operation, 
    message, 
    comparingIndices, 
    sortedArray, 
    insert, 
    extractRoot, 
    speed, 
    setSpeed, 
    reset,
    toggleType
  } = useHeap();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['heap'] || { concept: '', pseudocode: '' };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-20 lg:h-screen lg:overflow-hidden relative">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0 border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-black uppercase">BINARY <span className="text-[#00f5ff]">HEAP</span></h1>
            </div>
            
            <button onClick={() => setIsConceptOpen(!isConceptOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                isConceptOpen ? 'bg-brand-teal text-black border-brand-teal' : 'bg-white/5 border-white/10 text-brand-teal/70 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative p-8 overflow-y-auto">
             <div className="max-w-7xl mx-auto w-full space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <ControlPanel 
                      onInsert={insert} 
                      onExtract={extractRoot} 
                      onSort={() => {}} 
                      onReset={reset} 
                      onToggleType={toggleType} 
                      heapType={heapType} 
                      operation={operation} 
                    />
                  </div>
                  
                  <div className="bg-brand-dark p-6 rounded-2xl border border-brand-blue/30 shadow-2xl flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-brand-teal" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/70">System Hz</span>
                      </div>
                      <span className="text-xs font-mono text-brand-teal font-bold">{speed}ms</span>
                    </div>
                    <input type="range" min="100" max="1500" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-1.5 bg-brand-blue/30 rounded-lg appearance-none cursor-pointer accent-brand-teal" />
                  </div>
                </div>

                <div className="text-center min-h-[2rem]">
                  <p className="text-brand-teal font-black uppercase tracking-widest text-xs animate-pulse">
                    {operation !== 'idle' ? message : ''}
                  </p>
                </div>

                <div className="bg-brand-darkest rounded-[3rem] border border-white/5 p-8 relative overflow-hidden">
                  <HeapCanvas nodes={visualNodes} comparingIndices={comparingIndices} />
                </div>

                {sortedArray.length > 0 && (
                  <div className="glass-card p-6 rounded-2xl border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Extracted Elements</h3>
                    <div className="flex flex-wrap gap-2">
                      {sortedArray.map((val, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 font-mono text-brand-teal text-sm">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </main>

        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="Heap" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context={`Binary Heap visualizer (${heapType.toUpperCase()}). Explaining Heapify Up (bubble up on insert) and Heapify Down (bubble down on extract). Current status: ${message}`} /> */}
      </div>
    </div>
  );
};
