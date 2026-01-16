'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '../../lib/api';
import { CreateListingInput } from '../../types/listing';
import Link from 'next/link';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    proofOrReferenceLink: '',
    categories: [] as string[],
    location: '',
    useGPS: false,
    coordinates: { lat: 0, lng: 0, address: '' } as LocationData,
  });

  // Load selected location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedLocation');
    if (saved) {
      setFormData(prev => ({ ...prev, location: saved }));
    }
  }, []);

  // Load pending listing from sessionStorage to restore form when editing from review page
  useEffect(() => {
    const saved = sessionStorage.getItem('pendingListing');
    if (saved) {
      try {
        const pendingListing: CreateListingInput = JSON.parse(saved);
        
        // Restore form data
        setFormData(prev => ({
          ...prev,
          title: pendingListing.title || '',
          description: pendingListing.shortDescription || '',
          price: pendingListing.price ? pendingListing.price.toString() : '',
          proofOrReferenceLink: pendingListing.proofOrReferenceLink || '',
          categories: pendingListing.categories || [],
          location: pendingListing.location || prev.location,
        }));

        // Restore images if they exist (they're base64 data URLs)
        if (pendingListing.images && pendingListing.images.length > 0) {
          setImagePreviews(pendingListing.images);
          // Note: We can't restore File objects, but we can keep the previews
          // User would need to re-select files if they want to change them
        }
      } catch (e) {
        console.error('Error loading pending listing:', e);
        // If there's an error, just continue with empty form
      }
    }
  }, []);
  const [categoryInput, setCategoryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    proofOrReferenceLink?: string;
  }>({});

  // URL validation helper
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      // Validate title
      const titleTrimmed = formData.title.trim();
      if (!titleTrimmed) {
        setValidationErrors(prev => ({ ...prev, title: 'Title is required' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }
      if (titleTrimmed.length > 100) {
        setValidationErrors(prev => ({ ...prev, title: 'Title must be 100 characters or less' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }

      // Validate description
      const descriptionTrimmed = formData.description.trim();
      if (!descriptionTrimmed) {
        setValidationErrors(prev => ({ ...prev, description: 'Description is required' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }
      if (descriptionTrimmed.length > 500) {
        setValidationErrors(prev => ({ ...prev, description: 'Description must be 500 characters or less' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }

      // Validate proof/reference link
      const proofLinkTrimmed = formData.proofOrReferenceLink.trim();
      if (!proofLinkTrimmed) {
        setValidationErrors(prev => ({ ...prev, proofOrReferenceLink: 'Proof or reference link is required' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }
      if (!isValidUrl(proofLinkTrimmed)) {
        setValidationErrors(prev => ({ ...prev, proofOrReferenceLink: 'Please enter a valid URL (must start with http:// or https://)' }));
        setError('Please fix the errors above');
        setIsSubmitting(false);
        return;
      }

      // Convert images to base64
      // Use imagePreviews if available (restored from sessionStorage), otherwise convert File objects
      let validImages: string[] = [];
      
      if (imagePreviews.length > 0) {
        // Use restored image previews (already base64 data URLs)
        validImages = imagePreviews.filter(img => img && img.length > 0 && img.startsWith('data:image/'));
      } else if (images.length > 0) {
        // Convert File objects to base64
        const imagePromises = images.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const dataUrl = event.target.result as string;
                resolve(dataUrl);
              } else {
                reject(new Error('Failed to read image'));
              }
            };
            reader.onerror = (error) => {
              console.error('Error reading image:', error);
              reject(new Error('Failed to read image'));
            };
            reader.readAsDataURL(file);
          });
        });

        try {
          const imageDataUrls = await Promise.all(imagePromises);
          validImages = imageDataUrls.filter(img => img && img.length > 0 && img.startsWith('data:image/'));
          if (validImages.length !== images.length) {
            console.warn('Some images failed to convert:', images.length - validImages.length);
          }
        } catch (imgError) {
          console.error('Error converting images:', imgError);
          setError('Failed to process images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare the listing data (save to sessionStorage for review page)
      const listingData = {
        title: titleTrimmed,
        shortDescription: descriptionTrimmed,
        proofOrReferenceLink: proofLinkTrimmed,
        categories: formData.categories.length > 0 ? formData.categories : [],
        price: formData.price && formData.price.trim() ? parseFloat(formData.price) : undefined,
        location: formData.location && formData.location !== 'Select Location' ? formData.location : undefined,
        images: validImages, // Always send array, even if empty
      };

      // Save to sessionStorage for review page
      sessionStorage.setItem('pendingListing', JSON.stringify(listingData));
      
      // Navigate to review page
      router.push('/listings/create/review');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof validationErrors];
        return newErrors;
      });
    }
  };

  const handleCategoryAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && categoryInput.trim() && formData.categories.length < 3) {
      e.preventDefault();
      if (!formData.categories.includes(categoryInput.trim())) {
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, categoryInput.trim()],
        }));
      }
      setCategoryInput('');
    }
  };

  const handleCategoryRemove = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category),
    }));
  };

  // Character counts for validation display
  const titleCharCount = formData.title.trim().length;
  const descriptionCharCount = formData.description.trim().length;

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      // Check if file is JPEG/JPG
      const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/jpg' || 
                           file.name.toLowerCase().endsWith('.jpg') || 
                           file.name.toLowerCase().endsWith('.jpeg');
      
      if (isValidFormat) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`${invalidFiles.join(', ')} ${invalidFiles.length === 1 ? 'is' : 'are'} not valid JPEG file(s). Please upload JPG/JPEG images only.`);
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    }

    if (validFiles.length > 0) {
      // Create previews for all valid files
      const previewPromises = validFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.onerror = () => {
            resolve(''); // Resolve with empty string on error
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previewPromises).then((previews) => {
        const validPreviews = previews.filter(p => p !== '');
        if (validPreviews.length > 0) {
          setImagePreviews(prev => [...prev, ...validPreviews]);
        }
      }).catch((error) => {
        console.error('Error generating previews:', error);
        setError('Failed to load image previews');
      });

      setImages(prev => [...prev, ...validFiles]);
    }

    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  // Handle image removal
  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const handleUploadAreaClick = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  // Function to reverse geocode coordinates to address
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.municipality || '';
        const state = addr.state || addr.region || '';
        const country = addr.country || '';
        return `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`.trim() || data.display_name;
      }
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error getting address:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Get current location using GPS
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const address = await getAddressFromCoordinates(lat, lng);
          setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng, address },
            location: address,
          }));
        } catch (error) {
          setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng, address: '' },
            location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          }));
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enable location permissions.');
        setIsGettingLocation(false);
      }
    );
  };

  // Handle GPS toggle
  useEffect(() => {
    if (formData.useGPS) {
      getCurrentLocation();
    }
  }, [formData.useGPS]);

  // Generate map embed URL using location coordinates
  const getMapUrl = () => {
    const { lat, lng } = formData.coordinates;
    // Use a simple embed URL format that works with coordinates
    const locationQuery = encodeURIComponent(formData.location);
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=13&output=embed`;
  };

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900">
      {/* Header */}
      <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Sell Item</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Item Details Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Item Details</h2>
            
            <div className="space-y-4">
              {/* Product Title */}
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter Product Title"
                  className={`w-full px-4 py-3 bg-[#F6EEE6] border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    validationErrors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#A05205]'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.title && (
                    <p className="text-xs text-red-500">{validationErrors.title}</p>
                  )}
                  <p className={`text-xs ml-auto ${titleCharCount > 100 ? 'text-red-500' : 'text-gray-500'}`}>
                    {titleCharCount}/100 characters
                  </p>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  rows={4}
                  placeholder="Describe Your product"
                  className={`w-full px-4 py-3 bg-[#F6EEE6] border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none ${
                    validationErrors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#A05205]'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.description && (
                    <p className="text-xs text-red-500">{validationErrors.description}</p>
                  )}
                  <p className={`text-xs ml-auto ${descriptionCharCount > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                    {descriptionCharCount}/500 characters
                  </p>
                </div>
              </div>

              {/* Proof/Reference Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proof or Reference Link</label>
                <input
                  type="url"
                  name="proofOrReferenceLink"
                  value={formData.proofOrReferenceLink}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 bg-[#F6EEE6] border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    validationErrors.proofOrReferenceLink ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#A05205]'
                  }`}
                />
                {validationErrors.proofOrReferenceLink && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.proofOrReferenceLink}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Enter a valid URL (must start with http:// or https://)</p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1200"
                      className="w-full px-4 py-3 bg-[#F6EEE6] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Category</h2>
            
            <div className="space-y-3">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleCategoryAdd}
                placeholder="Input Category"
                disabled={formData.categories.length >= 3}
                className="w-full px-4 py-3 bg-[#F6EEE6] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] transition-colors disabled:opacity-50"
              />
              
              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded-full text-sm"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => handleCategoryRemove(category)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500">Max 3 categories</p>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="space-y-4">
              {/* Map */}
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300">
                <iframe
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                />
                <div className="absolute top-2 left-2 flex gap-1 bg-white rounded shadow-md">
                  <button type="button" className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border-r border-gray-200">Map</button>
                  <button type="button" className="px-3 py-1 text-xs font-medium text-gray-500">Satellite</button>
                </div>
                <div className="absolute top-2 right-2 flex flex-col bg-[#F6EEE6] rounded shadow-md">
                  <button type="button" className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                  <button type="button" className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-t border-gray-200">−</button>
                </div>
              </div>

              {/* GPS Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#F6EEE6] rounded-lg border border-gray-200">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Current Location (GPS)</span>
                    {isGettingLocation && (
                      <span className="text-xs text-gray-500">Getting location...</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{formData.location}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.useGPS}
                    onChange={(e) => setFormData(prev => ({ ...prev, useGPS: e.target.checked }))}
                    disabled={isGettingLocation}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#ff6b35] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35] peer-disabled:opacity-50"></div>
                </label>
              </div>
              
              {/* Manual Location Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or enter location manually</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value, useGPS: false }))}
                      placeholder="Enter city, address, or coordinates"
                      className="w-full px-4 py-3 bg-[#F6EEE6] border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Attach Product Images Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Attach Product Images</h2>
            
            {/* Hidden file input */}
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,.jpg,.jpeg"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {/* Upload Area */}
            <div 
              onClick={handleUploadAreaClick}
              className="w-full h-48 bg-[#F6EEE6] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#A05205] transition-colors"
            >
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-500">Jpegs Only</p>
              {images.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{images.length} image(s) selected</p>
              )}
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageRemove(index);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || titleCharCount > 100 || descriptionCharCount > 500 || !formData.proofOrReferenceLink.trim()}
            className="w-full bg-[#A05205] hover:bg-[#B86215] text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Listing...' : 'List Item'}
          </button>
        </form>
      </div>
    </main>
  );
}
