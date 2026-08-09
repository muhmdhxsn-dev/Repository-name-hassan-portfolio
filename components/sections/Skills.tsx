"use client";

import { skills as fallbackSkills } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";
import { Card } from "../ui/card";

export default function Skills({ list }: { list?: any[] }) {
  const activeSkills = list || fallbackSkills;

  return (
    <section id="skills" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-14">
          <div className="section-eyebrow mb-3">02 — SKILLS</div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            The stack behind the systems
          </h2>
        </RevealOnScroll>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeSkills.map((s, i) => (
            <RevealOnScroll key={s.cat} delay={i * 0.04}>
              <Card className="h-full p-6 transition-transform duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card">
                <h3 className="mb-4 font-display font-semibold text-accent-2">{s.cat}</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {s.items.map((it: any) => (
                    <li key={it} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

