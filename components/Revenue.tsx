
import React from 'react';

const Revenue: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Revenue Model</h2>
        <p className="text-purple-400 text-lg">Sustainable and Scalable Earnings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-white">Commission from Homestays</h3>
          <div className="relative pl-8 space-y-12">
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-900/50"></div>
            
            {[
              { num: "01", title: "Seasonal Commission Structure", desc: "Commission rates vary seasonally, with higher percentages during peak tourist months and reduced rates in off-peak periods." },
              { num: "02", title: "Benefits for Homestay Partners", desc: "Earn steady income through increased bookings, enjoy hassle-free customer management, and benefit from Yatrojana's marketing reach." },
              { num: "03", title: "Commission Collection Process", desc: "Yatrojana earns commissions by facilitating bookings between travelers and owners, collecting payments post-stay." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold z-10 group-hover:scale-110 transition-transform">
                  {item.num}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[3rem] flex flex-col justify-center items-center text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Customer Charges</h3>
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="w-48 h-48 bg-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/50">
              <span className="text-4xl font-bold text-gradient">Value</span>
            </div>
            
            {/* Orbital items mimicking the presentation style */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 p-3 rounded-xl border border-white/10 shadow-xl">
              <span className="text-xl">✈️</span>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 p-3 rounded-xl border border-white/10 shadow-xl">
              <span className="text-xl">💰</span>
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-gray-900 p-3 rounded-xl border border-white/10 shadow-xl">
              <span className="text-xl">🛠️</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 text-left border-l-2 border-blue-500">
              <p className="font-bold text-white">Trip Planning Fees</p>
              <p className="text-xs text-gray-400">Generate revenue by charging customers for personalized itinerary creation and optimization.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-left border-l-2 border-purple-500">
              <p className="font-bold text-white">Fixed Platform Fee</p>
              <p className="text-xs text-gray-400">Ensures consistent revenue by charging customers a set rate, simplifying billing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
