"use client";

import { journey as fallbackJourney } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

export default function LearningJourney({ items }: { items?: any[] }) {
  const activeJourney = items || fallbackJourney;

  return (
    <section id="journey" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-4xl">
        <RevealOnScroll className="mb-16">
          <div className="section-eyebrow mb-3">06 — LEARNING JOURNEY</div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Python fundamentals → AI engineering
          </h2>
        </RevealOnScroll>
        <div className="relative pl-10">
          <div className="absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-accent to-purple" />
          <div className="space-y-12">
            {activeJourney.map((j, i) => (
              <RevealOnScroll key={j.title} delay={i * 0.06} className="relative">
                <span className="absolute -left-10 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-[10px]">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold">{j.title}</h3>
                <p className="mt-1 text-muted">{j.desc}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

