
import React, { useEffect, useState } from 'react';
import { useBinaryTree } from './hooks/useBinaryTree';
import { TreeCanvas } from './components/TreeCanvas';
import { ControlPanel } from './components/ControlPanel';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Brain, Cpu } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

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

  useEffect(() => {
    const init = async () => {
      await new Promise(r => setTimeout(r, 500));
      insert(50);
    };
    init();
  }, []); 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FEFCFB] selection:bg-[#00f5ff] selection:text-black">
      <Header />
      <MobileLandscapeAlert />
      
      <main className="pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto relative">
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
            
            <div className="flex items-center space-x-3 bg-white/5 p-1 rounded-full border border-white/5">
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
          <div className="grid grid-cols-1 gap-8">
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
               
               {/* Quiz Overlay */}
               {showQuiz && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-20 p-4"
                 >
                   <div className="glass-card-accent p-12 rounded-[3rem] border-[#00f5ff]/30 max-w-md w-full text-center">
                     <Brain className="w-16 h-16 text-[#00f5ff] mx-auto mb-8 animate-pulse" />
                     <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Spatial Reasoning Test</h3>
                     <p className="text-white/60 mb-10 text-sm leading-relaxed">
                       Identify the correct insertion path for value <strong className="text-[#00f5ff]">{Math.floor(Math.random() * 100)}</strong> based on the current structure.
                     </p>
                     <Button className="w-full" onClick={() => setShowQuiz(false)}>Return to Core</Button>
                   </div>
                 </motion.div>
               )}
            </div>
            
            {/* Educational Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Real-World Use', icon: Book, content: 'Database indexing and filesystem structures rely on variants of BSTs for logarithmic efficiency.' },
                { title: 'Complexity', icon: Cpu, content: 'Search: O(log n)\nInsert: O(log n)\nWorst case (skewed): O(n)' },
                { title: 'Legend', icon: Brain, content: 'Blue: Default State\nCyan: Active Selection\nWhite: Recursive Search' }
              ].map((note, i) => (
                <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5 hover:border-[#00f5ff]/20 transition-all group">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00f5ff]/10 transition-all">
                      <note.icon className="w-4 h-4 text-[#00f5ff]" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest">{note.title}</h3>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* <ChatPanel 
          context="Binary Search Tree (BST). Nodes have at most two children. Left child < Parent < Right child. Operations: Insert, Delete, Search. Time Complexity: O(log n) average case, O(n) worst case." 
          onHighlightNode={highlightValue}
          onBuildStructure={buildTree}
        /> */}
      </main>
    </div>
  );
};
