import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradient: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    background: '#ffffff',
    card: '#f9fafb',
    text: '#1f2937',
    subtext: '#4b5563',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const [theme, setTheme] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    background: '#ffffff',
    card: '#f9fafb',
    text: '#1f2937',
    subtext: '#4b5563',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  });

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and update theme colors
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme({
        primary: '#818cf8',
        secondary: '#34d399',
        accent: '#c4b5fd',
        background: '#121212',
        card: '#1e1e1e',
        text: '#f3f4f6',
        subtext: '#9ca3af',
        border: '#2d2d2d',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        gradient: 'linear-gradient(135deg, #818cf8 0%, #c4b5fd 100%)'
      });
    } else {
      document.documentElement.classList.remove('dark');
      setTheme({
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#8b5cf6',
        background: '#ffffff',
        card: '#f9fafb',
        text: '#1f2937',
        subtext: '#4b5563',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
      });
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);