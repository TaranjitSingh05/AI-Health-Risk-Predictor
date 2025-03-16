import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, Activity } from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className={`mx-auto rounded-full transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-6 py-3">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <Activity className="w-8 h-8 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-accent">
              Health Risk Predictor
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            {['/', '/about', '/contact'].map((path) => {
              const label = path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === path
                      ? 'bg-gradient-to-r from-primary to-primary-accent text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-accent'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary-bright" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;