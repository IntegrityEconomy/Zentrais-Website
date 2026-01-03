'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function PrivacyPage() {
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
              {t('legal.privacy.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 font-sans">
              {t('legal.privacy.version')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.privacy.intro')}
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section1.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section1.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section1.frameworks')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4 space-y-2 ml-4">
              <li>GDPR (European Union)</li>
              <li>CCPA/CPRA (California)</li>
              <li>LGPD (Brazil)</li>
              <li>PIPEDA (Canada)</li>
              <li>UK GDPR</li>
              <li>APPI (Japan)</li>
              <li>Global Privacy Control (GPC) standards</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section1.design')}
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section2.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.privacy.section2.desc')}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section2.1.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section2.1.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Profile information (optional).</li>
              <li>Content you create: messages, posts, uploads, interactions.</li>
              <li>Communication data when you contact support.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section2.2.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section2.2.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Device and browser data</li>
              <li>IP address (anonymized where possible)</li>
              <li>Usage logs</li>
              <li>Cookies and local storage (minimal, essential-only)</li>
              <li>Error logs</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section2.3.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section2.3.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.privacy.section2.3.security')}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section2.4.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section2.4.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section2.4.token')}
            </p>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section3.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section3.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>To operate core platform functions</li>
              <li>To maintain safety and prevent fraud, spam, and abuse</li>
              <li>To improve performance and user experience</li>
              <li>To comply with legal obligations</li>
              <li>To protect the integrity of our ecosystem</li>
              <li>To provide you with opt-in features such as account creation</li>
              <li>To show your contributions inside the platform based on your chosen visibility settings</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section3.no.sell')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section3.no.monetize')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section3.no.manipulate')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans font-bold">
              {t('legal.privacy.section3.ever')}
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section4.title')}
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section4.1.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.privacy.section4.1.desc')}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section4.2.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section4.2.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Cloud hosting</li>
              <li>Security and monitoring</li>
              <li>Analytics</li>
              <li>Identity verification partners</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section4.3.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              {t('legal.privacy.section4.3.desc')}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              {t('legal.privacy.section4.4.title')}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section4.4.desc')}
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section5.title')}
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>End-to-end encryption for data in motion.</li>
              <li>AES-256 encryption for data at rest.</li>
              <li>Zero Trust security model.</li>
              <li>Secure access controls and audit trails.</li>
              <li>Minimal data retention.</li>
              <li>Regular penetration testing.</li>
              <li>Obfuscation and anonymization of interaction data.</li>
              <li>Role-based access controls for internal teams.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section6.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section6.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4 space-y-2 ml-4">
              <li>Login</li>
              <li>Security</li>
              <li>User preferences</li>
              <li>Platform functionality</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section6.no')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4 space-y-2 ml-4">
              <li>Third-party advertising cookies</li>
              <li>Behavioral tracking cookies</li>
              <li>Cross-site profiling tools</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section6.manage')}
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section7.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section7.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section7.delete')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans font-bold">
              {t('legal.privacy.section7.forever')}
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section8.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section8.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Access your data</li>
              <li>Correct your data</li>
              <li>Delete your data</li>
              <li>Export your data</li>
              <li>Restrict or object to processing</li>
              <li>Withdraw consent</li>
              <li>Opt-out of data sale or sharing (we don&apos;t sell data anyway)</li>
              <li>File a complaint with your data protection authority</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section8.worldwide')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section8.exercise')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans">
              {t('legal.privacy.section8.email')}
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section9.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section9.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section9.collect')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section9.delete')}
            </p>
          </div>

          {/* Section 10 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section10.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section10.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section10.use')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Data Processing Agreements (DPAs)</li>
              <li>GDPR-compliant safeguards</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section11.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section11.desc')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section11.no')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6 space-y-2 ml-4">
              <li>Train external AI models with your data</li>
              <li>Share your private content with AI vendors</li>
              <li>Use your data to build commercial datasets</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section11.may')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Safety detection</li>
              <li>Abuse prevention</li>
              <li>Performance optimization</li>
              <li>Integrity scoring (non-personal, anonymized behavioral signals)</li>
            </ul>
          </div>

          {/* Section 12 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section12.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section12.1')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              {t('legal.privacy.section12.2')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section12.3')}
            </p>
          </div>

          {/* Section 13 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section13.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section13.desc')}
            </p>
          </div>

          {/* Section 14 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section14.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.section14.desc')}
            </p>
          </div>

          {/* Section 15 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.privacy.section15.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.privacy.section15.desc')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              {t('legal.privacy.section15.office')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              {t('legal.privacy.section15.email')}
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
              <strong className="text-white">{t('legal.privacy.final.title')}</strong>
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.privacy.final.desc')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

