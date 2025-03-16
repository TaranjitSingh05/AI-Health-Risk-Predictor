import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import SplineBackground from './components/SplineBackground';
import About from './pages/About';
import Contact from './pages/Contact';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Auth from './pages/Auth';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="relative">
                    <SplineBackground url="https://prod.spline.design/cf4MsIbK0vltZaMO/scene.splinecode" />
                    <Navbar />
                    <Landing />
                    <Chatbot />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/features"
              element={
                <ProtectedRoute>
                  <div className="relative">
                    <SplineBackground url="https://prod.spline.design/cf4MsIbK0vltZaMO/scene.splinecode" />
                    <Navbar />
                    <Features />
                    <Chatbot />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <div className="relative">
                    <SplineBackground url="https://prod.spline.design/cf4MsIbK0vltZaMO/scene.splinecode" />
                    <Navbar />
                    <About />
                    <Chatbot />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <div className="relative">
                    <SplineBackground url="https://prod.spline.design/cf4MsIbK0vltZaMO/scene.splinecode" />
                    <Navbar />
                    <Contact />
                    <Chatbot />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;