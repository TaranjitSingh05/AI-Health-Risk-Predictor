import React, { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import SplineBackground from './SplineBackground';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  usesSpline?: boolean;
  splineUrl?: string;
  fullWidth?: boolean;
  showChatbot?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  usesSpline = true,
  splineUrl = 'https://prod.spline.design/cf4MsIbK0vltZaMO/scene.splinecode',
  fullWidth = false,
  showChatbot = true,
  className = ''
}) => {
  const { isDark, theme } = useTheme();

  return (
    <div className="min-h-screen relative" style={{ 
      backgroundColor: isDark ? theme.background : '#ffffff',
      color: isDark ? theme.text : theme.text
    }}>
      {usesSpline && <SplineBackground url={splineUrl} />}
      <Navbar />

      <main className={`pt-24 pb-16 ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={fullWidth ? 'w-full' : 'container mx-auto px-4 sm:px-6 lg:px-8'}
        >
          {children}
        </motion.div>
      </main>

      {showChatbot && <Chatbot />}
    </div>
  );
};

export default Layout; 