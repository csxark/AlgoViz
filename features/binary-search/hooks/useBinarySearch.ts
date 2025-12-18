
import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchStep, ArrayElement } from '../types';
import { sleep } from '../../../shared/utils/time';
import { useSound } from '../../../shared/context/SoundContext';

const INITIAL_SIZE = 15;

export const useBinarySearch = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [step, setStep] = useState<SearchStep>({
    low: -1,
    high: -1,
    mid: null,
    message: 'Initialize a target to search.',
    found: false,
    notFound: false
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [target, setTarget] = useState<number | null>(null);

  const isMounted = useRef(true);
  const { play } = useSound();

  useEffect(() => {
    isMounted.current = true;
    generateArray();
    return () => { isMounted.current = false; };
  }, []);

  const generateArray = useCallback((size: number = INITIAL_SIZE) => {
    const raw = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    
    // Remove duplicates for cleaner visualizer demo
    const unique = Array.from(new Set(raw)).sort((a, b) => a - b);
    
    setArray(unique.map((v, i) => ({ id: `el-${i}-${Date.now()}`, value: v })));
    setStep({
      low: -1,
      high: -1,
      mid: null,
      message: 'New sorted array generated.',
      found: false,
      notFound: false
    });
    setIsRunning(false);
  }, []);

  const runSearch = async (targetValue: number) => {
    if (isRunning) return;
    setIsRunning(true);
    setTarget(targetValue);

    let low = 0;
    let high = array.length - 1;
    
    setStep({ low, high, mid: null, message: `Searching for ${targetValue}. Range: [${low}, ${high}]`, found: false, notFound: false });
    await sleep(speed);
    if (!isMounted.current) return;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      setStep({ low, high, mid, message: `Checking middle element at index ${mid}...`, found: false, notFound: false });
      play('click');
      await sleep(speed);
      if (!isMounted.current) return;

      if (array[mid].value === targetValue) {
        setStep({ low, high, mid, message: `Found ${targetValue} at index ${mid}!`, found: true, notFound: false });
        play('success');
        setIsRunning(false);
        return;
      }

      if (array[mid].value < targetValue) {
        setStep({ low, high, mid, message: `${array[mid].value} < ${targetValue}. Discarding left half.`, found: false, notFound: false });
        await sleep(speed);
        low = mid + 1;
      } else {
        setStep({ low, high, mid, message: `${array[mid].value} > ${targetValue}. Discarding right half.`, found: false, notFound: false });
        await sleep(speed);
        high = mid - 1;
      }

      if (low <= high) {
        setStep({ low, high, mid: null, message: `Updating range to [${low}, ${high}]`, found: false, notFound: false });
        await sleep(speed / 2);
      }
    }

    setStep({ low, high, mid: null, message: `${targetValue} not found in array.`, found: false, notFound: true });
    play('error');
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setStep({
      low: -1,
      high: -1,
      mid: null,
      message: 'Ready.',
      found: false,
      notFound: false
    });
  };

  return {
    array,
    step,
    isRunning,
    speed,
    setSpeed,
    generateArray,
    runSearch,
    reset
  };
};
