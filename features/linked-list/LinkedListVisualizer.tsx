
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, RotateCw, Link2 } from 'lucide-react';
import { useLinkedListAnimation } from './hooks/useLinkedListAnimation';
import { ListNode } from './components/ListNode';
import { PlaybackControls } from './components/PlaybackControls';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { LinkedListNode } from './types';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

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
            
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:space-x-3">
              <Button size="sm" onClick={() => actions.insertHead(Math.floor(Math.random() * 99))} disabled={isBusy}>
                <Plus className="w-3 h-3 mr-2" /> Add Head
              </Button>
              <Button size="sm" variant="secondary" onClick={() => actions.insertTail(Math.floor(Math.random() * 99))} disabled={isBusy}>
                <Plus className="w-3 h-3 mr-2" /> Add Tail
              </Button>
              <Button size="sm" variant="outline" onClick={actions.reverse} disabled={isBusy || displayNodes.length < 2}>
                <RotateCw className="w-3 h-3 mr-2" /> Reverse
              </Button>
              <Button size="sm" variant="outline" onClick={() => actions.deleteNode(displayNodes[0]?.value || 0)} disabled={isBusy || displayNodes.length === 0} className="text-red-400 border-red-900/20">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col min-h-[400px]">
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-12">
              <div className="absolute top-8 left-0 right-0 text-center pointer-events-none z-10 px-8">
                <motion.div
                  key={currentStep.message}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-6 py-2 bg-[#00f5ff]/10 border border-[#00f5ff]/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest text-[#00f5ff] shadow-2xl"
                >
                  {currentStep.message}
                </motion.div>
              </div>

              <div className="flex items-center space-x-0 min-w-max mx-auto py-20">
                <AnimatePresence mode='popLayout'>
                  {displayNodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ListNode 
                        value={node.value}
                        highlight={currentStep.highlightedIds.includes(node.id)}
                        pointers={Object.entries(currentStep.pointers).filter(([_, id]) => id === node.id).map(([l]) => l)}
                        isTail={index === displayNodes.length - 1}
                      />
                    </motion.div>
                  ))}
                  
                  {displayNodes.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/20 font-black uppercase tracking-[0.3em] text-xs border border-white/5 rounded-3xl px-20 py-10 bg-white/[0.02]">
                      Buffer Null
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/5">
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>
        </main>

        <Sidebar />
        
        {/* <ChatPanel 
          context="Singly Linked List. Linear nodes. O(1) Head ops. O(n) Access. Memory is dynamic."
          onHighlightNode={(val) => actions.insertTail(val)}
        /> */}
      </div>
    </div>
  );
};
