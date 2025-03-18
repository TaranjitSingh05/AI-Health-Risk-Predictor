import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  ...rest
}) => {
  const { isDark, theme } = useTheme();

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-lg',
    lg: 'text-base px-6 py-2.5 rounded-xl'
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.gradient,
          color: 'white',
          border: 'none',
          hover: isDark ? 'brightness-110' : 'brightness-105',
        };
      case 'secondary':
        return {
          background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          color: isDark ? theme.text : theme.subtext,
          border: 'none',
          hover: isDark ? 'bg-opacity-20' : 'bg-opacity-10',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: isDark ? theme.primary : theme.primary,
          border: `1px solid ${isDark ? theme.primary : theme.primary}`,
          hover: isDark ? 'bg-primary/10' : 'bg-primary/5',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: isDark ? theme.text : theme.subtext,
          border: 'none',
          hover: isDark ? 'bg-white/5' : 'bg-black/5',
        };
      case 'danger':
        return {
          background: isDark ? theme.error + '30' : theme.error + '10',
          color: theme.error,
          border: 'none',
          hover: isDark ? 'bg-opacity-40' : 'bg-opacity-20',
        };
      default:
        return {
          background: theme.gradient,
          color: 'white',
          border: 'none',
          hover: 'brightness-105',
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <motion.button
      className={`
        font-medium transition-all flex items-center justify-center gap-2
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        background: variantStyle.background,
        color: variantStyle.color,
        border: variantStyle.border,
      }}
      whileHover={!disabled && !isLoading ? { filter: variantStyle.hover } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
};

export default Button; 