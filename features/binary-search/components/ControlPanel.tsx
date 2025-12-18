
import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { Search, RefreshCw, Shuffle, Sliders } from 'lucide-react';

interface ControlPanelProps {
  onSearch: (val: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (s: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSearch,
  onGenerate,
  onReset,
  isRunning,
  speed,
  onSpeedChange
}) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    const val = parseInt(input);
    if (!isNaN(val)) {
      onSearch(val);
    }
  };

  return (
    <div className="bg-brand-dark p-6 rounded-2xl border border-brand-blue/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-teal/50" />
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Target value"
              className="w-full pl-10 pr-4 py-3 bg-brand-darkest border border-brand-blue/50 rounded-xl text-brand-light focus:ring-2 focus:ring-brand-teal outline-none transition-all placeholder:text-brand-teal/30"
              disabled={isRunning}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isRunning || !input} className="shrink-0">
            Find
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onGenerate} disabled={isRunning}>
            <Shuffle className="w-4 h-4 mr-2" /> Shuffle
          </Button>
          <Button variant="outline" onClick={onReset} disabled={isRunning} className="text-red-400 border-red-900/30">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-brand-blue/20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-brand-teal/10 rounded-lg">
            <Sliders className="w-4 h-4 text-brand-teal" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal">Delay</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="flex-1 h-1.5 bg-brand-blue/30 rounded-lg appearance-none cursor-pointer accent-brand-teal"
            disabled={isRunning}
          />
          <span className="text-xs font-mono text-brand-teal w-12 text-right">{speed}ms</span>
        </div>
      </div>
    </div>
  );
};
