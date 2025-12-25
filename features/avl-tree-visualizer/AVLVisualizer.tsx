
import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Layers, Sliders, Cpu, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAVLTree } from './hooks/useAVLTree';
import { AVLCanvas } from './components/AVLCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ComparisonMode } from './components/ComparisonMode';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface AVLVisualizerProps {
  onBack: () => void;
}

export const AVLVisualizer: React.FC<AVLVisualizerProps> = ({ onBack }) => {
  const { 
    visualNodes, visualEdges, bstNodes, bstEdges, insert, reset, operation, message, comparisonStats, speed, setSpeed
  } = useAVLTree();

  const [showComparison, setShowComparison] = useState(false);
  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['avl-tree'] || { concept: '', pseudocode: '' };

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
              <h1 className="text-xl sm:text-2xl font-black uppercase">AVL <span className="text-[#00f5ff]">Tree</span></h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsConceptOpen(!isConceptOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isConceptOpen ? 'bg-brand-teal text-black border-brand-teal' : 'bg-white/5 border-white/10 text-brand-teal/70 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
              </button>
              <Button size="sm" variant={showComparison ? 'primary' : 'outline'} onClick={() => setShowComparison(!showComparison)} className="rounded-full">
                <Layers className="w-4 h-4 mr-2" /> {showComparison ? 'Hide Comp' : 'Compare BST'}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative p-8 overflow-y-auto">
             <div className="max-w-7xl mx-auto w-full space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                    <ControlPanel onInsert={insert} onReset={reset} onWorstCase={() => {}} onRandom={() => {}} operation={operation} />
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

                <div className="text-center h-8">
                  <motion.div key={message} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-brand-dark border border-white/5 text-xs text-brand-teal font-bold">
                    {message}
                  </motion.div>
                </div>

                {!showComparison ? (
                  <AVLCanvas nodes={visualNodes} edges={visualEdges} height={500} />
                ) : (
                  <ComparisonMode avlNodes={visualNodes} avlEdges={visualEdges} bstNodes={bstNodes} bstEdges={bstEdges} stats={comparisonStats} />
                )}
             </div>
          </div>
        </main>

        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="AVL Tree" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context="AVL Tree balancing logic." /> */}
      </div>
    </div>
  );
};
