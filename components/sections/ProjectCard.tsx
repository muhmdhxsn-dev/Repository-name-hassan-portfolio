"use client";

import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "@/lib/data";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <article
      className="group relative overflow-hidden rounded-sm border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04] hover:shadow-card"
    >
      {/* Top gradient strip */}
      <div
        className="h-1 w-full transition-opacity duration-300 opacity-50 group-hover:opacity-100"
        style={{ background: project.gradient }}
        aria-hidden="true"
      />

      {/* Number badge */}
      <div className="absolute right-6 top-6 risen-text text-[2.5rem] font-risen leading-none text-white/[0.04] transition-all duration-500 group-hover:text-white/[0.07] select-none">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="p-6 md:p-8">
        {/* Title */}
        <h3 className="risen-text mb-3 text-base tracking-[0.1em] text-white transition-colors duration-300 group-hover:text-accent-2 md:text-lg">
          {project.title.toUpperCase()}
        </h3>

        {/* Description */}
        <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted">
          {project.desc}
        </p>

        {/* Tech tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted/80 transition-colors hover:border-accent/25 hover:text-accent/80"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-1.5 border-l border-accent/20 pl-4">
          {project.features.map((f) => (
            <li key={f} className="text-xs leading-relaxed text-muted/80">
              {f}
            </li>
          ))}
        </ul>

        {/* Challenge */}
        <div className="mb-6 rounded-sm bg-accent/[0.04] p-3 text-xs leading-relaxed text-muted/80 border border-accent/10">
          <span className="risen-text text-[9px] tracking-[0.15em] text-accent/70">CHALLENGE SOLVED — </span>
          {project.challenge}
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 pt-2 border-t border-white/[0.05]">
          <a
            href={project.github}
            data-hover
            className="risen-text flex items-center gap-2 text-[10px] tracking-[0.15em] text-muted transition-colors hover:text-white"
          >
            <FiGithub size={13} />
            SOURCE
          </a>
          <a
            href={project.demo}
            data-hover
            className="risen-text flex items-center gap-2 text-[10px] tracking-[0.15em] text-muted transition-colors hover:text-white"
          >
            <FiExternalLink size={13} />
            LIVE DEMO
          </a>
        </div>
      </div>
    </article>
  );
}
