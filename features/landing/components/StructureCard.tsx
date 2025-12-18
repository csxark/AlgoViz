import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DataStructure, ViewType } from '../../../shared/types';
import { Button } from '../../../shared/components/Button';
import { ChevronRight } from 'lucide-react';

interface StructureCardProps {
  structure: DataStructure;
  index: number;
  onNavigate: (view: ViewType) => void;
}

export const StructureCard: React.FC<StructureCardProps> = ({ structure, index, onNavigate }) => {
  const Icon = structure.icon;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative h-full perspective-2000"
    >
      <div className="glass-card rounded-[32px] p-8 h-full flex flex-col border-brand-blue/30 group-hover:border-brand-teal/50 transition-all duration-500 shadow-2xl overflow-hidden">
        {/* Hover Glow */}
        <div className="absolute -inset-2 bg-brand-teal/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center mb-8 border border-brand-blue group-hover:bg-brand-teal group-hover:text-brand-light transition-all duration-300 shadow-inner">
            <Icon className="w-7 h-7 text-brand-teal group-hover:text-brand-light" />
          </div>

          <h3 className="text-2xl font-extrabold text-brand-light mb-4 tracking-tight group-hover:text-brand-teal transition-colors">
            {structure.title}
          </h3>
          
          <p className="text-brand-light/60 font-medium text-sm leading-relaxed mb-8 flex-grow">
            {structure.description}
          </p>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-brand-blue group-hover:bg-brand-teal group-hover:text-brand-light group-hover:border-brand-teal"
            onClick={() => onNavigate(structure.id)}
          >
            Access Protocol
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* 2025 Mesh Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Icon className="w-24 h-24 transform translate-x-1/3 -translate-y-1/3 rotate-12" />
        </div>
      </div>
    </motion.div>
  );
};