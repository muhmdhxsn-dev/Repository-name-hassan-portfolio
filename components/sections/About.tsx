"use client";

import { aboutCards as fallbackCards } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";
import { Card } from "../ui/card";

export default function About({ cards }: { cards?: any[] }) {
  const activeCards = cards || fallbackCards;

  return (
    <section id="about" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-14">
          <div className="section-eyebrow mb-3">01 — ABOUT</div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Who&apos;s building this?
          </h2>
        </RevealOnScroll>
        <div className="grid gap-6 md:grid-cols-2">
          {activeCards.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.05} className={c.wide ? "md:col-span-2" : ""}>
              <Card className="p-8">
                <h3 className="mb-3 font-display text-lg font-semibold text-accent-2">
                  {c.title}
                </h3>
                <p className="leading-relaxed text-muted">{c.body}</p>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

