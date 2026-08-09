"use client";

import { projects as fallbackProjects } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";
import ProjectCard from "./ProjectCard";

export default function Projects({ list }: { list?: any[] }) {
  const activeProjects = list || fallbackProjects;

  return (
    <section id="projects" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-eyebrow mb-3">03 — PROJECTS</div>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Selected work</h2>
          </div>
          <p className="max-w-sm text-muted">
            Backend services, APIs, and automation tools — built to run unattended.
          </p>
        </RevealOnScroll>
        <div className="grid gap-7 md:grid-cols-2">
          {activeProjects.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.06}>
              <ProjectCard project={p} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

