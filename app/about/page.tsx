'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function AboutPage() {
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
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-24 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white font-sans mx-auto">
              {t('about.title')}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6 text-white font-sans text-base sm:text-lg leading-relaxed">
            <p>
              {t('about.content.p1')} <strong>{t('about.content.integrity')}</strong>{t('about.content.p2')}
            </p>
            
            <p>
              {t('about.content.p3')} <strong>{t('about.content.truth')}</strong> {t('about.content.p4')}
            </p>
            
            <p>
              {t('about.content.p5')}
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>{t('about.content.engine1')}</strong> {t('about.content.engine1.desc')}</li>
              <li><strong>{t('about.content.engine2')}</strong> {t('about.content.engine2.desc')}</li>
              <li><strong>{t('about.content.engine3')}</strong> {t('about.content.engine3.desc')}</li>
            </ul>
            
            <p>
              {t('about.content.p6')}
            </p>
            
            <p>
              {t('about.content.p7')}
            </p>
            
            <p>
              {t('about.content.p8')}
            </p>
            
            <p>
              {t('about.content.p9')}
            </p>
            
            <p>
              {t('about.content.p10')}
            </p>
            
            <p className="font-bold text-xl mt-8">
              <strong>{t('about.content.footer')}</strong>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-auto w-full flex-shrink-0" style={{ backgroundColor: '#36454F' }}>
        <Footer />
      </div>
    </div>
  );
}

