import React from 'react';
import { Activity, Brain, Shield, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 
      ${isDark ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]'}`}>
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#84fab0]/20 to-[#8fd3f4]/20 animate-gradient"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b6b] to-[#feca57]">
                About Us
              </span>
            </h1>
            <p className={`mt-4 text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Revolutionizing healthcare through artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className={`${isDark ? 'bg-[#1a1a2e]/50' : 'bg-white/80'} backdrop-blur-md rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Our Mission</h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                We're dedicated to making advanced healthcare diagnostics accessible to everyone. 
                Our AI-powered platform combines cutting-edge technology with medical expertise 
                to provide accurate health risk assessments and early disease detection.
              </p>
            </div>
            <div className={`${isDark ? 'bg-[#1a1a2e]/50' : 'bg-white/80'} backdrop-blur-md rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Our Vision</h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                We envision a future where preventive healthcare is powered by AI, enabling 
                early intervention and better health outcomes for people worldwide. Our goal 
                is to make healthcare more proactive than reactive.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, title: 'AI-Powered', desc: 'Advanced machine learning algorithms for accurate predictions' },
              { icon: Shield, title: 'Secure', desc: 'Your health data is protected with enterprise-grade security' },
              { icon: Activity, title: 'Accurate', desc: 'High precision in disease detection and risk assessment' },
              { icon: Users, title: 'Accessible', desc: 'Healthcare insights available to everyone, anywhere' }
            ].map((item, index) => (
              <div key={index} className={`${isDark ? 'bg-[#1a1a2e]/50' : 'bg-white/80'} backdrop-blur-md rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300`}>
                <item.icon className="w-12 h-12 text-[#ff6b6b] mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;