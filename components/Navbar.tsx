"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#terminal", label: "Terminal" },
  { href: "#github", label: "GitHub" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ name }: { name?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const activeName = name || "Muhammad Hassan";
  const initials = activeName
    .split(" ")
    .map((w) => w[0])
    .join("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] px-6 py-4 transition-all duration-500 md:px-12",
        scrolled
          ? "border-b border-white/[0.06] bg-[#03060f]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(79,195,161,0.06)]"
          : ""
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          data-hover
          className="risen-text text-sm font-risen tracking-[0.2em] text-white/90 hover:text-accent transition-colors duration-200"
          aria-label="Back to top"
        >
          <span className="grad-text-accent">{initials}</span>
          <span className="mx-[0.15em] text-white/20">·</span>
          <span>HASSAN</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-hover
              className="risen-text text-[11px] tracking-[0.18em] text-muted transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <MagneticButton className="hidden md:inline-flex">
          <a
            href="#contact"
            data-hover
            className="risen-text rounded-sm border border-accent/40 bg-accent/10 px-5 py-2 text-[10px] tracking-[0.2em] text-accent transition-all duration-200 hover:bg-accent hover:text-bg hover:shadow-glow-sm"
          >
            LET&apos;S TALK
          </a>
        </MagneticButton>

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mt-4 flex flex-col gap-5 border-t border-white/[0.06] px-2 pb-5 pt-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="risen-text text-[11px] tracking-[0.18em] text-muted transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="risen-text mt-2 inline-block w-fit rounded-sm border border-accent/40 px-5 py-2 text-[10px] tracking-[0.2em] text-accent"
          >
            LET&apos;S TALK
          </a>
        </div>
      )}
    </nav>
  );
}
