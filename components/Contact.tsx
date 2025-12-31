import React from 'react';

const Contact: React.FC = () => {
  const triggerAI = () => {
    window.dispatchEvent(new CustomEvent('trigger-ai-insight', { 
      detail: "Why should I choose Yatrojana over other travel platforms? What makes your AI planning unique?" 
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center">
        <div className="text-center flex flex-col items-center w-full">
          <div className="glass-card p-12 rounded-[3rem] w-full max-w-2xl border-2 border-dashed border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 text-gradient uppercase tracking-tight">Yatrojana Venture</h3>
            <p className="text-gray-400 mb-10 leading-relaxed">
              We are dedicated to redefining the travel landscape in India by providing authentic experiences that are both sustainable and budget-friendly.
            </p>
            
            <button 
              onClick={triggerAI}
              className="w-full bg-white/5 hover:bg-white/10 border border-purple-500/40 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-widest mb-10 transition-all flex items-center justify-center gap-2"
            >
              <span>✨ Business Insights</span>
            </button>

            <div className="text-sm font-medium mt-6">
              <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-2 font-bold">Founder</p>
              <p className="text-white text-2xl font-semibold">Yashank Paliwal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;