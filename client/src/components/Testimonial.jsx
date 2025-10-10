import React from "react";

const testimonials = [
  {
    quote:
      "Badger brought all my scattered achievements into one clean profile. Now sharing my progress is effortless.",
    name: "Aarav Sharma",
    role: "Full‑stack Developer",
  },
  {
    quote:
      "The UI feels fast and polished. I love the subtle animations and the way badges are organized.",
    name: "Ishita Verma",
    role: "Product Designer",
  },
  {
    quote:
      "Finally a place where my coding, design, and course certificates live together. Huge time saver!",
    name: "Kartik Rao",
    role: "Student & Creator",
  },
];

function GlowCard({ children }) {
  return (
    <div className="relative isolate">
      {/* Outer multicolor glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-60 blur-lg"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #3b82f6, #a855f7, #ef4444, #f59e0b, #10b981, #3b82f6)",
        }}
      />

      {/* Card */}
      <div className="relative rounded-2xl bg-black p-6 sm:p-7 md:p-8 text-white h-60 md:h-64 w-full">
        {children}

        {/* Small doodle at bottom-right */}
        <svg
          className="absolute bottom-4 right-5 h-6 w-6 text-white/80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 16c4-2 8-2 12 0" />
          <path d="M6 19c3-1.5 6-1.5 9 0" />
        </svg>
      </div>
    </div>
  );
}

export default function Testimonial() {
  return (
    <section className="w-full bg-black py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="relative overflow-visible text-white">
          <style>{`
            @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
            @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
            .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
            .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
            @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
            .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
          `}</style>

          {/* SVG grid background (no gradient) */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="gridReactDarkResponsiveTestimonials" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridReactDarkResponsiveTestimonials)" />
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

          {/* Corner elements (same logic as Home, no top-left/bottom-right constraints here) */}
          <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6" style={{ animationDelay: '4s' }}>
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate top-6 left-[36%]" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-10 left-12" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                What people are saying
              </h2>
            </div>

            {/* 3 cards in a row (stack on small screens) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
              {testimonials.map((t, i) => (
                <GlowCard key={i}>
                  <blockquote className="text-white/90 text-base sm:text-[1.02rem] leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/60">{t.role}</p>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

