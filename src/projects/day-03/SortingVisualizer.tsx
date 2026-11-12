import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Shuffle } from 'lucide-react';

type AlgorithmType = 'Bubble Sort' | 'Selection Sort' | 'Insertion Sort';

export const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(24);
  const [speed, setSpeed] = useState<number>(30); // ms delay
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('Bubble Sort');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);

  const stopSignalRef = useRef<boolean>(false);

  const generateRandomArray = (size = arraySize) => {
    stopSignalRef.current = true;
    setIsRunning(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);

    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 15);
    }
    setArray(newArr);
  };

  useEffect(() => {
    generateRandomArray(arraySize);
    return () => {
      stopSignalRef.current = true;
    };
  }, [arraySize]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Bubble Sort
  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopSignalRef.current) return;
        setComparingIndices([j, j + 1]);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await sleep(speed);
        }
        setSwappingIndices([]);
      }
      sorted.push(n - i - 1);
      setSortedIndices([...sorted]);
    }
    setComparingIndices([]);
  };

  // Selection Sort
  const selectionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (stopSignalRef.current) return;
        setComparingIndices([minIdx, j]);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        setSwappingIndices([i, minIdx]);
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        swapCount++;
        setSwaps(swapCount);
        setArray([...arr]);
        await sleep(speed);
      }
      sorted.push(i);
      setSortedIndices([...sorted]);
      setSwappingIndices([]);
    }
    setComparingIndices([]);
  };

  // Insertion Sort
  const insertionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;
    const sorted: number[] = [0];

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0) {
        if (stopSignalRef.current) return;
        setComparingIndices([j, j + 1]);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j] > key) {
          setSwappingIndices([j, j + 1]);
          arr[j + 1] = arr[j];
          swapCount++;
          setSwaps(swapCount);
          setArray([...arr]);
          await sleep(speed);
          j = j - 1;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      setArray([...arr]);
      sorted.push(i);
      setSortedIndices([...sorted]);
    }
    setComparingIndices([]);
    setSwappingIndices([]);
  };

  const handleStart = async () => {
    if (isRunning) {
      stopSignalRef.current = true;
      setIsRunning(false);
      return;
    }

    stopSignalRef.current = false;
    setIsRunning(true);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);

    if (selectedAlgo === 'Bubble Sort') {
      await bubbleSort();
    } else if (selectedAlgo === 'Selection Sort') {
      await selectionSort();
    } else if (selectedAlgo === 'Insertion Sort') {
      await insertionSort();
    } else {
      await bubbleSort();
    }

    setIsRunning(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        {/* Algorithm Select */}
        <div className="flex items-center gap-2">
          {(['Bubble Sort', 'Selection Sort', 'Insertion Sort'] as AlgorithmType[]).map((algo) => (
            <button
              key={algo}
              disabled={isRunning}
              onClick={() => setSelectedAlgo(algo)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedAlgo === algo
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              } disabled:opacity-50`}
            >
              {algo}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateRandomArray()}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" /> Randomize
          </button>

          <button
            onClick={handleStart}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause' : 'Start Sorting'}
          </button>
        </div>
      </div>

      {/* Sliders and Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Array Size */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Array Elements</span>
            <span className="font-mono text-emerald-400">{arraySize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            disabled={isRunning}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Speed Slider */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Step Delay (ms)</span>
            <span className="font-mono text-cyan-400">{speed}ms</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Comparisons */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">Comparisons</p>
            <p className="text-lg font-mono font-bold text-amber-400">{comparisons}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        </div>

        {/* Swaps */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">Array Swaps</p>
            <p className="text-lg font-mono font-bold text-rose-400">{swaps}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
        </div>
      </div>

      {/* Visualizer Canvas Bars */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[260px] flex items-end justify-center gap-1.5 overflow-hidden">
        {array.map((value, idx) => {
          const isComparing = comparingIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);

          let barColor = 'bg-slate-700 hover:bg-slate-600';
          if (isSorted) barColor = 'bg-emerald-500 shadow-sm shadow-emerald-500/40';
          if (isComparing) barColor = 'bg-amber-400 shadow-sm shadow-amber-400/50';
          if (isSwapping) barColor = 'bg-rose-500 shadow-sm shadow-rose-500/50 scale-105';

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end group transition-all duration-75"
              style={{ height: '100%' }}
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-75 ${barColor}`}
                style={{ height: `${value}%` }}
              />
              {arraySize <= 25 && (
                <span className="text-[9px] font-mono text-slate-500 mt-1 select-none">
                  {value}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-700" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400" />
          <span>Comparing Elements</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500" />
          <span>Swapping Values</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>Sorted In Position</span>
        </div>
      </div>
    </div>
  );
};
