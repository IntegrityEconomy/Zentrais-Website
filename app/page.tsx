'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ONBOARDING_STORAGE_KEY = 'zentrais.onboarding.completed';
const WELCOME_STORAGE_KEY = 'zentrais.welcome.completed';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const welcomeCompleted = window.localStorage.getItem(WELCOME_STORAGE_KEY);
      const onboardingCompleted = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      const authToken = window.localStorage.getItem('auth_token');

      if (!welcomeCompleted) {
        router.replace('/welcome');
      } else if (!onboardingCompleted) {
        router.replace('/onboarding');
      } else if (!authToken) {
        router.replace('/login');
      } else {
        router.replace('/feed');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
