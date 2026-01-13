'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function WelcomePage() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Welcome To Zentrais';
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowContinue(true), 500);
      }
    }, 100); // Typing speed

    return () => clearInterval(typingInterval);
  }, []);

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('zentrais.welcome.completed', 'true');
    }
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-6 px-6">
        {/* Logo */}
        <div className="h-24 w-24 rounded-full flex items-center justify-center mb-4">
          <Image
            src="/Zentrais Flaticon 150x150-03.png"
            alt="Zentrais logo"
            width={96}
            height={96}
            priority
            className="object-contain"
          />
        </div>

        {/* App Name */}
        <h1 className="text-2xl font-bold text-gray-900">Zentrais</h1>

        {/* Greeting */}
        <p className="text-lg text-red-500 font-medium">Hey! There</p>

        {/* Typing Animation */}
        <div className="h-8 flex items-center">
          <p className="text-lg text-gray-800 font-medium">
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Continue Button */}
        {showContinue && (
          <button
            onClick={handleContinue}
            className="mt-8 px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

