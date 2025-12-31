
import React, { useState, useEffect } from 'react';
import { getDestinationSuggestions, getSeasonalTrendingDestinations } from '../lib/gemini';

const DestinationDiscovery: React.FC = () => {
  const [prefs, setPrefs] = useState({
    budget: 'Economy',
    interests: 'Adventure',
    companions: 'Solo',
    stateOrRegion: ''
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [seasonalCities, setSeasonalCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [manualCitySearch, setManualCitySearch] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.log("Location denied")
      );
    }
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setTrendingLoading(true);
    const month = new Date().toLocaleString('default', { month: 'long' });
    const cities = await getSeasonalTrendingDestinations(month, userLoc);
    setSeasonalCities(cities);
    setTrendingLoading(false);
  };

  const handleDiscover = async () => {
    setLoading(true);
    const results = await getDestinationSuggestions(prefs);
    setSuggestions(results);
    setLoading(false);
  };

  const handleSelectDestination = (destination: string) => {
    window.dispatchEvent(new CustomEvent('set-destination', { detail: destination }));
    // Also scroll to booking form for better UX
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerAI = () => {
    window.dispatchEvent(new CustomEvent('trigger-ai-insight', { 
      detail: `Explain how Yatro AI finds the best travel recommendations based on budget levels like ${prefs.budget} and interests like ${prefs.interests}, specifically for locations in ${prefs.stateOrRegion || 'India'}.` 
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="glass-card rounded-[3rem] p-10 border-t-4 border-blue-500 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        {/* Trending & Search Section */}
        <div className="mb-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">🔥 Trending for You</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Based on current season & region</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-4 items-center">
              <div className="relative group flex-1 md:w-72">
                <input 
                  type="text" 
                  placeholder="Search specific city..."
                  value={manualCitySearch}
                  onChange={(e) => setManualCitySearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && manualCitySearch && handleSelectDestination(manualCitySearch)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-bold"
                />
                <button 
                  onClick={() => manualCitySearch && handleSelectDestination(manualCitySearch)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  🔍
                </button>
              </div>

              <button 
                onClick={fetchTrending}
                disabled={trendingLoading}
                className="bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all text-lg"
                title="Refresh Trending"
              >
                <span className={trendingLoading ? 'animate-spin inline-block' : ''}>🔄</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {seasonalCities.length > 0 ? (
              seasonalCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelectDestination(city)}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-black text-gray-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all uppercase tracking-widest active:scale-95"
                >
                  {city}
                </button>
              ))
            ) : (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-24 h-8 bg-white/5 rounded-full animate-pulse"></div>
              ))
            )}
          </div>
        </div>

        <div className="relative z-10 text-center mb-12 pt-8 border-t border-white/5">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Discover Your Next Journey</h2>
          <p className="text-gray-400 font-light max-w-lg mx-auto leading-relaxed">Let Yatro AI find the perfect Indian getaway tailored to your lifestyle, preferred vibe, and travel companions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Budget Level</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none font-bold"
              value={prefs.budget}
              onChange={(e) => setPrefs({...prefs, budget: e.target.value})}
            >
              <option className="bg-gray-900" value="Economy">Economy / Budget Friendly</option>
              <option className="bg-gray-900" value="Mid-Range">Mid-Range / Comfort</option>
              <option className="bg-gray-900" value="Luxury">Premium / Luxury</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Main Interest</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none font-bold"
              value={prefs.interests}
              onChange={(e) => setPrefs({...prefs, interests: e.target.value})}
            >
              <option className="bg-gray-900" value="Adventure">Adventure & Trekking</option>
              <option className="bg-gray-900" value="Spiritual">Spiritual & Peaceful</option>
              <option className="bg-gray-900" value="Beach">Beach & Relaxation</option>
              <option className="bg-gray-900" value="Culture">Heritage & Culture</option>
              <option className="bg-gray-900" value="Mountains">Mountains & Scenic</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Companions</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none font-bold"
              value={prefs.companions}
              onChange={(e) => setPrefs({...prefs, companions: e.target.value})}
            >
              <option className="bg-gray-900" value="Solo">Solo Traveler</option>
              <option className="bg-gray-900" value="Couple">Couple / Romantic</option>
              <option className="bg-gray-900" value="Family">Family Trip</option>
              <option className="bg-gray-900" value="Friends">Group of Friends</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Region Preferences</label>
            <input 
              type="text"
              placeholder="e.g. Kerala, North-East"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] font-bold"
              value={prefs.stateOrRegion}
              onChange={(e) => setPrefs({...prefs, stateOrRegion: e.target.value})}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
          <button 
            onClick={handleDiscover}
            disabled={loading}
            className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black text-[11px] text-white uppercase tracking-widest shadow-[0_0_25px_rgba(37,99,235,0.4)] transform transition-all hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Consulting Yatro AI...' : '✨ Find Destinations'}
          </button>
          <button 
            onClick={triggerAI}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-purple-500/30 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3"
          >
            <span>✨ AI Analysis</span>
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {suggestions.map((s, i) => (
              <div key={i} className="glass-card rounded-[2.5rem] p-8 border border-white/5 hover:border-blue-500/40 transition-all group flex flex-col justify-between hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{s.name}</h4>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase font-black tracking-widest">
                      {s.vibe}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-8 font-light italic">
                    "{s.reason}"
                  </p>
                </div>
                <button 
                  onClick={() => handleSelectDestination(s.name)}
                  className="w-full py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  Start Planning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDiscovery;
