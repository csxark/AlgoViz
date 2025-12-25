
import React from 'react';
import { CellType } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface GridCellProps {
  row: number;
  col: number;
  type: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const GridCell: React.FC<GridCellProps> = React.memo(({
  row,
  col,
  type,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  const getStyles = () => {
    switch (type) {
      case 'start': return 'bg-green-500 border-green-600 z-10 scale-110 shadow-lg';
      case 'finish': return 'bg-red-500 border-red-600 z-10 scale-110 shadow-lg';
      case 'wall': return 'bg-gray-800 border-gray-700';
      case 'visited': return 'bg-[#00f5ff]/40 border-[#00f5ff]/30 animate-visit';
      case 'path': return 'bg-yellow-400 border-yellow-300 animate-path shadow-md z-10';
      default: return 'bg-white border-gray-100 hover:bg-gray-50';
    }
  };

  return (
    <div
      data-row={row}
      data-col={col}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      className={`
        w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
        border border-opacity-20 flex items-center justify-center cursor-pointer transition-colors duration-200 select-none touch-none
        ${getStyles()}
      `}
    >
      {type === 'start' && <Navigation className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white fill-current transform rotate-90" />}
      {type === 'finish' && <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white fill-current" />}
    </div>
  );
}, (prev, next) => prev.type === next.type);

GridCell.displayName = 'GridCell';
