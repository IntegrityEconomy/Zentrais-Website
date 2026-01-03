'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { ArrowRight, Download, Calendar, ChevronLeft, ChevronRight, AlertTriangle, X, CheckCircle, Shield, Users, MessageSquare, TrendingUp, BarChart3, Globe, Target, Zap, Cpu, FileText, RotateCw } from 'lucide-react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import InvestorForm from '../../components/forms/investor-form';

const VideoYoutube = dynamic(() => import('../../components/video-youtube'), { ssr: false });

// Componente de contador animado
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

// Componente de countdown
function LaunchCountdown({ t }: { t: (key: string) => string }) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const launchDate = new Date('2026-01-01');
    const updateCountdown = () => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setDays(daysLeft);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60); // Update hourly
    return () => clearInterval(interval);
  }, []);

  return <span>{days} {t('investors.countdown.days')}</span>;
}

export default function InvestorsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = `Zentrais | ${t('pagetitle.investors')}`;
  }, [t, language]);
  const [isVisible] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    roleOrganization: '',
    investmentFocus: '',
    amountInterested: '',
    email: '',
    comments: '',
  });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generar partículas suaves (reduced for performance)
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const teamMembers = [
    {
      name: t('investors.team.levi.name'),
      role: t('investors.team.levi.role'),
      bio: t('investors.team.levi.bio'),
      image: "/Levi Ezagui Picture 1.jpg",
    },
    {
      name: t('investors.team.antonio.name'),
      role: t('investors.team.antonio.role'),
      bio: t('investors.team.antonio.bio'),
      image: "/Antonio Lovera Portrait 3.jpeg",
    },
    {
      name: t('investors.team.david.name'),
      role: t('investors.team.david.role'),
      bio: t('investors.team.david.bio'),
      image: "/David Shagalov Picture 2.jpg",
    },
    {
      name: t('investors.team.declan.name'),
      role: t('investors.team.declan.role'),
      bio: t('investors.team.declan.bio'),
      image: "/Declan O'Beirne  Picture 1.jpg",
    },
    {
      name: t('investors.team.rick.name'),
      role: t('investors.team.rick.role'),
      bio: t('investors.team.rick.bio'),
      image: null,
    },
    {
      name: t('investors.team.shivani.name'),
      role: t('investors.team.shivani.role'),
      bio: t('investors.team.shivani.bio'),
      image: "/Shivani Tripathi Prof_H.jpeg",
    },
    {
      name: t('investors.team.davidson.name'),
      role: t('investors.team.davidson.role'),
      bio: t('investors.team.davidson.bio'),
      image: "/Davidson.jpeg",
    },
    {
      name: t('investors.team.advisory.name'),
      role: t('investors.team.advisory.role'),
      bio: t('investors.team.advisory.bio'),
      image: null,
    },
    {
      name: t('investors.team.zenzers.name'),
      role: t('investors.team.zenzers.role'),
      bio: t('investors.team.zenzers.bio'),
      image: null,
    },
  ];

  // Función para obtener la URL codificada de la imagen
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '';
    // Codificar solo los espacios y caracteres especiales, manteniendo la estructura de la ruta
    return imagePath.split('/').map(part => 
      part === '' ? '' : encodeURIComponent(part)
    ).join('/');
  };

  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const nextMember = () => {
    setCurrentMemberIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentMemberIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const goToMember = (index: number) => {
    setCurrentMemberIndex(index);
  };

  const handleDataRoom = () => {
    window.location.href = 'mailto:investors@zentrais.com?subject=Data Room Access Request';
  };

  const handleInvestorDeck = () => {
    window.location.href = 'mailto:investors@zentrais.com?subject=Investor Deck Request';
  };

  const handleInvestorRelations = () => {
    window.location.href = 'mailto:investors@zentrais.com';
  };

  const handleJoinHub = () => {
    const formElement = document.getElementById('investor-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden investors-tech investors-tone -mt-16 pt-16" style={{ backgroundColor: '#36454F' }}>
      {/* Fondo animado sutil */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Partículas suaves flotantes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-15"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Líneas de flujo sutiles - removed for performance */}
        </div>

      {/* YouTube Video Embed */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 md:pb-20 flex justify-center">
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
              videoId="0hkzlT3xOXI"
              controls={0}
              className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all duration-300"
            />
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 md:pb-32 overflow-hidden">
        {/* Animated Background Orbs - simplified for performance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl opacity-50"></div>
      </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Headline with animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 text-white leading-tight collaborator-heading tracking-tight relative"
          >
            <span className="relative inline-block">
              {t('investors.hero.title')}
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></span>
            </span>
          </motion.h1>

          {/* Sub-headline with animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-10 sm:mb-12 md:mb-14 leading-relaxed max-w-4xl mx-auto collaborator-body relative group"
          >
            <span className="relative inline-block">
              {t('investors.hero.subtitle')}
              {/* Subtle glow on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </span>
          </motion.p>

          {/* CTAs with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          >
            <Button
              onClick={handleInvestorDeck}
              className="group relative tone-button text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center gap-2 overflow-hidden"
            >
              {/* Animated background gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative z-10 flex items-center gap-2">
                {t('investors.hero.cta.primary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Button
              onClick={handleInvestorRelations}
              variant="outline"
              className="group relative bg-transparent border-2 border-indigo-400/50 text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:border-indigo-400 hover:bg-indigo-400/20 hover:shadow-2xl hover:shadow-indigo-500/30 overflow-hidden"
            >
              {/* Animated border glow */}
              <span className="absolute inset-0 border-2 border-indigo-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{t('investors.hero.cta.secondary')}</span>
            </Button>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>
        </div>
      </section>

      {/* Find Your Investor Type Section - Emerald/Teal Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.find.type.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 collaborator-body uppercase tracking-wider mb-4">{t('investors.find.type.subtitle')}</p>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto collaborator-body">
              {t('investors.find.type.desc')}
            </p>
          </motion.div>

          {/* Investor Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
            {/* Frontier Investor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-800/40 rounded-2xl border-2 border-emerald-400/30 p-8 sm:p-10 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading group-hover:text-emerald-300 transition-colors">
                {t('investors.find.frontier.title')}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors flex-1 mb-6">
                {t('investors.find.frontier.desc')}
              </p>
                <button 
                onClick={handleJoinHub}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm sm:text-base"
                >
                  {t('investors.find.frontier.learn')}
                </button>
            </motion.div>

            {/* Impact Investor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-slate-800/40 rounded-2xl border-2 border-teal-400/30 p-8 sm:p-10 hover:border-teal-400/60 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading group-hover:text-teal-300 transition-colors">
                {t('investors.find.impact.title')}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors flex-1 mb-6">
                {t('investors.find.impact.desc')}
              </p>
                <button 
                onClick={handleJoinHub}
                className="w-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/50 hover:border-teal-400 text-teal-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm sm:text-base"
                >
                  {t('investors.find.impact.learn')}
                </button>
            </motion.div>

            {/* Legacy Investor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-slate-800/40 rounded-2xl border-2 border-cyan-400/30 p-8 sm:p-10 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-4 collaborator-heading group-hover:text-cyan-300 transition-colors">
                {t('investors.find.legacy.title')}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors flex-1 mb-6">
                {t('investors.find.legacy.desc')}
              </p>
                <button 
                onClick={handleJoinHub}
                className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-sm sm:text-base"
                >
                  {t('investors.find.legacy.learn')}
                </button>
            </motion.div>
          </div>

          {/* Join Hub CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={handleJoinHub}
              className="tone-button text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 mx-auto"
            >
              {t('investors.find.join')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl opacity-50"></div>
                </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 flex-wrap justify-center">
              <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-400/50"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight collaborator-heading tracking-tight">
                {t('investors.problem.solution.heading').includes(' → ') ? (
                  <>
                    {t('investors.problem.solution.heading').split(' → ')[0]} <span className="text-red-400 mx-1 sm:mx-2">→</span> {t('investors.problem.solution.heading').split(' → ')[1]}
                  </>
                ) : (
                  t('investors.problem.solution.heading')
                )}
          </h2>
              <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-indigo-400/50"></div>
              </div>
            <p className="text-xs sm:text-sm text-gray-400 collaborator-body uppercase tracking-wider">{t('investors.problem.solution.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="tone-card bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-800/40  rounded-2xl sm:rounded-3xl border-2 border-red-400/20 p-6 sm:p-8 md:p-10 hover:border-red-400/40 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 relative overflow-hidden h-full">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500/10 rounded-full blur-2xl opacity-30"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-500/10 rounded-full blur-2xl opacity-30"></div>
        </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-red-400/20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/15 border border-red-400/40 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight collaborator-heading tracking-tight">
                      {t('investors.problem.title')}
            </h2>
            </div>

                  <ul className="space-y-4">
                    {[
                      { text: t('investors.problem.p1'), icon: X },
                      { text: t('investors.problem.p2'), icon: AlertTriangle },
                      { text: t('investors.problem.p3'), icon: Shield },
                      { text: t('investors.problem.p4'), icon: X },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className="text-base sm:text-lg text-gray-300 leading-relaxed collaborator-body flex items-start gap-4 group/item"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-400/30 flex items-center justify-center mt-1 group-hover/item:bg-red-500/20 group-hover/item:border-red-400/50 transition-all">
                            <Icon className="w-4 h-4 text-red-400" />
              </div>
                          <span className="flex-1">{item.text}</span>
                        </motion.li>
                      );
                    })}
                  </ul>
              </div>
              </div>
            </motion.div>

            {/* The Zentrais Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="tone-card bg-gradient-to-br from-indigo-900/20 via-slate-800/30 to-purple-900/20  rounded-2xl sm:rounded-3xl border-2 border-indigo-400/40 p-6 sm:p-8 md:p-10 hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden h-full">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.2),transparent_50%)]"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]"></div>
            </div>

                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-br-full"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/20 border-2 border-indigo-400/50 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0"
                    >
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-400" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight collaborator-heading tracking-tight">
                      {t('investors.solution.title')}
                    </h2>
              </div>

                  <div className="space-y-6">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-base sm:text-lg text-gray-200 leading-relaxed collaborator-body"
                    >
                      {t('investors.solution.desc')}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border-2 border-indigo-400/40 rounded-2xl p-6 space-y-4 relative overflow-hidden group/box"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/box:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className="flex items-start gap-4 relative z-10">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/20 border-2 border-indigo-400/50 flex items-center justify-center"
                        >
                          <TrendingUp className="w-6 h-6 text-indigo-400" />
                        </motion.div>
                        <p className="text-base sm:text-lg text-gray-100 leading-relaxed collaborator-body font-medium">
                          {t('investors.solution.desc2')}
                        </p>
              </div>
                    </motion.div>
              </div>
            </div>
          </div>
            </motion.div>
          </div>

          {/* Connecting Arrow/Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-gradient-to-r from-red-400/60 via-red-400/30 to-transparent rounded-full"></div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400/20 to-indigo-400/20 border-2 border-indigo-400/50 flex items-center justify-center "
              >
                <ArrowRight className="w-6 h-6 text-indigo-400" />
              </motion.div>
              <div className="w-16 h-1 bg-gradient-to-l from-indigo-400/60 via-indigo-400/30 to-transparent rounded-full"></div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* The Market Opportunity Section - Purple/Cyan Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight text-center collaborator-heading tracking-tight">
              {t('investors.market.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-purple-500/60 to-transparent mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto collaborator-body">
              {t('investors.market.desc')}
            </p>
          </motion.div>

          {/* Market Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/15 via-indigo-500/10 to-purple-500/10  rounded-3xl border-2 border-indigo-400/40 p-8 sm:p-10 hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tone-highlight collaborator-heading font-bold">
                    {t('investors.market.size')}
              </div>
              </div>
                <div className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body pl-0 sm:pl-16">
                  {t('investors.market.size.desc')}
            </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="tone-card bg-gradient-to-br from-pink-500/15 via-pink-500/10 to-purple-500/10  rounded-3xl border-2 border-pink-400/40 p-8 sm:p-10 hover:border-pink-400/70 hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 border-2 border-pink-400/50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tone-highlight collaborator-heading font-bold">
                    {t('investors.market.growth')}
              </div>
              </div>
                <div className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body pl-0 sm:pl-16">
                  {t('investors.market.growth.desc')}
            </div>
          </div>
            </motion.div>
            </div>

          {/* Key Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="tone-card bg-slate-800/30  rounded-2xl border border-indigo-400/20 p-6 sm:p-8 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-indigo-400" />
              </div>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed collaborator-body">
                  {t('investors.market.opportunity')}
            </p>
                </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="tone-card bg-slate-800/30  rounded-2xl border border-purple-400/20 p-6 sm:p-8 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
              </div>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed collaborator-body">
                  {t('investors.market.shift')}
                </p>
            </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="tone-card bg-gradient-to-br from-indigo-500/20 to-purple-500/20  rounded-2xl border-2 border-indigo-400/50 p-6 sm:p-8 hover:border-indigo-400/70 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/30 border-2 border-indigo-400/60 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-indigo-400" />
              </div>
                <p className="text-sm sm:text-base text-gray-100 leading-relaxed collaborator-body font-semibold">
                  {t('investors.market.positioning')}
                </p>
                </div>
            </motion.div>
              </div>
            </div>
      </section>

      {/* Why Zentrais Wins Section - Indigo/Purple/Pink Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.why.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent mb-4"></div>
            <p className="text-sm sm:text-base text-gray-400 collaborator-body uppercase tracking-wider">Integrity Economy + IP</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Defensible Technology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-slate-800/40  rounded-2xl border-2 border-indigo-400/30 p-8 sm:p-10 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-6 collaborator-heading group-hover:text-indigo-300 transition-colors">
                {t('investors.why.defensible.title')}
              </h3>
              <ul className="space-y-4 flex-1">
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.defensible.cri')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.defensible.integrity')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.defensible.identity')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.defensible.architecture')}
                </li>
              </ul>
            </motion.div>

            {/* IP Positioning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-slate-800/40  rounded-2xl border-2 border-purple-400/30 p-8 sm:p-10 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-6 collaborator-heading group-hover:text-purple-300 transition-colors">
                {t('investors.why.ip.title')}
              </h3>
              <ul className="space-y-4 flex-1">
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.ip.patents')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.ip.cri')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.ip.trademark')}
                </li>
              </ul>
            </motion.div>

            {/* Economic Flywheel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="tone-card bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-slate-800/40  rounded-2xl border-2 border-pink-400/30 p-8 sm:p-10 hover:border-pink-400/60 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 h-full flex flex-col group cursor-pointer"
            >
              <h3 className="text-2xl sm:text-3xl text-white mb-6 collaborator-heading group-hover:text-pink-300 transition-colors">
                {t('investors.why.flywheel.title')}
              </h3>
              <ul className="space-y-4 flex-1">
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.flywheel.desc')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.flywheel.insight')}
                </li>
                <li className="text-gray-200 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors">
                  {t('investors.why.flywheel.monetization')}
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traction Snapshot Section - Multi-Color Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.traction.title')}
          </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: 1, color: 'indigo', gradient: 'from-indigo-500/30 via-indigo-500/15 to-slate-800/50', border: 'border-indigo-400/40', hoverBorder: 'hover:border-indigo-400/80', shadow: 'hover:shadow-indigo-500/30', glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]' },
              { num: 2, color: 'purple', gradient: 'from-purple-500/30 via-purple-500/15 to-slate-800/50', border: 'border-purple-400/40', hoverBorder: 'hover:border-purple-400/80', shadow: 'hover:shadow-purple-500/30', glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
              { num: 3, color: 'pink', gradient: 'from-pink-500/30 via-pink-500/15 to-slate-800/50', border: 'border-pink-400/40', hoverBorder: 'hover:border-pink-400/80', shadow: 'hover:shadow-pink-500/30', glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]' },
              { num: 4, color: 'cyan', gradient: 'from-cyan-500/30 via-cyan-500/15 to-slate-800/50', border: 'border-cyan-400/40', hoverBorder: 'hover:border-cyan-400/80', shadow: 'hover:shadow-cyan-500/30', glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]' },
              { num: 5, color: 'blue', gradient: 'from-blue-500/30 via-blue-500/15 to-slate-800/50', border: 'border-blue-400/40', hoverBorder: 'hover:border-blue-400/80', shadow: 'hover:shadow-blue-500/30', glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
              { num: 6, color: 'emerald', gradient: 'from-emerald-500/30 via-emerald-500/15 to-slate-800/50', border: 'border-emerald-400/40', hoverBorder: 'hover:border-emerald-400/80', shadow: 'hover:shadow-emerald-500/30', glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
            ].map((item, index) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`tone-card bg-gradient-to-br ${item.gradient}  rounded-2xl border-2 ${item.border} ${item.hoverBorder} p-6 sm:p-8 hover:shadow-lg ${item.shadow} transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              >
                {/* Simple shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <p className="text-gray-100 text-sm sm:text-base leading-relaxed collaborator-body group-hover:text-white transition-colors font-medium">
                    {t(`investors.traction.${item.num}`)}
          </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview for Investors Section - Blue/Cyan Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-2xl opacity-50"></div>
                </div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.product.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-blue-500/60 to-transparent mb-6"></div>
          </motion.div>
          
          {/* Product Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-10">
            <div className="tone-card bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-400/30 p-4 sm:p-6 md:p-8 aspect-square flex items-center justify-center hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group">
              <div className="text-gray-300 text-[10px] xs:text-xs sm:text-sm text-center collaborator-body group-hover:text-white transition-colors px-1">{t('investors.product.ui')}</div>
                </div>
            <div className="tone-card bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30 p-4 sm:p-6 md:p-8 aspect-square flex items-center justify-center hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
              <div className="text-gray-300 text-[10px] xs:text-xs sm:text-sm text-center collaborator-body group-hover:text-white transition-colors px-1">{t('investors.product.cri')}</div>
              </div>
            <div className="tone-card bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl border border-pink-400/30 p-4 sm:p-6 md:p-8 aspect-square flex items-center justify-center hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group">
              <div className="text-gray-300 text-[10px] xs:text-xs sm:text-sm text-center collaborator-body group-hover:text-white transition-colors px-1">{t('investors.product.verification')}</div>
            </div>
            <div className="tone-card bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-400/30 p-4 sm:p-6 md:p-8 aspect-square flex items-center justify-center hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
              <div className="text-gray-300 text-[10px] xs:text-xs sm:text-sm text-center collaborator-body group-hover:text-white transition-colors px-1">{t('investors.product.chat')}</div>
              </div>
            <div className="tone-card bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30 p-4 sm:p-6 md:p-8 aspect-square flex items-center justify-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group">
              <div className="text-gray-300 text-[10px] xs:text-xs sm:text-sm text-center collaborator-body group-hover:text-white transition-colors px-1">{t('investors.product.marketplace')}</div>
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed text-center collaborator-body max-w-3xl mx-auto">
            {t('investors.product.label')}
          </p>
        </div>
      </section>

      {/* Investor Materials Section - Indigo Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.materials.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent mb-6"></div>
          </motion.div>

          <div className="space-y-4">
            <Button
              onClick={handleInvestorDeck}
              className="w-full tone-button text-white text-base sm:text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              {t('investors.materials.deck')}
            </Button>
            <Button
              onClick={handleDataRoom}
              className="w-full bg-transparent border-2 border-indigo-400/50 text-white text-base sm:text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400 hover:bg-indigo-400/10"
            >
              {t('investors.materials.dataroom')}
            </Button>
            <Button
              onClick={handleInvestorDeck}
              className="w-full bg-transparent border-2 border-indigo-400/50 text-white text-base sm:text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400 hover:bg-indigo-400/10 flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              {t('investors.materials.technical')}
            </Button>
            <Button
              onClick={handleInvestorRelations}
              className="w-full bg-transparent border-2 border-indigo-400/50 text-white text-base sm:text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400 hover:bg-indigo-400/10 flex items-center justify-center gap-3"
            >
              <Calendar className="w-5 h-5" />
              {t('investors.materials.call')}
            </Button>
          </div>
        </div>
      </section>

      {/* Team & Advisors Section - Pink/Indigo Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.team.heading')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-pink-500/60 to-transparent"></div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Team Card */}
            <div className="group relative bg-gradient-to-br from-white/8 to-white/3 rounded-3xl border-2 border-white/20 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:border-pink-400/40 hover:shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:scale-[1.01] min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] 2xl:min-h-[550px] flex flex-col items-center justify-center overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMemberIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  {(() => {
                    const member = teamMembers[currentMemberIndex];
                    
                    return (
                      <>
                        {/* Avatar Circle with Image */}
                        <div className="flex justify-center mb-4 sm:mb-6">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-lg relative bg-slate-800/50 flex items-center justify-center">
                            {member.image ? (
                              <img
                                src={getImageUrl(member.image)}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                style={{ 
                                  display: 'block',
                                  margin: '0 auto',
                                  objectPosition: member.name === 'Levi Ezagui' 
                                    ? 'center 10%' 
                                    : (member.name === 'Antonio Lovera' || member.name === 'David Shagalov' || member.name === 'Declan O\'Beirne' || member.name === 'Davidson Taylor')
                                    ? 'center 15%'
                                    : 'center center'
                                }}
                                loading={currentMemberIndex === 0 ? "eager" : "lazy"}
                                onError={(e) => {
                                  console.error('Error loading image:', member.image);
                                  // Intentar con la ruta original sin codificar
                                  e.currentTarget.src = member.image;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xl sm:text-2xl md:text-3xl font-bold collaborator-heading">
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl text-white mb-2 sm:mb-3 text-center collaborator-heading px-4">
                          {member.name}
                        </h3>

                        {/* Title */}
                        <p className="text-indigo-500 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center collaborator-heading px-4">
                          {member.role}
                        </p>

                        {/* Description */}
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-2xl collaborator-body px-4">
                          {member.bio}
                        </p>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevMember}
              className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 -translate-x-0 sm:-translate-x-4 md:-translate-x-8 lg:-translate-x-12 bg-pink-500/80 hover:bg-pink-500 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 shadow-lg shadow-pink-500/30 z-10"
              aria-label={t('investors.team.navigation.previous')}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextMember}
              className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 translate-x-0 sm:translate-x-4 md:translate-x-8 lg:translate-x-12 bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 shadow-lg shadow-indigo-500/30 z-10"
              aria-label={t('investors.team.navigation.next')}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToMember(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentMemberIndex
                      ? 'bg-indigo-500 w-8 sm:w-10'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`${t('investors.team.navigation.go')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section - Gradient Theme */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
        {/* Background decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-full blur-2xl opacity-50"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight collaborator-heading tracking-tight">
              {t('investors.final.title')}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-indigo-500/60 via-pink-500/60 to-transparent mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 leading-relaxed collaborator-body max-w-3xl mx-auto">
              {t('investors.final.desc')}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button
              onClick={handleInvestorDeck}
              className="tone-button text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
            >
              {t('investors.final.cta.deck')}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleInvestorRelations}
              variant="outline"
              className="bg-transparent border-2 border-indigo-400/50 text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-400/10"
            >
              {t('investors.final.cta.founders')}
            </Button>
          </div>
        </div>
      </section>

      {/* Investor Form Section */}
      <section id="investor-form" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-indigo-400/30 p-8 sm:p-12 investors-tone">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 leading-tight font-sans tracking-tight tone-highlight">
              Investor Form
            </h2>
            <p className="text-base sm:text-lg text-gray-300 text-center mb-8 leading-relaxed font-sans">
              Qualify investor interest, stage, focus, and expected material for next steps.
            </p>
            <InvestorForm />
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes flow-line {
          0% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -1600;
            opacity: 0;
          }
        }
        .animate-flow-line {
          stroke-dasharray: 800;
          animation: flow-line 8s linear infinite;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 85%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-out;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        /* Float animation removed for performance */
      `}</style>


      <Footer />
    </div>
  );
}
