import React, { useState } from 'react';
import { Mail, MapPin, Phone, Loader2, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'pending'
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Message sent successfully:', data);
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]'
    }`}>
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#84fab0]/20 to-[#8fd3f4]/20 animate-gradient"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b6b] to-[#feca57]">
                Contact Us
              </span>
            </h1>
            <p className={`mt-4 text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Get in touch with our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-[#1a1a2e]/90' : 'bg-white/95'} backdrop-blur-md rounded-xl shadow-lg p-8`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['name', 'email', 'message'].map((field) => (
                  <motion.div
                    key={field}
                    whileTap={{ scale: 0.995 }}
                    className="relative"
                  >
                    <label className={`block text-sm font-medium mb-1 
                      ${isDark ? 'text-gray-200' : 'text-gray-700'}
                      ${activeField === field ? 'text-primary' : ''}`}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === 'message' ? (
                      <textarea
                        name={field}
                        value={formData[field as keyof ContactFormData]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field)}
                        onBlur={() => setActiveField(null)}
                        required
                        rows={4}
                        className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200
                          ${isDark 
                            ? 'bg-[#1a1a2e]/60 border-gray-600 text-gray-100' 
                            : 'bg-white/90 border-gray-300 text-gray-900'} 
                          ${activeField === field 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'hover:border-gray-400 dark:hover:border-gray-500'}
                          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field as keyof ContactFormData]}
                        onChange={handleChange}
                        onFocus={() => setActiveField(field)}
                        onBlur={() => setActiveField(null)}
                        required
                        className={`mt-1 block w-full rounded-lg shadow-sm transition-all duration-200
                          ${isDark 
                            ? 'bg-[#1a1a2e]/60 border-gray-600 text-gray-100' 
                            : 'bg-white/90 border-gray-300 text-gray-900'} 
                          ${activeField === field 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'hover:border-gray-400 dark:hover:border-gray-500'}
                          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      />
                    )}
                  </motion.div>
                ))}

                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-100/90 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100/90 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-6 py-3 rounded-lg text-white flex items-center justify-center space-x-2
                    bg-gradient-to-r from-[#ff6b6b] to-[#feca57] hover:from-[#ff5252] hover:to-[#f7b731]
                    transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                    ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isDark ? 'bg-[#1a1a2e]/90' : 'bg-white/95'} backdrop-blur-md rounded-xl shadow-lg p-8`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Contact Information
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: ['123 Health Tech Street', 'San Francisco, CA 94105']
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: ['+91 99999999'],
                    action: () => handlePhoneClick('+91 99999999')
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: ['ts1036593@gmail.com'],
                    action: () => handleEmailClick('ts1036593@gmail.com')
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors
                      ${item.action ? 'cursor-pointer' : ''}
                      hover:bg-primary/5 dark:hover:bg-primary/10`}
                    onClick={item.action}
                  >
                    <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      {item.content.map((line, i) => (
                        <p key={i} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;