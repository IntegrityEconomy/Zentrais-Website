'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function LocationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    lat: 51.0447,
    lng: -114.0719,
    address: 'Calgary, Alberta',
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [recentLocations, setRecentLocations] = useState<string[]>([
    'Toronto',
    'Vancouver',
    'Montreal',
    'Ottawa',
    'Edmonton',
    'Winnipeg',
    'Quebec City',
  ]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [mapZoom, setMapZoom] = useState(13);

  // Load recent locations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentLocations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentLocations(parsed);
        }
      } catch (e) {
        console.error('Error loading recent locations:', e);
        // If there's an error, initialize with empty array
        setRecentLocations([]);
      }
    }
  }, []);

  // Save recent locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
  }, [recentLocations]);

  function handleLocateMe() {
    // Cancel any ongoing location request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsGettingLocation(true);
    setIsRetrying(false);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please enter a location manually.');
      setIsGettingLocation(false);
      return;
    }

    // Create abort controller for manual timeout
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // Manual timeout as backup (in case browser timeout doesn't work)
    const manualTimeout = setTimeout(() => {
      if (!abortController.signal.aborted) {
        abortController.abort();
        setIsGettingLocation(false);
        setIsRetrying(false);
        setLocationError('Location request is taking too long. Please try:\n• Moving to an area with better GPS signal\n• Ensuring location services are enabled\n• Using the search bar to enter a location manually');
      }
    }, 25000); // 25 second manual timeout

    // Check permissions first
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'denied') {
          setIsGettingLocation(false);
          setLocationError('Location access is denied. Please enable location permissions in your browser settings and refresh the page.');
          clearTimeout(manualTimeout);
          return;
        }
      }).catch(() => {
        // Permission API not supported, continue anyway
      });
    }

    // Start with lower accuracy first (faster), then retry with high accuracy if needed
    // This is faster for most users
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
        } catch (error) {
          if (abortController.signal.aborted) return;
          console.error('Error processing location:', error);
          setLocationError('Found your location but couldn\'t get the address. You can still use it.');
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
        
        // Handle error object that might be empty or have different structure
        const errorCode = error?.code ?? error?.PERMISSION_DENIED ?? 0;
        const isTimeout = errorCode === error?.TIMEOUT || errorCode === 3;
        const isUnavailable = errorCode === error?.POSITION_UNAVAILABLE || errorCode === 2;
        const isPermissionDenied = errorCode === error?.PERMISSION_DENIED || errorCode === 1;
        
        console.error('Error getting location (first attempt):', {
          code: errorCode,
          message: error?.message || 'Unknown error',
          error
        });
        
        // If timeout or unavailable, try again with even more lenient settings
        if (isTimeout || isUnavailable) {
          setIsRetrying(true);
          console.log('Retrying with more lenient settings...');
          
          // New manual timeout for retry
          const retryTimeout = setTimeout(() => {
            setIsGettingLocation(false);
            setIsRetrying(false);
            setLocationError('Location request is taking too long. Your device may have slow GPS or location services disabled. Please use the search bar to enter a location manually.');
          }, 45000); // 45 second timeout for retry
          
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              if (abortController.signal.aborted) return;
              clearTimeout(retryTimeout);
              
              try {
                const { latitude, longitude } = position.coords;
                const address = await getAddressFromCoordinates(latitude, longitude);
                if (abortController.signal.aborted) return;
                
                setSelectedLocation({ lat: latitude, lng: longitude, address });
                setSearchQuery(address);
                setMapZoom(13);
                setLocationError(null);
              } catch (error) {
                if (abortController.signal.aborted) return;
                console.error('Error processing location:', error);
                setLocationError('Found your location but couldn\'t get the address. You can still use it.');
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
            (retryError) => {
              if (abortController.signal.aborted) return;
              clearTimeout(retryTimeout);
              
              const retryErrorCode = retryError?.code ?? 0;
              console.error('Error getting location (retry attempt):', {
                code: retryErrorCode,
                message: retryError?.message || 'Unknown error',
                error: retryError
              });
              
              setIsGettingLocation(false);
              setIsRetrying(false);
              
              let errorMessage = 'Unable to retrieve your location. ';
              
              if (retryErrorCode === retryError?.PERMISSION_DENIED || retryErrorCode === 1) {
                errorMessage += 'Please enable location permissions in your browser settings and try again.';
              } else if (retryErrorCode === retryError?.POSITION_UNAVAILABLE || retryErrorCode === 2) {
                errorMessage += 'Location services may be disabled on your device. Please check your device settings, ensure you\'re in an area with GPS signal, or enter a location manually.';
              } else if (retryErrorCode === retryError?.TIMEOUT || retryErrorCode === 3) {
                errorMessage += 'Location request timed out. This may happen if GPS is slow or unavailable. Please try:\n• Moving to a location with better GPS signal\n• Ensuring location services are enabled on your device\n• Using the search bar to enter a location manually';
              } else {
                errorMessage += 'Please enter a location manually using the search bar.';
              }
              
              setLocationError(errorMessage);
            },
            { 
              enableHighAccuracy: false, // Lower accuracy - faster
              timeout: 60000, // 60 seconds - very lenient
              maximumAge: 300000 // Accept cached location up to 5 minutes old
            }
          );
        } else {
          // Permission denied or other error - don't retry
          clearTimeout(manualTimeout);
          setIsGettingLocation(false);
          setIsRetrying(false);
          
          let errorMessage = 'Unable to retrieve your location. ';
          
          if (isPermissionDenied) {
            errorMessage += 'Please enable location permissions in your browser settings and try again.';
          } else if (isUnavailable) {
            errorMessage += 'Location information is unavailable. Please enter a location manually.';
          } else if (isTimeout) {
            errorMessage += 'The request to get your location timed out. Please try again.';
          } else {
            errorMessage += `Unable to get location (Error code: ${errorCode}). Please enter a location manually using the search bar.`;
          }
          
          setLocationError(errorMessage);
        }
      },
      { 
        enableHighAccuracy: false, // Start with lower accuracy - faster
        timeout: 20000, // 20 seconds - reasonable timeout
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      }
    );
  }

  async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Zentrais-Marketplace/1.0' // Required by Nominatim
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data.address) {
        const address = data.address;
        const parts = [
          address.city || address.town || address.village || address.municipality,
          address.state || address.region || address.state_district,
          address.country,
        ].filter(Boolean);
        
        if (parts.length > 0) {
          return parts.join(', ');
        }
      }
      
      // Fallback to display_name if available
      if (data && data.display_name) {
        return data.display_name.split(',').slice(0, 3).join(',').trim();
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error; // Re-throw to let caller handle
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    // Update selected location when user types
    if (value.trim()) {
      setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: value.trim() });
    }
  }

  async function handleRecentLocationClick(location: string) {
    setSearchQuery(location);
    // Try to geocode the recent location
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        setSelectedLocation({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: location,
        });
        setMapZoom(13);
      } else {
        setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: location });
      }
    } catch (error) {
      console.error('Error geocoding recent location:', error);
      setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: location });
    }
  }

  function handleRemoveRecent(location: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRecentLocations(prev => prev.filter(loc => loc !== location));
  }

  function handleApply() {
    // Use search query if available, otherwise use selected location
    const locationToSave = searchQuery.trim() || selectedLocation.address;
    
    if (locationToSave) {
      // Update recent locations: if exists, move to top; if not, add to top
      setRecentLocations(prev => {
        // Remove the location if it already exists
        const filtered = prev.filter(loc => loc !== locationToSave);
        // Add to the beginning and keep max 10 locations
        return [locationToSave, ...filtered].slice(0, 10);
      });
      
      // Save selected location to localStorage
      localStorage.setItem('selectedLocation', locationToSave);
      
      // Dispatch a storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      // Also dispatch a custom event for same-window updates
      window.dispatchEvent(new Event('locationUpdated'));
      
      // Navigate back to previous page
      router.back();
    }
  }

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Try to geocode the search query
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const address = result.display_name || searchQuery.trim();
          setSelectedLocation({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            address: address,
          });
          setMapZoom(13); // Reset zoom when new location is selected
        } else {
          // If geocoding fails, still allow selection with default coordinates
          setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: searchQuery.trim() });
        }
      } catch (error) {
        console.error('Error geocoding:', error);
        // Fallback to default coordinates
        setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: searchQuery.trim() });
      }
    }
  }

  const displayLocations = showAllRecent ? recentLocations : recentLocations.slice(0, 1);
  
  // Generate map URL based on location and settings
  const getMapSrc = () => {
    const lat = selectedLocation.lat !== 0 ? selectedLocation.lat : 51.0447;
    const lng = selectedLocation.lng !== 0 ? selectedLocation.lng : -114.0719;
    const bboxPadding = 0.05 / (mapZoom / 13); // Adjust bbox based on zoom level
    
    if (mapType === 'satellite') {
      // For satellite view, we'll use a static image or fallback to map view
      // OpenStreetMap doesn't have satellite, so we'll keep using map view
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - bboxPadding},${lat - bboxPadding/2},${lng + bboxPadding},${lat + bboxPadding/2}&marker=${lat},${lng}&zoom=${mapZoom}`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - bboxPadding},${lat - bboxPadding/2},${lng + bboxPadding},${lat + bboxPadding/2}&marker=${lat},${lng}&zoom=${mapZoom}`;
  };

  const mapSrc = getMapSrc();
  const isApplyActive = (searchQuery.trim() !== '' || selectedLocation.address !== '');

  function handleZoomIn() {
    setMapZoom(prev => Math.min(prev + 1, 18));
  }

  function handleZoomOut() {
    setMapZoom(prev => Math.max(prev - 1, 5));
  }

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900">
      {/* Header */}
      <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">Location</h1>
          <div className="w-10 flex-shrink-0" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
        {/* Locate Me Button */}
        <div className="mb-4">
          <button
            onClick={handleLocateMe}
            disabled={isGettingLocation}
            className="w-full bg-[#A05205] hover:bg-[#B86215] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {isGettingLocation ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isRetrying ? 'Still trying... (this may take up to 60 seconds)' : 'Locating...'}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Locate Me
            </span>
            )}
          </button>
          {isGettingLocation && (
            <button
              onClick={() => {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                }
                setIsGettingLocation(false);
                setIsRetrying(false);
                setLocationError(null);
              }}
              className="mt-2 w-full text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Location Error Message */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
            <p className="text-sm whitespace-pre-line">{locationError}</p>
            <button
              onClick={() => setLocationError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search city, state, country"
              className="w-full px-4 py-3 pr-10 bg-[#F6EEE6] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A05205] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation({ lat: 51.0447, lng: -114.0719, address: '' });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Map */}
        <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300 mb-4">
          <iframe
            key={`${mapSrc}-${mapType}`}
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none"
            title="Location Map"
          />
          {/* Map Controls Overlay */}
          <div className="absolute top-2 left-2 flex gap-0 bg-[#F6EEE6] rounded shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMapType('map')}
              className={`px-3 py-1 text-xs font-medium border-r border-gray-300 transition-colors ${
                mapType === 'map'
                  ? 'bg-[#F6EEE6] text-gray-900'
                  : 'bg-[#F6EEE6] text-gray-500 hover:bg-gray-50'
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                mapType === 'satellite'
                  ? 'bg-[#F6EEE6] text-gray-900'
                  : 'bg-[#F6EEE6] text-gray-500 hover:bg-gray-50'
              }`}
            >
              Satellite
            </button>
          </div>
          <div className="absolute top-2 right-2 flex flex-col bg-[#F6EEE6] rounded shadow-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={handleZoomIn}
              className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 transition-colors text-base font-medium border-b border-gray-200"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 transition-colors text-base font-medium"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
        </div>

        {/* Apply Now Button */}
        <button
          onClick={handleApply}
          disabled={!isApplyActive}
          className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors mb-6 ${
            isApplyActive
              ? 'bg-[#A05205] hover:bg-[#B86215] text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Apply Now
        </button>

        {/* Recent Locations */}
        {recentLocations.length > 0 && (
          <div className="bg-[#F6EEE6] rounded-lg border border-gray-300 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Recent Locations</h2>
              {recentLocations.length > 1 && (
                <button
                  onClick={() => setShowAllRecent(!showAllRecent)}
                  className="text-sm text-[#A05205] hover:text-[#B86215] font-medium transition-colors"
                >
                  {showAllRecent ? 'Close' : 'See All'}
                </button>
              )}
            </div>

            <div className="space-y-0">
              {displayLocations.map((location, index) => (
                <div
                  key={`${location}-${index}`}
                  onClick={() => handleRecentLocationClick(location)}
                  className="flex items-center justify-between p-2.5 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                >
                  <span className="text-gray-700 text-sm">{location}</span>
                  <button
                    onClick={(e) => handleRemoveRecent(location, e)}
                    className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    aria-label={`Remove ${location}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

