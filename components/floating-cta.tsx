'use client';

import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

export default function FloatingCTA() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const getCTAText = () => {
    if (pathname.startsWith('/investors')) {
      return t('floating.cta.investors');
    } else if (pathname.startsWith('/user')) {
      return t('floating.cta.user');
    } else if (pathname.startsWith('/media')) {
      return t('floating.cta.media');
    } else if (pathname.startsWith('/collaborator')) {
      return t('floating.cta.collaborator');
    }
    return null;
  };

  const handleClick = () => {
    // Hacer scroll suave hacia el formulario correspondiente
    const formId = pathname.startsWith('/investors') 
      ? 'investor-form'
      : pathname.startsWith('/user')
      ? 'waitlist-form'
      : pathname.startsWith('/media')
      ? 'media-form'
      : pathname.startsWith('/collaborator')
      ? 'collaborator-form'
      : null;

    if (formId) {
      const formElement = document.getElementById(formId);
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const ctaText = getCTAText();

  // No mostrar en homepage
  if (!ctaText || pathname === '/') {
    return null;
  }

  const isMediaPage = pathname.startsWith('/media');
  const isInvestorsPage = pathname.startsWith('/investors');
  
  let buttonColorClass;
  if (isMediaPage) {
    buttonColorClass = 'bg-blue-500 hover:bg-blue-600 shadow-2xl hover:shadow-blue-500/50 border-l-2 border-t-2 border-b-2 border-blue-400/30';
  } else if (isInvestorsPage) {
    buttonColorClass = 'bg-indigo-500 hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-500/50 border-l-2 border-t-2 border-b-2 border-indigo-400/30';
  } else {
    buttonColorClass = 'bg-pink-500 hover:bg-pink-600 shadow-2xl hover:shadow-pink-500/50 border-l-2 border-t-2 border-b-2 border-pink-400/30';
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <button
        onClick={handleClick}
        className={`${buttonColorClass} text-white px-4 py-8 rounded-l-2xl rounded-r-none transition-all duration-300 hover:scale-105 group flex items-center gap-3 font-bold text-sm sm:text-base backdrop-blur-sm`}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <span className="transform rotate-180 whitespace-nowrap">{ctaText}</span>
        <ArrowRight className="w-5 h-5 transform rotate-90 group-hover:translate-y-1 transition-transform" />
      </button>
    </div>
  );
}

