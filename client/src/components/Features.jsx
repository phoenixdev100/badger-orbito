"use client";

import { TiltedScroll } from "@/components/ui/tilted-scroll";
import FeaturesSectionWithHoverEffects from "./feature-section-with-hover-effects";

export default function Features() {
  return (
    <>
      <div className="flex flex-col w-full text-inherit pt-10 pb-12 px-6 md:px-12 gap-6">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-3 text-white/70">
            Explore what makes Orbito your ultimate badge companion
          </p>
        </div>

        {/* Row with TiltedScroll (40%) on the left and FeatureSection (60%) on the right */}
        <div className="flex w-full flex-col md:flex-row items-start gap-6">
          {/* Left: TiltedScroll — 40% on md+, full width on small screens */}
          <div className="w-full md:w-2/5">
            <TiltedScroll />
          </div>

          {/* Right: Feature section — 60% on md+, full width on small screens */}
          <div className="w-full md:w-3/5">
            <FeaturesSectionWithHoverEffects />
          </div>
        </div>
      </div>
    </>
  );
}
