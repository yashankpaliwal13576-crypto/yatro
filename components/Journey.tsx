
import React from 'react';

const Journey: React.FC = () => {
  const steps = [
    {
      step: "Step 1",
      title: "Inquiry to Planning Process",
      desc: "Customers initiate inquiries through multiple channels, followed by personalized consultations to understand needs, leading to tailored planning."
    },
    {
      step: "Step 2",
      title: "Homestay Booking Assistance",
      desc: "Assisting customers throughout the homestay booking process by providing personalized recommendations, seamless communication, and transparent pricing."
    },
    {
      step: "Step 3",
      title: "Post-Trip Follow-up",
      desc: "We engage customers through personalized feedback requests, address concerns promptly, and offer loyalty rewards to nurture long-term relationships."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-16 accent-border pl-6">Customer Journey</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="text-purple-500 font-bold mb-4">{item.step}</div>
            <div className="w-full h-1 bg-white/10 mb-8 relative">
              <div className="absolute top-0 left-0 w-1/4 h-full bg-purple-500 group-hover:w-full transition-all duration-500"></div>
              <div className="absolute -top-1.5 left-0 w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
