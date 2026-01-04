import React, { useState, useEffect, useCallback, memo } from 'react';
import { getSmartItineraryStream, getTrainInfo, getHotelInfo, getHomestayInfo, getComprehensiveTripData, getFlightInfo, getDestinationDetails, getNearbyHotels, getCabInfo } from '../lib/gemini';
import { GenerateContentResponse } from '@google/genai';

const PRICE_RANGES = [
  { label: "Budget (Under ₹2k)", value: "Budget" },
  { label: "Standard (₹2k - ₹5k)", value: "Standard" },
  { label: "Premium (₹5k - ₹10k)", value: "Premium" },
  { label: "Luxury (₹10k+)", value: "Luxury" }
];

const TRAVEL_MODES = [
  { id: 'Itinerary', label: 'Itinerary', icon: '📅', group: 'Plan' },
  { id: 'Trip Planner', label: 'Planner', icon: '✨', group: 'Plan' },
  { id: 'Flight', label: 'Flights', icon: '✈️', group: 'Transit' },
  { id: 'Train', label: 'Trains', icon: '🚂', group: 'Transit' },
  { id: 'Cab', label: 'Cabs', icon: '🚖', group: 'Transit' },
  { id: 'Hotel', label: 'Hotels', icon: '🏨', group: 'Stay' },
  { id: 'Homestay', label: 'Homestays', icon: '🏡', group: 'Stay' },
];

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fromStation: '',
    destination: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    duration: '3',
    travelMode: 'Itinerary',
    adults: '2',
    children: '0',
    priceRange: 'Standard'
  });
  
  const [refreshCounts, setRefreshCounts] = useState<Record<string, number>>({});
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  
  const [hotelResult, setHotelResult] = useState<{ hotels: any[]; grounding: any[] } | null>(null);
  const [homestayResult, setHomestayResult] = useState<{ hotels: any[]; grounding: any[] } | null>(null);
  const [nearbyHotelsResult, setNearbyHotelsResult] = useState<{ hotels: any[]; grounding: any[] } | null>(null);
  const [cabResult, setCabResult] = useState<{ estimatedTime: string; distance: string; estimates: any[]; grounding: any[] } | null>(null);
  const [trains, setTrains] = useState<any[]>([]);
  const [trainAlternatives, setTrainAlternatives] = useState<string | null>(null);
  const [trainGrounding, setTrainGrounding] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [flightGrounding, setFlightGrounding] = useState<any[]>([]);
  const [comprehensiveResult, setComprehensiveResult] = useState<{ fullPlan: string; grounding: any[] } | null>(null);
  const [aiResult, setAiResult] = useState<{ text: string; links: any[] } | null>(null);
  const [destDetails, setDestDetails] = useState<{ description: string; bestTimeToVisit: string; weatherInfo?: string; attractions: string[] } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.debug("Location access denied"),
        { timeout: 5000 }
      );
    }
    
    const handleSetDest = (e: any) => {
      setFormData(prev => ({ ...prev, destination: e.detail }));
    };
    window.addEventListener('set-destination', handleSetDest);
    return () => window.removeEventListener('set-destination', handleSetDest);
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'checkInDate' || field === 'checkOutDate') {
        const diff = Math.ceil(Math.abs(new Date(updated.checkOutDate).getTime() - new Date(updated.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
        updated.duration = diff.toString();
      }
      return updated;
    });
  }, []);

  const handleSearch = async (overrideDest?: string, overrideMode?: string, isRefresh = false) => {
    const targetMode = overrideMode || formData.travelMode;
    const targetData = {
      ...formData,
      destination: overrideDest || formData.destination,
      travelMode: targetMode
    };

    if (!targetData.destination) return;
    
    setIsLoading(true);
    if (targetMode === 'Itinerary') setAiResult({ text: '', links: [] });
    else {
      setHotelResult(null);
      setHomestayResult(null);
      setNearbyHotelsResult(null); 
      setCabResult(null);
      setTrains([]);
      setFlights([]);
      setComprehensiveResult(null);
    }
    
    const currentRefreshCount = isRefresh ? (refreshCounts[targetMode] || 0) + 1 : 0;
    setRefreshCounts(prev => ({ ...prev, [targetMode]: currentRefreshCount }));

    try {
      if (targetMode === 'Trip Planner') {
        const data = await getComprehensiveTripData(targetData.fromStation, targetData.destination, targetData.adults, targetData.children, targetData.priceRange, userLocation);
        setComprehensiveResult(data);
      } else if (targetMode === 'Hotel') {
        const data = await getHotelInfo(targetData.destination, targetData.adults, targetData.children, targetData.priceRange, userLocation);
        setHotelResult(data);
      } else if (targetMode === 'Homestay') {
        const data = await getHomestayInfo(targetData.destination, targetData.adults, targetData.children, targetData.priceRange, userLocation);
        setHomestayResult(data);
      } else if (targetMode === 'Train') {
        const data = await getTrainInfo(targetData.fromStation, targetData.destination);
        setTrains(data.trains);
        setTrainAlternatives(data.alternatives);
        setTrainGrounding(data.grounding);
        
        if (data.trains && data.trains.length > 0) {
          const destStation = data.trains[0].toStation || targetData.destination;
          getNearbyHotels(destStation, targetData.priceRange).then(setNearbyHotelsResult);
        }
      } else if (targetMode === 'Cab') {
        const data = await getCabInfo(targetData.fromStation, targetData.destination);
        setCabResult(data);
      } else if (targetMode === 'Flight') {
        const data = await getFlightInfo(targetData.fromStation, targetData.destination, targetData.adults, targetData.children);
        setFlights(data.flights);
        setFlightGrounding(data.grounding);

        const airportSearch = `${targetData.destination} Airport`;
        getNearbyHotels(airportSearch, targetData.priceRange).then(setNearbyHotelsResult);
      } else {
        const stream = getSmartItineraryStream(targetData.destination, parseInt(targetData.duration), userLocation, currentRefreshCount);
        let accumulatedText = '';
        let links: any[] = [];
        for await (const chunk of stream) {
           const c = chunk as GenerateContentResponse;
           accumulatedText += (c.text || '');
           links = c.candidates?.[0]?.groundingMetadata?.groundingChunks || links;
           setAiResult({ text: accumulatedText, links });
        }
      }
      
      if (!isRefresh) {
        getDestinationDetails(targetData.destination).then(setDestDetails);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookCab = (provider: 'Uber' | 'Ola') => {
    const from = encodeURIComponent(formData.fromStation);
    const to = encodeURIComponent(formData.destination);
    if (provider === 'Uber') {
      window.open(`https://m.uber.com/lookup?pickup=${from}&destination=${to}`, '_blank');
    } else {
      window.open(`https://www.olacabs.com/`, '_blank');
    }
  };

  const renderGrounding = (grounding: any[]) => {
    if (!grounding || grounding.length === 0) return null;
    return (
      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
        <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Verified Sources:</h5>
        <div className="flex flex-wrap gap-3">
          {grounding.map((chunk, idx) => (
            <a key={idx} href={chunk.web?.uri || chunk.maps?.uri} target="_blank" rel="noopener noreferrer" 
               className="text-[10px] text-blue-400 font-bold border border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-500/5 transition-all">
              {chunk.web?.title || chunk.maps?.title || 'Source'}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const isTransitMode = ['Trip Planner', 'Flight', 'Train', 'Cab'].includes(formData.travelMode);
  const needsPaxInfo = ['Flight', 'Hotel', 'Homestay', 'Trip Planner'].includes(formData.travelMode);

  return (
    <div id="booking-section" className="glass-card rounded-[3rem] p-6 md:p-10 shadow-2xl border border-purple-500/20 transition-all">
      {/* Travel Mode Navigation Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 px-2">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Select Service</span>
           <div className="h-px flex-1 bg-white/5 mx-6"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {TRAVEL_MODES.map(mode => (
            <button 
              key={mode.id}
              onClick={() => setFormData(prev => ({...prev, travelMode: mode.id}))}
              className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group overflow-hidden ${
                formData.travelMode === mode.id 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-[0_10px_30px_rgba(147,51,234,0.3)] ring-1 ring-white/20' 
                  : 'bg-white/5 hover:bg-white/10 border border-white/5'
              }`}
            >
              <span className={`text-2xl mb-2 transition-transform duration-300 group-hover:scale-125 ${formData.travelMode === mode.id ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>
                {mode.icon}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                formData.travelMode === mode.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {mode.label}
              </span>
              {formData.travelMode === mode.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/40 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-end p-2">
        {isTransitMode && (
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">From</label>
            <input 
              type="text" placeholder="Origin City"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
              value={formData.fromStation} onChange={(e) => handleInputChange('fromStation', e.target.value)}
            />
          </div>
        )}

        <div className={`${isTransitMode ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-2`}>
          <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Destination</label>
          <input 
            type="text" placeholder="Where to?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
            value={formData.destination} onChange={(e) => handleInputChange('destination', e.target.value)}
          />
        </div>

        <div className="lg:col-span-2 space-y-2">
          {formData.travelMode === 'Itinerary' ? (
             <>
               <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Days</label>
               <input 
                 type="number" min="1" max="30"
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                 value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)}
               />
             </>
          ) : (
            <>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Travel Date</label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none [color-scheme:dark] transition-all"
                value={formData.checkInDate} onChange={(e) => handleInputChange('checkInDate', e.target.value)}
              />
            </>
          )}
        </div>

        {needsPaxInfo && (
          <>
            <div className="lg:col-span-1 space-y-2">
              <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest ml-1">Adults</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none font-bold appearance-none cursor-pointer"
                value={formData.adults} onChange={(e) => handleInputChange('adults', e.target.value)}
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#0c0c25]">{n}</option>)}
              </select>
            </div>
            <div className="lg:col-span-1 space-y-2">
              <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest ml-1">Kids</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none font-bold appearance-none cursor-pointer"
                value={formData.children} onChange={(e) => handleInputChange('children', e.target.value)}
              >
                {[0,1,2,3,4].map(n => <option key={n} value={n} className="bg-[#0c0c25]">{n}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest ml-1">Price Range</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none font-bold cursor-pointer"
            value={formData.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
          >
            {PRICE_RANGES.map(range => (
              <option key={range.value} value={range.value} className="bg-[#0c0c25]">{range.label}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2 flex gap-2">
          <button 
            onClick={() => handleSearch()} disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 text-[11px] uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading && formData.travelMode !== 'Itinerary' ? 'Consulting...' : 'Search'}
          </button>
          
          <button 
            onClick={() => handleSearch(undefined, undefined, true)}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all text-lg group active:scale-90"
            title="Refresh Strategy"
          >
            <span className={`inline-block transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}>🔄</span>
          </button>
        </div>
      </div>

      {/* Result Panes */}
      <div className="space-y-16 mt-16">
        {/* Specific Loading Placeholder */}
        {isLoading && formData.travelMode === 'Itinerary' && (!aiResult || !aiResult.text) && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="glass-card p-12 rounded-[3rem] border border-purple-500/20 flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-purple-600/5 blur-3xl"></div>
               <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">✨</div>
               </div>
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Crafting Your Itinerary</h4>
               <p className="text-purple-400 font-bold text-xs uppercase tracking-widest animate-pulse">Yatro is crafting your perfect itinerary...</p>
            </div>
          </div>
        )}

        {/* Dynamic Results Rendering */}
        {hotelResult && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
               <span className="text-3xl">🏨</span> Curated Accommodations
             </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotelResult.hotels.map((hotel, i) => (
                <div key={i} className="glass-card rounded-[2.5rem] p-8 border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                  <div className="flex flex-col h-full">
                    <h5 className="text-white font-black text-xl mb-1 group-hover:text-purple-400 transition-colors">{hotel.name}</h5>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">📍 {hotel.locationNote}</p>
                    
                    <div className="flex flex-col gap-2 mb-8">
                       <span className="self-start text-[9px] font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase tracking-[0.1em] flex items-center gap-2">
                         👥 {hotel.capacity}
                       </span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Pricing</span>
                        <span className="text-emerald-400 font-black text-2xl">{hotel.price}</span>
                        <span className="text-[8px] text-gray-600 uppercase">per night</span>
                      </div>
                      <button className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all transform active:scale-95">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderGrounding(hotelResult.grounding)}
          </div>
        )}

        {/* ... Other result types ... */}

        {aiResult && aiResult.text && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-purple-600 rounded-3xl flex items-center justify-center text-3xl shadow-[0_10px_30px_rgba(147,51,234,0.4)] ring-2 ring-white/10">✨</div>
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Personalized Itinerary</h4>
               </div>
               {isLoading && <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span><span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Yatro is writing...</span></div>}
            </div>
            <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl"></div>
              <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-line font-light">
                 {aiResult.text}
              </div>
              {renderGrounding(aiResult.links)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BookingForm);