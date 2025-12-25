
import { useState, useCallback, useRef, useEffect } from 'react';
import { GridCell, AlgorithmType, MouseMode, CellType } from '../types';
import { useSound } from '../../../shared/context/SoundContext';

// Helper to determine grid size based on viewport
const getGridDimensions = () => {
  if (typeof window === 'undefined') return { rows: 20, cols: 40 };
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  if (width < 640) return { rows: 25, cols: 15 }; // Vertical for mobile
  if (width < 1024) return { rows: 25, cols: 30 }; // Tablet
  return { rows: 22, cols: 50 }; // Desktop
};

export const usePathfinding = () => {
  const [dimensions, setDimensions] = useState(getGridDimensions());
  const [grid, setGrid] = useState<GridCell[][]>([]);
  
  const getInitialNodes = (rows: number, cols: number) => ({
    start: { row: Math.floor(rows * 0.2), col: Math.floor(cols / 2) },
    finish: { row: Math.floor(rows * 0.8), col: Math.floor(cols / 2) }
  });

  const [startNode, setStartNode] = useState(getInitialNodes(dimensions.rows, dimensions.cols).start);
  const [finishNode, setFinishNode] = useState(getInitialNodes(dimensions.rows, dimensions.cols).finish);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ visited: 0, length: 0 });
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [speed, setSpeed] = useState(20);

  const isMousePressed = useRef(false);
  const mouseMode = useRef<MouseMode>('idle');
  const { play } = useSound();

  useEffect(() => {
    const handleResize = () => {
      const newDims = getGridDimensions();
      if (newDims.rows !== dimensions.rows || newDims.cols !== dimensions.cols) {
        setDimensions(newDims);
        const { start, finish } = getInitialNodes(newDims.rows, newDims.cols);
        setStartNode(start);
        setFinishNode(finish);
      }
    };

    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [dimensions]);

  const createNode = useCallback((row: number, col: number, sNode: {row:number, col:number}, fNode: {row:number, col:number}): GridCell => {
    return {
      row,
      col,
      type: (row === sNode.row && col === sNode.col) ? 'start' :
            (row === fNode.row && col === fNode.col) ? 'finish' : 'empty',
      distance: Infinity,
      isVisited: false,
      previousNode: null,
      fScore: Infinity,
      gScore: Infinity,
      hScore: Infinity
    };
  }, []);

  const resetGrid = useCallback((clearWalls = false) => {
    setIsRunning(false);
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < dimensions.rows; row++) {
      const currentRow: GridCell[] = [];
      for (let col = 0; col < dimensions.cols; col++) {
        const node = createNode(row, col, startNode, finishNode);
        if (!clearWalls && grid[row] && grid[row][col] && grid[row][col].type === 'wall') {
          node.type = 'wall';
        }
        currentRow.push(node);
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setIsFinished(false);
    setStats({ visited: 0, length: 0 });
  }, [dimensions, startNode, finishNode, grid, createNode]);

  useEffect(() => {
    if (grid.length !== dimensions.rows || (grid[0] && grid[0].length !== dimensions.cols)) {
      resetGrid(true);
    }
  }, [dimensions, resetGrid, grid]);

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    isMousePressed.current = true;
    if (row === startNode.row && col === startNode.col) mouseMode.current = 'moveStart';
    else if (row === finishNode.row && col === finishNode.col) mouseMode.current = 'moveFinish';
    else { mouseMode.current = 'wall'; toggleWall(row, col); }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed.current || isRunning) return;
    if (row < 0 || row >= dimensions.rows || col < 0 || col >= dimensions.cols) return;

    if (mouseMode.current === 'moveStart') {
      if (grid[row][col].type !== 'wall' && grid[row][col].type !== 'finish') {
        const newGrid = grid.map(r => r.map(c => ({...c})));
        newGrid[startNode.row][startNode.col].type = 'empty';
        newGrid[row][col].type = 'start';
        setStartNode({ row, col });
        setGrid(newGrid);
      }
    } else if (mouseMode.current === 'moveFinish') {
      if (grid[row][col].type !== 'wall' && grid[row][col].type !== 'start') {
        const newGrid = grid.map(r => r.map(c => ({...c})));
        newGrid[finishNode.row][finishNode.col].type = 'empty';
        newGrid[row][col].type = 'finish';
        setFinishNode({ row, col });
        setGrid(newGrid);
      }
    } else if (mouseMode.current === 'wall') {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => { isMousePressed.current = false; mouseMode.current = 'idle'; };

  const toggleWall = (row: number, col: number) => {
    if (row < 0 || row >= dimensions.rows || col < 0 || col >= dimensions.cols) return;
    if (grid[row][col].type === 'start' || grid[row][col].type === 'finish') return;
    const newGrid = grid.map(r => r.map(c => ({...c})));
    newGrid[row][col].type = newGrid[row][col].type === 'wall' ? 'empty' : 'wall';
    setGrid(newGrid);
    play('click');
  };

  const getNeighbors = (node: GridCell, currentGrid: GridCell[][]) => {
    const neighbors: GridCell[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(currentGrid[row - 1][col]);
    if (row < dimensions.rows - 1) neighbors.push(currentGrid[row + 1][col]);
    if (col > 0) neighbors.push(currentGrid[row][col - 1]);
    if (col < dimensions.cols - 1) neighbors.push(currentGrid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== 'wall');
  };

  const manhattanDistance = (nodeA: GridCell, nodeB: GridCell) => Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);

  const getAllNodes = (g: GridCell[][]) => {
    const ns = [];
    for (const row of g) for (const node of row) ns.push(node);
    return ns;
  };

  const runAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const newGrid: GridCell[][] = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      previousNode: null,
      distance: Infinity,
      type: (node.type === 'visited' || node.type === 'path' || node.type === 'frontier') ? 'empty' : node.type
    })));
    setGrid(newGrid);

    const visitedNodesInOrder: GridCell[] = [];
    const start = newGrid[startNode.row][startNode.col];
    const finish = newGrid[finishNode.row][finishNode.col];

    if (algorithm === 'dijkstra') {
      start.distance = 0;
      const unvisitedNodes = getAllNodes(newGrid);
      while (unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closest = unvisitedNodes.shift();
        if (!closest || closest.distance === Infinity) break;
        closest.isVisited = true;
        visitedNodesInOrder.push(closest);
        if (closest === finish) break;
        for (const n of getNeighbors(closest, newGrid)) {
          n.distance = closest.distance + 1;
          n.previousNode = closest;
        }
      }
    } else if (algorithm === 'astar') {
      start.gScore = 0;
      start.fScore = manhattanDistance(start, finish);
      const openSet = [start];
      while (openSet.length > 0) {
        openSet.sort((a, b) => a.fScore - b.fScore);
        const current = openSet.shift()!;
        if (current.isVisited) continue;
        current.isVisited = true;
        visitedNodesInOrder.push(current);
        if (current === finish) break;
        for (const n of getNeighbors(current, newGrid)) {
          const tentativeG = current.gScore + 1;
          if (tentativeG < n.gScore) {
            n.previousNode = current;
            n.gScore = tentativeG;
            n.fScore = n.gScore + manhattanDistance(n, finish);
            if (!openSet.includes(n)) openSet.push(n);
          }
        }
      }
    } else if (algorithm === 'bfs') {
      const queue = [start];
      start.isVisited = true;
      while (queue.length) {
        const current = queue.shift()!;
        visitedNodesInOrder.push(current);
        if (current === finish) break;
        for (const n of getNeighbors(current, newGrid)) {
          n.isVisited = true;
          n.previousNode = current;
          queue.push(n);
        }
      }
    } else if (algorithm === 'dfs') {
      const stack = [start];
      while (stack.length) {
        const current = stack.pop()!;
        if (current.isVisited) continue;
        current.isVisited = true;
        visitedNodesInOrder.push(current);
        if (current === finish) break;
        for (const n of getNeighbors(current, newGrid)) {
          n.previousNode = current;
          stack.push(n);
        }
      }
    }

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => animatePath(finish), speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.type !== 'start' && node.type !== 'finish') updateNodeState(node.row, node.col, 'visited');
      }, speed * i);
    }
  };

  const animatePath = (f: GridCell) => {
    const path = [];
    let curr: GridCell | null = f;
    while (curr !== null) { path.unshift(curr); curr = curr.previousNode; }
    setStats({ visited: 0, length: path.length });
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        if (path[i].type !== 'start' && path[i].type !== 'finish') updateNodeState(path[i].row, path[i].col, 'path');
        if (i === path.length - 1) { setIsRunning(false); setIsFinished(true); play('success'); }
      }, 50 * i);
    }
  };

  const updateNodeState = (r: number, c: number, type: CellType) => {
    setGrid(prev => {
      const g = prev.map(row => [...row]);
      if (g[r] && g[r][c]) g[r][c] = { ...g[r][c], type };
      return g;
    });
  };

  const generateMaze = () => {
    resetGrid(true);
    setGrid(prev => prev.map((row, r) => row.map((node, c) => {
      if (Math.random() < 0.3 && !(r === startNode.row && c === startNode.col) && !(r === finishNode.row && c === finishNode.col)) {
        return { ...node, type: 'wall' };
      }
      return node;
    })));
  };

  return { grid, dimensions, isRunning, isFinished, stats, algorithm, speed, setAlgorithm, setSpeed, handleMouseDown, handleMouseEnter, handleMouseUp, runAlgorithm, resetGrid, generateMaze };
};
