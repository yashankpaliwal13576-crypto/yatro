
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center font-bold text-white text-xs">Y</div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">YATROJANA</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
          </div>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Yatrojana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
