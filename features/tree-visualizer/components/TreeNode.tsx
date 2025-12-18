import React from 'react';
import { motion } from 'framer-motion';
import { VisualNode } from '../types';

interface TreeNodeProps {
  node: VisualNode;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const getColors = () => {
    switch (node.state) {
      case 'highlighted':
        // Using light white for active focus to stand out
        return { stroke: '#FEFCFB', fill: '#1282A2', text: '#FEFCFB' };
      case 'found':
        // High contrast teal glow for success
        return { stroke: '#1282A2', fill: 'rgba(18, 130, 162, 0.2)', text: '#FEFCFB' };
      case 'modifying':
        // Use a deeper blue for system changes instead of red to stick to palette
        return { stroke: '#034078', fill: '#0A1128', text: '#1282A2' };
      default:
        return { stroke: '#034078', fill: '#001F54', text: '#FEFCFB' };
    }
  };

  const colors = getColors();

  return (
    <motion.g
      layoutId={node.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: node.x, 
        y: node.y, 
        scale: 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.circle
        r="22"
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="3"
        initial={false}
        animate={{ fill: colors.fill, stroke: colors.stroke }}
        transition={{ duration: 0.3 }}
        className="shadow-2xl"
      />
      
      <motion.text
        dy=".35em"
        textAnchor="middle"
        fill={colors.text}
        fontSize="14"
        fontWeight="800"
        initial={false}
        animate={{ fill: colors.text }}
      >
        {node.value}
      </motion.text>
      
      {node.state === 'found' && (
        <motion.circle
          r="22"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="2"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.g>
  );
};