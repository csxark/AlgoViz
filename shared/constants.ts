
import { Network, Link2, Layers, ListEnd, Share2, Hash, Triangle, Zap, Brain, Globe, Briefcase, Code2, Cpu, BarChart, GitMerge, BarChart3, Scale, Grid3x3, Split, Table2, Navigation, Hexagon, Search, FileText } from 'lucide-react';
import { DataStructure, NavItem, ViewType } from './types';

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.15,
    medium: 0.5,
    slow: 0.8
  },
  easing: {
    spring: { type: 'spring', stiffness: 260, damping: 20 },
    easeInOut: [0.4, 0, 0.2, 1]
  }
};

export const DATA_STRUCTURES: DataStructure[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Master the Divide and Conquer strategy. Efficiently find elements in sorted datasets with logarithmic time complexity.',
    icon: Search
  },
  {
    id: 'convex-hull',
    title: 'Convex Hull',
    description: 'Visualize geometric algorithms like Graham Scan and Jarvis March to find the smallest polygon enclosing a set of points.',
    icon: Hexagon
  },
  {
    id: 'pathfinding',
    title: 'Pathfinding',
    description: 'Visualize how algorithms like Dijkstra, A*, and BFS find the shortest path between nodes in a grid.',
    icon: Navigation
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Master optimization problems by visualizing the DP table filling process, recurrence relations, and solution backtracking.',
    icon: Table2
  },
  {
    id: 'segment-tree',
    title: 'Segment Tree',
    description: 'Efficiently query ranges and update values using a hierarchical tree structure with lazy propagation.',
    icon: Split
  },
  {
    id: 'matrix',
    title: 'Matrix Operations',
    description: 'Visualize 2D array algorithms including Spiral Traversal, Rotation, Transpose, and Search in Sorted Matrix.',
    icon: Grid3x3
  },
  {
    id: 'avl-tree',
    title: 'AVL Tree',
    description: 'Master self-balancing binary search trees. Visualize rotations (LL, RR, LR, RL) that keep lookup times optimal.',
    icon: Scale
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Compare classic sorting algorithms like Quick Sort, Merge Sort, and Bubble Sort in real-time races.',
    icon: BarChart3
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    description: 'Explore hierarchical data structures where each node has at most two children.',
    icon: Network
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Visualize linear collections of data elements whose order is not given by their physical placement in memory.',
    icon: Link2
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'Understand the LIFO (Last In, First Out) principle with push and pop operations.',
    icon: Layers
  },
  {
    id: 'queue',
    title: 'Queue',
    description: 'Master the FIFO (First In, First Out) principle for scheduling and buffering.',
    icon: ListEnd
  },
  {
    id: 'hash-table',
    title: 'Hash Table',
    description: 'Learn how key-value pairs are stored and retrieved efficiently using hash functions.',
    icon: Hash
  },
  {
    id: 'heap',
    title: 'Min/Max Heap',
    description: 'Visualize priority queues and heap sort using complete binary trees.',
    icon: Triangle
  },
  {
    id: 'graph',
    title: 'Graph Algorithms',
    description: 'Navigate complex networks using BFS, DFS, and Dijkstra pathfinding algorithms.',
    icon: Share2
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    description: 'Efficiently store and retrieve keys in a dataset of strings. Essential for autocomplete systems.',
    icon: GitMerge
  }
];

export const CONCEPTS: Record<string, { concept: string; pseudocode: string }> = {
  'binary-search': {
    concept: 'Finds a target in a sorted array by halving the search space each step. Required: Sorted data.',
    pseudocode: `while low <= high:
  mid = (low + high) / 2
  if arr[mid] == target: return mid
  if arr[mid] < target: low = mid + 1
  else: high = mid - 1`
  },
  'stack': {
    concept: 'A Last-In, First-Out (LIFO) structure. Operations occur only at the top.',
    pseudocode: `class Stack:
  push(val): arr.add(val)
  pop(): return arr.removeLast()
  peek(): return arr.last()`
  },
  'queue': {
    concept: 'A First-In, First-Out (FIFO) structure. Insertion at rear, removal at front.',
    pseudocode: `class Queue:
  enqueue(val): arr.push(val)
  dequeue(): return arr.shift()
  front(): return arr[0]`
  },
  'linked-list': {
    concept: 'A linear collection of nodes where each node points to the next, allowing O(1) insertion.',
    pseudocode: `function reverse(head):
  prev = null, curr = head
  while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  return prev`
  },
  'binary-tree': {
    concept: 'A hierarchical structure where each node has at most two children.',
    pseudocode: `function insert(root, val):
  if !root: return Node(val)
  if val < root.val: 
    root.left = insert(root.left, val)
  else: 
    root.right = insert(root.right, val)
  return root`
  },
  'avl-tree': {
    concept: 'A self-balancing BST where the height difference of subtrees is at most 1.',
    pseudocode: `if balanceFactor > 1:
  if val < left.val: 
    return rightRotate(y)
  else:
    y.left = leftRotate(y.left)
    return rightRotate(y)`
  },
  'sorting': {
    concept: 'Bubble Sort: Repeatedly steps through the list, compares adjacent elements and swaps them.',
    pseudocode: `for i from 0 to n-1:
  for j from 0 to n-i-1:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])`
  },
  'graph': {
    concept: 'BFS uses a queue to explore neighbors layer by layer from a starting node.',
    pseudocode: `queue.push(start)
while !queue.isEmpty():
  u = queue.pop()
  for v in adj[u]:
    if !visited[v]:
      visited[v] = true
      queue.push(v)`
  },
  'hash-table': {
    concept: 'Maps keys to indices using a hash function. Collisions are handled via chaining or probing.',
    pseudocode: `function put(key, val):
  index = hash(key) % size
  bucket = table[index]
  for pair in bucket:
    if pair.key == key: pair.val = val; return
  bucket.add(key, val)`
  },
  'heap': {
    concept: 'A complete binary tree where the root is always the min/max element.',
    pseudocode: `function bubbleUp(i):
  parent = (i-1)/2
  if arr[i] < arr[parent]:
    swap(i, parent)
    bubbleUp(parent)`
  },
  'trie': {
    concept: 'A prefix tree used for efficient string retrieval and autocomplete.',
    pseudocode: `function insert(word):
  node = root
  for char in word:
    if !node.children[char]:
      node.children[char] = Node()
    node = node.children[char]
  node.isEnd = true`
  },
  'segment-tree': {
    concept: 'A tree for storing intervals. Allows range queries and updates in O(log n).',
    pseudocode: `function query(node, L, R):
  if range inside [L, R]: return tree[node]
  if range outside: return 0
  return query(left) + query(right)`
  },
  'matrix': {
    concept: 'Spiral Traversal: Iterates through a 2D array in a spiral clockwise direction.',
    pseudocode: `while top <= bottom and left <= right:
  // Move Right, then Down, 
  // then Left, then Up
  // Update boundary pointers`
  },
  'dp': {
    concept: 'LCS: Finds the longest sequence common to two strings using a 2D table.',
    pseudocode: `if s1[i] == s2[j]:
  dp[i][j] = 1 + dp[i-1][j-1]
else:
  dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
  },
  'pathfinding': {
    concept: 'Dijkstra: Finds the shortest path in a graph with non-negative edge weights.',
    pseudocode: `dist[start] = 0
pq.push(0, start)
while !pq.isEmpty():
  u = pq.pop()
  for v in neighbors[u]:
    if dist[u] + w < dist[v]:
      dist[v] = dist[u] + w
      pq.push(dist[v], v)`
  },
  'convex-hull': {
    concept: 'Graham Scan: Finds the smallest convex polygon containing all points.',
    pseudocode: `sort points by polar angle
stack.push(p1, p2)
for i from 3 to n:
  while crossProduct(next, top, p[i]) <= 0:
    stack.pop()
  stack.push(p[i])`
  }
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', view: 'landing' },
  { label: 'Documentation', view: 'documentation' },
  // { label: 'About', view: 'about' },
];

export const FEATURES = [
  {
    icon: Zap,
    title: 'Interactive Visualizations',
    desc: 'Don’t just read code. Watch algorithms execute step-by-step with smooth, high-frame-rate animations.'
  },
  {
    icon: Brain,
    title: 'AI Tutor Mode',
    desc: 'Stuck? Ask our Gemini-powered AI tutor for instant hints, complexity analysis, and code explanations.'
  },
  {
    icon: Globe,
    title: 'Real-World Examples',
    desc: 'Understand how data structures power the software you use daily, from browser history to social networks.'
  },
  {
    icon: Briefcase,
    title: 'Interview Ready',
    desc: 'Master the patterns and fundamental concepts needed to ace technical interviews at top tech companies.'
  }
];

export const TECH_STACK = [
  { name: 'React 18', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Gemini 3 Pro', category: 'AI Model' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'GSAP', category: 'Effects' }
];

export const STATS = [
  { value: '16+', label: 'Data Structures' },
  { value: 'AI', label: 'Real-Time Explanations' },
  { value: '100%', label: 'Free & Open Source' },
];
