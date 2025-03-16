import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden
      ${isDark ? 'bg-dark-bg text-white' : 'bg-gradient-to-br from-primary-pale to-primary-bright'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-primary-accent/20 animate-gradient"></div>
        {/* Floating circles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isDark ? 'bg-primary-accent' : 'bg-primary'} opacity-10`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Gradient mesh */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, 
            ${isDark ? 'rgba(87, 204, 153, 0.1)' : 'rgba(34, 87, 122, 0.1)'} 0%, 
            transparent 50%)`,
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md relative ${
          isDark ? 'bg-dark-bg/50' : 'bg-white/80'
        } backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {isLogin
                  ? 'Sign in to access your account'
                  : 'Sign up to get started with our platform'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-colors ${
                        isDark
                          ? 'bg-dark-bg border-gray-600 text-white focus:border-primary-accent'
                          : 'border-gray-300 focus:border-primary'
                      } border`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-colors ${
                        isDark
                          ? 'bg-dark-bg border-gray-600 text-white focus:border-primary-accent'
                          : 'border-gray-300 focus:border-primary'
                      } border`}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-500"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-accent text-white py-2 px-4 rounded-lg
                    flex items-center justify-center space-x-2 hover:from-primary-light hover:to-primary-bright
                    transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className={`inline-flex items-center space-x-2 text-sm ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              {isLogin ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Need an account? Sign up</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Already have an account? Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary-accent/10"></div>
          <div
            className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/30 to-primary-accent/30 blur-3xl"
            style={{ transform: 'rotate(-45deg)' }}
          ></div>
          <div
            className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-br from-primary-light/30 to-primary-bright/30 blur-3xl"
            style={{ transform: 'rotate(45deg)' }}
          ></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;