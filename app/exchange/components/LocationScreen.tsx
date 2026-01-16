import React, { useState } from 'react';
import { X, Search, MapPin, ChevronLeft } from 'lucide-react';
import { cn } from '../utils';
import { RECENT_LOCATIONS } from '../constants';

interface LocationScreenProps {
  onBack: () => void;
  onLocationSelect: (location: string) => void;
}

export function LocationScreen({ onBack, onLocationSelect }: LocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState<'Map' | 'Satellite'>('Map');
  const [currentLocation, setCurrentLocation] = useState('Birmingham');
  const [recentLocations] = useState(RECENT_LOCATIONS);

  // Get current GPS location (placeholder)
  const getCurrentLocation = () => {
    // TODO: Implement GPS location detection
    setCurrentLocation('Current Location');
    alert('GPS location feature will be implemented with Google Maps integration');
  };

  // Search for location (placeholder)
  const searchLocation = () => {
    if (!searchQuery.trim()) return;
    
    // TODO: Implement location search with Google Maps Geocoding
    setCurrentLocation(searchQuery);
    alert(`Search for "${searchQuery}" will be implemented with Google Maps integration`);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  // Apply selected location
  const applyLocation = () => {
    onLocationSelect(currentLocation);
    onBack();
  };

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/95 backdrop-blur border-b border-black/5">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] font-semibold text-slate-800">Location</h1>
            <button
              type="button"
              onClick={onBack}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full active:scale-95 transition"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-md px-4 pb-[calc(80px+env(safe-area-inset-bottom))] sm:max-w-full">
        {/* Locate Me Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full rounded-lg bg-[#B56A1E] px-4 py-3 text-[14px] font-semibold text-white shadow-md active:scale-[0.99] transition"
          >
            Locate Me
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="flex items-center rounded-lg border border-slate-300 bg-white px-4 py-3">
            <input
              type="text"
              placeholder="Search city,state,country"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-500 outline-none"
            />
            <Search className="h-4 w-4 text-slate-400 ml-2" />
          </div>
        </div>

        {/* Map View Toggle */}
        <div className="mt-4 flex gap-2">
          {(['Map', 'Satellite'] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setMapView(view)}
              className={cn(
                'rounded-md px-4 py-2 text-[13px] font-medium transition',
                mapView === view
                  ? 'bg-[#B56A1E] text-white'
                  : 'bg-white text-slate-700 ring-1 ring-black/10 hover:bg-slate-50'
              )}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-4 relative h-64 overflow-hidden rounded-lg bg-slate-200 border border-slate-300">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 mb-3 text-slate-400" />
              <p className="text-[14px] font-medium text-slate-600 mb-1">Google Maps Integration</p>
              <p className="text-[12px] text-slate-500">Interactive map will be added here</p>
              <div className="mt-3 px-3 py-1.5 bg-white rounded-full text-[11px] text-slate-600 inline-block">
                {mapView} View • {currentLocation}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Locations */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-slate-800">Recent Locations</h3>
            <button className="text-[12px] text-[#B56A1E] font-medium">See All</button>
          </div>
          
          <div className="space-y-2">
            {recentLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setCurrentLocation(loc);
                  setSearchQuery(loc);
                }}
                className="flex w-full items-center justify-between rounded-lg bg-white p-3 text-left ring-1 ring-black/5 hover:bg-slate-50 active:scale-[0.99] transition"
              >
                <span className="text-[14px] text-slate-800">{loc}</span>
                <ChevronLeft className="h-4 w-4 rotate-180 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#F5EEE6]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 sm:max-w-3xl">
          <button
            type="button"
            onClick={applyLocation}
            className={cn(
              'w-full rounded-lg py-3 text-[14px] font-semibold',
              'bg-[#B56A1E] text-white shadow-md active:scale-[0.99] transition'
            )}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}