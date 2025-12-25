import React from 'react';
import { motion } from 'framer-motion';
import { DPProblemType } from '../types';
import { Database, LayoutList, Type } from 'lucide-react';

interface ProblemInputTableProps {
  problem: DPProblemType;
  inputs: Record<string, any>;
  activeRow: number | null;
}

export const ProblemInputTable: React.FC<ProblemInputTableProps> = ({ problem, inputs, activeRow }) => {
  return (
    <div className="bg-brand-darkest/40 border border-white/5 rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center space-x-2 mb-4 text-[#00f5ff]/70">
        <Database className="w-3 h-3" />
        <span className="text-[10px] font-black uppercase tracking-widest">Input Context</span>
      </div>

      {problem === 'knapsack' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg mb-2">
            <span className="text-[10px] text-white/40 uppercase font-black">Capacity</span>
            <span className="text-sm font-mono text-[#00f5ff]">{inputs.capacity}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 px-3 pb-2 text-[10px] font-black text-white/30 uppercase tracking-tighter">
            <span>Item</span>
            <span className="text-center">Wt</span>
            <span className="text-right">Val</span>
          </div>
          <div className="space-y-1">
            {inputs.items.map((item: any, idx: number) => {
              const isActive = activeRow !== null && activeRow === idx + 1;
              return (
                <motion.div 
                  key={item.id}
                  animate={{ 
                    backgroundColor: isActive ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: isActive ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  className="grid grid-cols-3 gap-2 px-3 py-2 border rounded-xl text-xs font-mono"
                >
                  <span className={isActive ? 'text-[#00f5ff] font-black' : 'text-white/60'}>#{item.id}</span>
                  <span className="text-center text-white/80">{item.w}</span>
                  <span className="text-right text-[#00f5ff]">{item.v}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {problem === 'lcs' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="text-[9px] text-white/30 uppercase font-black px-1 tracking-widest">String 1 (Rows)</div>
            <div className="flex flex-wrap gap-1">
              {inputs.str1.split('').map((char: string, i: number) => {
                const isActive = activeRow !== null && activeRow === i + 1;
                return (
                  <motion.div 
                    key={i}
                    animate={{ 
                      backgroundColor: isActive ? '#00f5ff' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#000' : '#fff'
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border border-white/5"
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[9px] text-white/30 uppercase font-black px-1 tracking-widest">String 2 (Cols)</div>
            <div className="flex flex-wrap gap-1">
              {inputs.str2.split('').map((char: string, i: number) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm bg-white/5 border border-white/5 opacity-50">
                  {char}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {problem === 'fibonacci' && (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Target N</span>
          <span className="text-5xl font-black text-[#00f5ff] font-mono">{inputs.n}</span>
          <div className="text-[9px] text-white/20 uppercase font-bold text-center leading-relaxed">
            Generating optimal sequence<br/>from $0$ to ${inputs.n}$
          </div>
        </div>
      )}
    </div>
  );
};