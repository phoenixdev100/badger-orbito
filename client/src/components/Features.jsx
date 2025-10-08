"use client";

import DisplayCards from "@/components/ui/display-cards"
import { TiltedScroll } from "@/components/ui/tilted-scroll";
import { Sparkles } from "lucide-react";

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "Featured",
    description: "Discover amazing content",
    date: "Just now",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "Popular",
    description: "Trending this week",
    date: "2 days ago",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "New",
    description: "Latest updates and features",
    date: "Today",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

export default function Features() {
  return (
    <div className="flex flex-col min-h-[400px] w-full text-inherit items-start justify-start pt-10 pb-12 px-6 md:px-12 gap-4 md:gap-6">
        <div className="mb-6 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Powerful Features
        </h2>
        <p className="mt-3 text-white/70">
          Explore what makes our platform fast, delightful, and reliable.
        </p>
        </div>
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="justify-self-start pl-4 md:pl-10 lg:pl-16">
              <TiltedScroll className="w-full justify-start" />
            </div>
            <div className="justify-self-end pr-6 md:pr-12 -mt-2 md:-mt-4">
              <DisplayCards cards={defaultCards} />
            </div>
          </div>
        </div>
    </div>
  );
}

