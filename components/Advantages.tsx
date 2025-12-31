
import React from 'react';

const Advantages: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 accent-border pl-6">Advantages for Customers</h2>
          <div className="space-y-8">
            {[
              { icon: "✓", title: "Seamless Trip Planning", desc: "Integrated booking, real-time updates, and personalized recommendations for a stress-free experience." },
              { icon: "✓", title: "Access to Best Homestays", desc: "Exclusive access to top-rated homestays ensuring quality, comfort, and authentic local experiences." },
              { icon: "✓", title: "Cost Transparency", desc: "Clear pricing structures enabling informed decisions and avoiding hidden fees for long-term trust." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold group-hover:bg-purple-500 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[3rem] overflow-hidden glass-card p-4">
          <img src="https://picsum.photos/600/800?travel" alt="Travel Advantage" className="rounded-[2.5rem] w-full object-cover aspect-square opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-[3rem] p-12 border border-white/5">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Advantages for Homestays</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Increased Visibility", desc: "Exposure to a wider audience, attracting more bookings and enhancing reputation in competitive markets." },
            { title: "Seasonal Revenue", desc: "Capitalize on peak seasons with increased bookings while using targeted promotions for steady flow." },
            { title: "Partnership Growth", desc: "Resource sharing, expanded reach, and collaborative marketing leading to increased revenue." }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                <div className="w-8 h-8 rounded-full bg-purple-600/50"></div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advantages;
