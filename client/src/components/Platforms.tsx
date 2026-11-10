import { useState } from "react";
import type * as React from "react";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiHackerrank,
  SiCodechef,
  SiKaggle,
} from "react-icons/si";
import { Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import assets from "../assets/assets";

/* ---- Theme colours matching Hero / Home animated palette ---- */
const PLATFORM_THEME: Record<string, { glow: string; label: string }> = {
  codolio:   { glow: "#1E67C6", label: "Codolio"      },
  github:    { glow: "#CE84CF", label: "GitHub"        },
  leetcode:  { glow: "#FFA116", label: "LeetCode"      },
  gfg:       { glow: "#2F8D46", label: "GeeksForGeeks" },
  credly:    { glow: "#FF6B2B", label: "Credly"        },
  hackerrank:{ glow: "#2EC866", label: "HackerRank"    },
  kaggle:    { glow: "#20BEFF", label: "Kaggle"        },
  codechef:  { glow: "#DD335C", label: "CodeChef"      },
  google:    { glow: "#13FFAA", label: "Google"        },
};

const Platforms: React.FC = () => {
  return (
    <div
      className="divide-y divide-white/10 py-10"
      style={{ paddingBottom: 0 }}
    >
      {/* Heading + Description */}
      <div className="px-4 sm:px-6 md:px-8 pb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
          Connected Platforms
        </h2>
        <p className="text-white/70 max-w-2xl">
          We integrate with popular learning and developer ecosystems so your
          orbitos and achievements stay in sync.
        </p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <LinkBox
          id="codolio"
          imgSrc={assets.codolioImage}
          href="https://www.codolio.com/"
        />
        <LinkBox
          id="github"
          Icon={Github}
          iconColor="#fff"
          href="https://github.com/phoenixdev100"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 divide-x divide-white/10">
        <LinkBox
          id="leetcode"
          imgSrc={assets.leetcodeWhite}
          href="https://leetcode.com/"
        />
        <LinkBox
          id="gfg"
          Icon={SiGeeksforgeeks}
          iconColor="#2F8D46"
          href="https://www.geeksforgeeks.org/"
        />
        <LinkBox
          id="credly"
          imgSrc={assets.credlyImage}
          href="https://www.credly.com/"
        />
        <LinkBox
          id="hackerrank"
          Icon={SiHackerrank}
          iconColor="#2EC866"
          href="https://www.hackerrank.com/"
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <LinkBox
          id="kaggle"
          Icon={SiKaggle}
          iconColor="#20BEFF"
          href="https://www.kaggle.com"
        />
        <LinkBox
          id="codechef"
          imgSrc={assets.codechefImage}
          href="https://www.codechef.com/"
        />
        {/* Google — raw img, still wrapped in LinkBox */}
        <LinkBox
          id="google"
          externalImgSrc="https://www.google.com/favicon.ico"
          externalImgAlt="Google"
          href="https://google.com"
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Reusable LinkBox Component                                           */
/* ------------------------------------------------------------------ */
interface LinkBoxProps {
  id: keyof typeof PLATFORM_THEME;
  Icon?: React.ComponentType<any>;
  href: string;
  imgSrc?: string;
  className?: string;
  iconColor?: string;
  externalImgSrc?: string;
  externalImgAlt?: string;
}

const LinkBox: React.FC<LinkBoxProps> = ({
  id,
  Icon,
  href,
  imgSrc,
  className,
  iconColor,
  externalImgSrc,
  externalImgAlt,
}) => {
  const [hovered, setHovered] = useState(false);
  const theme = PLATFORM_THEME[id] ?? { glow: "#ffffff", label: id };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex h-20 w-full items-center justify-center sm:h-28 md:h-36 overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ---- Animated glow background ---- */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="glow-bg"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${theme.glow}22 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ---- Animated corner dots on hover ---- */}
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(
        (pos, i) => (
          <motion.span
            key={pos}
            className={`absolute ${pos} h-1 w-1 rounded-full`}
            style={{ backgroundColor: theme.glow }}
            initial={{ opacity: 0, scale: 0 }}
            animate={hovered ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
          />
        )
      )}

      {/* ---- Shimmer border ---- */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-none"
        style={{
          boxShadow: hovered
            ? `inset 0 0 0 1px ${theme.glow}55`
            : `inset 0 0 0 1px transparent`,
          transition: "box-shadow 0.3s ease",
        }}
      />

      {/* ---- Icon / Image — scale + filter on hover ---- */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2"
        animate={
          hovered
            ? { scale: 1.12, y: -2 }
            : { scale: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={theme.label}
            className={className ?? "max-h-14 sm:max-h-20 md:max-h-24 object-contain"}
            style={{
              filter: hovered
                ? `drop-shadow(0 0 8px ${theme.glow}99)`
                : "none",
              transition: "filter 0.3s ease",
            }}
          />
        ) : externalImgSrc ? (
          <img
            src={externalImgSrc}
            alt={externalImgAlt ?? theme.label}
            className="h-10 w-10 object-contain"
            style={{
              filter: hovered
                ? `drop-shadow(0 0 8px ${theme.glow}99)`
                : "none",
              transition: "filter 0.3s ease",
            }}
          />
        ) : (
          Icon && (
            <Icon
              className="text-3xl sm:text-5xl md:text-6xl"
              color={iconColor}
              style={{
                filter: hovered
                  ? `drop-shadow(0 0 8px ${theme.glow}99)`
                  : "none",
                transition: "filter 0.3s ease",
              }}
            />
          )
        )}

        {/* ---- Platform name label — fade in on hover ---- */}
        <motion.span
          className="text-xs font-medium tracking-wide select-none"
          style={{ color: theme.glow }}
          initial={{ opacity: 0, y: 4 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
        >
          {theme.label}
        </motion.span>
      </motion.div>
    </a>
  );
};

export default Platforms;
