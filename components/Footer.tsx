"use client";

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
    <footer className="relative z-10 border-t border-white/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-muted md:flex-row">
        <p>© {new Date().getFullYear()} Muhammad Hassan. Built with Python-level attention to detail.</p>
        <div className="flex items-center gap-5">
          {activeSocials
            .filter((s) => s.platform !== "email") // email link is typically shown separately, but we can display it if we want.
            .map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                aria-label={s.platform}
                className="transition-colors hover:text-white"
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
            className="glass flex h-10 w-10 items-center justify-center rounded-full hover:border-accent-2"
          >
            <FiArrowUp />
          </button>
        </MagneticButton>
      </div>
    </footer>
  );
}

