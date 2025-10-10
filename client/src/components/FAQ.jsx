import React, { useState } from "react";

const faqs = [
  {
    q: "How late does the internet close?",
    a: "The internet never closes. Our app is available 24/7, though maintenance may occur occasionally.",
    icon: "💖",
  },
  {
    q: "Do I need a license?",
    a: "No license required. Just a modern browser and a good vibe.",
  },
  {
    q: "What flavour are the cookies?",
    a: "Mostly chocolate chip. Sometimes strictly functional.",
  },
  {
    q: "Can I get lost here?",
    a: "Not really. Clear navigation and search should keep you on track.",
    icon: "⭐",
  },
  {
    q: "What if I click the wrong button?",
    a: "Most actions are reversible and we confirm destructive ones. You're safe to explore.",
  },
];

function Pill({ children, rightIcon, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-full bg-white/95 text-slate-900 shadow-sm ring-1 ring-slate-200 px-5 sm:px-6 py-3 sm:py-4 transition hover:shadow-md hover:-translate-y-[1px] ${
        active ? "ring-slate-300" : ""
      }`}
    >
      <span className="flex items-center gap-3">
        {children}
        <span className="ml-auto inline-flex items-center justify-center rounded-full text-slate-500 group-hover:text-slate-700 transition">
          {rightIcon}
        </span>
      </span>
    </button>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(-1);

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

          {/* SVG grid background (match Testimonial) */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="gridReactDarkResponsiveFAQ" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridReactDarkResponsiveFAQ)" />
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
          <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6" style={{ animationDelay: '4s' }}>
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate top-4 left-[36%]" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-2 right-63" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">Frequently Asked Questions</h2>
            </div>

            {/* Stacked on small screens */}
            <div className="space-y-5 sm:space-y-6 md:hidden">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className="relative">
                    <Pill
                      active={isOpen}
                      onClick={() => setOpen((v) => (v === i ? -1 : i))}
                      rightIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 transition ${isOpen ? "rotate-45" : ""}`}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      }
                    >
                      <span className="flex items-center gap-3">
                        {f.icon && <span className="text-xl leading-none">{f.icon}</span>}
                        <span className="text-[1.05rem] sm:text-lg">{f.q}</span>
                      </span>
                    </Pill>
                    {isOpen && (
                      <div className="ml-4 mr-8 sm:ml-6 sm:mr-10 mt-2 text-slate-200/90">
                        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 sm:p-5">
                          <p className="text-sm sm:text-base leading-relaxed">{f.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Two-column alternating layout on md+ */}
            <div className="hidden md:flex md:flex-col md:gap-6">
              {Array.from({ length: Math.ceil(faqs.length / 2) }).map((_, rowIdx) => {
                const leftIndex = rowIdx * 2;
                const rightIndex = leftIndex + 1;
                const left = faqs[leftIndex];
                const right = faqs[rightIndex];
                const leftIsOpen = open === leftIndex;
                const rightIsOpen = open === rightIndex;
                const swap = rowIdx % 2 === 1; // odd rows: 30% left, 60% right

                const LeftColumn = () => (
                  <div className={`flex flex-col ${swap ? 'basis-[35%]' : 'basis-[60%]'} w-full`}>
                    {left && (
                      <>
                        <Pill
                          active={leftIsOpen}
                          onClick={() => setOpen((v) => (v === leftIndex ? -1 : leftIndex))}
                          rightIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 transition ${leftIsOpen ? 'rotate-45' : ''}`}>
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          }
                        >
                          <span className="flex items-center gap-3">
                            {left.icon && <span className="text-xl leading-none">{left.icon}</span>}
                            <span className="text-lg">{left.q}</span>
                          </span>
                        </Pill>
                        {leftIsOpen && (
                          <div className="mt-2 text-slate-200/90">
                            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                              <p className="text-base leading-relaxed">{left.a}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );

                const RightColumn = () => (
                  <div className={`flex flex-col ${swap ? 'basis-[60%]' : 'basis-[35%]'} w-full`}>
                    {right && (
                      <>
                        <Pill
                          active={rightIsOpen}
                          onClick={() => setOpen((v) => (v === rightIndex ? -1 : rightIndex))}
                          rightIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 transition ${rightIsOpen ? 'rotate-45' : ''}`}>
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          }
                        >
                          <span className="flex items-center gap-3">
                            {right.icon && <span className="text-xl leading-none">{right.icon}</span>}
                            <span className="text-lg">{right.q}</span>
                          </span>
                        </Pill>
                        {rightIsOpen && (
                          <div className="mt-2 text-slate-200/90">
                            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                              <p className="text-base leading-relaxed">{right.a}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );

                return (
                  <div key={rowIdx} className="flex w-full items-start gap-0">
                    {/* Left column */}
                    <LeftColumn />
                    {/* Spacer 10% */}
                    <div className="basis-[5%]" />
                    {/* Right column */}
                    <RightColumn />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
