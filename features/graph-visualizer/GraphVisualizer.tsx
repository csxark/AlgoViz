
import React, { useState } from 'react';
import { ArrowLeft, Trash2, BookOpen, Sliders } from 'lucide-react';
import { useGraph } from './hooks/useGraph';
import { GraphNode } from './components/GraphNode';
import { GraphEdge } from './components/GraphEdge';
import { GraphSidebar } from './components/GraphSidebar';
import { AlgorithmPanel } from './components/AlgorithmPanel';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { AlgorithmType } from './types';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';

interface GraphVisualizerProps {
  onBack: () => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ onBack }) => {
  const { 
    nodes, 
    edges, 
    selectedNodeId, 
    isPlaying,
    currentStep,
    handlers,
    runAlgorithm,
    reset,
    loadPreset,
    stop,
    stepForward,
    stepBackward,
    speed,
    setSpeed
  } = useGraph();

  const [isConceptOpen, setIsConceptOpen] = useState(false);
  const conceptData = CONCEPTS['graph'];

  const handleAlgorithmStart = (type: AlgorithmType) => {
    const startNode = selectedNodeId || nodes[0]?.id;
    if (startNode) runAlgorithm(type, startNode);
    else alert("Please select a start node first!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto">
          
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="pointer-events-auto flex space-x-2">
                <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-900/80 backdrop-blur">
                <ArrowLeft className="w-5 h-5" />
                </Button>
                <button 
                  onClick={() => setIsConceptOpen(!isConceptOpen)}
                  className={`pointer-events-auto flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all ${
                    isConceptOpen ? 'bg-[#00f5ff] text-black border-[#00f5ff]' : 'bg-black/60 border-white/10 text-[#00f5ff]/70 hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logic Docs</span>
                </button>
            </div>
            
            <div className="pointer-events-auto bg-gray-900/80 backdrop-blur border border-gray-700 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-300 shadow-lg flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                 <Sliders className="w-3 h-3 text-[#00f5ff]/50" />
                 <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-20 h-1 accent-[#00f5ff] pointer-events-auto" />
                 <span className="font-mono text-[#00f5ff]">{speed}x Hz</span>
              </div>
              <span>{isPlaying ? 'Running Process...' : 'Active Sandbox'}</span>
            </div>
          </div>

          <div className="flex-1 bg-gray-950 overflow-auto cursor-crosshair relative min-h-[400px]">
            <svg className="w-full h-full min-w-[600px] min-h-[600px] touch-none" onMouseDown={handlers.handleCanvasMouseDown} onMouseMove={handlers.handleCanvasMouseMove} onMouseUp={handlers.handleCanvasMouseUp} onClick={handlers.handleCanvasClick}>
              {edges.map(edge => {
                const s = nodes.find(n => n.id === edge.source);
                const t = nodes.find(n => n.id === edge.target);
                return s && t ? <GraphEdge key={edge.id} edge={edge} source={s} target={t} /> : null;
              })}
              {nodes.map(node => (
                <GraphNode key={node.id} node={node} isSelected={node.id === selectedNodeId} onMouseDown={(e) => handlers.handleNodeMouseDown(node.id, e)} onClick={(e) => handlers.handleNodeClick(node.id, e)} onRightClick={(e) => { e.preventDefault(); handlers.removeNode(node.id); }} onTouchStart={(e) => handlers.handleNodeTouchStart(node.id, e)} />
              ))}
            </svg>
          </div>

          <div className="absolute bottom-6 right-6 w-64 h-64 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-xl shadow-2xl p-4 overflow-hidden z-20 hidden md:block">
             <AlgorithmPanel step={currentStep} />
          </div>
        </main>

        <GraphSidebar onAlgorithm={handleAlgorithmStart} onReset={reset} onPreset={loadPreset} isPlaying={isPlaying} onPlayPause={() => isPlaying ? stop() : stepForward()} onStepForward={stepForward} onStepBackward={stepBackward} speed={speed} onSpeedChange={setSpeed} message={currentStep?.message} />
        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="Graph Algorithm" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context="Graph Structures and Pathfinding Algorithms." /> */}
      </div>
    </div>
  );
};
