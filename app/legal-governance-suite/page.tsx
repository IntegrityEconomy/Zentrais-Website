'use client';

import { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';

export default function LegalGovernanceSuitePage() {
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
              {t('legal.suite.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 font-sans mb-4">
              {t('legal.suite.date')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 font-sans">
              {t('legal.suite.index')}
            </h2>
          </div>

          {/* Index */}
          <div className="mb-12">
            <ol className="list-decimal list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>EULA for Mobile App</li>
              <li>AI Ethics & Responsible AI Policy</li>
              <li>Data Retention Schedule</li>
              <li>Transparency Report Template</li>
              <li>Third-Party Vendor Risk & Compliance Framework</li>
              <li>Acceptable Use Policy (AUP)</li>
              <li>DMCA Policy</li>
              <li>Terms for Influencers / Zenzers Program</li>
              <li>Community Guidelines</li>
              <li>Bug Bounty & Responsible Disclosure Policy</li>
              <li>Content Moderation Policy</li>
              <li>Integrity Economy Governance Charter</li>
              <li>Internal Data Access Policy</li>
              <li>Platform Risk Assessment Summary (for investors)</li>
              <li>AI Model Disclosure Statement (EU AI Act-ready)</li>
              <li>Global Compliance & Regulatory Matrix (US, EU, LATAM, APAC)</li>
              <li>Mobile App Permissions Statement (iOS - Android)</li>
              <li>White-Label / API Licensing Terms (for future partners)</li>
              <li>Contributor License Agreement (CLA) for open collaboration</li>
              <li>Data Room &quot;Legal & Governance Folder&quot; Executive Summary</li>
            </ol>
          </div>

          {/* Section 1 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              1. END USER LICENSE AGREEMENT (EULA — MOBILE APP)
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Effective Date: 11/15/2025
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Applies to: iOS, Android, progressive web apps
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              This Agreement governs the use of the Zentrais mobile application (&quot;App&quot;). By downloading or using the App, you agree to the following terms.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. License Grant
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Zentrais grants a limited, revocable, non-transferable, non-exclusive license to use the App for personal or authorized business use.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Restrictions
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Users may not:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Reverse engineer, decompile, or modify the App</li>
              <li>Attempt to access systems or data without authorization</li>
              <li>Use the App for illegal, harmful, or deceptive activity</li>
              <li>Copy, distribute, or sublicense any part of the App</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. App Updates
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              The App may be updated automatically. Continued use after updates implies acceptance.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Privacy & Data
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Use of the App is governed by Zentrais&apos; Privacy Policy, Terms of Service, and Security Policy.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5. Device Permissions
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              The App may request:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Camera access (optional features)</li>
              <li>Microphone (voice interactions)</li>
              <li>Push notifications</li>
              <li>Local storage</li>
              <li>Network access</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Users can disable permissions in their device settings.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              6. No Warranty
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              The App is provided &quot;as is.&quot; Zentrais makes no guarantees related to performance, accuracy, or uptime.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              7. Limitation of Liability
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              To the maximum extent permitted by law, Zentrais is not liable for damages arising from use of the App.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              8. Termination
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              We may terminate or suspend access if you violate this Agreement. You may stop using the App at any time.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              9. Contact
            </h3>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans">
              legal@zentrais.com
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              2. AI ETHICS & RESPONSIBLE AI POLICY
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Zentrais builds AI systems with integrity. This policy explains the principles guiding all AI interactions across Dialog, Perspective, and Exchange.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Core Principles
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li><strong className="text-white">Human-first</strong>: AI augments humans, not replaces them.</li>
              <li><strong className="text-white">Transparency</strong>: Users know when AI is being used.</li>
              <li><strong className="text-white">Fairness</strong>: No discrimination or algorithmic harm.</li>
              <li><strong className="text-white">Privacy</strong>: No external training on user data.</li>
              <li><strong className="text-white">Accountability</strong>: Human oversight for critical decisions.</li>
              <li><strong className="text-white">Security</strong>: Strong protection against misuse and manipulation.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Prohibited AI Uses
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais AI is never used for:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Profiling without consent</li>
              <li>Surveillance or monitoring</li>
              <li>Political manipulation</li>
              <li>Exploitation or coercion</li>
              <li>Behavior manipulation</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Data Use
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Internal performance improvement only</li>
              <li>No sale or external training datasets</li>
              <li>Only anonymized or aggregated analysis</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Safety Layers
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Moderation of harmful content</li>
              <li>Abuse detection models</li>
              <li>Human review escalation paths</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5. User Rights
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Users may:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Request explanations</li>
              <li>Request deletion of data</li>
              <li>Opt out of optional AI features</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              3. DATA RETENTION SCHEDULE
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              GDPR, CPRA, and global regulations compliant retention plan.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-base sm:text-lg text-gray-300 font-sans">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-8">Data Type</th>
                    <th className="text-left py-2 pr-8">Retention Period</th>
                    <th className="text-left py-2">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Account Information</td>
                    <td className="py-2 pr-8">Until user deletes account</td>
                    <td className="py-2">Operational necessity</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Content (posts, messages)</td>
                    <td className="py-2 pr-8">Until deletion or account closure</td>
                    <td className="py-2">Platform functionality</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Logs & Metadata</td>
                    <td className="py-2 pr-8">30-180 days</td>
                    <td className="py-2">Security, abuse prevention</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Payment Data</td>
                    <td className="py-2 pr-8">As required by financial law (3-7 years)</td>
                    <td className="py-2">Regulatory compliance</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Backup Data</td>
                    <td className="py-2 pr-8">30-90 days</td>
                    <td className="py-2">Disaster recovery</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-8">Support Tickets</td>
                    <td className="py-2 pr-8">12-24 months</td>
                    <td className="py-2">Quality and documentation</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-8">Identity Verification Tokens</td>
                    <td className="py-2 pr-8">24 hours or until confirmation</td>
                    <td className="py-2">Fraud prevention</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              All data is deleted or anonymized after retention expiration.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              4. TRANSPARENCY REPORT TEMPLATE
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              A quarterly report template for public trust and compliance.
            </p>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-6 font-bold">
              ZENTRAIS TRANSPARENCY REPORT — [Quarter/Year]
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Overview
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Summary of integrity initiatives and platform updates.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Content Moderation
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Number of flagged posts: ___</li>
              <li>AI-detected violations: ___</li>
              <li>Human-reviewed cases: ___</li>
              <li>Suspensions/terminations: ___</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Government Requests
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Requests received: ___</li>
              <li>Requests denied: ___</li>
              <li>Data produced (counts only): ___</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Security Incidents
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Breaches: 0 / ___</li>
              <li>Mitigated vulnerabilities: ___</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5. User Privacy Requests
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Data access requests: ___</li>
              <li>Deletion requests: ___</li>
              <li>Portability requests: ___</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              6. Improvements Made
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Security enhancements</li>
              <li>Model updates</li>
              <li>Policy refinements</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              5. THIRD-PARTY VENDOR RISK & COMPLIANCE FRAMEWORK
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Vendor Categories
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Hosting</li>
              <li>Security</li>
              <li>Identity verification</li>
              <li>Analytics</li>
              <li>Communication tools</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Requirements
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Vendors must meet:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>GDPR (General Data Protection Regulation)</li>
              <li>CPRA (California Privacy Rights Act)</li>
              <li>SOC 2 (Service Organization Control 2)</li>
              <li>ISO 27001 (Information Security Management System standard)</li>
              <li>Zero data sale policy</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Due Diligence Process
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Security questionnaire</li>
              <li>Contractual DPAs (Data Processing Agreements)</li>
              <li>Testing + audits</li>
              <li>Annual reviews</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Offboarding
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Data deletion confirmation</li>
              <li>Access removal</li>
              <li>Contract termination review</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              6. ACCEPTABLE USE POLICY (AUP)
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Users must not:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Harm, harass, or defraud others</li>
              <li>Spread malware or attempt unauthorized access</li>
              <li>Use bots or automation to manipulate interactions</li>
              <li>Upload or promote illegal content</li>
              <li>Spread intentional misinformation</li>
              <li>Disrupt platform integrity</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Violations lead to a warning, suspension, or removal.
            </p>
          </div>

          {/* Section 7 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              7. DMCA POLICY
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Reporting Infringement
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Submit a notice to: dmca@zentrais.com with:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Identification of copyrighted work</li>
              <li>Identification of infringing content</li>
              <li>Contact information</li>
              <li>Signed statement of good faith</li>
              <li>Statement of authority</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Counter-Notice Process
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Users may submit a counter-notice if content is removed in error.
            </p>
          </div>

          {/* Section 8 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              8. TERMS FOR INFLUENCERS / ZENZERS PROGRAM
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Expectations
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zenzers must:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Represent Zentrais truthfully</li>
              <li>Uphold the Integrity Economy</li>
              <li>Avoid deceptive endorsements</li>
              <li>Use only approved branding assets</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Compensation
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              May include:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Integrity Tokens</li>
              <li>Early access benefits</li>
              <li>Recognition inside the platform</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Content Ownership
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Creators retain ownership; Zentrais receives limited promotional rights with consent.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              9. COMMUNITY GUIDELINES
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Simple, direct rules:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Respect others</li>
              <li>No hate, harassment, or exploitation</li>
              <li>No impersonation</li>
              <li>No harmful misinformation</li>
              <li>No graphic violence</li>
              <li>Protect personal privacy</li>
              <li>Contribute with integrity</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              10. BUG BOUNTY & RESPONSIBLE DISCLOSURE POLICY
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Reporting Vulnerabilities
            </h3>
            <p className="text-base sm:text-lg text-white leading-relaxed font-sans mb-6">
              Email: security@zentrais.com
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Eligibility
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Valid reports include:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Security flaws</li>
              <li>Data exposure</li>
              <li>Authentication bypass</li>
              <li>Injection vulnerabilities</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Rewards
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Based on severity (low - critical).
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Rules
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>No violation of user privacy</li>
              <li>No extortion</li>
              <li>No public disclosure before the patch</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              11. CONTENT MODERATION POLICY
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Hybrid Moderation
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>AI pre-screening</li>
              <li>Human review for escalations</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Categories of Review
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Hate speech</li>
              <li>Violence</li>
              <li>Fraud</li>
              <li>Exploitation</li>
              <li>Misinformation</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Enforcement Levels
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Warning</li>
              <li>Temporary restriction</li>
              <li>Permanent removal</li>
            </ul>
          </div>

          {/* Section 12 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              12. INTEGRITY ECONOMY GOVERNANCE CHARTER
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Defines how Zentrais rewards ethical behavior.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Core Principles
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Verified contribution</li>
              <li>Transparent scoring</li>
              <li>User empowerment</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Integrity Tokens
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Earned through:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Constructive participation</li>
              <li>Original insights</li>
              <li>Community support</li>
              <li>Verified truthfulness</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Governance
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Oversight board</li>
              <li>Appeal process for disputes</li>
              <li>Transparent scoring logic (non-exploitable)</li>
            </ul>
          </div>

          {/* Section 13 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              13. INTERNAL DATA ACCESS POLICY
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Least Privilege
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Only necessary personnel have access to user data.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Access Logs
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              All internal access is logged and monitored.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Permissions
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Role-based</li>
              <li>Revoked immediately upon offboarding</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Violations
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Immediate termination + investigation.
            </p>
          </div>

          {/* Section 14 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              14. PLATFORM RISK ASSESSMENT SUMMARY (Investors)
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Core Risks
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>AI misuse</li>
              <li>Privacy violations</li>
              <li>System outages</li>
              <li>Regulatory changes</li>
              <li>Bad actors exploiting anonymity</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Mitigations
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Zero Trust security</li>
              <li>Identity verification partners</li>
              <li>Strong moderation</li>
              <li>Legal compliance monitoring</li>
              <li>Multi-region cloud redundancy</li>
            </ul>
          </div>

          {/* Section 15 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              15. AI MODEL DISCLOSURE STATEMENT (EU AI ACT-READY)
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Zentrais AI systems are:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>High-transparency</li>
              <li>Non-biometric</li>
              <li>Non-classification of protected attributes</li>
              <li>Non-manipulative</li>
              <li>Human-supervised</li>
              <li>Explainable upon request</li>
              <li>Accountable through continuous audits</li>
            </ul>
          </div>

          {/* Section 16 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              16. GLOBAL COMPLIANCE & REGULATORY MATRIX
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. US (CPRA/CCPA)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Opt-out rights</li>
              <li>Data-access rights</li>
              <li>Strict data sale prohibition</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. EU (GDPR)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Lawful basis</li>
              <li>Data minimization</li>
              <li>72-hour breach notification</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Brazil (LGPD)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Legal bases</li>
              <li>User consent</li>
              <li>Controller/Processor responsibilities</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              4. Canada (PIPEDA)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Accountability</li>
              <li>Safeguards</li>
              <li>Individual access rights</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              5. Japan (APPI)
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Cross-border transfer protections</li>
            </ul>
          </div>

          {/* Section 17 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              17. MOBILE APP PERMISSIONS STATEMENT
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              The App may request:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-4">
              <li>Camera (optional)</li>
              <li>Microphone (talk-to-AI features)</li>
              <li>Notifications</li>
              <li>Local storage</li>
              <li>Internet access</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              No location tracking or background surveillance.
            </p>
          </div>

          {/* Section 18 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              18. WHITE-LABEL / API LICENSING TERMS
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Grant
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              Non-exclusive, revocable API license.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Limits
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              No redistribution, no resale, no model extraction.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              3. Requirements
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Attribution</li>
              <li>Security protections</li>
              <li>Data processing compliance</li>
            </ul>
          </div>

          {/* Section 19 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              19. CONTRIBUTOR LICENSE AGREEMENT (CLA)
            </h2>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              1. Rights Granted
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-4">
              Contributors give Zentrais:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4 mb-6">
              <li>Right to use, modify, distribute</li>
              <li>Patent license for contributed work</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              2. Contributor Promises
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
              Work is original and not in violation of other rights.
            </p>
          </div>

          {/* Section 20 */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-sans">
              20. LEGAL & GOVERNANCE DATA ROOM SUMMARY
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-6">
              A 1-page overview for investors.
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-sans">
              Included Documents
            </h3>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-300 leading-relaxed font-sans space-y-2 ml-4">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Security Policy</li>
              <li>DPA</li>
              <li>Moderation Policy</li>
              <li>AI Ethics Policy</li>
              <li>Governance Charter</li>
              <li>Risk Assessments</li>
              <li>Compliance Matrix</li>
              <li>Equity & Token Governance</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

