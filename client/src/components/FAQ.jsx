import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does Orbito collect my badges?",
    a: "Orbito connects securely with your learning platforms like Credly, LeetCode, or Microsoft Learn to fetch and verify your badges automatically.",
    icon: "🏆",
  },
  {
    q: "Can I add badges manually?",
    a: "Yes! For unsupported platforms, you can upload badges manually with proof - we’ll keep them safe and stylish.",
    icon: "🧩",
  },
  {
    q: "Is my data secure?",
    a: "Totally. All connections are encrypted, and we never store your login credentials - only verified badge info.",
    icon: "🔒",
  },
  {
    q: "Will my badges update automatically?",
    a: "Absolutely! Once linked, new badges appear in your dashboard as soon as you earn them - no manual refresh needed.",
    icon: "🔄",
  },
  {
    q: "Can I share my badges on LinkedIn or Discord?",
    a: "Of course. Share your achievements to socials with one click and show off your learning journey proudly.",
    icon: "🚀",
  },
];

function Pill({ children, rightIcon, onClick, active }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.008 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`group relative w-full text-left rounded-full px-5 sm:px-6 py-3.5 sm:py-4 transition-all duration-200 cursor-pointer ${
        active
          ? "bg-white text-slate-950 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-400"
          : "bg-white/95 text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-white hover:shadow-md hover:ring-slate-300"
      }`}
    >
      <span className="flex items-center gap-3">
        {children}
        <span className="ml-auto inline-flex items-center justify-center rounded-full transition-colors">
          {rightIcon}
        </span>
      </span>
    </motion.button>
  );
}

function AccordionItem({ item, isOpen, onToggle, contentClassName = "" }) {
  if (!item) return null;

  return (
    <div className="w-full">
      <Pill
        active={isOpen}
        onClick={onToggle}
        rightIcon={
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="inline-flex items-center justify-center text-slate-500 group-hover:text-slate-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.span>
        }
      >
        <span className="flex items-center gap-3">
          {item.icon && <span className="text-xl leading-none">{item.icon}</span>}
          <span className="text-[1.05rem] sm:text-lg font-medium">{item.q}</span>
        </span>
      </Pill>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={`mt-2.5 text-slate-200/90 ${contentClassName}`}>
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 sm:p-5 backdrop-blur-md">
                <p className="text-sm sm:text-base leading-relaxed text-slate-300">{item.a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

          {/* SVG grid background */}
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
            <div className="space-y-4 sm:space-y-5 md:hidden">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  item={f}
                  isOpen={open === i}
                  onToggle={() => setOpen((v) => (v === i ? -1 : i))}
                  contentClassName="ml-3 mr-6 sm:ml-5 sm:mr-8"
                />
              ))}
            </div>

            {/* Two-column alternating layout on md+ */}
            <div className="hidden md:flex md:flex-col md:gap-5">
              {Array.from({ length: Math.ceil(faqs.length / 2) }).map((_, rowIdx) => {
                const leftIndex = rowIdx * 2;
                const rightIndex = leftIndex + 1;
                const left = faqs[leftIndex];
                const right = faqs[rightIndex];
                const swap = rowIdx % 2 === 1; // odd rows: 35% left, 60% right

                return (
                  <div key={rowIdx} className="flex w-full items-start gap-0">
                    {/* Left column */}
                    <div className={`flex flex-col ${swap ? "basis-[35%]" : "basis-[60%]"} w-full`}>
                      <AccordionItem
                        item={left}
                        isOpen={open === leftIndex}
                        onToggle={() => setOpen((v) => (v === leftIndex ? -1 : leftIndex))}
                      />
                    </div>

                    {/* Spacer 5% */}
                    <div className="basis-[5%]" />

                    {/* Right column */}
                    <div className={`flex flex-col ${swap ? "basis-[60%]" : "basis-[35%]"} w-full`}>
                      <AccordionItem
                        item={right}
                        isOpen={open === rightIndex}
                        onToggle={() => setOpen((v) => (v === rightIndex ? -1 : rightIndex))}
                      />
                    </div>
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
