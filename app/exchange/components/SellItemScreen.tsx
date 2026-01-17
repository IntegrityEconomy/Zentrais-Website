import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Plus, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { useExchangeAPI } from '../hooks/useExchangeAPI';
import { isAuthenticated } from '@/lib/auth';
import { uploadListingImage } from '@/lib/api/exchange';

interface SellItemScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function SellItemScreen({ onBack, onSuccess }: SellItemScreenProps) {
  const { createNewListing, loading, error } = useExchangeAPI();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [mapZoom, setMapZoom] = useState(13);
  const [useGPS, setUseGPS] = useState(true);
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({ lat: 51.0447, lng: -114.0719 });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
    
    // Listen for location updates
    const handleLocationUpdate = () => {
      const newLocation = localStorage.getItem('selectedLocation');
      if (newLocation) setLocation(newLocation);
    };
    
    window.addEventListener('storage', handleLocationUpdate);
    window.addEventListener('locationUpdated', handleLocationUpdate);
    
    return () => {
      window.removeEventListener('storage', handleLocationUpdate);
      window.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  // Get current GPS location
  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      setSubmitError('Geolocation is not supported by your browser.');
      return;
    }
    
    // Check current permission state
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        console.log('Geolocation permission status:', permissionStatus.state);
        // 'granted' = allowed, 'denied' = blocked, 'prompt' = will ask
      } catch (e) {
        console.log('Permission API not supported');
      }
    }
    
    setIsGettingLocation(true);
    setSubmitError(null);
    console.log('Requesting geolocation...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'Zentrais-Marketplace/1.0' } }
          );
          const data = await response.json();
          
          if (data?.address) {
            const parts = [
              data.address.city || data.address.town || data.address.village,
              data.address.state || data.address.region,
              data.address.country,
            ].filter(Boolean);
            
            const address = parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocation(address);
            localStorage.setItem('selectedLocation', address);
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.log('Geolocation error:', error.code, error.message);
        if (error.code === 1) {
          setSubmitError('Location permission denied. Please enable in browser settings.');
        } else if (error.code === 2) {
          setSubmitError('Location unavailable. GPS may be disabled on your device.');
        } else if (error.code === 3) {
          setSubmitError('Location request timed out. Please try again.');
        } else {
          setSubmitError('Unable to get your location.');
        }
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
    );
  }

  const addCategory = () => {
    if (formData.category.trim() && categories.length < 3 && !categories.includes(formData.category.trim())) {
      setCategories([...categories, formData.category.trim()]);
      setFormData({ ...formData, category: '' });
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setSubmitError('Please enter a product title');
      return;
    }
    
    if (!formData.description.trim()) {
      setSubmitError('Please enter a product description');
      return;
    }
    
    if (!formData.price.trim() || parseFloat(formData.price) <= 0) {
      setSubmitError('Please enter a valid price');
      return;
    }
    
    if (!location.trim()) {
      setSubmitError('Please set a location (use GPS or enter manually)');
      return;
    }
    
    if (!isAuthenticated()) {
      setSubmitError('Please log in to create a listing');
      return;
    }

    // Create listing via API with images
    const listing = await createNewListing({
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: categories.length > 0 ? categories.join(', ') : undefined,
      location_name: location,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
    });

    if (listing) {
      onSuccess?.();
      onBack();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (!isAuthenticated()) {
      setSubmitError('Please log in to upload images');
      return;
    }

    setIsUploadingImage(true);
    setSubmitError(null);

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          // Upload to S3 via backend
          const result = await uploadListingImage(file);
          setUploadedImages((prev) => [...prev, result.url]);
        } catch (err) {
          console.error('Error uploading image:', err);
          setSubmitError(err instanceof Error ? err.message : 'Failed to upload image');
        }
      }
    }

    setIsUploadingImage(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/95 backdrop-blur border-b border-black/5">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] font-semibold text-slate-800">Sell Item</h1>
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
        {/* Item Details */}
        <div className="mt-6">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-4">Item Details</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Product Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-500 focus:border-[#B56A1E] focus:outline-none"
            />
            
            <div className="space-y-1">
              <textarea
                placeholder="Describe Your product"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-500 focus:border-[#B56A1E] focus:outline-none"
              />
              <p className="text-[12px] text-slate-500">Max 100 Words</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-slate-700">Price</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="1200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-500 focus:border-[#B56A1E] focus:outline-none"
                />
                <span className="text-[14px] text-slate-700">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mt-8">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-4">Category</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="eg. Furniture"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-500 focus:border-[#B56A1E] focus:outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2 rounded-md bg-white px-3 py-1 ring-1 ring-black/10">
                  <span className="text-[13px] text-slate-700">{category}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-[12px] text-slate-500">Max 3 categories</p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-8">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-4">Location</h2>
          
          <div className="space-y-4">
            {/* Map View */}
            <div className="relative h-40 overflow-hidden rounded-lg border border-slate-300">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationCoords.lng - 0.05},${locationCoords.lat - 0.025},${locationCoords.lng + 0.05},${locationCoords.lat + 0.025}&marker=${locationCoords.lat},${locationCoords.lng}&zoom=${mapZoom}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="pointer-events-none"
                title="Location Map"
              />
              {/* Zoom Controls */}
              <div className="absolute top-2 right-2 flex flex-col bg-white rounded shadow-lg overflow-hidden border border-slate-200">
                <button type="button" onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
                  className="px-2 py-1 text-slate-700 hover:bg-slate-100 text-sm font-medium border-b border-slate-200">+</button>
                <button type="button" onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))}
                  className="px-2 py-1 text-slate-700 hover:bg-slate-100 text-sm font-medium">−</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[14px] font-medium text-slate-700">Current Location (GPS)</p>
                <p className="text-[13px] text-slate-500">{location || 'Not set'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#B56A1E] text-white text-[12px] font-medium disabled:opacity-50"
                >
                  {isGettingLocation ? (
                    <><Loader2 className="h-3 w-3 animate-spin" />Locating...</>
                  ) : (
                    <><MapPin className="h-3 w-3" />Get Location</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setUseGPS(!useGPS)}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition',
                    useGPS ? 'bg-[#B56A1E]' : 'bg-slate-300'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                      useGPS ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
            
            {/* Manual location entry */}
            <div className="mt-3">
              <label className="text-[13px] text-slate-600 mb-1 block">Or enter location manually:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (e.target.value.trim()) {
                    localStorage.setItem('selectedLocation', e.target.value.trim());
                  }
                }}
                placeholder="City, State, Country"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-[14px] text-slate-800 placeholder:text-slate-500 focus:border-[#B56A1E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Attach Product Images */}
        <div className="mt-8">
          <h2 className="text-[16px] font-semibold text-slate-800 mb-4">Attach Product Images</h2>
          
          <div className="space-y-4">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Upload button */}
            <button
              type="button"
              onClick={triggerImageUpload}
              disabled={isUploadingImage}
              className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="mx-auto h-8 w-8 text-slate-400 mb-2 animate-spin" />
                    <p className="text-[13px] text-slate-500">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Plus className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-[13px] text-slate-500">Add Photos</p>
                  </>
                )}
              </div>
            </button>
            
            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-white ring-1 ring-black/10">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 active:scale-95 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-[12px] text-slate-500">
              Image Only • {uploadedImages.length > 0 && `${uploadedImages.length} photo${uploadedImages.length === 1 ? '' : 's'} uploaded`}
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#F5EEE6]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 sm:max-w-3xl">
          {/* Error message */}
          {(submitError || error) && (
            <p className="text-red-600 text-[13px] text-center mb-2">
              {submitError || error}
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              'w-full rounded-xl py-3 text-[14px] font-semibold flex items-center justify-center gap-2',
              'bg-[#B56A1E] text-white shadow-md active:scale-[0.99] transition',
              loading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'List Item'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}