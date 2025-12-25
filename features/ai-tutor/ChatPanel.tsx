
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image as ImageIcon, X, Sparkles, Loader2, Terminal, Info } from 'lucide-react';
import { generateTutorResponse, analyzeStructureImage, ChatMessage } from '../../services/ai';
import { useSound } from '../../shared/context/SoundContext';

interface ChatPanelProps {
  context: string;
  onHighlightNode?: (val: number) => void;
  onBuildStructure?: (values: number[]) => void;
}

// Custom renderer for technical tokens wrapped in $...$
const ProtocolText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\$[^\$]+\$)/g);
  
  return (
    <div className="leading-relaxed text-[13px]">
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const content = part.slice(1, -1);
          return (
            <span 
              key={i} 
              className="inline-block px-1.5 py-0 mx-0.5 rounded bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] font-black font-mono shadow-[0_0_8px_rgba(0,245,255,0.2)]"
            >
              {content}
            </span>
          );
        }
        return <span key={i} className="text-white/80">{part}</span>;
      })}
    </div>
  );
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ context, onHighlightNode, onBuildStructure }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hello! I'm your AI assistant. I can help answer questions about algorithms, data structures, and visualizations. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { play } = useSound();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    play('click');
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Filter out the initial greeting message from history for API
    const apiHistory = messages.filter(msg => 
      !(msg.role === 'model' && msg.text.includes("Hello! I'm your AI assistant"))
    );

    const response = await generateTutorResponse(
      apiHistory.slice(-5), 
      input, 
      context,
      onHighlightNode
    );

    setIsThinking(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    play('success');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [...prev, { role: 'user', text: `Uploaded image: ${file.name}` }]);
    setIsThinking(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const numbers = await analyzeStructureImage(base64);
      
      setIsThinking(false);
      if (numbers && numbers.length > 0) {
        setMessages(prev => [...prev, { role: 'model', text: `I found these numbers in the image: ${numbers.join(', ')}. ${onBuildStructure ? 'Building visualization...' : ''}` }]);
        if (onBuildStructure) onBuildStructure(numbers);
        play('success');
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "I couldn't find any numbers in that image. Try uploading a clearer image with visible numbers." }]);
        play('error');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <>
      {/* Glow Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,245,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-brand-darkest border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] transition-all"
        onClick={() => { setIsOpen(!isOpen); play('click'); }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} className="relative">
              <Terminal className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00f5ff] rounded-full animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Futuristic Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
            className="fixed top-24 bottom-28 right-6 left-6 sm:left-auto sm:w-[400px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.8)] z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#00f5ff]/10 rounded-xl border border-[#00f5ff]/20">
                  <Terminal className="w-4 h-4 text-[#00f5ff]" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#00f5ff]">AI Assistant</h3>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500/70 tracking-widest uppercase">Online</span>
                  </div>
                </div>
              </div>
              <Info className="w-4 h-4 text-white/20 cursor-help" />
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-[#00f5ff]/[0.02]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-white rounded-br-none border border-white/10'
                        : 'bg-black/40 border border-[#00f5ff]/20 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                    }`}
                  >
                    {msg.role === 'model' ? (
                      <ProtocolText text={msg.text} />
                    ) : (
                      <p className="text-[13px] text-white/90 font-medium">{msg.text}</p>
                    )}
                  </motion.div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-black/40 border border-[#00f5ff]/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-3">
                    <Loader2 className="w-3.5 h-3.5 text-[#00f5ff] animate-spin" />
                    <span className="text-[10px] font-black text-[#00f5ff]/60 uppercase tracking-widest">Processing</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Module */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="flex items-center space-x-2 bg-black/40 rounded-2xl p-2 border border-white/10 focus-within:border-[#00f5ff]/50 transition-all shadow-inner">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-white/30 hover:text-[#00f5ff] transition-all"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 focus:outline-none text-[13px] font-medium"
                />

                <button
                  onClick={toggleVoice}
                  className={`p-2.5 transition-all ${isListening ? 'text-red-500 animate-pulse' : 'text-white/30 hover:text-[#00f5ff]'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-[#00f5ff] rounded-xl text-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-20 disabled:grayscale"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[8px] text-center mt-4 uppercase tracking-[0.3em] font-black text-white/20">
                AI Assistant • Ready to Help
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
