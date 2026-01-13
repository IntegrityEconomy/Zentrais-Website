'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const onboardingSlides = [
  {
    id: 1,
    title: 'Truth',
    description: 'Think clearly. Share truth. Explore perspectives.',
    graphic: 'truth',
  },
  {
    id: 2,
    title: 'Trust',
    description: 'Be understood. Speak from the heart.',
    graphic: 'trust',
  },
  {
    id: 3,
    title: 'Transparency',
    description: 'Trade with integrity.',
    graphic: 'transparency',
  },
  {
    id: 4,
    title: 'Your Integrity Ecosystem',
    description: '',
    graphic: 'logo',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = onboardingSlides[currentSlide];

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('zentrais.onboarding.completed', 'true');
      }
      router.push('/topics');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('zentrais.onboarding.completed', 'true');
    }
    router.push('/topics');
  };

  const renderGraphic = () => {
    if (slide.graphic === 'logo') {
      return (
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/Zentrais Flaticon 150x150-03.png"
            alt="Zentrais logo"
            width={64}
            height={64}
            className="object-contain"
          />
          <span className="text-2xl font-bold text-pink-700">Zentrais</span>
        </div>
      );
    }

    // Abstract graphics for Truth, Trust, Transparency
    return (
      <div className="w-32 h-32 mb-8 flex items-center justify-center">
        <div className="relative w-full h-full">
          {slide.graphic === 'truth' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#8B1538" strokeWidth="2" />
              <circle cx="50" cy="50" r="15" fill="#8B1538" />
              <line x1="30" y1="50" x2="45" y2="50" stroke="#8B1538" strokeWidth="2" />
              <line x1="55" y1="50" x2="70" y2="50" stroke="#8B1538" strokeWidth="2" />
            </svg>
          )}
          {slide.graphic === 'trust' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#8B1538" strokeWidth="2" />
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="#8B1538" strokeWidth="2" />
            </svg>
          )}
          {slide.graphic === 'transparency' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="25" y="40" width="50" height="20" fill="none" stroke="#8B1538" strokeWidth="2" rx="2" />
              <circle cx="50" cy="50" r="12" fill="#8B1538" />
            </svg>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {currentSlide > 0 ? (
          <button
            onClick={handleBack}
            className="p-2 text-gray-700 hover:bg-pink-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleSkip}
          className="text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        {renderGraphic()}
        <h2 className="text-3xl font-bold text-pink-800">{slide.title}</h2>
        {slide.description && (
          <p className="text-lg text-gray-700 max-w-sm">{slide.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-10">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-pink-700' : 'bg-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleNext}
          className="w-full bg-pink-700 hover:bg-pink-800 text-white rounded-full py-6 text-lg font-semibold"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

