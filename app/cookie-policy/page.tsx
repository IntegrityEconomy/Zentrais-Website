'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function CookiePolicyPage() {
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
              {t('legal.cookie.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 font-sans">
              {t('legal.cookie.version')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.cookie.intro')}
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.cookie.section1.title')}
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.cookie.section1.essential.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section1.essential.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Login</li>
              <li>Security</li>
              <li>Preferences</li>
              <li>Session continuity</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 font-bold">
              {t('legal.cookie.section1.essential.cannot')}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.cookie.section1.functional.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section1.functional.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Performance improvements</li>
              <li>Error tracking</li>
              <li>Language preferences</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.cookie.section1.analytics.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section1.analytics.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Anonymous traffic measurement</li>
              <li>Platform performance insights</li>
            </ul>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section1.no')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Advertising cookies</li>
              <li>Cross-site tracking</li>
              <li>Behavioral profiling tools</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.cookie.section2.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.cookie.section2.desc')}
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.cookie.section3.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section3.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Accept all</li>
              <li>Reject non-essential</li>
              <li>Customize settings</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.cookie.section3.browser')}
            </p>
          </div>

          {/* Contact Section */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.cookie.section4.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.cookie.section4.desc')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              {t('legal.cookie.section4.office')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              {t('legal.cookie.section4.email')}
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans">
              5185 NW 75th Ave,<br />
              Lauderhill, FL 33319<br />
              USA.
            </p>
          </div>

          {/* Final Note */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              <strong className="text-white">{t('legal.cookie.final.title')}</strong>
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.cookie.final.desc')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

