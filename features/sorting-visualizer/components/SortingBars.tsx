
import React from 'react';
import { motion } from 'framer-motion';
import { SortStep } from '../types';

interface SortingBarsProps {
  step: SortStep;
  maxValue: number;
}

export const SortingBars: React.FC<SortingBarsProps> = ({ step, maxValue }) => {
  const { array, comparing, swapping, sorted, pivot } = step;

  const getBarColor = (index: number) => {
    if (pivot === index) return '#a855f7'; // Purple (Pivot)
    if (swapping.includes(index)) return '#ef4444'; // Red (Swap)
    if (comparing.includes(index)) return '#eab308'; // Yellow (Compare)
    if (sorted.includes(index)) return '#22c55e'; // Green (Sorted)
    return '#3b82f6'; // Blue (Default)
  };

  return (
    <div className="flex items-end justify-center gap-[0.5px] sm:gap-[2px] h-full w-full px-2 sm:px-4">
      {array.map((value, index) => {
        const heightPercent = (value / maxValue) * 100;
        const color = getBarColor(index);
        
        return (
          <motion.div
            key={index}
            initial={false}
            animate={{ 
              height: `${heightPercent}%`, 
              backgroundColor: color 
            }}
            transition={{ type: 'tween', duration: 0.1 }}
            className="flex-1 rounded-t-sm min-w-[1px] relative group"
          >
            {/* Tooltip for value - only show if there's space */}
            <div className="hidden sm:group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-[10px] px-1 rounded pointer-events-none z-10">
              {value}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
