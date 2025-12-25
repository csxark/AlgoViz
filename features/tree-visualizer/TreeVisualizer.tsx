
import React, { useEffect, useState } from 'react';
import { useBinaryTree } from './hooks/useBinaryTree';
import { TreeCanvas } from './components/TreeCanvas';
import { ControlPanel } from './components/ControlPanel';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Brain, Cpu, BookOpen, Sliders } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';

interface TreeVisualizerProps {
  onBack: () => void;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ onBack }) => {
  const { 
    visualNodes, 
    visualEdges, 
    insert, 
    delete: remove, 
    search, 
    clear, 
    buildTree,
    highlightValue,
    operation,
    message,
    speed,
    setSpeed
  } = useBinaryTree();

  const [showQuiz, setShowQuiz] = useState(false);
  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['binary-tree'];

  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 500));
      insert(50);
    };
    init();
  }, []); 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FEFCFB] selection:bg-[#00f5ff] selection:text-black flex flex-col">
      <Header />
      <MobileLandscapeAlert />
      
      <main className="flex-1 pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center space-x-6">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol v4.0</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                  Binary Search <span className="text-[#00f5ff]">Tree</span>
                </h1>
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
               <Button 
                 variant={showQuiz ? 'primary' : 'ghost'} 
                 size="sm"
                 onClick={() => setShowQuiz(!showQuiz)}
                 className="rounded-full"
               >
                 <Brain className="w-4 h-4 mr-2" />
                 {showQuiz ? 'Exit Training' : 'Practice Mode'}
               </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="glass-card rounded-[2.5rem] p-8 border-white/5">
                <ControlPanel 
                  onInsert={insert}
                  onDelete={remove}
                  onSearch={search}
                  onClear={clear}
                  onSpeedChange={setSpeed}
                  speed={speed}
                  operation={operation}
                  message={message}
                />
              </div>
              
              <div className="relative glass-card rounded-[3rem] border-white/5 overflow-hidden h-[600px] flex items-center justify-center bg-black/40">
                 <TreeCanvas nodes={visualNodes} edges={visualEdges} />
                 
                 {showQuiz && (
                   <motion.div 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                     className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20 p-4"
                   >
                     <div className="glass-card-accent p-12 rounded-[3rem] border-[#00f5ff]/30 max-w-md w-full text-center">
                       <Brain className="w-16 h-16 text-[#00f5ff] mx-auto mb-8 animate-pulse" />
                       <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Spatial Reasoning Test</h3>
                       <p className="text-white/60 mb-10 text-sm leading-relaxed">
                         Identify the correct insertion path for value <strong className="text-[#00f5ff]">{Math.floor(Math.random() * 100)}</strong>.
                       </p>
                       <Button className="w-full" onClick={() => setShowQuiz(false)}>Return to Core</Button>
                     </div>
                   </motion.div>
                 )}
              </div>
            </div>

            {/* Side Tools */}
            <div className="space-y-6">
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
                  <span>Stable</span>
                  <span>Educational</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { title: 'Complexity', icon: Cpu, content: 'Search: O(log n)\nInsert: O(log n)\nSpace: O(n)' },
                  { title: 'Legend', icon: Brain, content: 'Blue: Default\nCyan: Selection\nWhite: Recursive' }
                ].map((note, i) => (
                  <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5">
                    <div className="flex items-center space-x-3 mb-4">
                      <note.icon className="w-4 h-4 text-[#00f5ff]" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">{note.title}</h3>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <ConceptWindow 
          isOpen={isConceptOpen}
          onClose={() => setIsConceptOpen(false)}
          title="Binary Tree"
          concept={conceptData.concept}
          pseudocode={conceptData.pseudocode}
        />

        {/* <ChatPanel 
          context="Binary Search Tree (BST). Left child < Parent < Right child. Average O(log n)." 
          onHighlightNode={highlightValue}
          onBuildStructure={buildTree}
        /> */}
      </main>
    </div>
  );
};
