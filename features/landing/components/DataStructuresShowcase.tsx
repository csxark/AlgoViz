import React from 'react';
import { StructureCard } from './StructureCard';
import { DATA_STRUCTURES } from '../../../shared/constants';
import { ViewType } from '../../../shared/types';
import { motion } from 'framer-motion';

interface DataStructuresShowcaseProps {
  onNavigate: (view: ViewType) => void;
}

export const DataStructuresShowcase: React.FC<DataStructuresShowcaseProps> = ({ onNavigate }) => {
  return (
    <section className="py-32 relative bg-brand-dark" id="visualizers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20">
          <div className="max-w-2xl text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-brand-mint mb-6 tracking-tighter"
            >
              NEURAL <span className="text-brand-teal">LIBRARIES</span>
            </motion.h2>
            <p className="text-brand-teal text-lg font-medium">
              Every structure is engineered with step-by-step logic gates. Optimized for high-fidelity learning and technical interview simulations.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex items-center space-x-2 text-brand-lime font-mono text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span>{DATA_STRUCTURES.length} PROTOCOLS LOADED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DATA_STRUCTURES.map((structure, index) => (
            <StructureCard 
              key={structure.id} 
              structure={structure} 
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};