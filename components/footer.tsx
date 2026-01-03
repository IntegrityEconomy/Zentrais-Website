'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Instagram, Youtube } from 'lucide-react';

// X (Twitter) icon component - new X logo
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Reddit icon component (not available in lucide-react)
const RedditIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-20 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Left Column - Zentrais Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Zentrais Flaticon 150x150-03.png"
                alt="Zentrais Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="text-white font-bold text-xl font-sans">Zentrais</span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                © 2025 Zentrais, Inc. All rights reserved.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                Built on Truth, Trust, and Transparency.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/company/zentrais-llc/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/zentrais" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/zentrais" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                aria-label="X"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@Zentrais" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://www.reddit.com/user/zentrais/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                aria-label="Reddit"
              >
                <RedditIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Middle Column - Company Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base font-sans">Company</h3>
            <div className="flex flex-col gap-3">
              <Link 
                href="/about" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Contact
              </Link>
              <Link 
                href="/career" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Career
              </Link>
            </div>
          </div>

          {/* Right Column - Legal Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base font-sans">Legal</h3>
            <div className="flex flex-col gap-3">
              <Link 
                href="/privacy" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookie-policy" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/security-policy" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Security Policy
              </Link>
              <Link 
                href="/legal-center" 
                className="text-slate-400 hover:text-white transition-colors duration-300 font-sans text-sm"
              >
                Legal Center
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 space-y-4">
          <p className="text-slate-400 italic text-sm font-sans text-center md:text-left">
            Zentrais is redefining how stories of truth are told: through integrity, transparency, and human connection.
          </p>
          <p className="text-slate-500 text-sm font-sans text-center md:text-left">
            © 2025 Zentrais. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

