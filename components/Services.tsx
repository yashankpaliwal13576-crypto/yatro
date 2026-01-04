import React, { memo } from 'react';

const Services: React.FC = () => {
  const triggerInsight = (serviceName: string) => {
    window.dispatchEvent(new CustomEvent('trigger-ai-insight', { 
      detail: `Explain how Yatrojana uses AI to improve "${serviceName}" for a better customer experience.` 
    }));
  };

  const services = [
    {
      title: "Smart Trip Itineraries",
      desc: "Our AI generates daily, time-optimized itineraries for your trips. From hidden local gems to iconic landmarks, we ensure your days are perfectly balanced and logically sequenced.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=60&w=400",
      accent: "from-purple-500 to-blue-500"
    },
    {
      title: "Customizable Trip Planning",
      desc: "Total flexibility at your fingertips. Our platform allows for granular, customizable trip planning where you can adjust budgets, preferences, and durations in real-time.",
      img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=60&w=400",
      accent: "from-blue-500 to-emerald-500"
    },
    {
      title: "Specially Curated Hotels",
      desc: "Experience luxury and comfort with our hand-picked selection of curated hotels. Every property is verified for quality, safety, and authentic hospitality standards.",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=60&w=400",
      accent: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-4xl font-black text-white mb-4 accent-border pl-6 uppercase tracking-tighter">What We Offer</h2>
        <p className="text-gray-400 max-w-2xl ml-6 font-light">Comprehensive travel solutions powered by intelligence, ensuring every mile of your journey is managed with precision.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {services.map((service, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2.5rem] glass-card border border-white/5 transition-all hover:border-purple-500/50 flex flex-col hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="h-56 overflow-hidden relative">
              <img 
                src={service.img} 
                alt={service.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110" 
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-20`}></div>
            </div>
            <div className="p-8 flex-1 flex flex-col relative">
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">{service.desc}</p>
              <button 
                onClick={() => triggerInsight(service.title)}
                className="mt-auto self-start text-[10px] font-black text-purple-400 border border-purple-500/30 px-5 py-2.5 rounded-full hover:bg-purple-500/10 transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg active:scale-95"
              >
                <span className="animate-pulse">✨</span> AI Insight
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-12 rounded-[3rem] border-l-8 border-blue-600 flex flex-col justify-between hover:shadow-[0_0_50px_rgba(37,99,235,0.15)] transition-all">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-500/20">🚀</div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Integrated Transit Hub</h3>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
              One platform for all your transit needs. We provide seamless integration and booking for <span className="text-white font-bold">Flights, Cabs, and Trains</span>. Our AI finds the most efficient connections, saving you hours of cross-platform searching.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">✈️ Flight Routes</span>
              <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">🚂 Rail Connectivity</span>
              <span className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">🚖 On-Demand Cabs</span>
            </div>
          </div>
          <button 
            onClick={() => triggerInsight("Integrated Transit Hub")}
            className="self-start text-[10px] font-black text-blue-400 border border-blue-500/30 px-6 py-3 rounded-2xl hover:bg-blue-500/10 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95"
          >
            <span>✨ System Deep-Dive</span>
          </button>
        </div>

        <div className="glass-card p-12 rounded-[3rem] border-l-8 border-purple-600 flex flex-col justify-between hover:shadow-[0_0_50px_rgba(147,51,234,0.15)] transition-all">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-purple-500/20">🏡</div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Verified Homestays</h3>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
              Step into the local life with our authenticated homestays. We vet every host and property to ensure <span className="text-white font-bold">safety, authenticity, and sustainability</span>. Get a real taste of Indian culture within your green budget.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Verified Hosts</span>
              <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Cultural Depth</span>
            </div>
          </div>
          <button 
            onClick={() => triggerInsight("Homestay Selection Assistance")}
            className="self-start text-[10px] font-black text-purple-400 border border-purple-500/30 px-6 py-3 rounded-2xl hover:bg-purple-500/10 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95"
          >
            <span>✨ Insight Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Services);