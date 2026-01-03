'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function LegalComplianceHandbookPage() {
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
              {t('legal.handbook.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 font-sans mb-4">
              {t('legal.handbook.date')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 font-sans">
              {t('legal.handbook.version')}
            </p>
          </div>

          {/* Version and Scope */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.handbook.scope.desc')}
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Users</li>
              <li>Investors</li>
              <li>Partners</li>
              <li>Regulators</li>
              <li>Internal teams</li>
              <li>Advisory/legal review</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.handbook.scope.master')}
            </p>
          </div>

          {/* Section 0 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.handbook.section0.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              {t('legal.handbook.section0.desc')}
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-4 font-bold">
              {t('legal.handbook.section0.pillars')}
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              {t('legal.handbook.section0.outline')}
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              {t('legal.handbook.section1.title')}
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1.1 Terms of Service (Summary)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Defines user rights and responsibilities.</li>
              <li>Covers eligibility, account use, prohibited behavior, AI limitations, termination, disclaimers, and liability limits.</li>
              <li>Controls apply across Dialog, Perspective, and Exchange.</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Full text maintained internally as the master reference.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1.2 Privacy Policy (Summary)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>We collect minimal personal data required to operate safely.</li>
              <li>No data sale. No behavioral ads. No exploitation.</li>
              <li>Users retain ownership of their content.</li>
              <li>Rights include access, deletion, correction, portability, and objection.</li>
              <li>Global compliance: GDPR, CPRA, LGPD, PIPEDA, APPI.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1.3 Cookie Policy
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Only essential and performance cookies used.</li>
              <li>No advertising or cross-site tracking cookies.</li>
              <li>Users can reject all non-essential cookies.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1.4 End User License Agreement (EULA)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Applies to iOS, Android, and progressive web apps.</li>
              <li>Grants a limited personal license to use the app.</li>
              <li>Covers updates, restrictions, device permissions, warranties, and termination.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1.5 Data Processing Agreement (DPA)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Zentrais = Processor; User = Controller.</li>
              <li>Supports privacy rights globally.</li>
              <li>Ensures encryption, sub-processor controls, international transfer safeguards, and breach notification within 72 hours.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              2. SECURITY & DATA PROTECTION
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2.1 Security Policy
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais uses:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Zero Trust architecture</li>
              <li>AES-256 encryption at rest</li>
              <li>TLS 1.3 encryption in transit</li>
              <li>Role-based access control</li>
              <li>Continuous monitoring</li>
              <li>Regular penetration tests</li>
              <li>Audits across infrastructure</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Data backups are encrypted with geo-redundancy.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2.2 Internal Data Access Policy
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Access granted strictly by job role.</li>
              <li>All access is logged and continuously monitored.</li>
              <li>Access is revoked immediately upon offboarding.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2.3 Responsible Disclosure / Bug Bounty
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Security researchers may report vulnerabilities to:
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-4">
              security@zentrais.com
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Rewards based on severity.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              No extortion, no disruption, no unauthorized data access.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2.4 Data Retention Schedule (Summary)
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-base sm:text-lg text-gray-300 font-sans">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-8">Data Type</th>
                    <th className="text-left py-2">Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Account Data</td>
                    <td className="py-2">Until account deletion</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Messages/Posts</td>
                    <td className="py-2">Until deleted or account closure</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Logs</td>
                    <td className="py-2">30-180 days</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Backups</td>
                    <td className="py-2">30-90 days</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Support Tickets</td>
                    <td className="py-2">12-24 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-8">Verification Tokens</td>
                    <td className="py-2">24 hours or until confirmation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              3. PLATFORM USE & BEHAVIOR
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3.1 Acceptable Use Policy
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Users must not:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Harass, harm, or impersonate others</li>
              <li>Spread malware or attempt unauthorized access</li>
              <li>Use bots to manipulate systems</li>
              <li>Promote illegal activity</li>
              <li>Intentionally spread misinformation</li>
              <li>Disrupt platform integrity</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Violations lead to warnings, restrictions, or termination.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3.2 Community Guidelines
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Core expectations:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Respect others</li>
              <li>Protect privacy</li>
              <li>No hate, exploitation, or harmful content</li>
              <li>No graphic violence</li>
              <li>Participate with Integrity</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3.3 Content Moderation Policy
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Hybrid moderation system:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>AI pre-screening</li>
              <li>Human review for escalations</li>
              <li>Enforcement ladder: warning → restriction → removal</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Content categories include misinformation, hate speech, violence, spam, and fraud.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3.4 DMCA Policy
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Copyright claims sent to:
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-4">
              dmca@zentrais.com
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Must include:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Identification of copyrighted work</li>
              <li>Identification of content</li>
              <li>Good-faith statement</li>
              <li>Authority statement</li>
              <li>Signature</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mt-4">
              Counter-notices supported.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              4. ARTIFICIAL INTELLIGENCE & ETHICS
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4.1 Responsible AI Policy
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Principles:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Human-first</li>
              <li>Transparency</li>
              <li>Fairness</li>
              <li>Accountability</li>
              <li>Privacy protection</li>
              <li>Security</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais AI does not:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Manipulate behavior</li>
              <li>Profile sensitive attributes</li>
              <li>Train on user identities</li>
              <li>Sell or export user data</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4.2 AI Model Disclosure (EU AI Act-Ready)
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais AI systems are:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Transparent</li>
              <li>Non-biometric</li>
              <li>Non-surveillance</li>
              <li>Non-manipulative</li>
              <li>Audited regularly</li>
              <li>Human-supervised</li>
              <li>Explainable upon request</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4.3 Safety Systems
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Safety systems are in place to detect and prevent harmful AI outputs, with continuous monitoring and human oversight.
            </p>
          </div>

          {/* Section 5 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              5. INTEGRITY ECONOMY & GOVERNANCE
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5.1 Governance Charter
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Defines how the Integrity Economy operates, including:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Verified contributions</li>
              <li>Transparent scoring logic</li>
              <li>Tokenized rewards (ZNT)</li>
              <li>Oversight board</li>
              <li>User appeal process</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5.2 Zenzers Program Terms
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              States requirements for influencers and ambassadors:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Represent Zentrais truthfully</li>
              <li>Use approved materials</li>
              <li>Uphold Integrity standards</li>
              <li>Avoid deceptive practices</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mt-4">
              Compensation may include tokens, recognition, or platform benefits.
            </p>
          </div>

          {/* Section 6 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              6. COMPLIANCE & RISK MANAGEMENT
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              6.1 Third-Party Vendor Risk Framework
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Lists requirements for all vendors:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>GDPR and CPRA compliance</li>
              <li>Security certifications (SOC2 / ISO 27001)</li>
              <li>No data sale</li>
              <li>Encrypted transfers</li>
              <li>Signed DPA</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Annual reviews are mandatory.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              6.2 Global Privacy & Compliance Matrix
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Specifically for the US (CPRA/CCPA):
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Opt-out rights</li>
              <li>Right to delete</li>
              <li>Right to know</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              7. API & WHITE-LABEL LICENSING
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              7.1 Device Permissions
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              App may request:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Microphone</li>
              <li>Notifications</li>
              <li>Local storage</li>
              <li>Network access</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              No background surveillance, no location tracking.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              7.2 API & White-Label Licensing
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Partners receive:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Non-exclusive API license</li>
              <li>Strict data privacy obligations</li>
              <li>No model extraction</li>
              <li>No resale or redistribution</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              7.3 Contributor License Agreement (CLA)
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Contributors grant Zentrais:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Rights to use, modify, and distribute submitted work</li>
              <li>Patent license for contributions</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mt-4">
              Contributors confirm originality.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              8. TRANSPARENCY & ACCOUNTABILITY
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              8.1 Transparency Report Template (Quarterly)
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Reports include:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Moderation statistics</li>
              <li>Security incidents</li>
              <li>Government requests</li>
              <li>User privacy requests</li>
              <li>Integrity improvements</li>
              <li>System reliability updates</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              8.2 Human Version of Privacy (Plain Words)
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              Your data is yours.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              We don&apos;t sell it.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              We don&apos;t track you across the web.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              We only collect what&apos;s needed to run Zentrais safely.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-2">
              You can delete everything whenever you want.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              No secrets. No exploitation. Full transparency.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              9. HANDBOOK GOVERNANCE
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              9.1 Updates
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              The Handbook may be updated to reflect:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Product changes</li>
              <li>Regulatory changes</li>
              <li>Security enhancements</li>
              <li>New features</li>
              <li>New AI frameworks</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Material updates will be communicated.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              9.2 Contact
            </h3>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              Zentrais Legal & Compliance Office
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              legal@zentrais.com
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-2">
              privacy@zentrais.com
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans">
              security@zentrais.com
            </p>
          </div>

          {/* Final Note */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              FINAL NOTE
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              This Handbook reflects the foundation of Zentrais:
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-4 font-bold">
              Truth. Trust. Transparency.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              It ensures legal protection, ethical operation, user safety, and investor-level governance as we scale into a global ecosystem.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

