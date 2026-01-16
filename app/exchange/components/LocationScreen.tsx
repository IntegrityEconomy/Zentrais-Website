'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '../utils';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationScreenProps {
  onBack: () => void;
  onLocationSelect: (location: string) => void;
}

export function LocationScreen({ onBack, onLocationSelect }: LocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    lat: 51.0447,
    lng: -114.0719,
    address: '',
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);

  // Load saved location and recent locations from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSearchQuery(savedLocation);
      setSelectedLocation(prev => ({ ...prev, address: savedLocation }));
    }
    
    const savedRecent = localStorage.getItem('recentLocations');
    if (savedRecent) {
      try {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentLocations(parsed);
        }
      } catch (e) {
        console.error('Error loading recent locations:', e);
      }
    }
  }, []);

  // Save recent locations to localStorage
  useEffect(() => {
    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
  }, [recentLocations]);

  // Reverse geocoding: get address from coordinates
  async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'Zentrais-Marketplace/1.0' } }
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();

      if (data?.address) {
        const address = data.address;
        const parts = [
          address.city || address.town || address.village || address.municipality,
          address.state || address.region || address.state_district,
          address.country,
        ].filter(Boolean);
        
        if (parts.length > 0) return parts.join(', ');
      }
      
      if (data?.display_name) {
        return data.display_name.split(',').slice(0, 3).join(',').trim();
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  // Handle Locate Me button
  function handleLocateMe() {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    
    setIsGettingLocation(true);
    setIsRetrying(false);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsGettingLocation(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    const manualTimeout = setTimeout(() => {
      if (!abortController.signal.aborted) {
        abortController.abort();
        setIsGettingLocation(false);
        setIsRetrying(false);
        setLocationError('Location request timed out. Please use the search bar.');
      }
    }, 25000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (abortController.signal.aborted) return;
        clearTimeout(manualTimeout);
        
        try {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoordinates(latitude, longitude);
          if (abortController.signal.aborted) return;
          
          setSelectedLocation({ lat: latitude, lng: longitude, address });
          setSearchQuery(address);
          setMapZoom(13);
          setLocationError(null);
        } catch {
          if (abortController.signal.aborted) return;
          setSelectedLocation({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude, 
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` 
          });
          setSearchQuery(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        } finally {
          if (!abortController.signal.aborted) {
            setIsGettingLocation(false);
            setIsRetrying(false);
          }
        }
      },
      (error) => {
        if (abortController.signal.aborted) return;
        clearTimeout(manualTimeout);
        
        console.log('Geolocation error:', error?.code, error?.message);
        
        const isTimeout = error?.code === 3;
        const isUnavailable = error?.code === 2;
        
        if (isTimeout || isUnavailable) {
          // Retry once with longer timeout
          setIsRetrying(true);
          const retryTimeout = setTimeout(() => {
            setIsGettingLocation(false);
            setIsRetrying(false);
            setLocationError(isTimeout ? 'Location request timed out.' : 'Location unavailable.');
          }, 45000);
          
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              if (abortController.signal.aborted) return;
              clearTimeout(retryTimeout);
              try {
                const address = await getAddressFromCoordinates(pos.coords.latitude, pos.coords.longitude);
                setSelectedLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address });
                setSearchQuery(address);
                setLocationError(null);
              } catch {
                setSelectedLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
                setSearchQuery(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
              } finally {
                if (!abortController.signal.aborted) { setIsGettingLocation(false); setIsRetrying(false); }
              }
            },
            (retryError) => {
              if (abortController.signal.aborted) return;
              clearTimeout(retryTimeout);
              setIsGettingLocation(false);
              setIsRetrying(false);
              if (retryError?.code === 1) {
                setLocationError('Location permission denied.');
              } else if (retryError?.code === 2) {
                setLocationError('Location unavailable. GPS may be disabled.');
              } else if (retryError?.code === 3) {
                setLocationError('Location request timed out.');
              } else {
                setLocationError('Unable to get location.');
              }
            },
            { enableHighAccuracy: false, timeout: 60000, maximumAge: 300000 }
          );
        } else if (error?.code === 1) {
          setIsGettingLocation(false);
          setIsRetrying(false);
          setLocationError('Location permission denied.');
        } else {
          setIsGettingLocation(false);
          setIsRetrying(false);
          setLocationError('Unable to get location.');
          setIsRetrying(false);
        }
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
    );
  }

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=1`,
        { headers: { 'User-Agent': 'Zentrais-Marketplace/1.0' } }
      );
      const data = await response.json();
      if (data?.length > 0) {
        setSelectedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), address: searchQuery.trim() });
        setMapZoom(13);
      }
    } catch (error) {
      console.error('Error geocoding:', error);
    }
  }

  async function handleRecentLocationClick(location: string) {
    setSearchQuery(location);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        { headers: { 'User-Agent': 'Zentrais-Marketplace/1.0' } }
      );
      const data = await response.json();
      if (data?.length > 0) {
        setSelectedLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), address: location });
        setMapZoom(13);
      }
    } catch (error) {
      console.error('Error geocoding:', error);
    }
  }

  function handleRemoveRecent(location: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRecentLocations(prev => prev.filter(loc => loc !== location));
  }

  function handleApply() {
    const locationToSave = searchQuery.trim() || selectedLocation.address;
    if (locationToSave) {
      setRecentLocations(prev => [locationToSave, ...prev.filter(loc => loc !== locationToSave)].slice(0, 10));
      localStorage.setItem('selectedLocation', locationToSave);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('locationUpdated'));
      onLocationSelect(locationToSave);
      onBack();
    }
  }

  const getMapSrc = () => {
    const lat = selectedLocation.lat || 51.0447;
    const lng = selectedLocation.lng || -114.0719;
    const bboxPadding = 0.05 / (mapZoom / 13);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - bboxPadding},${lat - bboxPadding/2},${lng + bboxPadding},${lat + bboxPadding/2}&marker=${lat},${lng}&zoom=${mapZoom}`;
  };

  const displayLocations = showAllRecent ? recentLocations : recentLocations.slice(0, 3);
  const isApplyActive = searchQuery.trim() !== '' || selectedLocation.address !== '';

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900">
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/95 backdrop-blur border-b border-black/5">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] font-semibold text-slate-800">Location</h1>
            <button type="button" onClick={onBack} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full active:scale-95 transition">
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-[calc(80px+env(safe-area-inset-bottom))] sm:max-w-full">
        <div className="mt-4">
          <button type="button" onClick={handleLocateMe} disabled={isGettingLocation}
            className="w-full rounded-lg bg-[#B56A1E] px-4 py-3 text-[14px] font-semibold text-white shadow-md disabled:opacity-50 active:scale-[0.99] transition flex items-center justify-center gap-2">
            {isGettingLocation ? (
              <><Loader2 className="h-5 w-5 animate-spin" />{isRetrying ? 'Still trying...' : 'Locating...'}</>
            ) : (
              <><MapPin className="h-5 w-5" />Locate Me</>
            )}
          </button>
          {isGettingLocation && (
            <button onClick={() => { abortControllerRef.current?.abort(); setIsGettingLocation(false); setIsRetrying(false); }}
              className="mt-2 w-full text-sm text-slate-600 hover:text-slate-900 underline">Cancel</button>
          )}
        </div>

        {locationError && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            <p className="text-sm">{locationError}</p>
            <button onClick={() => setLocationError(null)} className="mt-2 text-xs underline">Dismiss</button>
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="mt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center rounded-lg border border-slate-300 bg-white px-4 py-3">
              <input type="text" placeholder="Search city, state, country" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value.trim()) setSelectedLocation(prev => ({ ...prev, address: e.target.value.trim() })); }}
                className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-500 outline-none" />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: '' }); }}
                  className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              )}
            </div>
            <button type="submit" className="rounded-lg bg-[#B56A1E] px-4 py-3 text-white active:scale-95 transition">
              <Search className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-[12px] text-slate-500">Type a location and tap search, or use &quot;Locate Me&quot; for GPS</p>
        </form>

        <div className="mt-4 flex gap-2">
          {(['map', 'satellite'] as const).map((type) => (
            <button key={type} type="button" onClick={() => setMapType(type)}
              className={cn('rounded-md px-4 py-2 text-[13px] font-medium transition capitalize',
                mapType === type ? 'bg-[#B56A1E] text-white' : 'bg-white text-slate-700 ring-1 ring-black/10 hover:bg-slate-50')}>
              {type}
            </button>
          ))}
        </div>

        <div className="mt-4 relative h-64 overflow-hidden rounded-lg border border-slate-300">
          <iframe key={getMapSrc()} src={getMapSrc()} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" className="pointer-events-none" title="Location Map" />
          <div className="absolute top-2 right-2 flex flex-col bg-white rounded shadow-lg overflow-hidden border border-slate-200">
            <button type="button" onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
              className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 text-base font-medium border-b border-slate-200">+</button>
            <button type="button" onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))}
              className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 text-base font-medium">−</button>
          </div>
        </div>

        {recentLocations.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-slate-800">Recent Locations</h3>
              {recentLocations.length > 3 && (
                <button onClick={() => setShowAllRecent(!showAllRecent)} className="text-[12px] text-[#B56A1E] font-medium">
                  {showAllRecent ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayLocations.map((loc) => (
                <div key={loc} onClick={() => handleRecentLocationClick(loc)}
                  className="flex items-center justify-between rounded-lg bg-white p-3 ring-1 ring-black/5 hover:bg-slate-50 cursor-pointer active:scale-[0.99] transition">
                  <span className="text-[14px] text-slate-800">{loc}</span>
                  <button onClick={(e) => handleRemoveRecent(loc, e)} className="text-slate-400 hover:text-slate-600 p-1"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#F5EEE6]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 sm:max-w-3xl">
          <button type="button" onClick={handleApply} disabled={!isApplyActive}
            className={cn('w-full rounded-lg py-3 text-[14px] font-semibold transition',
              isApplyActive ? 'bg-[#B56A1E] text-white shadow-md active:scale-[0.99]' : 'bg-slate-200 text-slate-400 cursor-not-allowed')}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}