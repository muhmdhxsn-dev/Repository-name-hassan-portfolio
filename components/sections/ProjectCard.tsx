"use client";

import { useRef, useState } from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "@/lib/data";
import { Card } from "../ui/card";

export default function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMouseMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`,
    });
  };
  const onMouseLeave = () => setStyle({ transform: "none" });

  return (
    <Card
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className="overflow-hidden transition-transform duration-150 ease-out"
    >
      <div
        className="flex h-40 items-center justify-center"
        style={{ background: project.gradient }}
      >
        <span className="font-display text-2xl font-semibold text-white/90">
          {project.title}
        </span>
      </div>
      <div className="p-6">
        <p className="mb-4 text-sm leading-relaxed text-muted">{project.desc}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <details className="mb-4 text-sm text-muted">
          <summary className="cursor-pointer text-white/80 hover:text-white" data-hover>
            Key features &amp; challenges
          </summary>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3">
            <span className="text-white/80">Challenge solved:</span> {project.challenge}
          </p>
        </details>
        <div className="flex gap-4 text-sm">
          <a href={project.github} data-hover className="flex items-center gap-1.5 transition-colors hover:text-accent-2">
            <FiGithub /> Source
          </a>
          <a href={project.demo} data-hover className="flex items-center gap-1.5 transition-colors hover:text-accent-2">
            <FiExternalLink /> Live demo
          </a>
        </div>
      </div>
    </Card>
  );
}
