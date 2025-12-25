
import { useState, useCallback, useRef, useEffect } from 'react';
import { AVLNode, VisualAVLNode, VisualEdge, AVLOperation, ComparisonStats } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const FRAME_WIDTH = 1000;
const VERTICAL_SPACING = 70;

export const useAVLTree = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [bstRoot, setBstRoot] = useState<AVLNode | null>(null); 
  const [speed, setSpeed] = useState(800);
  
  const [visualNodes, setVisualNodes] = useState<VisualAVLNode[]>([]);
  const [visualEdges, setVisualEdges] = useState<VisualEdge[]>([]);
  const [bstNodes, setBstNodes] = useState<VisualAVLNode[]>([]);
  const [bstEdges, setBstEdges] = useState<VisualEdge[]>([]);

  const [operation, setOperation] = useState<AVLOperation>('idle');
  const [message, setMessage] = useState('AVL Tree Ready');
  const [comparisonStats, setComparisonStats] = useState<ComparisonStats>({ avlHeight: 0, bstHeight: 0, avlRotations: 0 });
  
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [imbalancedNodeId, setImbalancedNodeId] = useState<string | null>(null);
  const [pivotNodeId, setPivotNodeId] = useState<string | null>(null);

  const rootRef = useRef(root);
  rootRef.current = root;
  const bstRootRef = useRef(bstRoot);
  bstRootRef.current = bstRoot;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  
  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (ms?: number) => {
    await sleep(ms || speedRef.current);
    if (!isMounted.current) throw new Error('Unmounted');
  };

  const getHeight = (node: AVLNode | null): number => node ? node.height : 0;
  const getBalance = (node: AVLNode | null): number => node ? getHeight(node.left) - getHeight(node.right) : 0;
  const updateHeight = (node: AVLNode) => { node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1; };

  const calculateLayout = useCallback((node: AVLNode | null, x: number, y: number, level: number): { nodes: VisualAVLNode[], edges: VisualEdge[] } => {
    if (!node) return { nodes: [], edges: [] };
    node.x = x;
    node.y = y;
    const bf = getBalance(node);
    let state: VisualAVLNode['state'] = 'default';
    if (activeNodeIds.has(node.id)) state = 'checking';
    if (imbalancedNodeId === node.id) state = 'imbalanced';
    if (pivotNodeId === node.id) state = 'rotating-pivot';
    const vNode: VisualAVLNode = { ...node, balanceFactor: bf, state };
    const offset = Math.max(FRAME_WIDTH / (Math.pow(2, level + 2)), 35); 
    const leftResult = calculateLayout(node.left, x - offset, y + VERTICAL_SPACING, level + 1);
    const rightResult = calculateLayout(node.right, x + offset, y + VERTICAL_SPACING, level + 1);
    const currentEdges: VisualEdge[] = [];
    if (node.left) currentEdges.push({ id: `${node.id}-${node.left.id}`, x1: x, y1: y, x2: node.left.x, y2: node.left.y, state: 'default' });
    if (node.right) currentEdges.push({ id: `${node.id}-${node.right.id}`, x1: x, y1: y, x2: node.right.x, y2: node.right.y, state: 'default' });
    return { nodes: [vNode, ...leftResult.nodes, ...rightResult.nodes], edges: [...currentEdges, ...leftResult.edges, ...rightResult.edges] };
  }, [activeNodeIds, imbalancedNodeId, pivotNodeId]);

  useEffect(() => {
    const avlLayout = calculateLayout(root, FRAME_WIDTH / 2, 50, 0);
    setVisualNodes(avlLayout.nodes);
    setVisualEdges(avlLayout.edges);
    const bstLayout = calculateLayout(bstRoot, FRAME_WIDTH / 2, 50, 0);
    setBstNodes(bstLayout.nodes);
    setBstEdges(bstLayout.edges);
    setComparisonStats(prev => ({ ...prev, avlHeight: getHeight(root), bstHeight: getHeight(bstRoot) }));
  }, [root, bstRoot, calculateLayout]);

  const rightRotate = async (y: AVLNode, animate: boolean): Promise<AVLNode> => {
    const x = y.left!;
    const T2 = x.right;
    if (animate) { setPivotNodeId(y.id); setActiveNodeIds(new Set([x.id])); setMessage(`Rotating ${y.value} right...`); play('pop'); await wait(); }
    x.right = y; y.left = T2;
    updateHeight(y); updateHeight(x);
    if (animate) { setComparisonStats(s => ({...s, avlRotations: s.avlRotations + 1})); setRoot({...rootRef.current!}); await wait(speedRef.current / 2); }
    return x;
  };

  const leftRotate = async (x: AVLNode, animate: boolean): Promise<AVLNode> => {
    const y = x.right!;
    const T2 = y.left;
    if (animate) { setPivotNodeId(x.id); setActiveNodeIds(new Set([y.id])); setMessage(`Rotating ${x.value} left...`); play('pop'); await wait(); }
    y.left = x; x.right = T2;
    updateHeight(x); updateHeight(y);
    if (animate) { setComparisonStats(s => ({...s, avlRotations: s.avlRotations + 1})); setRoot({...rootRef.current!}); await wait(speedRef.current / 2); }
    return y;
  };

  const insertNode = async (node: AVLNode | null, value: number, animate: boolean, isBST: boolean = false): Promise<AVLNode> => {
    if (!node) {
      const newNode: AVLNode = { id: Math.random().toString(36).substr(2, 9), value, height: 1, left: null, right: null, x: 0, y: 0 };
      if (animate && !isBST) { setMessage(`Found empty spot! Inserting ${value}.`); play('insert'); }
      return newNode;
    }
    if (animate && !isBST) { setActiveNodeIds(new Set([node.id])); setMessage(`Traversing: ${value} ${value < node.value ? '<' : '>'} ${node.value}`); await wait(speedRef.current / 2); }
    if (value < node.value) node.left = await insertNode(node.left, value, animate, isBST);
    else if (value > node.value) node.right = await insertNode(node.right, value, animate, isBST);
    else return node;
    updateHeight(node);
    if (isBST) return node;
    const balance = getBalance(node);
    if (balance > 1 && value < (node.left?.value || 0)) { if (animate) { setImbalancedNodeId(node.id); setMessage(`LL Case. Single Right Rotation.`); play('error'); await wait(); } const newNode = await rightRotate(node, animate); if (animate) { setImbalancedNodeId(null); setPivotNodeId(null); } return newNode; }
    if (balance < -1 && value > (node.right?.value || 0)) { if (animate) { setImbalancedNodeId(node.id); setMessage(`RR Case. Single Left Rotation.`); play('error'); await wait(); } const newNode = await leftRotate(node, animate); if (animate) { setImbalancedNodeId(null); setPivotNodeId(null); } return newNode; }
    if (balance > 1 && value > (node.left?.value || 0)) { if (animate) { setImbalancedNodeId(node.id); setMessage(`LR Case. Dual Rotation.`); play('error'); await wait(); } node.left = await leftRotate(node.left!, animate); const newNode = await rightRotate(node, animate); if (animate) { setImbalancedNodeId(null); setPivotNodeId(null); } return newNode; }
    if (balance < -1 && value < (node.right?.value || 0)) { if (animate) { setImbalancedNodeId(node.id); setMessage(`RL Case. Dual Rotation.`); play('error'); await wait(); } node.right = await rightRotate(node.right!, animate); const newNode = await leftRotate(node, animate); if (animate) { setImbalancedNodeId(null); setPivotNodeId(null); } return newNode; }
    return node;
  };

  const insert = useCallback(async (value: number) => {
    if (operation !== 'idle') return;
    setOperation('inserting');
    if (bstRootRef.current || !rootRef.current) { setBstRoot(await insertNode(bstRootRef.current ? JSON.parse(JSON.stringify(bstRootRef.current)) : null, value, false, true)); }
    setRoot(await insertNode(rootRef.current ? JSON.parse(JSON.stringify(rootRef.current)) : null, value, true));
    setActiveNodeIds(new Set()); setImbalancedNodeId(null); setPivotNodeId(null); setOperation('idle');
  }, [operation]);

  const reset = useCallback(() => { setRoot(null); setBstRoot(null); setComparisonStats({ avlHeight: 0, bstHeight: 0, avlRotations: 0 }); setMessage('Tree Cleared'); }, []);

  return { visualNodes, visualEdges, bstNodes, bstEdges, insert, reset, operation, message, comparisonStats, speed, setSpeed };
};
