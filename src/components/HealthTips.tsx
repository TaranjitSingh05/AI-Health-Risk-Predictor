import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lightbulb, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Tip {
  id: number;
  title: string;
  content: string;
  category: 'nutrition' | 'fitness' | 'mental' | 'sleep' | 'general';
  source?: string;
  sourceUrl?: string;
}

const HealthTips: React.FC = () => {
  const { isDark } = useTheme();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const tips: Tip[] = [
    {
      id: 1,
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily. Proper hydration improves energy levels, brain function, and helps maintain healthy skin.',
      category: 'general',
      source: 'Mayo Clinic',
      sourceUrl: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256'
    },
    {
      id: 2,
      title: 'Mindful Eating',
      content: 'Pay attention to what and when you eat. Avoid distractions like TV during meals to prevent overeating and improve digestion.',
      category: 'nutrition',
      source: 'Harvard Health',
      sourceUrl: 'https://www.health.harvard.edu/staying-healthy/mindful-eating'
    },
    {
      id: 3,
      title: 'Regular Exercise',
      content: 'Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening activities twice weekly.',
      category: 'fitness',
      source: 'CDC',
      sourceUrl: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm'
    },
    {
      id: 4,
      title: 'Prioritize Sleep',
      content: "Adults should get 7-9 hours of quality sleep per night. Consistent sleep schedules help regulate your body's internal clock.",
      category: 'sleep',
      source: 'Sleep Foundation',
      sourceUrl: 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need'
    },
    {
      id: 5,
      title: 'Manage Stress',
      content: 'Practice stress-reduction techniques like deep breathing, meditation, or yoga. Chronic stress can lead to various health problems.',
      category: 'mental',
      source: 'American Psychological Association',
      sourceUrl: 'https://www.apa.org/topics/stress/manage-stress'
    },
    {
      id: 6,
      title: 'Balanced Diet',
      content: 'Include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats in your diet. Limit processed foods and added sugars.',
      category: 'nutrition',
      source: 'USDA',
      sourceUrl: 'https://www.myplate.gov/'
    },
    {
      id: 7,
      title: 'Regular Health Check-ups',
      content: 'Schedule regular preventive screenings and check-ups with your healthcare provider, even when you feel healthy.',
      category: 'general',
      source: 'CDC',
      sourceUrl: 'https://www.cdc.gov/prevention/index.html'
    }
  ];

  const nextTip = () => {
    setDirection(1);
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const prevTip = () => {
    setDirection(-1);
    setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
  };

  // Auto-rotate tips
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      nextTip();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [autoplay, currentTipIndex]);

  // Handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * -5;
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 5;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    setAutoplay(false);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
    setAutoplay(true);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'nutrition':
        return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'fitness':
        return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'mental':
        return isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800';
      case 'sleep':
        return isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-800';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  // Enhanced variants for 3D animations
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction > 0 ? 30 : -30,
      z: -200
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      z: 0
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction < 0 ? 30 : -30,
      z: -200
    })
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-lg p-4 mb-6 relative overflow-hidden`}
      style={{ 
        transformStyle: 'preserve-3d',
        transform: isHovering ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : 'perspective(1000px) rotateX(0) rotateY(0)',
        transition: 'transform 0.2s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        boxShadow: isDark 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 1px rgba(245, 158, 11, 0.2)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px 1px rgba(245, 158, 11, 0.1)'
      }}
    >
      {/* Header with 3D effect */}
      <div className="flex items-center mb-4" style={{ transform: 'translateZ(20px)' }}>
        <motion.div
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.2, 1, 1.2, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <Lightbulb className={`w-5 h-5 mr-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
        </motion.div>
        <h3 className="text-lg font-semibold">Health Tips</h3>
        <motion.div
          className="ml-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
        </motion.div>
      </div>
      
      {/* Tip Carousel with enhanced 3D effect */}
      <div className="relative h-48" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentTipIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 1.5
            }}
            className="absolute w-full"
            style={{ 
              transformStyle: "preserve-3d",
              transform: 'translateZ(10px)'
            }}
          >
            <motion.div 
              className="p-4 rounded-lg border border-opacity-20 h-full flex flex-col"
              whileHover={{ 
                boxShadow: isDark 
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                y: -5
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <motion.h4 
                  className="font-bold text-lg"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {tips[currentTipIndex].title}
                </motion.h4>
                <motion.span 
                  className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(tips[currentTipIndex].category)}`}
                  whileHover={{ scale: 1.1 }}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {tips[currentTipIndex].category}
                </motion.span>
              </div>
              <motion.p 
                className="text-sm flex-grow"
                style={{ transform: 'translateZ(5px)' }}
              >
                {tips[currentTipIndex].content}
              </motion.p>
              {tips[currentTipIndex].source && (
                <motion.div 
                  className="mt-2 text-xs flex items-center justify-end"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <span className="opacity-75">Source: {tips[currentTipIndex].source}</span>
                  {tips[currentTipIndex].sourceUrl && (
                    <motion.a 
                      href={tips[currentTipIndex].sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`ml-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline flex items-center`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </motion.a>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Controls with 3D effect */}
      <div className="flex justify-between mt-4" style={{ transform: 'translateZ(15px)' }}>
        <motion.button 
          onClick={prevTip}
          className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="Previous tip"
          whileHover={{ scale: 1.2, x: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        {/* Dots Indicator with 3D effect */}
        <div className="flex items-center space-x-1">
          {tips.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentTipIndex ? 1 : -1);
                setCurrentTipIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentTipIndex 
                  ? 'bg-emerald-500 w-4' 
                  : isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to tip ${index + 1}`}
              style={{ transform: index === currentTipIndex ? 'translateZ(5px)' : 'translateZ(0)' }}
            />
          ))}
        </div>
        
        <motion.button 
          onClick={nextTip}
          className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="Next tip"
          whileHover={{ scale: 1.2, x: 2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* 3D decorative elements */}
      <motion.div 
        className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br from-amber-300 to-amber-600"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{ filter: 'blur(8px)' }}
      />
      <motion.div 
        className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-10 bg-gradient-to-br from-emerald-300 to-emerald-600"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{ filter: 'blur(8px)' }}
      />
    </motion.div>
  );
};

export default HealthTips; 