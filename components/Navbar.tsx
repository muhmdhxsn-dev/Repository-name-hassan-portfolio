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
  const firstLetter = activeName.split(" ")[0]?.[0] || "M";
  const lastName = activeName.split(" ").slice(1).join(" ") || "Hassan";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-6 py-5 transition-colors duration-300 md:px-12",
        scrolled && "bg-bg/75 backdrop-blur-xl border-b border-white/10"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#home" data-hover className="font-display text-lg font-semibold tracking-tight">
          {firstLetter}<span className="grad-text">.</span>{lastName}
        </a>
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-hover className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
        <MagneticButton className="hidden md:inline-flex">
          <a
            href="#contact"
            data-hover
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Let&apos;s talk
          </a>
        </MagneticButton>
        <button
          className="text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      {open && (
        <div className="mt-4 flex flex-col gap-4 px-2 pb-4 text-muted md:hidden transition-opacity duration-200">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
