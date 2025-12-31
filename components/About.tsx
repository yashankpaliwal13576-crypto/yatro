
import React from 'react';

const About: React.FC = () => {
  const cards = [
    {
      title: "Company Overview",
      content: "Yatrojana is an online travel planning platform where the users get their dream travel package and homestays in a budget friendly way!",
      icon: "🌍"
    },
    {
      title: "Our Mission and Vision",
      content: "Our business is for every niche, anyone can plan their trips and tour with us, anywhere in the India within their affordable and green budget!",
      icon: "🎯"
    },
    {
      title: "Target Audience: All Generations",
      content: "From young explorers (13+) to cherished seniors, our platform is designed for everyone. We curate experiences that bridge age gaps, ensuring safety for kids and comfort for elders.",
      icon: "👥"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-12 accent-border pl-6">Who We Are</h2>
      
      <div className="space-y-8">
        {cards.map((card, idx) => (
          <div key={idx} className="glass-card rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8 transition-transform hover:translate-x-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
              {card.icon}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {card.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
