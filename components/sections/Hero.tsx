"use client";

import { useEffect, useRef, useState } from "react";
import { roles as fallbackRoles, stats as fallbackStats } from "@/lib/data";
import MagneticButton from "../MagneticButton";
import RevealOnScroll from "../RevealOnScroll";

function useTypewriter(customRoles?: string[]) {
  const [text, setText] = useState("");
  const activeRoles = customRoles || fallbackRoles;

  useEffect(() => {
    let ri = 0;
    let ci = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = activeRoles[ri];
      if (!word) return;
      if (!deleting) {
        ci++;
        setText(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timeout = setTimeout(tick, 1300);
          return;
        }
      } else {
        ci--;
        setText(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % activeRoles.length;
        }
      }
      timeout = setTimeout(tick, deleting ? 45 : 85);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [activeRoles]);

  return text;
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      setCount(value);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const step = Math.max(1, Math.round(value / 40));
        let cur = 0;
        const interval = window.setInterval(() => {
          cur += step;
          if (cur >= value) {
            cur = value;
            window.clearInterval(interval);
          }
          setCount(cur);
        }, 20);

        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero({ data, stats }: { data?: any; stats?: any }) {
  const activeRoles = data?.typingText || fallbackRoles;
  const typed = useTypewriter(activeRoles);

  const currentStats = stats || fallbackStats;
  const name = data?.name || "Muhammad Hassan";
  const firstName = name.split(" ")[0] || "Muhammad";
  const lastName = name.substring(firstName.length).trim() || "Hassan";
  const subtitle = data?.subtitle || "I design and ship backend systems that don't fall over — Python services, REST & async APIs, and automation pipelines that remove the boring parts of other people's jobs. Currently pointing that same discipline at AI engineering.";
  const title = data?.title || "Available for backend & automation roles";
  const resumeUrl = data?.resumeUrl || "/resume.pdf";

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen items-center px-6 pb-20 pt-32 md:px-12"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <RevealOnScroll className="mb-6 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[.3em] text-muted">
              {title}
            </span>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05}>
            <h1 className="font-display text-[13vw] font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="grad-text">{lastName}</span>
                </>
              )}
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="mt-6 flex items-center gap-2 font-mono text-xl text-muted md:text-2xl">
            <span>&gt;</span>
            <span className="text-white">{typed}</span>
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-blink bg-accent-2 align-middle" />
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {subtitle}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} className="mt-9 flex flex-wrap gap-4">
            <MagneticButton>
              <a
                href="#projects"
                data-hover
                className="rounded-full bg-accent px-6 py-3.5 text-sm font-medium shadow-glow transition-colors hover:bg-accent-2"
              >
                View Projects
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={resumeUrl}
                data-hover
                download
                className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium transition-colors hover:border-white/40"
              >
                Download Resume
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#contact"
                data-hover
                className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium transition-colors hover:border-white/40"
              >
                Contact Me
              </a>
            </MagneticButton>
          </RevealOnScroll>

          <RevealOnScroll delay={0.25} className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
            {currentStats.map((s: any) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-muted">{s.label}</div>
              </div>
            ))}
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1} className="relative flex h-[420px] items-center justify-center md:h-[520px]">
          <div className="glass absolute inset-0 rounded-[2rem]" />
          <svg viewBox="0 0 320 420" className="relative h-full w-full p-8" fill="none">
            <defs>
              <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <g className="font-mono">
              <circle cx="160" cy="50" r="26" fill="rgba(99,102,241,.15)" stroke="#6366F1" strokeWidth="1.5" />
              <text x="160" y="55" textAnchor="middle" fill="#fff" fontSize="10">client</text>

              <line x1="160" y1="76" x2="160" y2="118" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="105" y="118" width="110" height="46" rx="10" fill="rgba(59,130,246,.12)" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="160" y="137" textAnchor="middle" fill="#fff" fontSize="10">FastAPI</text>
              <text x="160" y="152" textAnchor="middle" fill="#8B93A7" fontSize="9">/v1/endpoint</text>

              <line x1="160" y1="164" x2="160" y2="206" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="60" y="206" width="90" height="46" rx="10" fill="rgba(139,92,246,.12)" stroke="#8B5CF6" strokeWidth="1.5" />
              <text x="105" y="225" textAnchor="middle" fill="#fff" fontSize="10">Worker</text>
              <text x="105" y="240" textAnchor="middle" fill="#8B93A7" fontSize="9">Celery</text>

              <rect x="170" y="206" width="90" height="46" rx="10" fill="rgba(99,102,241,.12)" stroke="#6366F1" strokeWidth="1.5" />
              <text x="215" y="225" textAnchor="middle" fill="#fff" fontSize="10">Postgres</text>
              <text x="215" y="240" textAnchor="middle" fill="#8B93A7" fontSize="9">database</text>

              <line x1="105" y1="164" x2="105" y2="206" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="215" y1="164" x2="215" y2="206" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />

              <line x1="160" y1="290" x2="160" y2="330" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="105" y="330" width="110" height="46" rx="10" fill="rgba(59,130,246,.12)" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="160" y="349" textAnchor="middle" fill="#fff" fontSize="10">Response</text>
              <text x="160" y="364" textAnchor="middle" fill="#8B93A7" fontSize="9">200 OK · JSON</text>

              <line x1="160" y1="252" x2="160" y2="290" stroke="url(#pipe)" strokeWidth="2" strokeDasharray="4 4" />
            </g>
            <circle r="4.5" fill="#fff">
              <animateMotion
                dur="3.4s"
                repeatCount="indefinite"
                path="M160,76 L160,118 M160,164 L160,206 M105,164 L105,206 M215,164 L215,206 M160,290 L160,330"
              />
            </circle>
          </svg>
          <span className="glass absolute -bottom-3 -right-3 rounded-full px-3 py-1.5 font-mono text-[10px] text-muted md:-right-4 md:bottom-6">
            request → automation → response
          </span>
        </RevealOnScroll>
      </div>

      <a
        href="#about"
        data-hover
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs text-muted md:flex"
      >
        <span>scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-accent to-transparent" />
      </a>
    </section>
  );
}

