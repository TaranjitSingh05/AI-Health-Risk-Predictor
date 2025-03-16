import React, { useState, useRef } from 'react';
import { Activity, AlertCircle, ArrowRight, Loader2, XCircle, Heart, Brain, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import HealthGamification from '../components/HealthGamification';
import DailyChallenge from '../components/DailyChallenge';
import HealthTips from '../components/HealthTips';

const skinDiseases = [
  {
    disease: 'Acne Vulgaris',
    characteristics: ['red bumps', 'whiteheads', 'blackheads', 'inflammation'],
    confidence: 94.3,
    description: 'Common inflammatory skin condition characterized by comedones, papules, and pustules.',
    recommendations: 'Consider topical treatments and consult a dermatologist for severe cases.'
  },
  {
    disease: 'Psoriasis',
    characteristics: ['red patches', 'silvery scales', 'thick skin', 'dry'],
    confidence: 91.8,
    description: 'Chronic autoimmune condition causing rapid skin cell buildup, resulting in thick, scaly patches.',
    recommendations: 'Requires long-term management. Consult a dermatologist for treatment options.'
  }
];

const calculateStrokeRisk = (data: {
  age: string;
  gender: string;
  bloodPressure: string;
  glucose: string;
  bmi: string;
  smoking: string;
  heartDisease: string;
}): { riskPercentage: number; recommendations: string[] } => {
  let riskScore = 0;
  
  const age = parseInt(data.age);
  if (age > 65) riskScore += 30;
  else if (age > 55) riskScore += 20;
  else if (age > 45) riskScore += 10;

  const bp = parseInt(data.bloodPressure);
  if (bp > 180) riskScore += 30;
  else if (bp > 140) riskScore += 20;
  else if (bp > 120) riskScore += 10;

  const glucose = parseInt(data.glucose);
  if (glucose > 200) riskScore += 20;
  else if (glucose > 140) riskScore += 15;
  else if (glucose > 100) riskScore += 5;

  const bmi = parseFloat(data.bmi);
  if (bmi > 30) riskScore += 20;
  else if (bmi > 25) riskScore += 10;

  if (data.smoking === 'current') riskScore += 25;
  else if (data.smoking === 'former') riskScore += 15;

  if (data.heartDisease === 'yes') riskScore += 30;

  return {
    riskPercentage: Math.min(Math.round(riskScore), 100),
    recommendations: getHealthRecommendations(riskScore)
  };
};

const getHealthRecommendations = (riskScore: number): string[] => {
  const recommendations = [
    'Maintain a balanced, heart-healthy diet',
    'Exercise regularly (at least 150 minutes per week)',
    'Monitor blood pressure regularly',
    'Stay hydrated',
    'Get adequate sleep (7-9 hours)'
  ];

  if (riskScore > 50) {
    recommendations.push(
      'Consider consulting a cardiologist',
      'Monitor blood pressure daily',
      'Reduce sodium intake',
      'Practice stress management techniques'
    );
  }

  if (riskScore > 70) {
    recommendations.push(
      'Urgent medical consultation recommended',
      'Consider medication review with your doctor',
      'Implement strict dietary changes',
      'Daily blood pressure and glucose monitoring'
    );
  }

  return recommendations;
};

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  Icon: React.ComponentType<any>;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

interface RiskMeterProps {
  value: number;
}

interface ImageUpload {
  file: File;
  preview: string;
}

interface HomeProps {
  activeTab?: 'disease' | 'stroke';
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children, Icon, severity }) => {
  const { isDark } = useTheme();
  
  const severityColors = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    success: 'text-green-500'
  };
  
  return (
    <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-100'} mr-4`}>
          <Icon className={severityColors[severity]} size={24} />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const RiskMeter: React.FC<RiskMeterProps> = ({ value }) => {
  const angle = (value / 100) * 180 - 90;
  const { isDark } = useTheme();

  return (
    <div className={`relative w-48 h-24 mx-auto`}>
      {/* Background arc */}
      <div className="absolute inset-0 rounded-[50%]"
        style={{
          background: `conic-gradient(
            from -90deg,
            rgba(34, 197, 94, ${isDark ? '0.2' : '0.15'}) 0deg,
            rgba(234, 179, 8, ${isDark ? '0.2' : '0.15'}) 60deg,
            rgba(239, 68, 68, ${isDark ? '0.2' : '0.15'}) 120deg,
            rgba(239, 68, 68, ${isDark ? '0.2' : '0.15'}) 180deg,
            transparent 180deg
          )`
        }}
      />
      
      {/* Value arc */}
      <div className="absolute inset-0 rounded-[50%]"
        style={{
          background: `conic-gradient(
            from -90deg,
            ${value <= 30 ? '#22c55e' : value <= 60 ? '#eab308' : '#ef4444'} 0deg,
            ${value <= 30 ? '#22c55e' : value <= 60 ? '#eab308' : '#ef4444'} ${angle + 90}deg,
            transparent ${angle + 90}deg
          )`,
          filter: 'drop-shadow(0 0 10px rgba(87, 204, 153, 0.3))'
        }}
      />
      
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 origin-bottom transition-transform duration-1000"
        style={{
          width: '2px',
          height: '90px',
          background: `linear-gradient(to top, ${isDark ? '#fff' : '#000'}, transparent)`,
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }}
      >
        <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full 
          bg-gradient-to-br from-primary to-primary-accent shadow-lg`} />
      </div>
      
      {/* Value display */}
      <div className={`absolute bottom-0 w-full text-center text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
        <span className="relative inline-block transform hover:scale-110 transition-transform">
          {value}%
          <div className="absolute inset-0 animate-pulse opacity-50 bg-gradient-to-r from-primary/20 to-primary-accent/20 blur-lg" />
        </span>
      </div>
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ activeTab = 'disease' }) => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState(activeTab);
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResults, setDiseaseResults] = useState<any[]>([]);
  const [healthData, setHealthData] = useState({
    age: '',
    gender: 'male',
    bloodPressure: '',
    glucose: '',
    bmi: '',
    smoking: 'never',
    heartDisease: 'no'
  });
  const [strokeRiskResult, setStrokeRiskResult] = useState<any>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const maxImages = 3;

  // Add refs for 3D effects
  const diseaseCardRef = useRef<HTMLDivElement>(null);
  const strokeCardRef = useRef<HTMLDivElement>(null);

  const analyzeImage = async (imageData: string): Promise<any> => {
    // Simulate API call to analyze image
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock result
    const randomIndex = Math.floor(Math.random() * skinDiseases.length);
    return skinDiseases[randomIndex];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = [];
    for (let i = 0; i < Math.min(files.length, maxImages - uploadedImages.length); i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        alert('Each file size must be less than 10MB');
        continue;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files');
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          file,
          preview: reader.result as string
        });
        if (newImages.length === Math.min(files.length, maxImages - uploadedImages.length)) {
          setUploadedImages(prev => [...prev, ...newImages].slice(0, maxImages));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) return;
    
    setIsAnalyzing(true);
    setDiseaseResults([]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results: any[] = await Promise.all(uploadedImages.map(img => analyzeImage(img.preview)));
    setDiseaseResults(results);
    setIsAnalyzing(false);
  };

  const handleHealthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = calculateStrokeRisk(healthData);
      setStrokeRiskResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderDiseaseResult = () => {
    if (diseaseResults.length === 0 || isAnalyzing) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <ResultCard 
          title="Detection Results" 
          Icon={Brain}
          severity={diseaseResults[0].confidence >= 90 ? 'danger' :
                     diseaseResults[0].confidence >= 70 ? 'warning' : 'info'}
        >
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Detected Condition
                </h4>
                <p className="text-2xl font-bold text-primary-accent">
                  {diseaseResults[0].disease}
                </p>
              </div>
              <div className="text-right">
                <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Confidence Level
                </h4>
                <p className={`text-lg font-medium ${
                  diseaseResults[0].confidence >= 90 ? 'text-red-500' :
                  diseaseResults[0].confidence >= 70 ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                  {diseaseResults[0].confidence >= 90 ? 'High' :
                   diseaseResults[0].confidence >= 70 ? 'Moderate' : 'Low'}
                </p>
              </div>
            </div>

            <div>
              <RiskMeter value={diseaseResults[0].confidence} />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Analysis
                </h4>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {diseaseResults[0].description}
                </p>
              </div>
              
              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Recommendations
                </h4>
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {diseaseResults[0].recommendations.map((rec: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg flex items-start space-x-3 ${
                          isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          diseaseResults[0].confidence >= 90 ? 'bg-red-500' :
                          diseaseResults[0].confidence >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {rec}
                        </p>
                      </motion.div>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ResultCard>
      </motion.div>
    );
  };

  const renderStrokeRiskResult = () => {
    if (!strokeRiskResult || isAnalyzing) return null;

    const riskLevel = strokeRiskResult.riskPercentage >= 70 ? 'High' :
                     strokeRiskResult.riskPercentage >= 40 ? 'Moderate' : 'Low';
    
    const severityColor = riskLevel === 'High' ? 'danger' :
                         riskLevel === 'Moderate' ? 'warning' : 'success';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <ResultCard 
          title="Stroke Risk Assessment" 
          Icon={Heart}
          severity={severityColor}
        >
          <div className="space-y-6 mt-4">
            <div className="text-center">
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Overall Risk Level
              </h4>
              <RiskMeter value={strokeRiskResult.riskPercentage} />
              <p className={`mt-2 text-lg font-medium ${
                riskLevel === 'High' ? 'text-red-500' :
                riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {riskLevel} Risk
              </p>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 flex items-center space-x-2 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                <span>Key Recommendations</span>
                <Info className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="space-y-2">
                {strokeRiskResult.recommendations.map((rec: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg flex items-start space-x-3 ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      riskLevel === 'High' ? 'bg-red-500' :
                      riskLevel === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {rec}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ResultCard>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.h1 
        className={`text-4xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Health Risk Predictor
        <motion.span 
          className="inline-block ml-2"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.2, 1, 1.2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </motion.span>
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width on large screens */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Tab Navigation with 3D effect */}
          <motion.div 
            className={`flex mb-6 rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            whileHover={{ 
              boxShadow: isDark 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 0 10px 1px rgba(16, 185, 129, 0.2)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 10px 1px rgba(16, 185, 129, 0.1)'
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.button
              onClick={() => setTab('disease')}
              className={`flex-1 py-3 px-4 text-center transition-all ${
                tab === 'disease'
                  ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white`
                  : ''
              }`}
              whileHover={{ 
                y: -2,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ y: 0 }}
              style={{ transform: 'translateZ(5px)' }}
            >
              Disease Detection
            </motion.button>
            <motion.button
              onClick={() => setTab('stroke')}
              className={`flex-1 py-3 px-4 text-center transition-all ${
                tab === 'stroke'
                  ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white`
                  : ''
              }`}
              whileHover={{ 
                y: -2,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ y: 0 }}
              style={{ transform: 'translateZ(5px)' }}
            >
              Stroke Risk Assessment
            </motion.button>
          </motion.div>

          {/* Disease Detection Tab */}
          {tab === 'disease' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                ref={diseaseCardRef}
                className={`p-6 rounded-xl shadow-lg mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ 
                  boxShadow: isDark 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 1px rgba(16, 185, 129, 0.2)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px 1px rgba(16, 185, 129, 0.1)'
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.h2 
                  className="text-2xl font-bold mb-4"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Skin Disease Detection
                </motion.h2>
                <motion.p 
                  className="mb-6 opacity-75"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  Upload images of skin conditions for AI-powered analysis and detection of potential skin diseases.
                </motion.p>

                {/* Image Upload Section with 3D effect */}
                <motion.div 
                  className="mb-6"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <motion.label
                    htmlFor="image-upload"
                    className={`block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all hover:bg-opacity-50 ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: isDark ? '#10b981' : '#10b981',
                      boxShadow: isDark 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 0 6px 1px rgba(16, 185, 129, 0.2)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 6px 1px rgba(16, 185, 129, 0.1)'
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div 
                      className="flex flex-col items-center justify-center"
                      style={{ transform: 'translateZ(15px)' }}
                    >
                      <motion.svg
                        className={`w-10 h-10 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ 
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </motion.svg>
                      <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs opacity-75">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </motion.div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </motion.label>
                </motion.div>

                {/* Uploaded Images Preview with 3D effect */}
                {uploadedImages.length > 0 && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ transform: 'translateZ(5px)' }}
                  >
                    <h3 className="text-lg font-semibold mb-3">Uploaded Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uploadedImages.map((img, index) => (
                        <motion.div 
                          key={index} 
                          className="relative group"
                          whileHover={{ 
                            scale: 1.05,
                            zIndex: 10,
                            boxShadow: isDark 
                              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <img
                            src={img.preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            style={{ transform: 'translateZ(2px)' }}
                          />
                          <motion.button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ transform: 'translateZ(10px)' }}
                          >
                            <XCircle size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        onClick={analyzeImages}
                        disabled={isAnalyzing}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          isAnalyzing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                        } text-white`}
                        whileHover={{ 
                          scale: isAnalyzing ? 1 : 1.05,
                          boxShadow: isAnalyzing ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
                        style={{ transform: 'translateZ(15px)' }}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Analyze Images
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Results Section */}
                {diseaseResults.length > 0 && renderDiseaseResult()}
              </motion.div>
            </motion.div>
          )}

          {/* Stroke Risk Assessment Tab */}
          {tab === 'stroke' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                ref={strokeCardRef}
                className={`p-6 rounded-xl shadow-lg mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                whileHover={{ 
                  boxShadow: isDark 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 1px rgba(16, 185, 129, 0.2)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px 1px rgba(16, 185, 129, 0.1)'
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.h2 
                  className="text-2xl font-bold mb-4"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Stroke Risk Assessment
                </motion.h2>
                <motion.p 
                  className="mb-6 opacity-75"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  Complete the form below to assess your potential risk of stroke based on key health factors.
                </motion.p>

                {/* Health Form Toggle with 3D effect */}
                <motion.div 
                  className="mb-6"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <motion.button
                    onClick={() => setShowHealthForm(!showHealthForm)}
                    className={`w-full p-4 rounded-lg flex justify-between items-center ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: isDark 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">Enter Your Health Information</span>
                    <motion.div
                      animate={{ 
                        y: showHealthForm ? 0 : [0, 5, 0],
                        transition: { 
                          y: showHealthForm ? {} : { repeat: Infinity, repeatType: "reverse", duration: 1 }
                        }
                      }}
                    >
                      {showHealthForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* Health Form with 3D effect */}
                <AnimatePresence>
                  {showHealthForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <form onSubmit={handleHealthSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Form fields with 3D effect */}
                        {/* Age */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">Age</label>
                          <motion.input
                            type="number"
                            value={healthData.age}
                            onChange={(e) => setHealthData({ ...healthData, age: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            placeholder="Enter your age"
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          />
                        </motion.div>

                        {/* Gender */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">Gender</label>
                          <motion.select
                            value={healthData.gender}
                            onChange={(e) => setHealthData({ ...healthData, gender: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </motion.select>
                        </motion.div>

                        {/* Blood Pressure */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">Systolic Blood Pressure (mmHg)</label>
                          <motion.input
                            type="number"
                            value={healthData.bloodPressure}
                            onChange={(e) => setHealthData({ ...healthData, bloodPressure: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            placeholder="e.g., 120"
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          />
                        </motion.div>

                        {/* Glucose */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">Fasting Blood Glucose (mg/dL)</label>
                          <motion.input
                            type="number"
                            value={healthData.glucose}
                            onChange={(e) => setHealthData({ ...healthData, glucose: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            placeholder="e.g., 90"
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          />
                        </motion.div>

                        {/* BMI */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">BMI</label>
                          <motion.input
                            type="number"
                            step="0.1"
                            value={healthData.bmi}
                            onChange={(e) => setHealthData({ ...healthData, bmi: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            placeholder="e.g., 24.5"
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          />
                        </motion.div>

                        {/* Smoking Status */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">Smoking Status</label>
                          <motion.select
                            value={healthData.smoking}
                            onChange={(e) => setHealthData({ ...healthData, smoking: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          >
                            <option value="never">Never Smoked</option>
                            <option value="former">Former Smoker</option>
                            <option value="current">Current Smoker</option>
                          </motion.select>
                        </motion.div>

                        {/* Heart Disease */}
                        <motion.div
                          style={{ transform: 'translateZ(5px)' }}
                          whileHover={{ scale: 1.02, z: 10 }}
                        >
                          <label className="block mb-2 text-sm font-medium">History of Heart Disease</label>
                          <motion.select
                            value={healthData.heartDisease}
                            onChange={(e) => setHealthData({ ...healthData, heartDisease: e.target.value })}
                            className={`w-full p-3 rounded-lg ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-gray-50 border-gray-300 text-gray-900'
                            } border`}
                            required
                            whileFocus={{ 
                              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.4)',
                              scale: 1.02
                            }}
                          >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </motion.select>
                        </motion.div>

                        {/* Submit Button with enhanced 3D effect */}
                        <motion.div 
                          className="md:col-span-2 flex justify-end"
                          style={{ transform: 'translateZ(15px)' }}
                        >
                          <motion.button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg flex items-center"
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Calculate Risk
                            <motion.div
                              animate={{ 
                                x: [0, 5, 0],
                                transition: { repeat: Infinity, repeatType: "reverse", duration: 1 }
                              }}
                            >
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results Section */}
                {strokeRiskResult && renderStrokeRiskResult()}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar - 1/3 width on large screens */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Health Gamification Component */}
          <HealthGamification />
          
          {/* Daily Challenges Component */}
          <DailyChallenge />
          
          {/* Health Tips Component */}
          <HealthTips />
        </motion.div>
      </div>
      
      {/* Decorative 3D elements */}
      <motion.div 
        className="fixed -z-10 top-20 left-10 w-64 h-64 rounded-full opacity-10 bg-gradient-to-br from-emerald-300 to-teal-600"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 20, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{ filter: 'blur(40px)' }}
      />
      <motion.div 
        className="fixed -z-10 bottom-20 right-10 w-80 h-80 rounded-full opacity-10 bg-gradient-to-br from-blue-300 to-purple-600"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{ filter: 'blur(50px)' }}
      />
    </div>
  );
};

export default Home;