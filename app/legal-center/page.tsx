'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function LegalCenterPage() {
  const { t } = useLanguage();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generar partículas suaves
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#36454F', marginTop: '-64px', paddingTop: '64px' }}>
      {/* Fondo animado sutil */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Partículas suaves flotantes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-25 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Líneas de flujo sutiles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-flow" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-flow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-flow" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Content Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white font-sans mx-auto">
              {t('legal.center.title')}
            </h1>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col items-center justify-center gap-6 mt-16">
            <Link 
              href="/dpa"
              className="w-full max-w-md px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 rounded-lg text-white font-sans text-base sm:text-lg transition-colors duration-300 text-center"
            >
              {t('legal.center.dpa')}
            </Link>
            <Link 
              href="/gdpr-cookie-consent"
              className="w-full max-w-md px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 rounded-lg text-white font-sans text-base sm:text-lg transition-colors duration-300 text-center"
            >
              {t('legal.center.gdpr')}
            </Link>
            <Link 
              href="/legal-compliance-handbook"
              className="w-full max-w-md px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 rounded-lg text-white font-sans text-base sm:text-lg transition-colors duration-300 text-center"
            >
              {t('legal.center.handbook')}
            </Link>
            <Link 
              href="/legal-governance-suite"
              className="w-full max-w-md px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 rounded-lg text-white font-sans text-base sm:text-lg transition-colors duration-300 text-center"
            >
              {t('legal.center.suite')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

