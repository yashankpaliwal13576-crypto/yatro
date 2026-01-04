import React, { memo } from 'react';

interface Package {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  tag: string;
  highlights: string[];
}

const PACKAGES: Package[] = [
  {
    id: 'ladakh',
    title: 'Mystical Ladakh',
    location: 'Leh & Pangong',
    duration: '7 Days / 6 Nights',
    price: '₹24,500',
    tag: 'Adventurous',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=60&w=600',
    highlights: ['Pangong Lake', 'Khardung La Pass', 'Nubra Valley']
  },
  {
    id: 'kerala',
    title: 'God\'s Own Country',
    location: 'Munnar & Alleppey',
    duration: '5 Days / 4 Nights',
    price: '₹18,200',
    tag: 'Relaxing',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=60&w=600',
    highlights: ['Houseboat Stay', 'Tea Plantations', 'Varkala Beach']
  },
  {
    id: 'rajasthan',
    title: 'Royal Rajasthan',
    location: 'Jaipur & Udaipur',
    duration: '6 Days / 5 Nights',
    price: '₹21,000',
    tag: 'Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=60&w=600',
    highlights: ['Amber Fort', 'City Palace', 'Lake Pichola']
  },
  {
    id: 'goa',
    title: 'Coastal Paradise',
    location: 'North & South Goa',
    duration: '4 Days / 3 Nights',
    price: '₹12,500',
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1512789172734-8b09f9d46752?auto=format&fit=crop&q=60&w=600',
    highlights: ['Dudhsagar Falls', 'Beach Shacks', 'Old Goa']
  }
];

const HolidayPackages: React.FC = () => {
  const handlePlan = (destination: string) => {
    window.dispatchEvent(new CustomEvent('set-destination', { detail: destination }));
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerAI = (pkgName: string) => {
    window.dispatchEvent(new CustomEvent('trigger-ai-insight', { 
      detail: `Give me a detailed day-wise itinerary for the "${pkgName}" holiday package in India. Include best budget tips.` 
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-4 block">Curated Experiences</span>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          Popular <span className="text-gradient">Holidays</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto font-light leading-relaxed">
          Hand-picked destinations paired with AI-optimized routes for the perfect Indian getaway.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id} 
            className="group glass-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(147,51,234,0.15)] flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-60"></div>
              <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {pkg.tag}
              </span>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  📍 {pkg.location}
                </p>
              </div>

              <div className="space-y-2 mb-8">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                    <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                    {h}
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="block text-[8px] text-gray-600 uppercase font-bold tracking-widest">Starts from</span>
                    <span className="text-emerald-400 font-black text-2xl">{pkg.price}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold mb-1">{pkg.duration}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePlan(pkg.location)}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
                  >
                    Plan Trip
                  </button>
                  <button 
                    onClick={() => triggerAI(pkg.title)}
                    className="w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                    title="AI Details"
                  >
                    ✨
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <button className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-3 mx-auto group active:scale-95">
          View All Packages <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default memo(HolidayPackages);