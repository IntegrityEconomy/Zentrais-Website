'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function CareerPage() {
  const { t } = useLanguage();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  // Generar partículas suaves
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Asegurar que el fondo oscuro cubra toda la página
    document.body.style.backgroundColor = '#36454F';
    const mainElement = document.querySelector('main');
    if (mainElement) {
      (mainElement as HTMLElement).style.backgroundColor = '#36454F';
    }
    return () => {
      document.body.style.backgroundColor = 'transparent';
      if (mainElement) {
        (mainElement as HTMLElement).style.backgroundColor = '';
      }
    };
  }, []);

  return (
    <div className="text-white relative flex flex-col w-full" style={{ backgroundColor: '#36454F', marginTop: '-64px', paddingTop: '64px', minHeight: '100vh', width: '100%' }}>
      {/* Fondo animado sutil */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundColor: '#36454F' }}>
        {/* Partículas suaves flotantes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-25 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
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
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-24 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white font-sans mx-auto">
              {t('career.title')}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-8 text-white font-sans text-base sm:text-lg leading-relaxed">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                {t('career.hero.title')}
              </h2>
              <p>
                {t('career.hero.desc')}
              </p>
            </div>

            {/* Why Zentrais Section */}
            <div className="mt-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                {t('career.why.title')}
              </h2>
              <p className="mb-4">
                {t('career.why.desc')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>{t('career.why.engine1')}</strong> {t('career.why.engine1.desc')}</li>
                <li><strong>{t('career.why.engine2')}</strong> {t('career.why.engine2.desc')}</li>
                <li><strong>{t('career.why.engine3')}</strong> {t('career.why.engine3.desc')}</li>
              </ul>
              <p className="mt-4">
                {t('career.why.footer')}
              </p>
            </div>

            {/* Who Thrives Here Section */}
            <div className="mt-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                {t('career.thrives.title')}
              </h2>
              <p className="mb-4">{t('career.thrives.desc')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('career.thrives.item1')}</li>
                <li>{t('career.thrives.item2')}</li>
                <li>{t('career.thrives.item3')}</li>
                <li>{t('career.thrives.item4')}</li>
                <li>{t('career.thrives.item5')}</li>
              </ul>
              <p className="mt-4">
                {t('career.thrives.footer')}
              </p>
            </div>

            {/* Roles We're Strengthening Section */}
            <div className="mt-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                {t('career.roles.title')}
              </h2>
              <p className="mb-4">
                {t('career.roles.desc')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('career.roles.item1')}</li>
                <li>{t('career.roles.item2')}</li>
                <li>{t('career.roles.item3')}</li>
                <li>{t('career.roles.item4')}</li>
                <li>{t('career.roles.item5')}</li>
                <li>{t('career.roles.item6')}</li>
              </ul>
              <p className="mt-4">
                {t('career.roles.footer')}
              </p>
            </div>

            {/* How to Apply Section */}
            <div className="mt-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
                {t('career.apply.title')}
              </h2>
              <p className="mb-4">{t('career.apply.desc')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>{t('career.apply.item1')}</li>
                <li>{t('career.apply.item2')}</li>
                <li>{t('career.apply.item3')}</li>
              </ul>
              <p className="mb-2">
                <strong>{t('career.apply.email')}</strong> <a href="mailto:careers@zentrais.com" className="text-indigo-400 hover:text-indigo-300 underline">{t('career.apply.email.address')}</a>
              </p>
              <p className="mb-6">
                <strong>{t('career.apply.subject')}</strong> {t('career.apply.subject.text')}
              </p>
              <p className="font-bold text-xl mt-8">
                {t('career.apply.footer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto w-full flex-shrink-0" style={{ backgroundColor: '#36454F' }}>
        <Footer />
      </div>
    </div>
  );
}

