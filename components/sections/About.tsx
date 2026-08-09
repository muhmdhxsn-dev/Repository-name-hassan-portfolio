"use client";

import { aboutCards as fallbackCards } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

export default function About({ cards }: { cards?: any[] }) {
  const activeCards = cards || fallbackCards;

  return (
    <section id="about" className="relative z-10 px-6 py-24 md:px-12">
      {/* Faint divider glow */}
      <div className="rule mb-20" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <RevealOnScroll className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow mb-4">01 — ABOUT</div>
            <h2 className="section-title">
              WHO&apos;S<br />
              BUILDING THIS?
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
            Python developer with a bias for reliability, clean contracts, and automation that saves people real hours.
          </p>
        </RevealOnScroll>

        {/* Cards — asymmetric grid */}
        <div className="grid gap-4 md:grid-cols-12">
          {activeCards.map((c, i) => {
            // First card takes 7 cols, second 5, third 5, fourth 7, fifth full
            const colSpans = [
              "md:col-span-7",
              "md:col-span-5",
              "md:col-span-5",
              "md:col-span-7",
              "md:col-span-12",
            ];
            const span = c.wide ? "md:col-span-12" : (colSpans[i] ?? "md:col-span-6");

            return (
              <RevealOnScroll
                key={c.title}
                delay={i * 0.06}
                className={span}
              >
                <div className="group h-full rounded-sm border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-accent/20 hover:bg-white/[0.035] md:p-8">
                  {/* Label */}
                  <div className="risen-text mb-4 text-[10px] tracking-[0.2em] text-accent/70">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Title */}
                  <h3 className="risen-text mb-3 text-sm tracking-[0.12em] text-white/90">
                    {c.title.toUpperCase()}
                  </h3>
                  {/* Body */}
                  <p className="text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
