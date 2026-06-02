
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'brown';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#FF8C00] text-white shadow-md",
    outline: "border-2 border-[#4e342e] text-[#4e342e]",
    brown: "bg-[#4e342e] text-[#f3e5d8] shadow-md"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs md:text-sm",
    md: "px-6 py-3 text-sm md:text-base",
    lg: "px-8 py-4 text-lg md:text-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
