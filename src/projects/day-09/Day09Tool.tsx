import React, { useState, useId } from 'react';
import { Play, RotateCcw, Search, Plus, Sparkles, Network } from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

export const Day09Tool: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(() => {
    // Initial balanced tree: 50, 30, 70, 20, 40, 60, 80
    return {
      val: 50,
      left: {
        val: 30,
        left: { val: 20, left: null, right: null },
        right: { val: 40, left: null, right: null },
      },
      right: {
        val: 70,
        left: { val: 60, left: null, right: null },
        right: { val: 80, left: null, right: null },
      },
    };
  });

  const [inputVal, setInputVal] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>('');
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [traversalResult, setTraversalResult] = useState<{ type: string; values: number[] } | null>(null);
  const [message, setMessage] = useState<string>('Binary Search Tree initialized with 7 nodes.');

  const baseSvgId = useId();

  // Insert helper
  const insertNode = (current: TreeNode | null, val: number): TreeNode => {
    if (!current) return { val, left: null, right: null };
    if (val < current.val) {
      current.left = insertNode(current.left, val);
    } else if (val > current.val) {
      current.right = insertNode(current.right, val);
    }
    return current;
  };

  const handleInsert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(inputVal, 10);
    if (isNaN(num)) return;

    setRoot((prev) => {
      const cloned = prev ? JSON.parse(JSON.stringify(prev)) : null;
      return insertNode(cloned, num);
    });

    setHighlightedNode(num);
    setMessage(`Inserted ${num} into the BST.`);
    setInputVal('');
  };

  // Search helper
  const handleSearch = () => {
    const target = parseInt(searchVal, 10);
    if (isNaN(target) || !root) return;

    let curr: TreeNode | null = root;
    let found = false;

    while (curr) {
      if (curr.val === target) {
        found = true;
        break;
      }
      if (target < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    if (found) {
      setHighlightedNode(target);
      setMessage(`Found ${target} in the BST!`);
    } else {
      setHighlightedNode(null);
      setMessage(`Value ${target} does not exist in the BST.`);
    }
  };

  // Traversal helpers
  const handleInOrder = () => {
    const list: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      traverse(node.left);
      list.push(node.val);
      traverse(node.right);
    };
    traverse(root);
    setTraversalResult({ type: 'In-Order (Left, Root, Right → Always Sorted)', values: list });
    setMessage('In-Order traversal yields values in monotonically ascending order.');
  };

  const handlePreOrder = () => {
    const list: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      list.push(node.val);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(root);
    setTraversalResult({ type: 'Pre-Order (Root, Left, Right)', values: list });
  };

  const handlePostOrder = () => {
    const list: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      list.push(node.val);
    };
    traverse(root);
    setTraversalResult({ type: 'Post-Order (Left, Right, Root)', values: list });
  };

  // Randomize Tree
  const handleRandomize = () => {
    const values = [45, 25, 75, 15, 35, 65, 85, 10, 95];
    let newRoot: TreeNode | null = null;
    for (const v of values) {
      newRoot = insertNode(newRoot, v);
    }
    setRoot(newRoot);
    setHighlightedNode(null);
    setTraversalResult(null);
    setMessage('Generated new balanced sample BST.');
  };

  // Clear Tree
  const handleClear = () => {
    setRoot(null);
    setHighlightedNode(null);
    setTraversalResult(null);
    setMessage('Tree cleared.');
  };

  // Layout calculations for rendering
  interface RenderNode {
    val: number;
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
  }

  const renderNodes: RenderNode[] = [];
  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    spread: number,
    parentX?: number,
    parentY?: number
  ) => {
    if (!node) return;
    renderNodes.push({ val: node.val, x, y, parentX, parentY });
    if (node.left) {
      calculatePositions(node.left, x - spread, y + 60, spread / 2, x, y);
    }
    if (node.right) {
      calculatePositions(node.right, x + spread, y + 60, spread / 2, x, y);
    }
  };

  if (root) {
    calculatePositions(root, 300, 45, 130);
  }

  // Tree stats
  const getStats = (node: TreeNode | null): { count: number; height: number } => {
    if (!node) return { count: 0, height: 0 };
    const left = getStats(node.left);
    const right = getStats(node.right);
    return {
      count: 1 + left.count + right.count,
      height: 1 + Math.max(left.height, right.height),
    };
  };

  const stats = getStats(root);

  return (
    <div className="space-y-6">
      {/* Control Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        {/* Insert and Search Form */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Insert */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Value"
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={handleInsert}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Insert
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="number"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Target"
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </div>

        {/* Action presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Reset Sample
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Traversal Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Play className="w-3 h-3 text-emerald-400" /> Traversals:
          </span>
          <button
            onClick={handleInOrder}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium transition-colors"
          >
            In-Order (Sorted)
          </button>
          <button
            onClick={handlePreOrder}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Pre-Order
          </button>
          <button
            onClick={handlePostOrder}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Post-Order
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-slate-400">
          <span>Nodes: <strong className="text-white font-mono">{stats.count}</strong></span>
          <span>Height: <strong className="text-emerald-400 font-mono">{stats.height}</strong></span>
        </div>
      </div>

      {/* Traversal Result Card */}
      {traversalResult && (
        <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            {traversalResult.type} Output:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {traversalResult.values.map((v, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-100 font-bold"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas Tree Visualization */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto min-h-[320px] flex items-center justify-center relative">
        {!root ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Network className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs">Tree is currently empty. Insert values or click 'Reset Sample'.</p>
          </div>
        ) : (
          <svg width="600" height="280" className="overflow-visible select-none">
            {/* Connecting Lines */}
            {renderNodes.map((n, idx) => {
              if (n.parentX === undefined || n.parentY === undefined) return null;
              return (
                <line
                  key={`line-${idx}-${baseSvgId}`}
                  x1={n.parentX}
                  y1={n.parentY}
                  x2={n.x}
                  y2={n.y}
                  stroke="#334155"
                  strokeWidth="2"
                />
              );
            })}

            {/* Tree Nodes */}
            {renderNodes.map((n) => {
              const isHighlight = highlightedNode === n.val;
              return (
                <g key={`node-${n.val}-${baseSvgId}`} className="cursor-pointer transition-all">
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="19"
                    className={`transition-all duration-200 ${
                      isHighlight
                        ? 'fill-emerald-500 stroke-emerald-300 stroke-[3px] drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                        : 'fill-slate-900 stroke-slate-700 hover:stroke-slate-500 stroke-2'
                    }`}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    className={`text-xs font-mono font-bold select-none pointer-events-none ${
                      isHighlight ? 'fill-slate-950' : 'fill-slate-100'
                    }`}
                  >
                    {n.val}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Status banner */}
      <div className="text-xs text-slate-400 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
        <span>{message}</span>
        <span className="font-mono text-[11px] text-emerald-400">Search: O(log N) average</span>
      </div>
    </div>
  );
};
