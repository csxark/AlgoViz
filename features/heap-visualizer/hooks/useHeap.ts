
import { useState, useRef, useEffect, useCallback } from 'react';
import { HeapNode, HeapType, HeapOperation, VisualHeapNode } from '../types';
import { useSound } from '../../../shared/context/SoundContext';

export const useHeap = () => {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [heapType, setHeapType] = useState<HeapType>('min');
  const [operation, setOperation] = useState<HeapOperation>('idle');
  const [message, setMessage] = useState('Ready');
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(800);

  const heapRef = useRef(heap);
  heapRef.current = heap;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const wait = async (ms?: number) => {
    await new Promise(resolve => setTimeout(resolve, ms || speedRef.current));
    if (!isMounted.current) throw new Error('Unmounted');
  };

  const getLayout = useCallback((nodes: HeapNode[]): VisualHeapNode[] => {
    return nodes.map((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = (index + 1) - Math.pow(2, level);
      const span = 1000 / Math.pow(2, level);
      const x = (positionInLevel * span) + (span / 2);
      const y = 60 + level * 80;
      return { ...node, index, x, y, state: 'default' };
    });
  }, []);

  const reset = () => { 
    setHeap([]); 
    setSortedArray([]); 
    setComparingIndices([]); 
    setOperation('idle'); 
    setMessage('Heap Cleared');
  };

  const swap = async (i: number, j: number) => {
    const newHeap = [...heapRef.current];
    const temp = newHeap[i];
    newHeap[i] = newHeap[j];
    newHeap[j] = temp;
    if (isMounted.current) setHeap(newHeap);
    play('pop');
    await wait();
  };

  const bubbleUp = async (idx: number) => {
    let index = idx;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      setComparingIndices([index, parent]);
      setMessage(`Comparing element ${heapRef.current[index].value} with parent ${heapRef.current[parent].value}`);
      await wait(speedRef.current / 1.5);

      const v = heapRef.current[index].value;
      const p = heapRef.current[parent].value;
      const shouldSwap = heapType === 'min' ? v < p : v > p;

      if (shouldSwap) {
        setMessage(`Swapping: ${v} ${heapType === 'min' ? '<' : '>'} ${p}`);
        await swap(index, parent);
        index = parent;
      } else {
        setMessage('Heap property satisfied');
        break;
      }
    }
    setComparingIndices([]);
  };

  const bubbleDown = async (idx: number) => {
    let curr = idx;
    while (true) {
      const n = heapRef.current.length;
      let target = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      const indicesToHighlight = [curr];
      if (left < n) indicesToHighlight.push(left);
      if (right < n) indicesToHighlight.push(right);
      setComparingIndices(indicesToHighlight);

      if (left < n) {
        const lVal = heapRef.current[left].value;
        const cVal = heapRef.current[target].value;
        if (heapType === 'min' ? lVal < cVal : lVal > cVal) {
          target = left;
        }
      }

      if (right < n) {
        const rVal = heapRef.current[right].value;
        const sVal = heapRef.current[target].value;
        if (heapType === 'min' ? rVal < sVal : rVal > sVal) {
          target = right;
        }
      }

      if (target !== curr) {
        setMessage(`Violated property at ${heapRef.current[curr].value}. Swapping with child ${heapRef.current[target].value}`);
        await swap(curr, target);
        curr = target;
      } else {
        setMessage('Heap property restored');
        break;
      }
    }
    setComparingIndices([]);
  };

  const insert = async (value: number) => {
    if (operation !== 'idle') return;
    setOperation('inserting');
    setMessage(`Inserting ${value} at the end of the heap...`);
    const newItem = { id: Math.random().toString(36).substr(2, 9), value };
    const newHeap = [...heapRef.current, newItem];
    setHeap(newHeap);
    play('insert');
    await wait();

    try {
      await bubbleUp(newHeap.length - 1);
    } catch (e) {}

    setOperation('idle');
  };

  const extractRoot = async () => {
    if (operation !== 'idle' || heapRef.current.length === 0) return;
    setOperation('extracting');
    const rootVal = heapRef.current[0].value;
    setMessage(`Extracting root value ${rootVal}`);
    await wait();

    const n = heapRef.current.length;
    if (n === 1) {
      setHeap([]);
      setSortedArray(prev => [...prev, rootVal]);
      play('delete');
    } else {
      // Swap root with last element
      setMessage(`Swapping root ${rootVal} with last element ${heapRef.current[n - 1].value}`);
      await swap(0, n - 1);
      
      const extracted = heapRef.current[n - 1];
      setHeap(prev => prev.slice(0, -1));
      setSortedArray(prev => [...prev, extracted.value]);
      play('delete');
      await wait();

      setMessage('Performing Heapify Down (Bubble Down)...');
      try {
        await bubbleDown(0);
      } catch (e) {}
    }

    setOperation('idle');
  };

  const toggleType = async () => {
    if (operation !== 'idle') return;
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);
    setMessage(`Switching to ${newType.toUpperCase()} heap. Rebuilding structure...`);
    
    // Naive rebuild for animation
    const items = [...heapRef.current];
    setHeap([]);
    setOperation('building');
    await wait(500);

    for (const item of items) {
      const currentItems = [...heapRef.current, item];
      setHeap(currentItems);
      await bubbleUp(currentItems.length - 1);
    }
    setOperation('idle');
  };

  return { 
    heap, 
    visualNodes: getLayout(heap), 
    heapType, 
    operation, 
    message, 
    comparingIndices, 
    sortedArray, 
    insert, 
    extractRoot, 
    speed, 
    setSpeed, 
    reset,
    toggleType
  };
};
