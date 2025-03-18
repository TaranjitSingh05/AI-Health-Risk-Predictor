import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  clickable = false,
  onClick
}) => {
  const { isDark, theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? theme.card : '#ffffff',
        boxShadow: isDark 
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      whileHover={hoverable ? { y: -5, boxShadow: isDark 
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.06)'
      } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      {children}
    </div>
  );
}; 