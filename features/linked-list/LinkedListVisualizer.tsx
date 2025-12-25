
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, RotateCw, Link2, BookOpen, Sliders } from 'lucide-react';
import { useLinkedListAnimation } from './hooks/useLinkedListAnimation';
import { ListNode } from './components/ListNode';
import { PlaybackControls } from './components/PlaybackControls';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { LinkedListNode, PlaybackSpeed } from './types';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';

interface LinkedListVisualizerProps {
  onBack: () => void;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ onBack }) => {
  const { 
    currentStep,
    totalSteps,
    currentStepIndex,
    isPlaying,
    play,
    pause,
    stepForward,
    stepBackward,
    speed,
    setSpeed,
    actions
  } = useLinkedListAnimation();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['linked-list'];

  const getOrderedNodes = (nodes: LinkedListNode[], headId: string | null): LinkedListNode[] => {
    if (!headId) return [];
    const ordered: LinkedListNode[] = [];
    let currId: string | null = headId;
    const visited = new Set<string>();
    while (currId && !visited.has(currId)) {
      const node = nodes.find(n => n.id === currId);
      if (node) {
        ordered.push(node);
        visited.add(currId);
        currId = node.nextId;
      } else { break; }
    }
    return ordered;
  };

  const displayNodes = getOrderedNodes(currentStep.state.nodes, currentStep.state.headId);
  const isBusy = isPlaying;

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
                  <Link2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sequential Protocol</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Linked <span className="text-[#00f5ff]">List</span></h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsConceptOpen(!isConceptOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isConceptOpen ? 'bg-[#00f5ff] text-black border-[#00f5ff]' : 'bg-white/5 border-white/10 text-[#00f5ff]/70 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
              </button>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:space-x-3">
                <Button size="sm" onClick={() => actions.insertHead(Math.floor(Math.random() * 99))} disabled={isBusy}>
                  <Plus className="w-3 h-3 mr-2" /> Add Head
                </Button>
                <Button size="sm" variant="outline" onClick={actions.reverse} disabled={isBusy || displayNodes.length < 2}>
                  <RotateCw className="w-3 h-3 mr-2" /> Reverse
                </Button>
              </div>
            </div>
          </div>

          {/* System Hz Sub-Header */}
          <div className="px-8 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-xs">
              <Sliders className="w-4 h-4 text-[#00f5ff]/50" />
              <input 
                type="range" min="0.5" max="2" step="0.5"
                value={speed} onChange={(e) => setSpeed(Number(e.target.value) as PlaybackSpeed)}
                className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
              />
              <span className="text-[10px] font-mono text-[#00f5ff]">{speed}x Hz</span>
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">O(1) Insertion Ready</div>
          </div>

          <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col min-h-[400px]">
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-12">
              <div className="flex items-center space-x-0 min-w-max mx-auto py-20">
                <AnimatePresence mode='popLayout'>
                  {displayNodes.map((node, index) => (
                    <motion.div key={node.id} layout initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }}>
                      <ListNode 
                        value={node.value}
                        highlight={currentStep.highlightedIds.includes(node.id)}
                        pointers={Object.entries(currentStep.pointers).filter(([_, id]) => id === node.id).map(([l]) => l)}
                        isTail={index === displayNodes.length - 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/5">
            <PlaybackControls 
              isPlaying={isPlaying} onPlay={play} onPause={pause}
              onStepForward={stepForward} onStepBackward={stepBackward}
              currentStep={currentStepIndex} totalSteps={totalSteps}
              speed={speed} onSpeedChange={setSpeed}
            />
          </div>
        </main>

        <Sidebar />

        <ConceptWindow 
          isOpen={isConceptOpen}
          onClose={() => setIsConceptOpen(false)}
          title="Linked List"
          concept={conceptData.concept}
          pseudocode={conceptData.pseudocode}
        />
        
        {/* <ChatPanel 
          context="Singly Linked List. Linear nodes. O(1) Head ops."
          onHighlightNode={(val) => actions.insertTail(val)}
        /> */}
      </div>
    </div>
  );
};
