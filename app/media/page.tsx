'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Folder, Megaphone, BookOpen, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '../../components/footer';
import { useLanguage } from '../../contexts/language-context';
import MediaForm from '../../components/forms/media-form';

const VideoYoutube = dynamic(() => import('../../components/video-youtube'), { ssr: false });

// These will be defined inside the component to use translations

export default function MediaPage() {
  const { t, language } = useLanguage();
  const isEs = language === 'es';

  useEffect(() => {
    document.title = `Zentrais | ${t('pagetitle.media')}`;
  }, [t, language]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mediaType: '',
    platform: '',
    followerCount: '',
    publicationHistory: '',
  });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate subtle particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const handlePressKit = () => {
    window.location.href = 'mailto:media@zentrais.com?subject=Media%20Kit%20Request';
  };

  const handleBecomeCollaborator = () => {
    window.location.href = 'mailto:collaborators@zentrais.com?subject=Become a Collaborator';
  };

  const handleJoinZenzers = () => {
    const formElement = document.getElementById('media-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = 'Join the Zenzers Circle Application';
    const body = `
Full Name: ${formData.fullName}
Email: ${formData.email}
Media Type: ${formData.mediaType}
Platform or Outlet: ${formData.platform}
Follower Count / Audience Size: ${formData.followerCount || 'Not provided'}
Publication History / Focus Area: ${formData.publicationHistory}
    `.trim();
    window.location.href = `mailto:collaborators@zentrais.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden media-body media-tone -mt-16 pt-16" style={{ backgroundColor: '#36454F' }}>
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Soft floating particles */}
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
        
        {/* Subtle flow lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-flow" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent animate-flow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-flow" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* 1. Hero / Headline */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-24">
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
                videoId="O64DdZ7KyD0"
                controls={0}
                className="absolute top-0 left-0 w-full h-full rounded-2xl border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all duration-300"
              />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight collaborator-heading">
            {isEs
              ? 'Zentrais redefine cómo se conectan los humanos en una era de IA y autenticidad.'
              : 'Zentrais redefines how humans connect in an era of AI and authenticity.'}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed collaborator-body">
            {isEs
              ? 'Un ecosistema Humano+IA construido sobre identidad, integridad e interacción responsable, dando forma al próximo estándar para la verdad digital.'
              : 'A Human+AI ecosystem built on identity, integrity, and accountable interaction — shaping the next standard for digital truth.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handlePressKit}
              className="tone-button text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {isEs ? 'Kit de Medios' : 'Media Kit'}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleJoinZenzers}
              variant="outline"
              className="bg-transparent border-2 border-blue-400/60 text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-400/10"
            >
              {isEs ? 'Solicitar Entrevista' : 'Request Interview'}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Media Kit */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Folder className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 collaborator-heading">
                {isEs ? 'Kit de Medios' : 'Media Kit'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 collaborator-body">
                {isEs
                  ? 'Un conjunto de activos totalmente descargables para periodistas y medios de comunicación.'
                  : 'A fully downloadable set of assets for journalists and media outlets.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 text-sm sm:text-base text-gray-100 collaborator-body">
            <ul className="space-y-2">
              <li>{isEs ? '• Logotipos oficiales (SVG/PNG)' : '• Official logos (SVG/PNG)'}</li>
              <li>{isEs ? '• Fotos de los fundadores (Levi, Ant, etc.)' : "• Founders' photos (Levi, Ant, etc)"}</li>
              <li>
                {isEs
                  ? '• Capturas de pantalla del producto (Perspective, Dialog, Exchange)'
                  : '• Product screenshots (Perspective, Dialog, Exchange)'}
              </li>
              <li>{isEs ? '• Presentación de la marca (PDF)' : '• Brand deck (PDF)'}</li>
            </ul>
            <ul className="space-y-2">
              <li>{isEs ? '• Hoja de información general de la plataforma' : '• Platform overview sheet'}</li>
              <li>{isEs ? '• Boilerplate de la empresa' : '• Company boilerplate'}</li>
              <li>{isEs ? '• Los últimos comunicados de prensa' : '• Latest media releases'}</li>
            </ul>
          </div>

          <Button
            onClick={handlePressKit}
            className="tone-button w-full sm:w-auto text-white text-base sm:text-lg px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            {isEs ? 'Descargar Kit de Medios' : 'Download Media Kit'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* 3. Key Facts & Figures */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center collaborator-heading">
            {isEs ? 'Datos y cifras clave' : 'Key Facts & Figures'}
          </h2>
          <div className="bg-slate-900/60 rounded-2xl border border-blue-400/30 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-100 collaborator-body">
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-blue-200">{isEs ? 'Fundada:' : 'Founded:'}</span> 2025
              </p>
              <p>
                <span className="font-semibold text-blue-200">{isEs ? 'Fundadores:' : 'Founders:'}</span>{' '}
                {isEs
                  ? 'Levi Ezagui y Antonio "Ant" Lovera.'
                  : 'Levi Ezagui and Antonio "Ant" Lovera.'}
              </p>
              <p>
                <span className="font-semibold text-blue-200">{isEs ? 'Equipo:' : 'Team:'}</span>{' '}
                {isEs
                  ? 'Más de 60 ingenieros, diseñadores y estrategas a nivel global'
                  : '60+ global engineers, designers, strategists'}
              </p>
              <p>
                <span className="font-semibold text-blue-200">
                  {isEs ? 'Innovación central:' : 'Core Innovation:'}
                </span>{' '}
                {isEs
                  ? 'Economía de Integridad + ICR (Índice de Resonancia Cognitiva)'
                  : 'Integrity Economy + CRI (Cognitive Resonance Index)'}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-blue-200">{isEs ? 'Etapa:' : 'Stage:'}</span>{' '}
                {isEs ? 'Alpha privada' : 'Private Alpha'}
              </p>
              <p>
                <span className="font-semibold text-blue-200">
                  {isEs ? 'Lanzamiento beta:' : 'Beta Launch:'}
                </span>{' '}
                Q1 2026
              </p>
              <p>
                <span className="font-semibold text-blue-200">
                  {isEs ? 'Lanzamiento de MVP:' : 'MVP Release:'}
                </span>{' '}
                {isEs ? '17 de enero de 2026' : 'January 17, 2026'}
              </p>
              <p>
                <span className="font-semibold text-blue-200">
                  {isEs ? 'Lista de espera inicial:' : 'Early Waitlist:'}
                </span>{' '}
                {isEs ? 'Más de 5,000 registros' : '5,000+ sign-ups'}
              </p>
              <p>
                <span className="font-semibold text-blue-200">
                  {isEs ? 'Financiación:' : 'Funding:'}
                </span>{' '}
                {isEs
                  ? 'Ronda de pre-semilla en curso (detalles disponibles bajo solicitud)'
                  : 'Pre-Seed round in progress (details available on request)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What&apos;s in the News / Why Now? */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-center collaborator-heading">
            {isEs ? '¿Qué está pasando en las noticias? ¿Por qué ahora?' : "What’s in the News / Why Now?"}
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-6 text-center collaborator-body">
            {isEs ? 'Por qué Zentrais es importante hoy' : 'Why Zentrais Matters Today'}
          </p>
          <div className="bg-slate-900/60 rounded-2xl border border-blue-400/30 p-6 sm:p-8 text-sm sm:text-base text-gray-100 collaborator-body space-y-2">
            <p>
              {isEs
                ? '• La adopción de chatbots de IA está explotando a nivel global.'
                : '• AI chat adoption is exploding globally.'}
            </p>
            <p>
              {isEs
                ? '• Los usuarios están agotados por el ruido, la manipulación y los feeds impulsados por algoritmos.'
                : '• Users are exhausted by noise, manipulation, and algorithm-driven feeds.'}
            </p>
            <p>
              {isEs
                ? '• La confianza en las plataformas digitales está en mínimos históricos.'
                : '• Trust in digital platforms is at record lows.'}
            </p>
            <p>
              {isEs
                ? '• La verificación de identidad y la autenticidad se están volviendo indispensables.'
                : '• Identity verification and authenticity are becoming non-negotiable.'}
            </p>
            <p>
              {isEs
                ? '• La interacción en tiempo real y responsable es la próxima frontera.'
                : '• Real-time, accountable interaction is the next frontier.'}
            </p>
            <p>
              {isEs
                ? '• Las instituciones y las marcas necesitan espacios de confianza para un diálogo significativo.'
                : '• Institutions and brands need trusted spaces for meaningful dialogue.'}
            </p>
            <p className="mt-4">
              {isEs
                ? 'Zentrais ofrece una plataforma verificada Humano+IA construida sobre integridad en lugar de manipulación.'
                : 'Zentrais offers a verified, Human+AI platform built on integrity instead of manipulation.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. The Zentrais Narrative (Media-Ready) */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center collaborator-heading">
            {isEs ? 'La narrativa de Zentrais' : 'The Zentrais Narrative'}
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed collaborator-body">
            {isEs
              ? 'Zentrais está construyendo la primera Economía de Integridad del mundo, una plataforma Humano+IA donde la identidad verificada, el diálogo responsable y los insights alineados con la verdad reemplazan el ruido y la distorsión de las redes sociales tradicionales. Con su puntaje de ICR (Índice de Resonancia Cognitiva) patentado, un equipo global de más de 60 constructores y un lanzamiento previsto para el Q1 de 2026, Zentrais está redefiniendo cómo se conectan los humanos y cómo se crea valor en línea.'
              : "Zentrais is building the world's first Integrity Economy — a Human+AI platform where verified identity, accountable dialog, and truth-aligned insights replace the noise and distortion of traditional social media. With proprietary CRI scoring, a global team of 60+ builders, and a launch planned for Q1 2026, Zentrais is redefining how humans connect and how value is created online."}
          </div>
        </div>
      </section>

      {/* 6. Vista previa del producto */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 collaborator-heading">
            {isEs ? 'Vista previa del producto' : 'Product Preview'}
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-8 collaborator-body">
            {isEs ? 'Mira la Economía de Integridad en acción.' : 'See the Integrity Economy in action.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 text-gray-100 text-xs sm:text-sm collaborator-body flex items-center justify-center transition-colors duration-300 hover:bg-blue-500/20 hover:border-blue-400/60 cursor-pointer">
              {isEs ? 'Interfaz de Perspective' : 'Perspective interface'}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 text-gray-100 text-xs sm:text-sm collaborator-body flex items-center justify-center transition-colors duration-300 hover:bg-blue-500/20 hover:border-blue-400/60 cursor-pointer">
              {isEs ? 'Interfaz de Dialog (chat)' : 'Dialog (chat) interface'}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 text-gray-100 text-xs sm:text-sm collaborator-body flex items-center justify-center transition-colors duration-300 hover:bg-blue-500/20 hover:border-blue-400/60 cursor-pointer">
              {isEs ? 'Vista de puntaje de ICR' : 'CRI scoring view'}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 text-gray-100 text-xs sm:text-sm collaborator-body flex items-center justify-center transition-colors duration-300 hover:bg-blue-500/20 hover:border-blue-400/60 cursor-pointer">
              {isEs ? 'Vista previa del mercado Exchange' : 'Exchange marketplace preview'}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Media Contact */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 md:p-10 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 collaborator-heading">
            {isEs ? 'Contacto de prensa' : 'Media Contact'}
          </h2>
          <p className="text-sm sm:text-base text-gray-200 mb-4 collaborator-body">
            {isEs ? 'Consultas de prensa: ' : 'Media inquiries: '}
            <a href="mailto:media@zentrais.com" className="text-blue-300 hover:text-blue-200 underline">media@zentrais.com</a>
          </p>
          <p className="text-sm sm:text-base text-gray-200 mb-6 collaborator-body">
            {isEs ? 'Nombre: ' : 'Name: '}
            <span className="font-semibold text-white">Davidson Taylor</span>
            <br />
            {isEs
              ? 'Cargo: Comunicaciones / Relaciones con los medios'
              : 'Role: Communications / Media Relations'}
          </p>
          <Button
            onClick={handleJoinZenzers}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-base sm:text-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            {isEs ? 'Solicitar Entrevista' : 'Request Interview'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 collaborator-heading">
            {isEs
              ? 'Cubre la historia de la próxima evolución en la interacción Humano+IA.'
              : 'Cover the story of the next evolution in Human+AI interaction.'}
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-8 collaborator-body">
            {isEs
              ? 'Accede al Kit de Medios completo o solicita una entrevista directa con el equipo fundador de Zentrais.'
              : 'Access the full Media Kit or request a direct interview with the Zentrais founding team.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handlePressKit}
              className="tone-button text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {isEs ? 'Descargar Kit de Medios' : 'Download Media Kit'}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleJoinZenzers}
              variant="outline"
              className="bg-transparent border-2 border-blue-400/60 text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-400/10"
            >
              {isEs ? 'Solicitar Entrevista' : 'Request Interview'}
            </Button>
          </div>
        </div>
      </section>

      {/* Media / Zenzers Form Section */}
      <section id="media-form" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-8 sm:p-12 media-tone">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 leading-tight font-sans tracking-tight tone-highlight">
              Media / Zenzers Form
            </h2>
            <p className="text-base sm:text-lg text-gray-300 text-center mb-8 leading-relaxed font-sans">
              Support journalists, content creators, public figures, and supporters.
            </p>
            <MediaForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
