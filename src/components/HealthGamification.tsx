import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Award, Star, Trophy, Target, Heart, Zap, Activity, TrendingUp, Medal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
}

interface HealthGamificationProps {
  userId?: string;
}

const HealthGamification: React.FC<HealthGamificationProps> = ({ userId }) => {
  const { isDark } = useTheme();
  const [healthPoints, setHealthPoints] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [showAchievementPopup, setShowAchievementPopup] = useState<boolean>(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_chat',
      title: 'Health Explorer',
      description: 'Started your first conversation with the health assistant',
      icon: Heart,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      points: 50
    },
    {
      id: 'risk_assessment',
      title: 'Risk Analyzer',
      description: 'Completed your first health risk assessment',
      icon: Activity,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      points: 100
    },
    {
      id: 'streak_3',
      title: 'Health Enthusiast',
      description: 'Used the app for 3 consecutive days',
      icon: Zap,
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      points: 150
    },
    {
      id: 'chat_master',
      title: 'Conversation Master',
      description: 'Had 10 meaningful conversations with the health assistant',
      icon: Star,
      unlocked: false,
      progress: 2,
      maxProgress: 10,
      points: 200
    },
    {
      id: 'health_guru',
      title: 'Health Guru',
      description: 'Reached level 5 in your health journey',
      icon: Trophy,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      points: 500
    }
  ]);

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
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Simulate unlocking an achievement
  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          setUnlockedAchievement(achievement);
          setShowAchievementPopup(true);
          setHealthPoints(prev => prev + achievement.points);
          
          // Hide popup after 3 seconds
          setTimeout(() => {
            setShowAchievementPopup(false);
          }, 3000);
          
          return { ...achievement, unlocked: true, progress: achievement.maxProgress };
        }
        return achievement;
      })
    );
  };

  // Update progress for an achievement
  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const newProgress = Math.min(achievement.progress + progress, achievement.maxProgress);
          
          // If reached max progress, unlock the achievement
          if (newProgress >= achievement.maxProgress) {
            unlockAchievement(achievementId);
            return { ...achievement, progress: achievement.maxProgress };
          }
          
          return { ...achievement, progress: newProgress };
        }
        return achievement;
      })
    );
  };

  // Calculate level based on points
  useEffect(() => {
    const newLevel = Math.floor(healthPoints / 200) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      
      // Check if health guru achievement should be unlocked
      if (newLevel >= 5) {
        unlockAchievement('health_guru');
      }
    }
  }, [healthPoints, level]);

  // For demo purposes, unlock first achievement after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!achievements.find(a => a.id === 'first_chat')?.unlocked) {
        unlockAchievement('first_chat');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

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
      whileHover={{ boxShadow: isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {/* Health Points and Level Display */}
      <div className="flex justify-between items-center mb-4" style={{ transform: 'translateZ(20px)' }}>
        <div>
          <h3 className="text-lg font-semibold">Health Journey</h3>
          <p className="text-sm opacity-75">Track your progress and earn rewards</p>
        </div>
        <div className="flex items-center">
          <motion.div 
            className={`flex items-center px-3 py-1 rounded-full ${isDark ? 'bg-emerald-900' : 'bg-emerald-100'}`}
            whileHover={{ scale: 1.05 }}
            style={{ transform: 'translateZ(30px)' }}
          >
            <Heart className={`w-4 h-4 mr-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className="font-bold">{healthPoints} HP</span>
          </motion.div>
          <motion.div 
            className={`ml-2 flex items-center px-3 py-1 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}
            whileHover={{ scale: 1.05 }}
            style={{ transform: 'translateZ(30px)' }}
          >
            <Star className={`w-4 h-4 mr-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="font-bold">Level {level}</span>
          </motion.div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4" style={{ transform: 'translateZ(15px)' }}>
        <div className="flex justify-between text-xs mb-1">
          <span>Progress to Level {level + 1}</span>
          <span>{healthPoints % 200}/200</span>
        </div>
        <div className={`h-2 w-full rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" 
            style={{ width: `${(healthPoints % 200) / 2}%` }}
            initial={{ width: '0%' }}
            animate={{ width: `${(healthPoints % 200) / 2}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>
      
      {/* Achievements */}
      <div style={{ transform: 'translateZ(10px)' }}>
        <h4 className="font-medium mb-2">Achievements</h4>
        <div className="space-y-2">
          {achievements.map((achievement) => (
            <motion.div 
              key={achievement.id}
              className={`flex items-center p-2 rounded-lg transition-all ${
                achievement.unlocked 
                  ? isDark ? 'bg-gray-700' : 'bg-gray-100' 
                  : isDark ? 'bg-gray-900 opacity-60' : 'bg-gray-50 opacity-60'
              }`}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div 
                className={`p-2 rounded-full mr-3 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                whileHover={{ rotate: achievement.unlocked ? 10 : 0 }}
              >
                <achievement.icon className={`w-5 h-5 ${
                  achievement.unlocked ? 'text-white' : isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </motion.div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{achievement.title}</span>
                  <span className="text-xs opacity-75">+{achievement.points} HP</span>
                </div>
                <p className="text-xs opacity-75">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="mt-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className={`h-1 w-full rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" 
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievementPopup && unlockedAchievement && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ y: -50, opacity: 0, scale: 0.8, rotateY: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-20 right-6 z-50"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <div className={`p-4 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 border-emerald-500`}>
              <div className="flex items-center">
                <motion.div 
                  className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mr-3"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    times: [0, 0.5, 1],
                    repeat: 1
                  }}
                >
                  <Trophy className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <div className="text-sm font-bold text-emerald-500">Achievement Unlocked!</div>
                  <div className="font-semibold">{unlockedAchievement.title}</div>
                  <div className="text-xs opacity-75">{unlockedAchievement.description}</div>
                  <motion.div 
                    className="text-xs font-bold text-emerald-500 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    +{unlockedAchievement.points} Health Points
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HealthGamification;

// Export utility functions to be used in other components
export const useHealthGamification = () => {
  // This hook can be used in other components to interact with the gamification system
  const triggerAchievement = (achievementId: string) => {
    // In a real app, this would communicate with a central state management system
    // For now, we'll just dispatch a custom event
    const event = new CustomEvent('health-achievement', { 
      detail: { achievementId } 
    });
    window.dispatchEvent(event);
  };
  
  const addHealthPoints = (points: number) => {
    const event = new CustomEvent('health-points', { 
      detail: { points } 
    });
    window.dispatchEvent(event);
  };
  
  return {
    triggerAchievement,
    addHealthPoints
  };
}; 