'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Users, DollarSign, Handshake, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

const VideoYoutube = dynamic(() => import('../components/video-youtube'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = 'Zentrais';
  }, []);

  const audienceCards = [
    {
      id: 'user',
      title: t('home.card.user.title'),
      description: t('home.card.user.desc'),
      route: '/user',
      color: 'emerald',
      icon: Users,
    },
    {
      id: 'investor',
      title: t('home.card.investor.title'),
      description: t('home.card.investor.desc'),
      route: '/investors',
      color: 'indigo',
      icon: DollarSign,
    },
    {
      id: 'collaborator',
      title: t('home.card.collaborator.title'),
      description: t('home.card.collaborator.desc'),
      route: '/collaborator',
      color: 'amber',
      icon: Handshake,
    },
    {
      id: 'media',
      title: t('home.card.media.title'),
      description: t('home.card.media.desc'),
      route: '/media',
      color: 'pink',
      icon: Camera,
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-scroll"
      style={{ 
        backgroundImage: `url('/fondo-new.jpg')`,
        transform: 'translateZ(0)',
        willChange: 'auto',
        contain: 'layout style paint'
      }}
    >
      {/* HEADLINE SECTION */}
      <div className="container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 lg:pt-44 text-center relative">
        {/* Animated background gradient - optimized */}
        <div 
          className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl"
          style={{ 
            transform: 'translateZ(0)', 
            backfaceVisibility: 'hidden',
            contain: 'layout style paint',
            willChange: 'auto'
          }}
        ></div>
        
        {/* Floating orbs - reduced blur for performance */}
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-float opacity-60"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', contain: 'layout style paint', willChange: 'auto' }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl animate-float animation-delay-300 opacity-60"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', contain: 'layout style paint', willChange: 'auto' }}
        ></div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight drop-shadow-2xl font-sans animate-fade-in-up relative group">
          <span className="inline-block bg-gradient-to-r from-white via-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent bg-[length:200%_auto] relative" style={{ willChange: 'auto' }}>
            {t('home.headline')}
            {/* Subtle glow behind text - reduced blur */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" style={{ transitionDuration: '300ms', willChange: 'opacity' }}></span>
          </span>
        </h1>
        <h2 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 text-white/90 tracking-wide drop-shadow-lg font-sans animate-fade-in-up animation-delay-200 group/subheadline"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'auto' }}
        >
          <span 
            className="inline-block bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent transition-transform group-hover/subheadline:scale-105"
            style={{ transitionDuration: '200ms', willChange: 'transform' }}
          >
            {t('home.subheadline')}
          </span>
        </h2>
        <p 
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 sm:mb-10 drop-shadow font-sans animate-fade-in-up animation-delay-400 relative group/desc"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'auto' }}
        >
          <span 
            className="relative inline-block transition-opacity group-hover/desc:text-white/95"
            style={{ transitionDuration: '200ms', willChange: 'opacity' }}
          >
            {t('home.description')}
            {/* Subtle shimmer effect on hover - optimized */}
            <span 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover/desc:opacity-100 transition-opacity pointer-events-none"
              style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '300ms', willChange: 'opacity' }}
            ></span>
          </span>
        </p>
      </div>

      {/* SECCIÓN PRINCIPAL */}
      <div 
        className="flex items-center justify-center"
        style={{ contain: 'layout style' }}
      >
        <div 
          className="container mx-auto pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6"
          style={{ contain: 'layout style' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-center">
            {audienceCards.map((card, index) => {
              const Icon = card.icon;
              const colorClasses = {
                emerald: {
                  border: 'border-emerald-400/30',
                  borderHover: 'group-hover:border-emerald-400/60',
                  shadow: 'shadow-emerald-500/20',
                  shadowHover: 'group-hover:shadow-emerald-500/40',
                  icon: 'text-emerald-400',
                  iconHover: 'group-hover:text-emerald-300',
                  glow: 'from-emerald-400/20 via-emerald-500/10 to-transparent',
                  particle: 'bg-emerald-400',
                },
                indigo: {
                  border: 'border-indigo-400/30',
                  borderHover: 'group-hover:border-indigo-400/60',
                  shadow: 'shadow-indigo-500/20',
                  shadowHover: 'group-hover:shadow-indigo-500/40',
                  icon: 'text-indigo-400',
                  iconHover: 'group-hover:text-indigo-300',
                  glow: 'from-indigo-400/20 via-indigo-500/10 to-transparent',
                  particle: 'bg-indigo-400',
                },
                amber: {
                  border: 'border-amber-400/30',
                  borderHover: 'group-hover:border-amber-400/60',
                  shadow: 'shadow-amber-500/20',
                  shadowHover: 'group-hover:shadow-amber-500/40',
                  icon: 'text-amber-400',
                  iconHover: 'group-hover:text-amber-300',
                  glow: 'from-amber-400/20 via-amber-500/10 to-transparent',
                  particle: 'bg-amber-400',
                },
                pink: {
                  border: 'border-pink-400/30',
                  borderHover: 'group-hover:border-pink-400/60',
                  shadow: 'shadow-pink-500/20',
                  shadowHover: 'group-hover:shadow-pink-500/40',
                  icon: 'text-pink-400',
                  iconHover: 'group-hover:text-pink-300',
                  glow: 'from-pink-400/20 via-pink-500/10 to-transparent',
                  particle: 'bg-pink-400',
                },
              };

              const colors = colorClasses[card.color as keyof typeof colorClasses];

              return (
                <div
                  key={card.id}
                  className={`group relative p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg ${colors.border} ${colors.borderHover} cursor-pointer overflow-hidden transition-all hover:bg-white/20 hover:shadow-2xl ${colors.shadow} ${colors.shadowHover} hover:scale-105 hover:-translate-y-1 animate-fade-in-up active:scale-105`}
                  style={{ 
                    animationDelay: `${index * 100 + 600}ms`,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    contain: 'layout style paint',
                    transitionDuration: '200ms',
                    willChange: 'transform'
                  }}
                  onClick={() => router.push(card.route)}
                >
                  {/* Animated border glow - reduced blur */}
                  <div 
                    className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity`}
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms', willChange: 'opacity' }}
                  ></div>
                  
                  {/* Simplified light animation */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity`}
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms', willChange: 'opacity' }}
                  ></div>
                  
                  {/* Simplified shimmer - only on hover */}
                  <div
                    className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '300ms', willChange: 'opacity' }}
                  ></div>

                  {/* Reduced particles - only 2 instead of 3 */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ transform: 'translateZ(0)', transitionDuration: '200ms', willChange: 'opacity' }}
                  >
                    <div 
                      className={`absolute top-4 left-4 w-2 h-2 ${colors.particle} rounded-full opacity-60`} 
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                    ></div>
                    <div 
                      className={`absolute bottom-4 right-4 w-2 h-2 ${colors.particle} rounded-full opacity-60`} 
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                    ></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div 
                      className="relative inline-block"
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' }}
                    >
                      <Icon
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.icon} ${colors.iconHover} mx-auto mb-3 sm:mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg`}
                        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms', willChange: 'transform' }}
                      />
                    </div>
                    <h3 
                      className="font-bold text-white text-base sm:text-lg mb-2 transition-opacity group-hover:text-white uppercase tracking-wider font-sans"
                      style={{ transitionDuration: '200ms', willChange: 'opacity' }}
                    >
                      {card.title}
                    </h3>
                    <p 
                      className="text-xs sm:text-sm text-white/90 transition-opacity group-hover:text-white font-sans"
                      style={{ transitionDuration: '200ms', willChange: 'opacity' }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* YouTube Video Embed */}
          <div className="mt-12 sm:mt-16 md:mt-20 flex justify-center animate-fade-in-up animation-delay-800">
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
                  videoId="9MuAki_Cx9w"
                  controls={1}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all duration-300"
                />
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* MICRO-PROOF BAR - optimized */}
          <div 
            className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t border-white/20 animate-fade-in-up animation-delay-1000"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'auto' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 text-center text-white/70 text-sm sm:text-base">
              <div 
                className="flex items-center gap-2 group/proof hover:text-white transition-opacity"
                style={{ transitionDuration: '200ms', willChange: 'opacity' }}
              >
                <span 
                  className="inline-block w-2 h-2 bg-cyan-400 rounded-full opacity-80 group-hover/proof:opacity-100 transition-opacity"
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms' }}
                ></span>
                <span 
                  className="font-semibold text-white/90 group-hover/proof:scale-105 transition-transform"
                  style={{ transform: 'translateZ(0)', transitionDuration: '200ms', willChange: 'transform' }}
                >{t('home.proof.builders')}</span>
              </div>
              <div 
                className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-60"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              ></div>
              <div 
                className="flex items-center gap-2 group/proof hover:text-white transition-opacity"
                style={{ transitionDuration: '200ms', willChange: 'opacity' }}
              >
                <span 
                  className="inline-block w-2 h-2 bg-purple-400 rounded-full opacity-80 group-hover/proof:opacity-100 transition-opacity"
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms' }}
                ></span>
                <span 
                  className="font-semibold text-white/90 group-hover/proof:scale-105 transition-transform"
                  style={{ transform: 'translateZ(0)', transitionDuration: '200ms', willChange: 'transform' }}
                >{t('home.proof.founders')}</span>
              </div>
              <div 
                className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-60"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              ></div>
              <div 
                className="flex items-center gap-2 group/proof hover:text-white transition-opacity"
                style={{ transitionDuration: '200ms', willChange: 'opacity' }}
              >
                <span 
                  className="inline-block w-2 h-2 bg-pink-400 rounded-full opacity-80 group-hover/proof:opacity-100 transition-opacity"
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', transitionDuration: '200ms' }}
                ></span>
                <span 
                  className="font-semibold text-white/90 group-hover/proof:scale-105 transition-transform"
                  style={{ transform: 'translateZ(0)', transitionDuration: '200ms', willChange: 'transform' }}
                >{t('home.proof.beta')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
