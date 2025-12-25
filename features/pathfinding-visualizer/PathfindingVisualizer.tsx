
import React from 'react';
import { ArrowLeft, Navigation, Activity } from 'lucide-react';
import { usePathfinding } from './hooks/usePathfinding';
import { GridBoard } from './components/GridBoard';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface PathfindingVisualizerProps {
  onBack: () => void;
}

export const PathfindingVisualizer: React.FC<PathfindingVisualizerProps> = ({ onBack }) => {
  const { 
    grid,
    isRunning,
    algorithm,
    speed,
    setAlgorithm,
    setSpeed,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    runAlgorithm,
    resetGrid,
    generateMaze,
    stats
  } = usePathfinding();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col overflow-hidden">
      <Header />
      <MobileLandscapeAlert />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-20 lg:h-screen lg:overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          {/* Top Title Bar & Stats */}
          <div className="px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-6">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 text-[#00f5ff] mb-1">
                  <Navigation className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Navigation</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Path<span className="text-[#00f5ff]">finding</span></h1>
              </div>
            </div>

            {/* Live Diagnostics: Visible stats during and after visualization */}
            <div className="flex items-center space-x-8 px-8 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Nodes Scanned</span>
                <span className="text-xl font-mono font-bold text-[#00f5ff]">{stats.visited}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Optimal Length</span>
                <span className="text-xl font-mono font-bold text-[#00f5ff]">{stats.length}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative">
            
            {/* Expanded Horizontal Command Bar */}
            <div className="w-full p-6 border-b border-white/5 bg-white/[0.02] shrink-0 z-20">
              <div className="max-w-6xl mx-auto">
                <ControlPanel 
                  algorithm={algorithm}
                  setAlgorithm={setAlgorithm}
                  isRunning={isRunning}
                  onVisualize={runAlgorithm}
                  onReset={() => resetGrid(false)}
                  onClearWalls={() => resetGrid(true)}
                  onGenerateMaze={generateMaze}
                  speed={speed}
                  setSpeed={setSpeed}
                />
              </div>
            </div>

            {/* Main Interactive Grid Area */}
            <div className="flex-1 p-8 bg-[#0a0a0a] overflow-auto relative flex items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
              <GridBoard 
                grid={grid}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
              
              {/* Interaction Hint Overlay */}
              {!isRunning && !stats.visited && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur rounded-lg border border-white/10 text-[10px] text-white/40 font-black uppercase tracking-widest pointer-events-none">
                  Click & Drag to Draw Walls • Move Start/End Targets
                </div>
              )}
            </div>
          </div>
        </main>

        <Sidebar />

        {/* <ChatPanel 
          context={`Pathfinding visualizer. Algorithm: ${algorithm.toUpperCase()}. The user is searching for shortest paths on a grid.`}
          onHighlightNode={() => {}} 
        /> */}
      </div>
    </div>
  );
};
