import React, { useState } from 'react';
import { ArrowLeft, Table2, BookOpen, Sliders, Cpu, Brain, Zap } from 'lucide-react';
import { useDPAlgorithm } from './hooks/useDPAlgorithm';
import { DPTable } from './components/DPTable';
import { ControlPanel } from './components/ControlPanel';
import { ProblemInfo } from './components/ProblemInfo';
import { ProblemInputTable } from './components/ProblemInputTable';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { CONCEPTS } from '../../shared/constants';
import { motion } from 'framer-motion';

interface DPVisualizerProps {
  onBack: () => void;
}

export const DPVisualizer: React.FC<DPVisualizerProps> = ({ onBack }) => {
  const { 
    dpState,
    playback,
    problem,
    inputs,
    setProblem,
    setInputs,
    setPlayback,
    startVisualization,
    reset
  } = useDPAlgorithm();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['dp'] || { concept: 'Neural Protocol missing.', pseudocode: '// ERROR' };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-24 lg:h-screen lg:overflow-hidden">
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Bar */}
          <div className="px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-6">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
                  <Table2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Optimization Protocol</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Dynamic <span className="text-[#00f5ff]">Programming</span></h1>
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
              
              <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-full border border-brand-teal/20">
                <Zap className="w-4 h-4" />
                <span>Recursive Optimization</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row bg-[#0a0a0a] relative h-full">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-[400px] p-6 border-r border-white/5 bg-black/20 shrink-0 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              <ControlPanel 
                problem={problem}
                onProblemChange={setProblem}
                inputs={inputs}
                onInputChange={(k, v) => setInputs((prev: any) => ({...prev, [k]: v}))}
                onStart={startVisualization}
                onReset={reset}
                isPlaying={playback.isPlaying}
                message={dpState.message}
                result={dpState.result}
                speed={playback.speed}
                onSpeedChange={(s) => setPlayback(p => ({...p, speed: s}))}
              />

              <div className="bg-brand-dark p-6 rounded-2xl border border-brand-blue/30 shadow-2xl flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-brand-teal" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/70">System Hz</span>
                    </div>
                    <span className="text-xs font-mono text-brand-teal font-bold">{Math.round(800/playback.speed)}ms</span>
                  </div>
                  <input
                    type="range" min="0.5" max="4" step="0.5"
                    value={playback.speed} onChange={(e) => setPlayback(p => ({...p, speed: Number(e.target.value)}))}
                    className="w-full h-1.5 bg-brand-blue/30 rounded-lg appearance-none cursor-pointer accent-brand-teal mb-2"
                  />
                  <div className="flex justify-between text-[8px] font-black uppercase text-white/20 tracking-widest">
                    <span>Fast</span>
                    <span>Stable</span>
                    <span>Educational</span>
                  </div>
              </div>

              {/* Input Data Table - THE NEW ADDITION */}
              <ProblemInputTable 
                problem={problem} 
                inputs={inputs} 
                activeRow={dpState.activeCell?.r || null} 
              />

              <ProblemInfo problem={problem} />
            </div>

            {/* Table Canvas */}
            <div className="flex-1 p-8 bg-[#0a0a0a] overflow-hidden relative flex flex-col">
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
              
              <div className="flex-1 glass-card rounded-[3rem] border-white/5 bg-black/40 overflow-hidden relative shadow-2xl">
                 <DPTable state={dpState} />
              </div>
              
              {/* Legend */}
              <div className="mt-8 flex flex-wrap gap-6 text-[9px] font-black uppercase tracking-widest text-white/30 justify-center">
                <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div> 
                  Computing
                </span>
                <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div> 
                  Sub-problem Source
                </span>
                <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> 
                  Optimal Path
                </span>
              </div>
            </div>

          </div>
        </main>

        <ConceptWindow 
          isOpen={isConceptOpen}
          onClose={() => setIsConceptOpen(false)}
          title="Dynamic Programming"
          concept={conceptData.concept}
          pseudocode={conceptData.pseudocode}
        />

        {/* <ChatPanel 
          context={`Dynamic Programming: ${problem.toUpperCase()}. 
          Discuss how we use the input context table to fill cells.
          For ${problem === 'lcs' ? 'LCS' : problem === 'knapsack' ? 'Knapsack' : 'Fibonacci'}, explain the specific sub-problem dependency visualized by the orange highlight.`}
          onHighlightNode={() => {}} 
        /> */}
      </div>
    </div>
  );
};