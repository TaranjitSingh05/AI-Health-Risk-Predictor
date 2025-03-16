import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SplineBackgroundProps {
  url: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        'events-target'?: string;
        'loading-anim'?: boolean;
        'auto-rotate'?: boolean;
        'camera-target'?: string;
        'camera-orbit'?: string;
        'ambient-light'?: string;
        'environment-preset'?: string;
      };
    }
  }
}

const SplineBackground: React.FC<SplineBackgroundProps> = ({ url }) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const checkSupport = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setIsSupported(!!gl);
    };
    checkSupport();

    const loadSplineViewer = () => {
      return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="@splinetool/viewer"]')) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.63/build/spline-viewer.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Spline viewer'));
        document.head.appendChild(script);
      });
    };

    const initSpline = async () => {
      try {
        await loadSplineViewer();
        
        // Create and configure viewer
        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', url);
        viewer.setAttribute('events-target', 'global');
        viewer.setAttribute('loading-anim', 'true');
        
        viewer.style.position = 'absolute';
        viewer.style.top = '0';
        viewer.style.left = '0';
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        viewer.style.pointerEvents = 'none';
        viewer.className = `w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`;

        // Add event listeners
        viewer.addEventListener('error', handleSplineError);
        viewer.addEventListener('load', handleSplineLoad);

        // Store reference
        viewerRef.current = viewer;

        // Add to DOM
        const container = document.querySelector('.spline-container');
        if (container) {
          container.appendChild(viewer);
        }
      } catch (error) {
        console.error('Spline initialization error:', error);
        handleSplineError();
      }
    };

    initSpline();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener('error', handleSplineError);
        viewerRef.current.removeEventListener('load', handleSplineLoad);
        viewerRef.current.remove();
      }
    };
  }, [url]);

  const handleSplineLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleSplineError = () => {
    setHasError(true);
    if (retryCount.current < maxRetries) {
      retryCount.current += 1;
      setTimeout(() => {
        setHasError(false);
        setIsLoading(true);
        
        // Remove and recreate viewer
        if (viewerRef.current) {
          viewerRef.current.remove();
          viewerRef.current = null;
        }
        
        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', url);
        viewer.setAttribute('events-target', 'global');
        viewer.setAttribute('loading-anim', 'true');
        
        viewer.style.position = 'absolute';
        viewer.style.top = '0';
        viewer.style.left = '0';
        viewer.style.width = '100%';
        viewer.style.height = '100%';
        viewer.style.pointerEvents = 'none';
        
        const container = document.querySelector('.spline-container');
        if (container) {
          container.appendChild(viewer);
        }
      }, 2000);
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className={`w-full h-full ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#ffecd2]'
        }`}>
          <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
        </div>
      </div>
    );
  }

  return (
    <div className="spline-background fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="spline-container w-full h-full">
        {(isLoading || hasError) && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
              : 'bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]'
          }`}>
            <div className="text-center">
              {isLoading ? (
                <>
                  <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`} />
                  <p className={isDark ? 'text-white' : 'text-gray-800'}>
                    Loading 3D Scene...
                  </p>
                </>
              ) : (
                <div className="text-center p-4">
                  <p className={isDark ? 'text-white' : 'text-gray-800'}>
                    {retryCount.current < maxRetries ? 'Retrying...' : 'Failed to load 3D scene'}
                  </p>
                  {retryCount.current >= maxRetries && (
                    <button 
                      onClick={() => window.location.reload()} 
                      className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-white text-gray-900 hover:bg-gray-100' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplineBackground;