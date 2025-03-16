import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useHealthGamification } from './HealthGamification';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DailyChallenge: React.FC = () => {
  const { isDark } = useTheme();
  const { addHealthPoints } = useHealthGamification();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [showCompletionAnimation, setShowCompletionAnimation] = useState<boolean>(false);
  const [completedPoints, setCompletedPoints] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Generate daily challenges
  useEffect(() => {
    const allChallenges = [
      {
        id: 'water_intake',
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses of water today',
        points: 50,
        difficulty: 'easy'
      },
      {
        id: 'steps_count',
        title: 'Step Challenge',
        description: 'Take at least 8,000 steps today',
        points: 75,
        difficulty: 'medium'
      },
      {
        id: 'meditation',
        title: 'Mindful Moment',
        description: 'Practice meditation for 10 minutes',
        points: 60,
        difficulty: 'easy'
      },
      {
        id: 'nutrition',
        title: 'Balanced Diet',
        description: 'Eat at least 3 servings of vegetables today',
        points: 70,
        difficulty: 'medium'
      },
      {
        id: 'sleep',
        title: 'Sleep Well',
        description: 'Get 7-8 hours of sleep tonight',
        points: 80,
        difficulty: 'medium'
      },
      {
        id: 'workout',
        title: 'Active Living',
        description: 'Complete a 30-minute workout session',
        points: 100,
        difficulty: 'hard'
      },
      {
        id: 'sugar_free',
        title: 'Sugar Detox',
        description: 'Avoid added sugars for the entire day',
        points: 90,
        difficulty: 'hard'
      },
      {
        id: 'posture',
        title: 'Posture Perfect',
        description: 'Practice good posture throughout the day',
        points: 60,
        difficulty: 'easy'
      },
      {
        id: 'screen_time',
        title: 'Digital Detox',
        description: 'Reduce screen time by 1 hour today',
        points: 70,
        difficulty: 'medium'
      }
    ];
    
    // Randomly select 3 challenges for the day
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random());
    const dailyChallenges = shuffled.slice(0, 3).map(challenge => ({
      ...challenge,
      completed: false,
      difficulty: challenge.difficulty as 'easy' | 'medium' | 'hard'
    }));
    
    setChallenges(dailyChallenges);
  }, []);
  
  // Update time until reset
  useEffect(() => {
    const updateTimeUntilReset = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diffMs = tomorrow.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${diffHrs}h ${diffMins}m`);
    };
    
    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const completeChallenge = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => {
        if (challenge.id === id && !challenge.completed) {
          // Show completion animation
          setCompletedPoints(challenge.points);
          setShowCompletionAnimation(true);
          
          // Add points to user's total
          addHealthPoints(challenge.points);
          
          // Hide animation after 2 seconds
          setTimeout(() => {
            setShowCompletionAnimation(false);
          }, 2000);
          
          return { ...challenge, completed: true };
        }
        return challenge;
      })
    );
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'medium':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'hard':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };

  // Add floating animation
  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    });
  }, [controls]);

  return (
    <motion.div 
      ref={cardRef}
      className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-lg p-4 mb-6 relative`}
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isDark 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 1px rgba(16, 185, 129, 0.2)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px 1px rgba(16, 185, 129, 0.1)'
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: isDark 
          ? '0 25px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px 1px rgba(16, 185, 129, 0.3)' 
          : '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 0 20px 1px rgba(16, 185, 129, 0.2)'
      }}
    >
      {/* Header with 3D effect */}
      <div className="flex justify-between items-center mb-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Calendar className={`w-5 h-5 mr-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </motion.div>
          <h3 className="text-lg font-semibold">Daily Health Challenges</h3>
        </div>
        <motion.div 
          className="flex items-center text-sm"
          animate={controls}
        >
          <Clock className="w-4 h-4 mr-1" />
          <span>Resets in: {timeUntilReset}</span>
        </motion.div>
      </div>
      
      {/* Challenges List with 3D effect */}
      <div className="space-y-3" style={{ transform: 'translateZ(10px)' }}>
        {challenges.map((challenge, index) => (
          <motion.div 
            key={challenge.id}
            className={`p-3 rounded-lg border transition-all ${
              challenge.completed 
                ? isDark ? 'bg-gray-700 border-emerald-500' : 'bg-emerald-50 border-emerald-200' 
                : isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              z: 30
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1" style={{ transform: 'translateZ(15px)' }}>
                <div className="flex items-center">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <motion.span 
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(challenge.difficulty)}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {challenge.difficulty}
                  </motion.span>
                </div>
                <p className="text-sm opacity-75 mt-1">{challenge.description}</p>
              </div>
              <div className="flex flex-col items-end" style={{ transform: 'translateZ(20px)' }}>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Award className={`w-4 h-4 mr-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className="font-bold">{challenge.points} HP</span>
                </motion.div>
                {!challenge.completed ? (
                  <motion.button 
                    onClick={() => completeChallenge(challenge.id)}
                    className="mt-2 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete <ArrowRight className="w-3 h-3 ml-1" />
                  </motion.button>
                ) : (
                  <motion.div 
                    className="mt-2 text-xs px-3 py-1 rounded-full bg-gray-500 text-white flex items-center opacity-75"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.75 }}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Completed
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Completion Animation with enhanced 3D effect */}
      {showCompletionAnimation && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotateY: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{ perspective: "1000px" }}
        >
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center"
            animate={{ 
              boxShadow: [
                "0 0 20px 0px rgba(16, 185, 129, 0.4)",
                "0 0 40px 10px rgba(16, 185, 129, 0.6)",
                "0 0 20px 0px rgba(16, 185, 129, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: 1 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <CheckCircle className="w-8 h-8 mr-3" />
            </motion.div>
            <div>
              <div className="text-xl font-bold">Challenge Completed!</div>
              <motion.div 
                className="text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                +{completedPoints} Health Points
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyChallenge; 