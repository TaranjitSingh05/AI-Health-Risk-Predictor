import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Minimize2, Maximize2, Loader2, Clock, Info, AlertTriangle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// Load API keys from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize OpenAI if API key is available
let openai: OpenAI | null = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // This is for client-side usage
  });
}

const SYSTEM_PROMPT = `You are an AI health assistant specializing in health risk assessment and disease detection. Your responses should be:
1. Professional and accurate
2. Focused on health-related information
3. Clear and easy to understand
4. Include relevant medical context when appropriate
5. Always encourage consulting healthcare professionals for serious concerns`;

// Free AI API endpoint as a fallback
const FREE_AI_API_URL = "https://api.openai.com/v1/chat/completions";

const Chatbot = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "system", 
      content: SYSTEM_PROMPT, 
      timestamp: new Date() 
    },
    { 
      role: "assistant", 
      content: "Hello! I'm your AI health assistant. How can I help you today?", 
      timestamp: new Date() 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [apiMode, setApiMode] = useState<"openai" | "gemini" | "huggingface" | "fallback">("openai");
  const [apiError, setApiError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    
    // Add a small delay to simulate typing
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: text,
        timestamp: new Date()
      }]);
    }, 1000);
  };

  // Fallback response generator
  const generateFallbackResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I help with your health questions today?";
    }
    
    if (lowerCaseMessage.includes("headache") || lowerCaseMessage.includes("head pain")) {
      return "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare professional.";
    }
    
    if (lowerCaseMessage.includes("cold") || lowerCaseMessage.includes("flu") || lowerCaseMessage.includes("fever")) {
      return "Common cold and flu symptoms include fever, cough, sore throat, body aches, and fatigue. Rest, hydration, and over-the-counter medications can help manage symptoms. If symptoms are severe or persist for more than a week, please consult a healthcare professional.";
    }
    
    if (lowerCaseMessage.includes("diet") || lowerCaseMessage.includes("nutrition") || lowerCaseMessage.includes("eat")) {
      return "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is essential for good health. Try to limit processed foods, added sugars, and excessive salt. Remember that individual nutritional needs vary, so consulting with a nutritionist can provide personalized guidance.";
    }
    
    if (lowerCaseMessage.includes("exercise") || lowerCaseMessage.includes("workout") || lowerCaseMessage.includes("fitness")) {
      return "Regular physical activity is important for maintaining good health. Aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities twice a week. Always start gradually and consult with a healthcare provider before beginning a new exercise program, especially if you have existing health conditions.";
    }
    
    if (lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("anxiety") || lowerCaseMessage.includes("depression")) {
      return "Mental health is as important as physical health. Stress management techniques include regular exercise, adequate sleep, mindfulness practices, and maintaining social connections. If you're experiencing persistent feelings of anxiety or depression that interfere with daily life, please reach out to a mental health professional for support.";
    }
    
    if (lowerCaseMessage.includes("sleep") || lowerCaseMessage.includes("insomnia")) {
      return "Quality sleep is essential for overall health. Adults typically need 7-9 hours of sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, and avoid caffeine and large meals close to bedtime. If sleep problems persist, consider consulting a healthcare provider.";
    }
    
    // Default response if no specific topics are detected
    return "I understand you're asking about " + userMessage.substring(0, 30) + "... While I aim to provide helpful health information, I recommend consulting with a qualified healthcare professional for personalized advice tailored to your specific situation.";
  };

  // Try to use OpenAI API
  const tryOpenAI = async (userMessage: string, messageHistory: Message[]): Promise<string | null> => {
    if (!openai || !OPENAI_API_KEY) return null;
    
    try {
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      formattedMessages.push({
        role: "user",
        content: userMessage
      });
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800
      });
      
      const text = response.choices[0]?.message?.content;
      if (text) {
        setApiMode("openai");
        return text;
      }
      return null;
    } catch (error) {
      console.error("OpenAI API error:", error);
      return null;
    }
  };

  // Try to use Gemini API
  const tryGemini = async (userMessage: string): Promise<string | null> => {
    if (!GEMINI_API_KEY) return null;
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
              { role: "model", parts: [{ text: "I understand. I'll act as a professional health assistant." }] },
              { role: "user", parts: [{ text: userMessage }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          setApiMode("gemini");
          return text;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini API error:", error);
      return null;
    }
  };

  // Try to use HuggingFace API as another fallback
  const tryHuggingFace = async (userMessage: string): Promise<string | null> => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
            }
          }),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.generated_text) {
          setApiMode("huggingface");
          return data.generated_text;
        }
      }
      return null;
    } catch (error) {
      console.error("HuggingFace API error:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
  
    const userMessage = input.trim();
    const newMessages = [...messages, { 
      role: "user" as const, 
      content: userMessage,
      timestamp: new Date()
    }];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setApiError(null);
  
    try {
      // Try OpenAI first
      const openaiResponse = await tryOpenAI(userMessage, messages);
      if (openaiResponse) {
        simulateTyping(openaiResponse);
        setIsLoading(false);
        return;
      }
      
      // Try Gemini as fallback
      const geminiResponse = await tryGemini(userMessage);
      if (geminiResponse) {
        simulateTyping(geminiResponse);
        setIsLoading(false);
        return;
      }
      
      // Try HuggingFace as another fallback
      const huggingfaceResponse = await tryHuggingFace(userMessage);
      if (huggingfaceResponse) {
        simulateTyping(huggingfaceResponse);
        setIsLoading(false);
        return;
      }
      
      // If all APIs fail, use the fallback response generator
      setApiMode("fallback");
      setApiError("All AI APIs failed. Using offline mode.");
      const fallbackResponse = generateFallbackResponse(userMessage);
      simulateTyping(fallbackResponse);
      
    } catch (error) {
      console.error("Error in chat handling:", error);
      setApiMode("fallback");
      setApiError("Error processing request");
      simulateTyping("I apologize, but I'm having trouble processing your request right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 
              text-white rounded-full shadow-lg transition-all duration-300 z-50
              hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed right-6 bottom-6 w-96 ${isDark ? "bg-gray-800" : "bg-white"} 
              rounded-2xl shadow-2xl overflow-hidden z-50 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
            style={{ height: isMinimized ? "60px" : "500px" }}
          >
            {/* Chat Header */}
            <div className={`p-3 flex justify-between items-center ${isDark ? "bg-gray-900" : "bg-gradient-to-r from-emerald-500 to-teal-500"} ${isDark ? "text-white" : "text-white"}`}>
              <div className="flex items-center">
                <div className="bg-white p-1 rounded-full mr-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-medium">Health Assistant</h3>
                  {apiMode !== "openai" && apiMode !== "gemini" && (
                    <div className="text-xs flex items-center mt-0.5">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Offline Mode
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button onClick={toggleInfo} className="p-1 rounded-full hover:bg-black/10">
                  <Info className="w-4 h-4" />
                </button>
                <button onClick={toggleMinimize} className="p-1 rounded-full hover:bg-black/10">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-black/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && !isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`p-3 text-sm border-b ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}
                >
                  <p>This AI health assistant can help answer your health-related questions and provide general guidance.</p>
                  <p className="mt-1 font-semibold">Remember: Always consult with healthcare professionals for medical advice.</p>
                  {apiError && (
                    <p className="mt-1 text-amber-500">Note: {apiError}</p>
                  )}
                  {apiMode === "fallback" && (
                    <p className="mt-1 text-amber-500">
                      To enable AI responses, please add your OpenAI API key in the .env file.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className={`p-4 overflow-y-auto ${isDark ? "text-gray-200" : "text-gray-800"}`} style={{ height: "calc(100% - 120px)" }}>
                  {messages.filter(msg => msg.role !== "system").map((msg, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`mb-3 max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
                    >
                      <div className={`p-3 rounded-2xl ${
                        msg.role === "user" 
                          ? `bg-gradient-to-r from-emerald-500 to-teal-500 text-white` 
                          : isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"} ${msg.role === "user" ? "justify-end" : ""}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(msg.timestamp)}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && !isTyping && (
                    <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 max-w-[85%]">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  )}
                  {isTyping && (
                    <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 max-w-[85%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className={`p-3 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200"}`}>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your health question..."
                      className={`flex-grow p-3 rounded-l-lg focus:outline-none ${
                        isDark 
                          ? "bg-gray-700 text-white placeholder:text-gray-400" 
                          : "bg-gray-100 text-gray-800 placeholder:text-gray-500"
                      }`}
                    />
                    <button 
                      onClick={handleSend} 
                      disabled={isLoading || !input.trim()}
                      className={`p-3 rounded-r-lg ${
                        isLoading || !input.trim()
                          ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      } text-white`}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
