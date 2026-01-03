'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from './language-selector';
import ChannelSelector from './channel-selector';

export default function Navbar() {
  const pathname = usePathname();
  
  // Rutas donde la navbar debe ser sticky
  const stickyRoutes = ['/', '/user', '/investors', '/collaborator', '/media', '/privacy', '/about', '/contact', '/career', '/terms', '/cookie-policy', '/security-policy', '/legal-center', '/dpa', '/legal-compliance-handbook', '/gdpr-cookie-consent', '/legal-governance-suite'];
  const isSticky = stickyRoutes.includes(pathname);
  const isHomepage = pathname === '/';

  return (
    <nav 
      className={`w-full ${
        isHomepage 
          ? 'backdrop-blur-sm shadow-sm border-b border-white/5' 
          : 'bg-slate-900/90 backdrop-blur-sm shadow-lg border-b border-white/10'
      } ${
        isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''
      }`}
      style={!isHomepage ? {
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px) saturate(180%)',
        WebkitBackdropFilter: 'blur(8px) saturate(180%)',
      } : undefined}
    >
      <div className="flex justify-between items-center py-0 px-4 sm:px-6 h-auto min-h-0">
        {isHomepage ? (
          <>
            <div className="flex-1"></div>
            <Link 
              href="/" 
              className="group flex items-center cursor-pointer hover:opacity-80 transition-all duration-300"
              style={{ gap: '0.5px', alignItems: 'center' }}
            >
              <Image
                src="/Zentrais Flaticon 150x150-03.png"
                alt="Zentrais Logo"
                width={36}
                height={36}
                className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:scale-110 self-center"
              />
              <Image
                src="/logo-1.png"
                alt="Zentrais"
                width={130}
                height={130}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 transition-transform duration-300 group-hover:scale-110 object-contain self-center"
                style={{ marginTop: '4px' }}
              />
            </Link>
            <div className="flex-1 flex justify-end items-center gap-4">
              <LanguageSelector />
            </div>
          </>
        ) : (
          <>
            <Link 
              href="/" 
              className="group flex items-center cursor-pointer hover:opacity-80 transition-all duration-300"
              style={{ gap: '0.5px', alignItems: 'center' }}
            >
              <Image
                src="/Zentrais Flaticon 150x150-03.png"
                alt="Zentrais Logo"
                width={36}
                height={36}
                className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 transition-transform duration-300 group-hover:scale-110 self-center"
              />
              <Image
                src="/logo-1.png"
                alt="Zentrais"
                width={130}
                height={130}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 transition-transform duration-300 group-hover:scale-110 object-contain self-center"
                style={{ marginTop: '4px' }}
              />
            </Link>
            <div className="flex justify-end items-center gap-4">
              <ChannelSelector />
              <LanguageSelector />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

