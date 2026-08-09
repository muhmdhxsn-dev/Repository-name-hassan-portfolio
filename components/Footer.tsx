"use client";

import Link from "next/link";
import { FiGithub, FiLinkedin, FiTwitter, FiArrowUp, FiMail, FiExternalLink } from "react-icons/fi";
import MagneticButton from "./MagneticButton";

export default function Footer({ socialLinks }: { socialLinks?: any[] }) {
  const renderIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <FiGithub size={18} />;
      case "linkedin":
        return <FiLinkedin size={18} />;
      case "twitter":
      case "x":
        return <FiTwitter size={18} />;
      case "email":
      case "mail":
        return <FiMail size={18} />;
      default:
        return <FiExternalLink size={18} />;
    }
  };

  const defaultSocials = [
    { platform: "github", url: "https://github.com/" },
    { platform: "linkedin", url: "https://linkedin.com/" },
    { platform: "twitter", url: "https://twitter.com/" },
  ];

  const activeSocials = socialLinks || defaultSocials;

  return (
    <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm md:flex-row">
        <p className="risen-text text-[9px] tracking-[0.18em] text-muted/50">
          &copy; {new Date().getFullYear()} MUHAMMAD HASSAN. BUILT WITH PYTHON-LEVEL ATTENTION TO DETAIL.
        </p>
        <div className="flex items-center gap-5">
          {activeSocials
            .filter((s) => s.platform !== "email")
            .map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                aria-label={s.platform}
                className="text-muted/50 transition-colors hover:text-white"
              >
                {renderIcon(s.platform)}
              </a>
            ))}
        </div>
        <MagneticButton>
          <button
            data-hover
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/[0.08] bg-white/[0.03] text-muted/60 transition-all hover:border-accent/30 hover:text-accent"
          >
            <FiArrowUp size={14} />
          </button>
        </MagneticButton>
      </div>
    </footer>
  );
}

