import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Automatically fade splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-500 overflow-hidden ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Splash Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/assets/splash.png')`,
        }}
      />

      {/* Subtle Ambient Overlay */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />

      {/* Floating Action / Skip Bar at Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-3 w-full max-w-xs px-4">
        {/* Animated Progress Line */}
        <div className="w-48 h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>

        <button
          onClick={() => setVisible(false)}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <span>Skip to PrepForge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
