import React from 'react';
import { motion } from 'framer-motion';
import { GraphNode as IGraphNode } from '../types';

interface GraphNodeProps {
  node: IGraphNode;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onRightClick: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

export const GraphNode: React.FC<GraphNodeProps> = ({ 
  node, 
  isSelected, 
  onMouseDown, 
  onClick,
  onRightClick,
  onTouchStart
}) => {
  const getColors = () => {
    switch (node.state) {
      case 'start': return { fill: '#1282A2', stroke: '#FEFCFB' };
      case 'target': return { fill: '#FEFCFB', stroke: '#1282A2' };
      case 'current': return { fill: '#1282A2', stroke: '#034078' };
      case 'visited': return { fill: '#034078', stroke: '#1282A2' };
      case 'queued': return { fill: '#001F54', stroke: '#034078' };
      default: return { fill: '#0A1128', stroke: isSelected ? '#1282A2' : '#034078' };
    }
  };

  const colors = getColors();
  const radius = 25;

  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1 
      }}
      className="cursor-pointer"
      onMouseDown={onMouseDown}
      onClick={onClick}
      onContextMenu={onRightClick}
      onTouchStart={onTouchStart}
    >
      {isSelected && (
        <circle r={radius + 6} fill="none" stroke="#1282A2" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
      )}

      <motion.circle
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={isSelected ? 3 : 2}
        animate={{ fill: colors.fill, stroke: colors.stroke }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />

      <text
        dy=".35em"
        textAnchor="middle"
        fill={node.state === 'target' ? '#0A1128' : '#FEFCFB'}
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.label}
      </text>

      {node.distance !== undefined && node.distance !== Infinity && (
        <g transform={`translate(0, -${radius + 12})`}>
          <rect x="-15" y="-10" width="30" height="16" rx="4" fill="#034078" opacity="0.9" />
          <text textAnchor="middle" fill="#FEFCFB" fontSize="10" dy="2">{node.distance}</text>
        </g>
      )}
    </motion.g>
  );
};