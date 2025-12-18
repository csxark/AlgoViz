
import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  onClick,
  disabled,
  ...props 
}) => {
  let play: any = () => {};
  try {
     const sound = useSound();
     play = sound.play;
  } catch(e) { }

  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus:outline-none rounded-full relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-brand-teal text-brand-darkest hover:bg-white shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]',
    secondary: 'bg-white/10 text-white hover:bg-brand-teal hover:text-brand-darkest border border-white/10',
    outline: 'border border-brand-teal/30 text-brand-teal hover:bg-brand-teal/5 backdrop-blur-sm',
    ghost: 'text-white/60 hover:text-brand-teal hover:bg-brand-teal/5'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] min-h-[32px]',
    md: 'px-6 py-3 text-[11px] min-h-[44px]',
    lg: 'px-8 py-4 text-[13px] min-h-[54px]'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      play('click');
      onClick?.(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
      disabled={disabled}
      {...props as any}
    >
      <span className="relative z-10 flex items-center">{children}</span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </motion.button>
  );
};
