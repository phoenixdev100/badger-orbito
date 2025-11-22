import React from 'react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bottom-0 left-0 right-0 bg-black">
      {/* Match Testimonial's animated grid background */}
      <style>{`
        @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
        .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
        .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
        @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
      `}</style>

      <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="gridReactDarkResponsiveFooter" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridReactDarkResponsiveFooter)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
        <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
        <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
        <circle cx="20%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3s' }} />
        <circle cx="80%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3.2s' }} />
        <circle cx="20%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.4s' }} />
        <circle cx="80%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.6s' }} />
        <circle cx="50%" cy="50%" r="1.2" className="detail-dot" style={{ animationDelay: '4s' }} />
      </svg>

      {/* Corner elements */}
      <div className="corner-element-animate top-2 right-4" style={{ animationDelay: '4s' }}>
        <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
      </div>
      <div className="corner-element-animate bottom-2 left-8" style={{ animationDelay: '4.4s' }}>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Left: copyright */}
          <p className="text-sm text-white/80">© Copyright Orbito {new Date().getFullYear()}</p>

          {/* Middle: slogan */}
          <p className="text-sm md:text-base text-white/90 text-center">Built for Learners ❤️ Loved by Creators</p>

          {/* Right: social links */}
          <div className="flex items-center gap-6">
            {/* GitHub */}
            <a href="https://github.com/singh04ayush" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 stroke-white/80 hover:stroke-white transition-colors">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/ayush-singh-87b3682a5/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 stroke-white/80 hover:stroke-white transition-colors">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Other socials commented out */}
            {/**
            <a href="#" aria-label="Twitter">
              <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 stroke-white/80 hover:stroke-white transition-colors">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>

            <a href="#" aria-label="Messages">
              <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-5 stroke-white/80 hover:stroke-white transition-colors">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
              </svg>
            </a>
            **/}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
