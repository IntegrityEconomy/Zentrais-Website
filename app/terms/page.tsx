'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function TermsPage() {
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
              {t('legal.terms.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 font-sans">
              {t('legal.terms.effective')}
            </p>
          </div>

          {/* Welcome to Zentrais */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.welcome')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.intro')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.agree')}
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section1.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section1.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mt-4">
              {t('legal.terms.section1.aim')}
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section2.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section2.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Be at least 18 years old</li>
              <li>Have legal capacity to enter into agreements</li>
              <li>Agree to comply with all applicable laws</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section2.org')}
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section3.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section3.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section3.if')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>You must provide accurate information</li>
              <li>You must maintain the security of your credentials</li>
              <li>You are responsible for activity under your account</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section4.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section4.report')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-6">
              {t('legal.terms.section4.email')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section4.agree')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Violate any law</li>
              <li>Harass, harm, or exploit others</li>
              <li>Upload harmful code or attempt to breach systems</li>
              <li>Impersonate others or misrepresent identity</li>
              <li>Use Zentrais for illegal, fraudulent, or abusive purposes</li>
              <li>Interfere with platform integrity</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section4.honor')}
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section5.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section5.own')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section5.grant')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Display content within the platform</li>
              <li>Moderate content to ensure safety</li>
              <li>Use anonymized content for performance improvement</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section5.no')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section5.remove')}
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section6.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section6.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section6.understand')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>AI may generate, recommend, or respond to content</li>
              <li>AI may make errors or misinterpret statements</li>
              <li>You are responsible for your actions based on the AI output</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section6.no.advice')}
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section7.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section7.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Exploit security vulnerabilities</li>
              <li>Promote violence or hate</li>
              <li>Spread misinformation intentionally</li>
              <li>Create deepfakes to harm others</li>
              <li>Conduct unauthorized scraping or data extraction</li>
              <li>Launder identity or manipulate Integrity Scores</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section7.violations')}
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section8.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section8.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>You violate these Terms</li>
              <li>You compromise platform security</li>
              <li>You abuse another user</li>
              <li>You create legal or safety risk</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section8.you')}
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section9.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section9.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section9.guarantee')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Uninterrupted access</li>
              <li>Error-free performance</li>
              <li>Accuracy of AI-generated content</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section9.discretion')}
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section10.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section10.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais is not liable for damages, losses, or misuse arising from your use of the platform.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Liability is limited to the amount paid to Zentrais (if any) in the last 12 months.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section10.jurisdictions')}
            </p>
          </div>

          {/* Section 11 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section11.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section11.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Your violation of these Terms</li>
              <li>Your content</li>
              <li>Your misuse of the platform</li>
            </ul>
          </div>

          {/* Section 12 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section12.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section12.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section12.notify')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.terms.section12.continued')}
            </p>
          </div>

          {/* Section 13 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section13.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.terms.section13.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Delaware law</li>
              <li>Local laws in your jurisdiction (when applicable by privacy law)</li>
            </ul>
          </div>

          {/* Section 14 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.terms.section14.title')}
            </h2>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              {t('legal.terms.section14.office')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans">
              {t('legal.terms.section14.email')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

