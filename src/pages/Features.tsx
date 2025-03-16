import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Home as HomePage } from './Home';

const Features = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = React.useState('disease');

  return (
    <div className={`min-h-screen transition-colors duration-200 
      ${isDark ? 'bg-dark-bg text-gray-100' : 'bg-[#faf7f2]'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-accent/5" />
        {/* Animated circles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle at center, 
                ${i % 2 === 0 ? '#57CC99' : '#22577A'}, 
                transparent)`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${i * -2}s`
            }}
          />
        ))}
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setActiveTab('disease')}
            className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300
              transform hover:scale-105 hover:shadow-lg ${
              activeTab === 'disease'
                ? 'bg-gradient-to-r from-primary to-primary-accent text-white shadow-[0_0_20px_rgba(87,204,153,0.3)]'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            <span>Disease Detection</span>
          </button>
          <button
            onClick={() => setActiveTab('stroke')}
            className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300
              transform hover:scale-105 hover:shadow-lg ${
              activeTab === 'stroke'
                ? 'bg-gradient-to-r from-primary to-primary-accent text-white shadow-[0_0_20px_rgba(87,204,153,0.3)]'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span>Stroke Risk Assessment</span>
          </button>
        </div>

        <HomePage activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Features;