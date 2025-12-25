
import React, { useState } from 'react';
import { Layers, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { ViewType } from '../types';

interface HeaderProps {
  onNavigate?: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMuted, toggleMute } = useSound();

  const handleNavClick = (view: ViewType) => {
    if (onNavigate) {
      onNavigate(view);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <nav className="glass-card rounded-2xl px-6 h-16 flex items-center justify-between border-white/5 bg-black/40 backdrop-blur-xl">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center space-x-3 focus:outline-none group"
          >
            <div className="p-2 bg-[#00f5ff]/10 rounded-xl group-hover:bg-[#00f5ff]/20 transition-all duration-300 border border-[#00f5ff]/20">
              <Layers className="w-5 h-5 text-[#00f5ff]" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-extrabold text-white tracking-tighter uppercase">
                ALGO<span className="text-[#00f5ff]">VIZ</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#00f5ff]/50 font-black">2025 Protocol</span>
            </div>
          </button>

          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#00f5ff]/70 hover:text-[#00f5ff] transition-all relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00f5ff] transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              {/* Sound Toggle */}
              <button 
                onClick={toggleMute}
                className="p-2 text-[#00f5ff]/60 hover:text-[#00f5ff] transition-all rounded-xl hover:bg-white/5"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white rounded-xl hover:bg-white/5"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 max-w-7xl mx-auto px-4"
          >
            <div className="glass-card rounded-2xl p-4 space-y-2 border-white/5 bg-black/90 backdrop-blur-2xl shadow-2xl">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-white/70 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5 transition-all text-xs font-black uppercase tracking-widest"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
