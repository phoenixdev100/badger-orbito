import type * as React from "react";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiHackerrank,
  SiCodechef,
  SiKaggle,
} from "react-icons/si";
import { Github } from "lucide-react";
import assets from "../assets/assets";

const Platforms: React.FC = () => {
  return (
    <div className="divide-y divide-white/10 py-10" style={{
      paddingBottom: 0,
    }}>
      {/* Heading + Description */}
      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
          Connected Platforms
        </h2>
        <p className="text-white/70 max-w-2xl">
          We integrate with popular learning and developer ecosystems so your orbitos and achievements stay in sync.
        </p>
      </div>
      {/* Row 1 */}
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <LinkBox imgSrc={assets.codolioImage} href="https://www.codolio.com/" />
        <LinkBox Icon={Github} iconColor="#fff" href="https://github.com/singh04ayush" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 divide-x divide-white/10">
        <LinkBox imgSrc={assets.leetcodeWhite} href="https://leetcode.com/" />
        <LinkBox Icon={SiGeeksforgeeks} iconColor="#2F8D46" href="https://www.geeksforgeeks.org/" />
        <LinkBox imgSrc={assets.credlyImage} href="https://www.credly.com/" />
        <LinkBox Icon={SiHackerrank} iconColor="#2EC866" href="https://www.hackerrank.com/" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <LinkBox Icon={SiKaggle} iconColor="#20BEFF" href="https://www.kaggle.com" />
        <LinkBox imgSrc={assets.codechefImage} href="https://www.codechef.com/" />
        <div className="flex items-center justify-center">
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

/* ---------------- Reusable LinkBox Component ---------------- */
const LinkBox = ({
  Icon,
  href,
  imgSrc,
  className,
  iconColor,
}: {
  Icon?: React.ComponentType<any>;
  href: string;
  imgSrc?: string;
  className?: string;
  iconColor?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-20 w-full items-center justify-center sm:h-28 md:h-36 bg-transparent text-inherit"
    >
      {/* Base Icon/Image */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="custom icon"
          className={className ?? "max-h-14 sm:max-h-20 md:max-h-24 object-contain"}
        />
      ) : (
        Icon && <Icon className="text-3xl sm:text-5xl md:text-6xl" color={iconColor} />
      )}
    </a>
  );
};



export default Platforms;
