import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Header } from '../../shared/components/Header';
import { ViewType } from '../../shared/types';
import { DATA_STRUCTURES } from '../../shared/constants';
import { DOC_DB, DocContent, Language } from './data'; 
import { Button } from '../../shared/components/Button';
import { 
  Terminal, 
  Search, 
  Code2, 
  BookOpen, 
  Clock, 
  Database,
  ArrowRight,
  Menu,
  X,
  Zap,
  Info,
  Copy,
  Check
} from 'lucide-react';

// Fallback if data is missing for a specific ID
const getDocContent = (id: ViewType): DocContent => DOC_DB[id] || {
  id,
  title: DATA_STRUCTURES.find(ds => ds.id === id)?.title || 'Neural Protocol',
  theory: 'Technical analysis for this infrastructure protocol is currently being indexed by the AlgoViz core neural net.',
  operations: ['Protocol Scanning...'],
  complexity: { time: ' Pending ', space: ' Pending ' },
  snippets: [{ language: 'python', code: '# Protocol snippet loading...' }]
};

export const DocumentationPage: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<ViewType>('binary-search');
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDoc = getDocContent(selectedId);
  const filteredDS = DATA_STRUCTURES.filter(ds => ds.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectProtocol = (id: ViewType) => {
    setSelectedId(id);
    setIsSidebarOpen(false);
    setCopied(false); // Reset copy state on switch
  };

  const handleCopy = () => {
    const code = currentDoc.snippets.find(s => s.language === activeLang)?.code;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FEFCFB] flex flex-col">
      <Header onNavigate={onNavigate} />
      
      <div className="flex-1 flex pt-24 h-screen overflow-hidden relative">
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 left-6 z-50 p-4 bg-[#00f5ff] text-black rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Sidebar: Protocol Manifest */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-[#0a0a0a] border-r border-white/5 transition-transform duration-300 transform
           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 flex flex-col shrink-0
        `}>
          <div className="p-6 border-b border-white/5 pt-28 lg:pt-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f5ff]/50" />
              <input 
                type="text" placeholder="Find Protocol..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#00f5ff]/50 transition-all placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
            {filteredDS.map(ds => (
              <button
                key={ds.id}
                onClick={() => selectProtocol(ds.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group flex items-center space-x-3 ${
                  selectedId === ds.id ? 'bg-[#00f5ff]/10 border border-[#00f5ff]/30' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <ds.icon className={`w-4 h-4 ${selectedId === ds.id ? 'text-[#00f5ff]' : 'text-white/40 group-hover:text-white/70'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedId === ds.id ? 'text-[#00f5ff]' : 'text-white/70 group-hover:text-white'}`}>
                  {ds.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar p-6 lg:p-12 relative">
          <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 pb-24">
            
            <header className="space-y-4">
              <div className="flex items-center space-x-2 text-[#00f5ff]">
                <Terminal className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core Neural Index</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                  {currentDoc.title}
                </h1>
                <Button size="sm" variant="primary" onClick={() => onNavigate(selectedId)}>
                  Initialize Lab <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="glass-card-accent p-6 lg:p-8 rounded-2xl border-[#00f5ff]/20 hover:border-[#00f5ff]/40 transition-colors">
                <div className="flex items-center space-x-3 mb-4 opacity-50">
                  <Clock className="w-4 h-4 text-[#00f5ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Time Analysis</span>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono text-[#00f5ff]">{currentDoc.complexity.time}</div>
              </div>
              <div className="glass-card-accent p-6 lg:p-8 rounded-2xl border-[#00f5ff]/20 hover:border-[#00f5ff]/40 transition-colors">
                <div className="flex items-center space-x-3 mb-4 opacity-50">
                  <Database className="w-4 h-4 text-[#00f5ff]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Space Index</span>
                </div>
                <div className="text-2xl lg:text-3xl font-black font-mono text-[#00f5ff]">{currentDoc.complexity.space}</div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[#00f5ff]">
                <BookOpen className="w-4 h-4" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Theoretical Protocol</h2>
              </div>
              <p className="text-lg text-white/60 leading-relaxed font-medium max-w-3xl">{currentDoc.theory}</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[#00f5ff]">
                <Zap className="w-4 h-4" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Primary Operations</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentDoc.operations.map((op, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-colors cursor-default">
                    {op}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-[#00f5ff]">
                <Code2 className="w-4 h-4" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Code Implementation</h2>
              </div>
              
              <div className="glass-card rounded-[1.5rem] lg:rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl bg-[#050505]">
                <div className="flex bg-white/[0.02] border-b border-white/5 overflow-x-auto custom-scrollbar">
                  {(['c', 'cpp', 'java', 'python'] as Language[]).map(lang => (
                    <button
                      key={lang} onClick={() => setActiveLang(lang)}
                      className={`px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
                        activeLang === lang ? 'text-[#00f5ff] bg-white/5' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
                      {activeLang === lang && (
                        <motion.div layoutId="langUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f5ff] shadow-[0_0_10px_#00f5ff]" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="relative group">
                  <div className="absolute right-4 top-4 z-10">
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all backdrop-blur-sm group-hover:opacity-100 opacity-0"
                      title="Copy Code"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#00f5ff]" /> : <Copy className="w-4 h-4 text-white/50" />}
                    </button>
                  </div>

                  <div className="text-xs lg:text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                    <SyntaxHighlighter
                      language={activeLang === 'c' ? 'cpp' : activeLang}
                      style={vscDarkPlus}
                      customStyle={{ 
                        background: 'transparent', 
                        margin: 0, 
                        padding: '2.5rem',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#333', textAlign: 'right' }}
                      wrapLines={true}
                    >
                      {currentDoc.snippets.find(s => s.language === activeLang)?.code || ''}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="pt-12 border-t border-white/5 flex items-center space-x-4 opacity-20 hover:opacity-40 transition-opacity">
               <Info className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Documentation Ref: ALGO-VIZ-2025-INDEX</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;