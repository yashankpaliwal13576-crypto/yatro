
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import DestinationDiscovery from './components/DestinationDiscovery';
import HolidayPackages from './components/HolidayPackages';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-dark selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10">
        <section id="home">
          <Hero />
        </section>
        
        <div className="relative z-20 -mt-16 md:-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
          <BookingForm />
        </div>

        <section id="packages" className="py-24 bg-white/[0.01]">
          <HolidayPackages />
        </section>

        <section id="discover" className="py-24">
          <DestinationDiscovery />
        </section>

        <section id="services" className="py-24 bg-white/[0.02] border-y border-white/5">
          <Services />
        </section>

        <section id="contact" className="py-24">
          <Contact />
        </section>
      </main>
      
      <ChatBot />
      <Footer />
    </div>
  );
};

export default App;
