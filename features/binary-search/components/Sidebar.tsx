
import React from 'react';
import { Search, Info, Clock, Terminal } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-80 bg-brand-dark border-l border-brand-blue/30 p-6 overflow-y-auto lg:h-[calc(100vh-4rem)] custom-scrollbar">
      <div className="space-y-8">
        <section>
          <div className="flex items-center space-x-2 text-brand-teal mb-4">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Divide & Conquer</h3>
          </div>
          <p className="text-brand-light/70 text-sm leading-relaxed">
            Binary Search is an efficient algorithm for finding an item from a <strong>sorted</strong> list of items. It works by repeatedly halving the portion of the list that could contain the item.
          </p>
        </section>

        <section>
          <div className="flex items-center space-x-2 text-brand-teal mb-4">
            <Clock className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Complexity</h3>
          </div>
          <div className="bg-brand-darkest p-4 rounded-xl border border-brand-blue/20 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-brand-teal/60">Time</span>
              <span className="text-brand-light font-mono">O(log n)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-teal/60">Space</span>
              <span className="text-brand-light font-mono">O(1)</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 text-brand-teal mb-4">
            <Terminal className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Code Logic</h3>
          </div>
          <div className="bg-brand-darkest p-4 rounded-xl border border-brand-blue/20 font-mono text-[10px] text-brand-teal/80 leading-relaxed overflow-x-auto">
            <pre>{`while (low <= high) {
  mid = (low + high) / 2;
  if (arr[mid] == target) 
    return mid;
  if (arr[mid] < target) 
    low = mid + 1;
  else 
    high = mid - 1;
}`}</pre>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-xs uppercase tracking-widest text-brand-teal/40 mb-4">Prerequisites</h3>
          <div className="flex items-center space-x-2 bg-brand-teal/5 p-3 rounded-lg border border-brand-teal/10">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
            <span className="text-xs text-brand-teal font-medium">Array must be sorted</span>
          </div>
        </section>
      </div>
    </div>
  );
};
