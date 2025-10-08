import type * as React from "react";
import {
  SiGoogle,
  SiTiktok,
  SiSpotify,
} from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import {
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
// CSS-driven hover animations; no JS animation needed

const Platforms: React.FC = () => {
  return (
    <div className="divide-y divide-white/10 py-10">
      {/* Row 1 */}
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <LinkBox
          Icon={SiGoogle}
          href="https://mail.google.com/mail/u/0/?demo@gmail.com&tf=cm"
        />
        <LinkBox Icon={Github} href="https://github.com/singh04ayush" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 divide-x divide-white/10">
        <LinkBox Icon={Twitter} href="https://x.com" />
        <LinkBox Icon={Linkedin} href="https://www.linkedin.com/in" />
        <LinkBox Icon={Instagram} href="https://www.instagram.com" />
        <LinkBox Icon={Facebook} href="https://www.facebook.com" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <LinkBox Icon={FaDiscord} href="https://discord.com" />
        <LinkBox
          href="https://21st.dev"
          className="h-6 w-auto object-contain"
          imgSrc="https://media.licdn.com/dms/image/v2/D4E0BAQH3Jqtih4t7-A/company-logo_200_200/B4EZY_fSK1HUAM-/0/1744821888382/21st_dev_logo?e=2147483647&v=beta&t=8hoDRfmpNQR3aqnKWef5U0bW9Mg2GCbgwvgeQ5MKaKU"
        />
        <LinkBox
          href="https://kamaleshsaportfolio.netlify.app/"
          className="h-8 w-auto object-contain"
          imgSrc="https://i.ibb.co/q36kg6qT/fotor-2025052503615.png"
        />
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
}: {
  Icon?: React.ComponentType<any>;
  href: string;
  imgSrc?: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative grid h-20 w-full place-content-center sm:h-28 md:h-36 overflow-hidden bg-transparent text-inherit"
    >
      {/* Base Icon/Image */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="custom icon"
          className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
        />
      ) : (
        Icon && <Icon className="text-xl sm:text-3xl md:text-4xl" />
      )}

      {/* Hover Overlay */}
      <div
        className="hoverOverlay pointer-events-none absolute inset-0 grid place-content-center origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
        style={{
          willChange: "transform",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          background: "rgba(255,255,255,0.95)",
          color: "#000000",
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="hover icon"
            className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
          />
        ) : (
          Icon && <Icon className="text-xl sm:text-3xl md:text-4xl" />
        )}
      </div>
    </a>
  );
};



export default Platforms;
