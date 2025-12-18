
import React from 'react';
import { Button } from '../../../shared/components/Button';
import { Play, RotateCcw, Trash2, Grid, Sliders, Cpu, Zap, Activity } from 'lucide-react';
import { AlgorithmType } from '../types';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (a: AlgorithmType) => void;
  isRunning: boolean;
  onVisualize: () => void;
  onReset: () => void;
  onClearWalls: () => void;
  onGenerateMaze: () => void;
  speed: number;
  setSpeed: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  isRunning,
  onVisualize,
  onReset,
  onClearWalls,
  onGenerateMaze,
  speed,
  setSpeed
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-8">
      
      {/* 1. Protocol Selection: Segmented Control for algorithms */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#00f5ff]/50">
          <Cpu className="w-3 h-3" />
          <span>Navigation Protocol</span>
        </div>
        <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-inner">
          {(['dijkstra', 'astar', 'bfs', 'dfs'] as AlgorithmType[]).map(algo => (
            <button
              key={algo}
              onClick={() => !isRunning && setAlgorithm(algo)}
              disabled={isRunning}
              className={`flex-1 py-3 text-[11px] font-black rounded-xl uppercase transition-all tracking-tighter ${
                algorithm === algo 
                  ? 'bg-[#00f5ff] text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]' 
                  : 'text-white/40 hover:text-white/70'
              } ${isRunning ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {algo === 'astar' ? 'A-Star Search' : algo === 'dijkstra' ? 'Dijkstra' : algo}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Execution Primary Actions: Visualize and Maze */}
      <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
        <div className="w-full sm:w-auto">
          <Button 
            onClick={onVisualize} 
            disabled={isRunning} 
            className="w-full sm:min-w-[180px] h-14 rounded-2xl shadow-[0_0_30px_rgba(0,245,255,0.2)]"
            variant="primary"
          >
            <Play className="w-5 h-5 mr-3 fill-current" /> Initialize
          </Button>
        </div>
        <div className="w-full sm:w-auto">
          <Button 
            onClick={onGenerateMaze} 
            disabled={isRunning} 
            variant="secondary"
            className="w-full h-14 rounded-2xl border-white/10"
          >
            <Grid className="w-4 h-4 mr-2" /> Build Maze
          </Button>
        </div>
      </div>

      {/* 3. Global Tools: Speed and Resets */}
      <div className="flex flex-col sm:flex-row items-center gap-8 pl-0 xl:pl-8 xl:border-l border-white/10">
        
        {/* Speed Adjustment */}
        <div className="flex flex-col space-y-3 w-full sm:w-44">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Hertz Rate</span>
            <span className="text-[10px] font-mono text-[#00f5ff]">{speed < 10 ? 'MAX' : 'SYNC'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Sliders className="w-3 h-3 text-white/20" />
            <input 
              type="range" min="5" max="50" step="5"
              value={55 - speed} 
              onChange={(e) => setSpeed(55 - Number(e.target.value))}
              disabled={isRunning}
              className="flex-1 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
            />
          </div>
        </div>

        {/* Global Reset Operations */}
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onReset} 
            disabled={isRunning} 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 px-4 h-12"
          >
            <RotateCcw className="w-3 h-3 mr-2" /> Clear Path
          </Button>
          <Button 
            onClick={onClearWalls} 
            disabled={isRunning} 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 px-4 h-12"
          >
            <Trash2 className="w-3 h-3 mr-2" /> Reset Core
          </Button>
        </div>
      </div>

    </div>
  );
};
