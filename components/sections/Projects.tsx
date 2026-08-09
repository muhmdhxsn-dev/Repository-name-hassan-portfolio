"use client";

import { projects as fallbackProjects } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";
import ProjectCard from "./ProjectCard";

export default function Projects({ list }: { list?: any[] }) {
  const activeProjects = list || fallbackProjects;

  return (
    <section id="projects" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <RevealOnScroll className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow mb-4">03 — PROJECTS</div>
            <h2 className="section-title">
              SELECTED<br />
              WORK
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
            Backend services, APIs, and automation tools — built to run unattended.
          </p>
        </RevealOnScroll>

        {/* Grid — 2-col, staggered */}
        <div className="grid gap-5 md:grid-cols-2">
          {activeProjects.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.07}>
              <ProjectCard project={p} index={i} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
