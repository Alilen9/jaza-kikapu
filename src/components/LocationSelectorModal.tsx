import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Location } from '../types';
import { MapPin, X, Check } from 'lucide-react';

export const LocationSelectorModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    locations,
    activeLocation,
    setActiveLocation,
    showToast,
  } = useMarket();

  if (!isLocationModalOpen) return null;

  const handleSelectLocation = (loc: Location) => {
    setActiveLocation(loc);
    setIsLocationModalOpen(false);
    showToast(`Market switched to ${loc.marketName} (${loc.subCounty})`);
  };

  // Group by sub-county
  const subCounties = Array.from(new Set(locations.map(l => l.subCounty)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D95D39]/10 text-[#D95D39] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Choose Market Location
              </h3>
              <p className="text-[11px] text-stone-500">
                Discover stalls, live sellers & delivery in your area
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Taita-Taveta County Hubs
          </div>

          {subCounties.map(sc => {
            const scLocs = locations.filter(l => l.subCounty === sc);
            return (
              <div key={sc} className="space-y-1.5">
                <div className="text-xs font-bold text-stone-900 px-1">
                  {sc} Sub-County
                </div>

                <div className="space-y-1.5">
                  {scLocs.map(loc => {
                    const isSelected = activeLocation?.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                            : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs">{loc.marketName}</div>
                          <div className={`text-[11px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            {loc.town} · {loc.area}
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-[#F4A261]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 text-[11px] text-stone-400 text-center">
          Designed with county-wide expansion support across Kenya.
        </div>
      </div>
    </div>
  );
};
