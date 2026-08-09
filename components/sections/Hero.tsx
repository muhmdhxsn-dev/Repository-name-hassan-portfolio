"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { roles as fallbackRoles, stats as fallbackStats } from "@/lib/data";
import MagneticButton from "../MagneticButton";
import RevealOnScroll from "../RevealOnScroll";

/* ─── Typewriter ──────────────────────────────────────────────── */
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
          timeout = setTimeout(tick, 1400);
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
      timeout = setTimeout(tick, deleting ? 42 : 80);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [activeRoles]);

  return text;
}

/* ─── Counter ─────────────────────────────────────────────────── */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) { setCount(value); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(value); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const step = Math.max(1, Math.round(value / 40));
        let cur = 0;
        const interval = window.setInterval(() => {
          cur += step;
          if (cur >= value) { cur = value; window.clearInterval(interval); }
          setCount(cur);
        }, 20);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Star Canvas ─────────────────────────────────────────────── */
function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create stars
    const NUM = 120;
    type Star = { x: number; y: number; r: number; opacity: number; speed: number; px: number; py: number };
    const stars: Star[] = Array.from({ length: NUM }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.55 + 0.1,
      speed: Math.random() * 0.00008 + 0.00002,
      px: 0,
      py: 0,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    let last = performance.now();
    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      stars.forEach((s) => {
        // Slow upward drift + subtle mouse parallax
        s.y -= s.speed * dt;
        if (s.y < 0) { s.y = 1; s.x = Math.random(); }

        const parallaxX = (mx - 0.5) * 0.012 * s.r;
        const parallaxY = (my - 0.5) * 0.012 * s.r;

        const screenX = (s.x + parallaxX) * canvas.width;
        const screenY = (s.y + parallaxY) * canvas.height;

        ctx.beginPath();
        ctx.arc(screenX, screenY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 240, ${s.opacity})`;
        ctx.fill();
      });

      // Occasional bigger glowing stars
      if (Math.random() < 0.002) {
        const gx = Math.random() * canvas.width;
        const gy = Math.random() * canvas.height;
        const gr = Math.random() * 1.5 + 0.5;
        const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 4);
        gradient.addColorStop(0, "rgba(125,223,198,0.5)");
        gradient.addColorStop(1, "rgba(125,223,198,0)");
        ctx.beginPath();
        ctx.arc(gx, gy, gr * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="star-canvas"
      aria-hidden="true"
    />
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
export default function Hero({ data, stats }: { data?: any; stats?: any }) {
  const activeRoles = data?.typingText || fallbackRoles;
  const typed = useTypewriter(activeRoles);

  const currentStats = stats || fallbackStats;
  const name = data?.name || "Muhammad Hassan";
  const firstName = name.split(" ")[0] || "Muhammad";
  const lastName = name.substring(firstName.length).trim() || "Hassan";
  const subtitle =
    data?.subtitle ||
    "I design and ship backend systems that don't fall over — Python services, REST & async APIs, and automation pipelines that remove the boring parts of other people's jobs. Currently pointing that same discipline at AI engineering.";
  const title = data?.title || "Available for backend & automation roles";
  const resumeUrl = data?.resumeUrl || "/resume.pdf";

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[min(860px,100vh)] items-center overflow-hidden px-6 pb-20 pt-28 md:px-12"
    >
      {/* Deep space background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -5%, rgba(79,195,161,0.08) 0%, transparent 65%), " +
            "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(108,142,191,0.06) 0%, transparent 65%), " +
            "#03060f",
        }}
        aria-hidden="true"
      />

      {/* Particle star canvas */}
      <StarCanvas />

      {/* Subtle horizontal scan lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
          backgroundSize: "100% 6px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Status badge */}
        <RevealOnScroll className="mb-8 flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          <span className="risen-text text-[10px] tracking-[0.2em] text-muted">
            {title}
          </span>
        </RevealOnScroll>

        {/* Name — primary hero element */}
        <RevealOnScroll delay={0.05}>
          <h1 className="risen-text text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] text-white">
            <span className="block">{firstName.toUpperCase()}</span>
            {lastName && (
              <span className="block grad-text">{lastName.toUpperCase()}</span>
            )}
          </h1>
        </RevealOnScroll>

        {/* Role typewriter */}
        <RevealOnScroll delay={0.12} className="mt-6 flex items-center gap-2">
          <span className="font-mono text-xs text-accent/60 select-none">&gt;</span>
          <span className="font-mono text-sm text-accent md:text-base">{typed}</span>
          <span className="inline-block h-[1em] w-[2px] bg-accent align-middle opacity-80 animate-blink" />
        </RevealOnScroll>

        {/* Description */}
        <RevealOnScroll delay={0.18} className="mt-6 max-w-xl">
          <p className="text-sm leading-relaxed text-muted md:text-base">{subtitle}</p>
        </RevealOnScroll>

        {/* CTA buttons */}
        <RevealOnScroll delay={0.24} className="mt-8 flex flex-wrap gap-3">
          <MagneticButton>
            <a
              href="#projects"
              data-hover
              className="risen-text inline-block rounded-sm bg-accent px-6 py-3 text-[11px] tracking-[0.2em] text-bg shadow-glow transition-all duration-300 hover:bg-accent-2 hover:shadow-[0_0_30px_-8px_rgba(79,195,161,0.8)]"
            >
              VIEW PROJECTS
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={resumeUrl}
              data-hover
              download
              className="risen-text inline-block rounded-sm border border-white/15 px-6 py-3 text-[11px] tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-accent/50 hover:text-white"
            >
              DOWNLOAD CV
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#contact"
              data-hover
              className="risen-text inline-block rounded-sm border border-white/15 px-6 py-3 text-[11px] tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-accent/50 hover:text-white"
            >
              CONTACT
            </a>
          </MagneticButton>
        </RevealOnScroll>

        {/* Stats row */}
        <RevealOnScroll delay={0.3} className="mt-14 flex flex-wrap gap-10 border-t border-white/[0.06] pt-8">
          {currentStats.map((s: any) => (
            <div key={s.label} className="group">
              <div className="risen-text text-2xl text-white md:text-3xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        data-hover
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted/60 transition-opacity hover:text-muted md:flex"
        aria-label="Scroll to about section"
      >
        <span>scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-accent/60 to-transparent" />
      </a>
    </section>
  );
}
