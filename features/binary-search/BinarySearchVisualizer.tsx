
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Fingerprint } from 'lucide-react';
import { useBinarySearch } from './hooks/useBinarySearch';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
// import { ChatPanel } from '../ai-tutor/ChatPanel';
import { MobileLandscapeAlert } from '../../shared/components/MobileLandscapeAlert';

interface BinarySearchVisualizerProps {
  onBack: () => void;
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({ onBack }) => {
  const {
    array,
    step,
    isRunning,
    speed,
    setSpeed,
    generateArray,
    runSearch,
    reset
  } = useBinarySearch();

  return (
    <div className="min-h-screen bg-brand-darkest text-brand-light flex flex-col">
      <Header />
      <MobileLandscapeAlert />

      <div className="flex-1 flex flex-col lg:flex-row pt-20 lg:h-screen lg:overflow-hidden">
        <main className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] lg:min-h-0 lg:h-auto overflow-y-auto lg:overflow-hidden">
          
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-blue/20 bg-brand-darkest/50 backdrop-blur gap-4 shrink-0 z-10">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0 border-brand-blue/50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter">BINARY <span className="text-brand-teal">SEARCH</span></h1>
            </div>
            
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-full border border-brand-teal/20">
              <Fingerprint className="w-4 h-4" />
              <span>Logarithmic Efficiency</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-brand-darkest relative p-4 sm:p-8">
            <div className="max-w-4xl mx-auto w-full space-y-8">
              <ControlPanel 
                onSearch={runSearch}
                onGenerate={() => generateArray()}
                onReset={reset}
                isRunning={isRunning}
                speed={speed}
                onSpeedChange={setSpeed}
              />

              <div className="bg-brand-dark p-8 rounded-[32px] border border-brand-blue/30 shadow-inner relative min-h-[350px] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-6 left-0 right-0 text-center pointer-events-none px-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.message}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`inline-block px-6 py-2 rounded-full border text-sm font-mono backdrop-blur-xl ${
                        step.found ? 'bg-green-900/30 border-green-500 text-green-400' :
                        step.notFound ? 'bg-red-900/30 border-red-500 text-red-400' :
                        'bg-brand-blue/20 border-brand-teal/30 text-brand-teal'
                      }`}
                    >
                      {step.message}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap justify-center items-end gap-2 sm:gap-4 mt-12 w-full">
                  {array.map((el, idx) => {
                    const isOutside = step.low !== -1 && (idx < step.low || idx > step.high);
                    const isMid = step.mid === idx;
                    const isLow = step.low === idx;
                    const isHigh = step.high === idx;

                    return (
                      <div key={el.id} className="relative flex flex-col items-center">
                        {/* Pointer Labels */}
                        <div className="absolute -top-12 flex flex-col items-center space-y-1 h-10 justify-end">
                          <AnimatePresence>
                            {isMid && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="px-2 py-0.5 bg-brand-teal text-brand-darkest text-[10px] font-black rounded uppercase"
                              >
                                Mid
                              </motion.span>
                            )}
                            {isLow && !isMid && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-2 py-0.5 bg-brand-blue text-brand-light text-[10px] font-black rounded uppercase"
                              >
                                Low
                              </motion.span>
                            )}
                            {isHigh && !isMid && (
                              <motion.span 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-2 py-0.5 bg-brand-blue text-brand-light text-[10px] font-black rounded uppercase"
                              >
                                High
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Array Cell */}
                        <motion.div
                          layout
                          className={`
                            w-10 h-14 sm:w-14 sm:h-20 rounded-2xl border-2 flex items-center justify-center shadow-lg relative transition-all duration-500
                            ${isOutside ? 'opacity-20 scale-90 border-brand-blue' : 'opacity-100 border-brand-teal/40 bg-brand-darkest'}
                            ${isMid ? 'ring-4 ring-brand-teal ring-offset-4 ring-offset-brand-dark scale-110 z-10 border-brand-teal bg-brand-blue/30' : ''}
                            ${step.found && isMid ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''}
                          `}
                        >
                          <span className={`text-sm sm:text-xl font-black ${isOutside ? 'text-brand-teal/50' : 'text-brand-light'}`}>
                            {el.value}
                          </span>
                        </motion.div>

                        <span className="mt-2 text-[10px] font-mono text-brand-teal/30">{idx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Sidebar />

        {/* <ChatPanel 
          context="Binary Search Algorithm. Explain the prerequisites (sorted array), the middle calculation (low+high)/2, and how it eliminates half the dataset each step. Emphasize why it's faster than linear search for large datasets."
          onHighlightNode={(val) => runSearch(val)}
        /> */}
      </div>
    </div>
  );
};
