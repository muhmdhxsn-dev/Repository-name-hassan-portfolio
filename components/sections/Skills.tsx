"use client";

import { skills as fallbackSkills } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

export default function Skills({ list }: { list?: any[] }) {
  const activeSkills = list || fallbackSkills;

  return (
    <section id="skills" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        {/* Header — left-aligned, asymmetric */}
        <RevealOnScroll className="mb-14 grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="section-eyebrow mb-4">02 — SKILLS</div>
            <h2 className="section-title">
              THE STACK<br />
              BEHIND THE<br />
              SYSTEMS
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-muted">
              Technologies I reach for daily — from Python services and databases to cloud infrastructure and automation tooling.
            </p>
          </div>
        </RevealOnScroll>

        {/* Skills grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {activeSkills.map((s, i) => (
            <RevealOnScroll key={s.cat} delay={i * 0.04}>
              <div className="group relative overflow-hidden rounded-sm border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-accent/25 hover:bg-white/[0.04]">
                {/* Accent corner line */}
                <div className="absolute left-0 top-0 h-6 w-[2px] bg-gradient-to-b from-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

                {/* Category label */}
                <h3 className="risen-text mb-4 text-[10px] tracking-[0.22em] text-accent/80">
                  {s.cat.toUpperCase()}
                </h3>

                {/* Items */}
                <ul className="space-y-2">
                  {s.items.map((it: string) => (
                    <li key={it} className="flex items-center gap-2.5 text-sm text-muted">
                      <span className="h-px w-3 flex-shrink-0 bg-accent/40" aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
