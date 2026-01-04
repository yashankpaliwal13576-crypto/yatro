import React, { memo } from 'react';

const Hero: React.FC = () => {
  const triggerAI = () => {
    window.dispatchEvent(new CustomEvent('trigger-ai-insight', { 
      detail: "What are the latest travel trends in India for 2024 and how can I plan an eco-friendly trip?" 
    }));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Optimized Background Assets */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] will-change-transform"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] will-change-transform"></div>
        
        <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>✈️</div>
        <div className="absolute bottom-1/3 right-20 text-7xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🏨</div>
        <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '4s' }}>🚂</div>
        <div className="absolute bottom-1/4 left-20 text-4xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🚕</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-5 animate-float" style={{ animationDelay: '3s' }}>🌴</div>

        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-drift">
           <div className="absolute -top-3 right-0 text-xl">✈️</div>
        </div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-drift" style={{ animationDelay: '10s' }}>
           <div className="absolute -top-3 right-0 text-xl">🚂</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 animate-pulse">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            India's Most Intelligent Travel Platform
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter">
            REDEFINING <br />
            <span className="text-gradient">TRAVEL JOURNEY</span>
          </h1>
          
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Smart itineraries, verified homestays, and integrated transit. <br className="hidden md:block" />
            Experience a <span className="text-white border-b-2 border-purple-500">greener, smarter, and more affordable</span> way to explore India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
          <button 
            onClick={triggerAI}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="flex items-center gap-3 relative z-10">
              ✨ Consult Yatro AI
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Hero);