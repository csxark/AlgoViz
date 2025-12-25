
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Flag, BookOpen, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../shared/components/Header';
import { Button } from '../../shared/components/Button';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';
import { ChatPanel } from '../ai-tutor/ChatPanel';
import { AlgorithmType, SortStep, SortMode } from './types';
import { useSortingAlgorithms } from './hooks/useSortingAlgorithms';
import { useSortingAudio } from './hooks/useSortingAudio';
import { SortingBars } from './components/SortingBars';
import { ControlPanel } from './components/ControlPanel';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { RaceMode } from './components/RaceMode';
import { ConceptWindow } from '../../shared/components/ConceptWindow';
import { CONCEPTS } from '../../shared/constants';

interface SortingVisualizerProps {
  onBack: () => void;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ onBack }) => {
  const [arraySize, setArraySize] = useState(30);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [mode, setMode] = useState<SortMode>('single');
  const [isConceptOpen, setIsConceptOpen] = useState(false);
  
  const [selectedAlg, setSelectedAlg] = useState<AlgorithmType>('bubble');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [raceAlgos, setRaceAlgos] = useState<AlgorithmType[]>(['bubble', 'quick', 'merge']);
  const [raceSteps, setRaceSteps] = useState<Record<AlgorithmType, SortStep[]>>({} as any);
  const [raceIndices, setRaceIndices] = useState<Record<AlgorithmType, number>>({} as any);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const { generateSteps } = useSortingAlgorithms();
  const { playTone, playCompletion } = useSortingAudio();
  const conceptData = CONCEPTS['sorting'];

  useEffect(() => { generateArray('random'); }, []);

  useEffect(() => {
    if (initialArray.length === 0) return;
    if (mode === 'single') {
      const newSteps = generateSteps(initialArray, selectedAlg);
      setSteps(newSteps);
      setCurrentStepIndex(0);
    } else {
      const newRaceSteps: any = {};
      const newIndices: any = {};
      raceAlgos.forEach(alg => {
        newRaceSteps[alg] = generateSteps(initialArray, alg);
        newIndices[alg] = 0;
      });
      setRaceSteps(newRaceSteps);
      setRaceIndices(newIndices);
    }
    setIsPlaying(false);
  }, [initialArray, selectedAlg, mode, raceAlgos, generateSteps]);

  const generateArray = (type: 'random' | 'nearly' | 'reversed') => {
    let arr: number[] = [];
    if (type === 'random') arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    else if (type === 'reversed') arr = Array.from({ length: arraySize }, (_, i) => arraySize - i);
    else {
      arr = Array.from({ length: arraySize }, (_, i) => i + 1);
      for(let i=0; i<Math.floor(arraySize/5); i++) {
        const idx1 = Math.floor(Math.random() * arraySize);
        const idx2 = Math.floor(Math.random() * arraySize);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      }
    }
    setInitialArray(arr);
  };

  useEffect(() => { generateArray('random'); }, [arraySize]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'single') {
          setCurrentStepIndex(prev => {
            if (prev >= steps.length - 1) { setIsPlaying(false); playCompletion(steps[0].array.length); return prev; }
            return prev + 1;
          });
        } else {
          setRaceIndices(prev => {
            const next = { ...prev };
            let allFinished = true;
            raceAlgos.forEach(alg => {
              if (next[alg] < (raceSteps[alg]?.length || 0) - 1) { next[alg]++; allFinished = false; }
            });
            if (allFinished) { setIsPlaying(false); playCompletion(initialArray.length); }
            return next;
          });
        }
      }, 200 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, steps.length, speed, mode, raceAlgos, raceSteps, playCompletion, initialArray.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <MobileLandscapeAlert />

      <div className="flex-1 flex flex-col lg:flex-row pt-16 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tighter">SORTING <span className="text-[#00f5ff]">RACE</span></h1>
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
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button onClick={() => setMode('single')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-[#00f5ff] text-black' : 'text-gray-400'}`}>Standard</button>
                <button onClick={() => setMode('race')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'race' ? 'bg-[#00f5ff] text-black' : 'text-gray-400'}`}><Flag className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 relative">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-950/50 flex items-center justify-between">
              <AlgorithmSelector selected={selectedAlg} onChange={setSelectedAlg} isRaceMode={mode === 'race'} raceAlgorithms={raceAlgos} onToggleRaceAlg={(a) => !raceAlgos.includes(a) ? setRaceAlgos([...raceAlgos, a]) : setRaceAlgos(raceAlgos.filter(x => x !== a))} />
              <div className="hidden md:flex items-center space-x-4 bg-black/20 p-2 rounded-xl">
                 <Sliders className="w-3 h-3 text-[#00f5ff]/50" />
                 <input type="range" min="1" max="20" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-24 h-1 accent-[#00f5ff]" />
                 <span className="text-[10px] font-mono text-[#00f5ff]">{speed}x Hz</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden relative flex flex-col">
              {mode === 'single' ? (
                <div className="flex-1 bg-gray-950/50 rounded-xl border border-gray-800 relative p-4 flex flex-col">
                  {steps[currentStepIndex] && <SortingBars step={steps[currentStepIndex]} maxValue={100} />}
                </div>
              ) : (
                <RaceMode algorithms={raceAlgos} steps={raceSteps} currentIndices={raceIndices} maxValue={100} />
              )}
            </div>

            <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
                <ControlPanel isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onReset={() => setCurrentStepIndex(0)} onStepForward={() => setCurrentStepIndex(p => Math.min(p+1, steps.length-1))} onStepBackward={() => setCurrentStepIndex(p => Math.max(p-1, 0))} onGenerate={generateArray} speed={speed} onSpeedChange={setSpeed} arraySize={arraySize} onSizeChange={setArraySize} isSorting={isPlaying} />
            </div>
          </div>
        </main>

        <ConceptWindow isOpen={isConceptOpen} onClose={() => setIsConceptOpen(false)} title="Sorting" concept={conceptData.concept} pseudocode={conceptData.pseudocode} />
        {/* <ChatPanel context="Sorting Algorithms complexity O(n log n)." /> */}
      </div>
    </div>
  );
};
