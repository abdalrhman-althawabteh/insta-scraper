import React, { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-yellow text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]",
    outline: "border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-brand-dark border-2 border-gray-800 text-white px-4 py-3 rounded-lg focus:border-brand-yellow focus:ring-0 transition-colors placeholder-gray-600 outline-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-brand-dark border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 8 }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="relative">
      <div className={`w-${size * 4} h-${size * 4} border-4 border-brand-yellow/20 rounded-full`}></div>
      <div className={`w-${size * 4} h-${size * 4} border-4 border-brand-yellow border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
    </div>
    <p className="text-gray-400 animate-pulse">Analyzing profile data...</p>
  </div>
);
