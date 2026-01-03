'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { ArrowRight, Globe, Target, Zap, TrendingUp, Sparkles, FileText, Phone, ClipboardList } from 'lucide-react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';
import { motion } from 'framer-motion';
import CollaboratorForm from '../../components/forms/collaborator-form';

const VideoYoutube = dynamic(() => import('../../components/video-youtube'), { ssr: false });

// These will be defined inside the component to use translations

export default function CollaboratorPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = `Zentrais | ${t('pagetitle.collaborator')}`;
  }, [t, language]);

  const [collaborationFormData, setCollaborationFormData] = useState({
    brandName: '',
    contactPerson: '',
    emailPhone: '',
    collaborationTrack: '',
    optionalNotes: '',
  });
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

  const handleBecomePartner = () => {
    const formElement = document.getElementById('collaborator-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactPartnerships = () => {
    window.location.href = 'mailto:partnerships@zentrais.com?subject=Partnerships Inquiry';
  };

  const handleStartCollaboration = () => {
    const formElement = document.getElementById('collaborator-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCollaborationFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = 'Start Your Collaboration Application';
    const body = `
Brand / Company Name: ${collaborationFormData.brandName}
Contact Person: ${collaborationFormData.contactPerson}
Email / Phone: ${collaborationFormData.emailPhone}
Preferred Collaboration Track: ${collaborationFormData.collaborationTrack}
Optional Notes: ${collaborationFormData.optionalNotes || 'Not provided'}
    `.trim();
    window.location.href = `mailto:collaborators@zentrais.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCollaborationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCollaborationFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden collaborator-body collaborator-tone -mt-16 pt-16" style={{ backgroundColor: '#36454F' }}>
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
        {/* YouTube Video Embed */}
        <div className="relative z-10 mb-12 sm:mb-16 md:mb-20 flex justify-center">
          <div className="w-full max-w-6xl px-4 sm:px-6">
            <div className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
              {/* Glow effect behind video */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Border gradient */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Inner shadow container */}
              <div className="absolute inset-0.5 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
              
              {/* Video iframe */}
              <VideoYoutube
                videoId="-uvjvRhY-lQ"
                controls={0}
                className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all duration-300"
              />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Left Section - Text Content */}
            <div className="text-left flex flex-col justify-center relative z-10">
              {/* Headline with animation */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 text-white leading-tight collaborator-heading tracking-tight relative"
              >
                <span className="relative inline-block">
                  Partner with the first Integrity Economy platform.
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></span>
                </span>
              </motion.h1>

              {/* Sub-headline with animation */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed collaborator-body relative group"
              >
                <span className="relative inline-block">
                  Zentrais connects brands, creators, media, and tech innovators with verified audiences inside a Human+AI ecosystem built on trust, relevance, and real engagement.
                  {/* Subtle glow on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                </span>
              </motion.p>

              {/* CTAs with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto"
              >
                <Button
                  onClick={handleBecomePartner}
                  className="group relative tone-button text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto"
                >
                  {/* Animated background gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Become a Partner →
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button
                  onClick={() => window.location.href = 'mailto:collaboration@zentrais.com?subject=Partnerships Team Contact'}
                  variant="outline"
                  className="group relative bg-transparent border-2 border-indigo-400/50 text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-400/20 hover:shadow-2xl hover:shadow-indigo-500/30 overflow-hidden w-full sm:w-auto whitespace-nowrap"
                >
                  {/* Animated border glow */}
                  <span className="absolute inset-0 border-2 border-indigo-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 text-center">Contact Partnerships Team</span>
              </Button>
              </motion.div>
            </div>

            {/* Right Section - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex items-center justify-center lg:justify-end self-stretch relative z-10 mt-8 lg:mt-0"
            >
              <div className="relative w-full max-w-2xl">
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-auto">
                  <Image
                    src="/meeting.png"
                    alt="Business meeting with dashboard"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Partner with Zentrais Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              Why Partner with Zentrais
              </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"></div>
          </motion.div>

          {/* Mini Infographic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Reach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl sm:text-2xl text-white mb-3 collaborator-heading group-hover:text-indigo-300 transition-colors">
                Reach
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                Verified global users with real identities, not bots.
              </p>
            </motion.div>

            {/* Relevance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl sm:text-2xl text-white mb-3 collaborator-heading group-hover:text-indigo-300 transition-colors">
                Relevance
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                AI-matched interactions ensure your message lands with the right communities.
              </p>
            </motion.div>

            {/* Innovation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl sm:text-2xl text-white mb-3 collaborator-heading group-hover:text-indigo-300 transition-colors">
                Innovation
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                Access a new Integrity Economy powered by CRI scoring and verified insights.
              </p>
            </motion.div>

            {/* Brand Enhancement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
              <h3 className="text-xl sm:text-2xl text-white mb-3 collaborator-heading group-hover:text-indigo-300 transition-colors">
                Brand Enhancement
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                Be an early leader in trust-based digital engagement.
              </p>
            </motion.div>

            {/* First-Mover Advantage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group md:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60 transition-all">
                <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
              <h3 className="text-xl sm:text-2xl text-white mb-3 collaborator-heading group-hover:text-indigo-300 transition-colors">
                First-Mover Advantage
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                Shape the platform and co-create early features with our founding team.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Value Snapshot Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight px-2">
              Partner Value Snapshot
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed collaborator-body px-2">
              As a brand or media partner, you will:
            </p>
          </motion.div>

          {/* Bullet Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="tone-card bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-800/40 rounded-2xl sm:rounded-3xl border-2 border-indigo-400/30 p-5 sm:p-6 md:p-8 lg:p-10 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
          >
            <ul className="space-y-4 sm:space-y-5">
              {[
                'Reach users across global Dialog and Perspective sessions',
                'Engage with AI-matched audiences in real time',
                'Participate in verified, identity-driven interactions',
                'Co-launch live events, collaborative formats, and thought-leadership spaces',
                'Access insights through the CRI model and integrity-based interaction analytics',
                'Share revenue from marketplace transactions inside the Exchange engine',
                'Build credibility by aligning with transparency, trust, and accountability',
              ].map((text, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4 group/item"
                >
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mt-0.5 sm:mt-1 group-hover/item:bg-indigo-500/30 group-hover/item:border-indigo-400/60 transition-all">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400"></div>
                  </div>
                  <span className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed collaborator-body group-hover/item:text-white transition-colors flex-1">
                    {text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FOR PARTNERS Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 text-white leading-tight collaborator-heading font-bold">
              {t('collaborator.partners.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-pink-500/60 to-transparent"></div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {/* Left Column - Who we partner with */}
            <div className="group relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8 sm:p-10 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] transition-all duration-500 hover:border-pink-400/40 hover:scale-[1.02]">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-pink-400 to-indigo-400 rounded-full"></div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold collaborator-heading">
                    {t('collaborator.partners.who.title')}
                  </h3>
                </div>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item1')}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item2')}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item3')}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item4')}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item5')}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-pink-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      <strong className="text-white font-semibold">{t('collaborator.partners.who.item6')}</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - What you get */}
            <div className="group relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8 sm:p-10 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] transition-all duration-500 hover:border-indigo-400/40 hover:scale-[1.02]">
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-indigo-400 to-pink-400 rounded-full"></div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold collaborator-heading">
                    {t('collaborator.partners.what.title')}
                  </h3>
                </div>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item1')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item2')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item3')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item4')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item5')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <div className="mt-1.5 w-3 h-3 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-sm rotate-45 flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover/item:scale-110 transition-transform duration-300"></div>
                    <span className="text-gray-100 text-base sm:text-lg leading-relaxed pt-0.5">
                      {t('collaborator.partners.what.item6')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="tone-card bg-gradient-to-br from-indigo-500/15 via-indigo-500/10 to-purple-500/10 rounded-3xl border-2 border-indigo-400/40 p-8 sm:p-10 md:p-12 hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <span className="text-sm uppercase tracking-wider text-amber-300 mb-2 block">Case Study</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 collaborator-heading">
                  Brand X (Hypothetical)
                </h2>
                <p className="text-lg text-gray-300">
                  Brand X partnered with Zentrais to host a "Live Integrity Dialog" around sustainability.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 collaborator-heading">Their campaign:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="tone-card bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-800/40 rounded-xl border-2 border-amber-400/30 p-4 hover:border-amber-400/60 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-amber-300 mb-1">18,000</div>
                    <div className="text-gray-300 text-sm sm:text-base">Verified users across 14 regions</div>
                  </div>
                  <div className="tone-card bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-800/40 rounded-xl border-2 border-amber-400/30 p-4 hover:border-amber-400/60 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-amber-300 mb-1">6.2×</div>
                    <div className="text-gray-300 text-sm sm:text-base">Higher engagement than traditional social channels</div>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Matched audiences using Zentrais' interest graph + CRI alignment",
                    "Produced actionable insight segments used in their content strategy",
                    "Led to a co-created marketplace drop inside Exchange",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-amber-300"></div>
                      <span className="text-gray-200 text-base sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tone-card bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-amber-500/5 rounded-xl border-2 border-amber-400/40 p-6">
                <p className="text-lg sm:text-xl font-semibold text-white mb-2 collaborator-heading">Result:</p>
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                  Deeper trust, higher retention, and a more meaningful brand–audience relationship.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="tone-card bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-slate-800/40 rounded-2xl border-2 border-purple-400/30 p-6 sm:p-8 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              <p className="text-gray-200 text-lg sm:text-xl mb-4 leading-relaxed italic">
                "Zentrais opened a new channel for real conversations, not performative noise."
              </p>
              <p className="text-gray-400 text-sm sm:text-base">— Early Pilot Partner</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="tone-card bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-slate-800/40 rounded-2xl border-2 border-pink-400/30 p-6 sm:p-8 hover:border-pink-400/60 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300"
            >
              <p className="text-gray-200 text-lg sm:text-xl mb-4 leading-relaxed italic">
                "This is the only platform where identity, trust, and relevance are aligned by design."
              </p>
              <p className="text-gray-400 text-sm sm:text-base">— Strategic Advisor</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Materials Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight collaborator-heading">
              Partner Materials
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Make it clean and frictionless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <button
                onClick={() => window.location.href = 'mailto:collaboration@zentrais.com?subject=Partner Overview PDF Request'}
                className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40 rounded-2xl border-2 border-indigo-400/30 p-6 sm:p-8 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 w-full h-full flex flex-col items-center justify-center min-h-[140px] group"
              >
                <FileText className="w-12 h-12 mb-3" style={{ color: '#7c3aed' }} />
                <span className="text-white text-base sm:text-lg font-semibold text-center group-hover:text-indigo-300 transition-colors">Download Partner Overview (PDF)</span>
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <button
                onClick={() => window.location.href = 'mailto:collaboration@zentrais.com?subject=Partnership Call Request'}
                className="tone-card bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-slate-800/40 rounded-2xl border-2 border-purple-400/30 p-6 sm:p-8 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full h-full flex flex-col items-center justify-center min-h-[140px] group"
              >
                <Phone className="w-12 h-12 mb-3" style={{ color: '#7c3aed' }} />
                <span className="text-white text-base sm:text-lg font-semibold text-center group-hover:text-purple-300 transition-colors">Request Partnership Call</span>
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <button
                onClick={() => window.location.href = 'mailto:collaboration@zentrais.com?subject=Collaboration Framework Request'}
                className="tone-card bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-slate-800/40 rounded-2xl border-2 border-pink-400/30 p-6 sm:p-8 hover:border-pink-400/60 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 w-full h-full flex flex-col items-center justify-center min-h-[140px] group"
              >
                <ClipboardList className="w-12 h-12 mb-3" style={{ color: '#7c3aed' }} />
                <span className="text-white text-base sm:text-lg font-semibold text-center group-hover:text-pink-300 transition-colors">Get the Collaboration Framework</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner CTA / Contact Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="tone-card bg-gradient-to-br from-indigo-500/15 via-indigo-500/10 to-purple-500/10 rounded-3xl border-2 border-indigo-400/40 p-8 sm:p-10 md:p-12 text-center hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight collaborator-heading">
              Ready to collaborate?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
              Work with the founding team to co-create the future of verified interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBecomePartner}
                className="tone-button text-white text-lg px-8 py-6 rounded-xl font-bold transition-all duration-500 hover:scale-105"
              >
                Become a Partner →
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:collaboration@zentrais.com?subject=Partnerships Inquiry'}
                className="bg-transparent border-2 border-indigo-400/50 text-white text-lg px-8 py-6 rounded-xl font-semibold hover:border-indigo-400 hover:bg-indigo-400/20 transition-all duration-500"
              >
                Contact Partnerships: collaboration@zentrais.com
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ways to Collaborate Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading">
              {t('collaborator.ways.title')}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {t('collaborator.ways.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* Research Alliances Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading text-center flex-shrink-0 h-[3.5rem] sm:h-[4rem] flex items-center justify-center leading-tight">{t('collaborator.ways.research.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 flex-grow min-h-0">
                {t('collaborator.ways.research.desc')}
              </p>
              <Button
                onClick={() => window.location.href = 'mailto:collaborators@zentrais.com?subject=Research Alliances Request'}
                className="tone-button w-full text-white text-base sm:text-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex-shrink-0 mt-auto"
              >
                {t('collaborator.ways.research.cta')}
              </Button>
            </div>

            {/* Exchange Integration Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading text-center flex-shrink-0 h-[3.5rem] sm:h-[4rem] flex items-center justify-center leading-tight">{t('collaborator.ways.marketplace.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 flex-grow min-h-0">
                {t('collaborator.ways.marketplace.desc')}
              </p>
              <Button
                onClick={() => window.location.href = 'mailto:collaborators@zentrais.com?subject=Exchange Integration Request'}
                className="tone-button w-full text-white text-base sm:text-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex-shrink-0 mt-auto"
              >
                {t('collaborator.ways.marketplace.cta')}
              </Button>
            </div>

            {/* Co-Brand Campaigns Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading text-center flex-shrink-0 h-[3.5rem] sm:h-[4rem] flex items-center justify-center leading-tight">{t('collaborator.ways.cobrand.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 flex-grow min-h-0">
                {t('collaborator.ways.cobrand.desc')}
              </p>
              <Button
                onClick={() => window.location.href = 'mailto:collaborators@zentrais.com?subject=Co-Brand Campaigns Request'}
                className="tone-button w-full text-white text-base sm:text-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex-shrink-0 mt-auto"
              >
                {t('collaborator.ways.cobrand.cta')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Collaboration Form Section */}
      <section id="collaborator-form" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-pink-400/30 p-8 sm:p-12 collaborator-tone">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 leading-tight font-sans tracking-tight tone-highlight">
              Collaborators / Brands Form
            </h2>
            <p className="text-base sm:text-lg text-gray-300 text-center mb-8 leading-relaxed font-sans">
              Qualify potential partners, tech integrations, brand sponsors, and contributors.
            </p>
            <CollaboratorForm />
          </div>
        </div>
      </section>

      {/* Persistent CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-amber-400/20 p-4">
        <Button
          onClick={handleStartCollaboration}
          className="tone-button w-full text-white"
        >
          {t('collaborator.start.mobile')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Footer />
    </div>
  );
}
