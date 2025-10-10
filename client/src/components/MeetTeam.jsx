import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import assets from "../assets/assets";

const teamMembers = [
  {
    id: 1,
    name: "Priyanshi Sharma",
    designation: "Founder & CEO",
    image: assets.PriyanshiImage,
  },
  {
    id: 2,
    name: "Ayush Singh",
    designation: "Founding Engineer",
    image: assets.AyushImage,
  },
  {
    id: 3,
    name: "Deepak",
    designation: "Founding Engineer",
    image: assets.DeepakImage,
  },
];

export default function MeetTeam() {
  return (
    <section className="w-full bg-black py-16 sm:py-20 md:py-24">
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

          {/* SVG grid background (same as Testimonial) */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="gridReactDarkResponsiveMeetTeam" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridReactDarkResponsiveMeetTeam)" />
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
          <div className="corner-element-animate top-15 left-[22%]" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-1 left-12" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                Meet the Squad
              </h2>
            </div>

            <div className="flex justify-center">
              <AnimatedTooltip items={teamMembers} size="lg" className="gap-4 md:gap-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
