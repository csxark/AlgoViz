
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../shared/components/Header';
import { ViewType } from '../../shared/types';
import { DATA_STRUCTURES } from '../../shared/constants';
import { 
  Terminal, 
  Search, 
  Code2, 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Zap, 
  Database,
  ArrowUpRight,
  // Fix: Added missing ArrowRight import
  ArrowRight
} from 'lucide-react';
import { Button } from '../../shared/components/Button';

// --- Types for Documentation Content ---
type Language = 'c' | 'cpp' | 'java' | 'python';

interface CodeSnippet {
  language: Language;
  code: string;
}

interface DocContent {
  id: ViewType;
  title: string;
  theory: string;
  complexity: {
    time: string;
    space: string;
  };
  snippets: CodeSnippet[];
}

// --- Content Database (Condensed for example, focusing on quality) ---
const DOC_DB: Record<string, DocContent> = {
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    theory: 'Binary Search is a classic divide-and-conquer algorithm. It finds the position of a target value within a sorted array by repeatedly halving the search interval.',
    complexity: { time: '$O(log_n)$', space: '$O(1)$' },
    snippets: [
      { language: 'python', code: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1' },
      { language: 'cpp', code: 'int binarySearch(int arr[], int l, int r, int x) {\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (arr[m] == x) return m;\n        if (arr[m] < x) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}' },
      { language: 'java', code: 'class BinarySearch {\n    int search(int arr[], int x) {\n        int l = 0, r = arr.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (arr[m] == x) return m;\n            if (arr[m] < x) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n}' },
      { language: 'c', code: 'int binarySearch(int arr[], int n, int x) {\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (arr[m] == x) return m;\n        if (arr[m] < x) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}' }
    ]
  },
  'stack': {
    id: 'stack',
    title: 'Linear Stack',
    theory: 'A stack is a Last-In, First-Out (LIFO) data structure where elements are added (pushed) and removed (popped) from the same end, called the top.',
    complexity: { time: '$O(1)$ per op', space: '$O(n)$ total' },
    snippets: [
      { language: 'python', code: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item): self.items.append(item)\n    def pop(self): return self.items.pop() if self.items else None' },
      { language: 'java', code: 'import java.util.Stack;\nStack<Integer> st = new Stack<>();\nst.push(10);\nst.pop();' },
      { language: 'cpp', code: '#include <stack>\nstd::stack<int> s;\ns.push(10);\ns.pop();' },
      { language: 'c', code: '#define MAX 100\nint stack[MAX];\nint top = -1;\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }' }
    ]
  },
  'linked-list': {
    id: 'linked-list',
    title: 'Singly Linked List',
    theory: 'A linked list consists of nodes where each node contains data and a reference to the next node. Unlike arrays, they are not stored contiguously in memory.',
    complexity: { time: '$O(n)$ search, $O(1)$ head insertion', space: '$O(n)$' },
    snippets: [
      { language: 'python', code: 'class Node:\n    def __init__(self, data): \n        self.data = data\n        self.next = None' },
      { language: 'java', code: 'class Node {\n    int data;\n    Node next;\n    Node(int d) { data = d; next = null; }\n}' },
      { language: 'cpp', code: 'struct Node {\n    int data;\n    Node* next;\n    Node(int d) : data(d), next(nullptr) {}\n};' },
      { language: 'c', code: 'struct Node {\n    int data;\n    struct Node* next;\n};' }
    ]
  }
};

// Fallback logic for structures not yet explicitly documented in this doc block
const getDocContent = (id: ViewType): DocContent => {
  return DOC_DB[id] || {
    id,
    title: DATA_STRUCTURES.find(ds => ds.id === id)?.title || 'Neural Protocol',
    theory: 'Technical analysis for this infrastructure protocol is currently being indexed by the AlgoViz core neural net.',
    complexity: { time: '$Pending$', space: '$Pending$' },
    snippets: [{ language: 'python', code: '# Protocol snippet loading...' }]
  };
};

export const DocumentationPage: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<ViewType>('binary-search');
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDoc = getDocContent(selectedId);
  const filteredDS = DATA_STRUCTURES.filter(ds => 
    ds.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FEFCFB] flex flex-col">
      <Header onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-24 h-screen overflow-hidden">
        
        {/* Sidebar: Protocol Manifest */}
        <aside className="w-full lg:w-80 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col shrink-0">
          <div className="p-6 border-b border-white/5">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f5ff]/50 group-focus-within:text-[#00f5ff] transition-colors" />
              <input 
                type="text" 
                placeholder="Find Protocol..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[#00f5ff]/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
            {filteredDS.map(ds => (
              <button
                key={ds.id}
                onClick={() => setSelectedId(ds.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden flex items-center space-x-3 ${
                  selectedId === ds.id ? 'bg-[#00f5ff]/10 border border-[#00f5ff]/30' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <ds.icon className={`w-4 h-4 ${selectedId === ds.id ? 'text-[#00f5ff]' : 'text-white/40'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedId === ds.id ? 'text-[#00f5ff]' : 'text-white/70'}`}>
                  {ds.title}
                </span>
                {selectedId === ds.id && (
                  <motion.div layoutId="doc-active-glow" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f5ff]" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content: High-Fidelity Docs */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar p-8 lg:p-12 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f5ff]/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Page Header */}
            <header className="space-y-4">
              <div className="flex items-center space-x-2 text-[#00f5ff]">
                <Terminal className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.4em]">Core Neural Index</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                  {currentDoc.title}
                </h1>
                <Button size="sm" variant="primary" onClick={() => onNavigate(selectedId)}>
                  Initialize Interactive Lab <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </header>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card-accent p-8 rounded-[2rem] border-[#00f5ff]/20">
                <div className="flex items-center space-x-3 mb-4 opacity-50">
                  <Clock className="w-4 h-4 text-[#00f5ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Time Analysis</span>
                </div>
                <div className="text-3xl font-black font-mono text-[#00f5ff]">{currentDoc.complexity.time}</div>
              </div>
              <div className="glass-card-accent p-8 rounded-[2rem] border-[#00f5ff]/20">
                <div className="flex items-center space-x-3 mb-4 opacity-50">
                  <Database className="w-4 h-4 text-[#00f5ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Space Index</span>
                </div>
                <div className="text-3xl font-black font-mono text-[#00f5ff]">{currentDoc.complexity.space}</div>
              </div>
            </div>

            {/* Theory Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <BookOpen className="w-4 h-4 text-[#00f5ff]" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Theoretical Protocol</h2>
              </div>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                {currentDoc.theory}
              </p>
            </section>

            {/* Polyglot Code Console */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <Code2 className="w-4 h-4 text-[#00f5ff]" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Neural Syntax implementations</h2>
              </div>
              
              <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                {/* Language Tabs */}
                <div className="flex bg-white/[0.02] border-b border-white/5 px-6">
                  {(['c', 'cpp', 'java', 'python'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                        activeLang === lang ? 'text-[#00f5ff]' : 'text-white/30 hover:text-white/60'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                      {activeLang === lang && (
                        <motion.div layoutId="lang-tab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#00f5ff]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="p-10 bg-black/40 font-mono text-sm leading-relaxed overflow-x-auto relative">
                  <div className="absolute top-4 right-8 flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                  <pre className="text-white/80">
                    <AnimatePresence mode="wait">
                      <motion.code
                        key={`${selectedId}-${activeLang}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="block"
                      >
                        {currentDoc.snippets.find(s => s.language === activeLang)?.code || '// Implementation indexed...'}
                      </motion.code>
                    </AnimatePresence>
                  </pre>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;
