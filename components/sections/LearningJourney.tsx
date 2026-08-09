"use client";

import { journey as fallbackJourney } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

export default function LearningJourney({ items }: { items?: any[] }) {
  const activeJourney = items || fallbackJourney;

  return (
    <section id="journey" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <RevealOnScroll className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow mb-4">06 — LEARNING JOURNEY</div>
            <h2 className="section-title">
              PYTHON<br />
              → AI ENGINEERING
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
            A deliberate progression — each phase building on the last toward production AI systems.
          </p>
        </RevealOnScroll>

        {/* Timeline — horizontal on large, vertical on mobile */}
        <div className="relative">
          {/* Vertical track */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-purple/40 to-transparent md:hidden"
            aria-hidden="true"
          />

          {/* Desktop horizontal track */}
          <div
            className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-accent/60 via-purple/40 to-transparent hidden md:block"
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="grid gap-6 md:grid-cols-6">
            {activeJourney.map((j, i) => {
              const isLast = i === activeJourney.length - 1;
              return (
                <RevealOnScroll key={j.title} delay={i * 0.07} className="pl-10 md:pl-0 md:pt-12">
                  {/* Node dot */}
                  <div
                    className={`absolute left-2.5 -translate-x-1/2 flex h-3 w-3 items-center justify-center rounded-full border md:static md:mb-4 md:translate-x-0 ${
                      isLast
                        ? "border-accent bg-accent shadow-glow-sm"
                        : "border-white/20 bg-[#03060f]"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Number */}
                  <div className="risen-text mb-2 text-[10px] tracking-[0.2em] text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <h3 className="risen-text mb-2 text-[11px] tracking-[0.12em] text-white/90">
                    {j.title.toUpperCase()}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-muted">{j.desc}</p>

                  {/* "Current" badge */}
                  {isLast && (
                    <span className="risen-text mt-3 inline-block rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] tracking-[0.15em] text-accent">
                      CURRENT
                    </span>
                  )}
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
