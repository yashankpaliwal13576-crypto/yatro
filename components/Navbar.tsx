
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#050510]/80 backdrop-blur-2xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="cursor-pointer group flex flex-col items-center">
          <span className="text-4xl md:text-6xl font-black tracking-tighter text-white transition-all duration-500 group-hover:scale-105 group-hover:text-purple-400">
            YATROJANA
          </span>
          <div className="h-1 w-12 group-hover:w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500 mt-1 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
