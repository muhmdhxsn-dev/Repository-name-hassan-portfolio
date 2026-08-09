"use client";

import { useEffect, useRef, useState } from "react";
import { terminalCommands as fallbackCommands } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

type Line = { html: string };

export default function Terminal({ commands }: { commands?: Record<string, string> }) {
  const activeCommands = commands || fallbackCommands;
  const [lines, setLines] = useState<Line[]>([
    { html: `Welcome to hassan@portfolio. Type <span class="text-white">help</span> to get started.` },
  ]);
  const [value, setValue] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const echo = { html: `<span class="text-muted">hassan@portfolio:~$</span> ${raw}` };

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "") {
      setLines((l) => [...l, echo]);
      return;
    }
    if (activeCommands[cmd]) {
      setLines((l) => [...l, echo, { html: activeCommands[cmd].replace(/\n/g, "<br/>") }]);
    } else {
      setLines((l) => [
        ...l,
        echo,
        { html: `command not found: ${cmd} — type <span class="text-white">help</span>` },
      ]);
    }
  };

  return (
    <section id="terminal" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow mb-4">04 — TERMINAL</div>
            <h2 className="section-title">
              CLI VERSION<br />
              OF ME
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
            Type <span className="font-mono text-accent">help</span> to see available commands.
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          delay={0.1}
          className="overflow-hidden rounded-sm border border-white/[0.08] shadow-[0_24px_80px_-40px_rgba(79,195,161,0.18)]"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#06090f] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
            <span className="ml-3 risen-text text-[9px] tracking-[0.15em] text-muted/60">HASSAN@PORTFOLIO ~</span>
          </div>
          <div
            ref={bodyRef}
            role="log"
            aria-live="polite"
            className="h-[340px] overflow-y-auto bg-[#03060f] p-5 font-mono text-sm text-muted leading-relaxed"
            onClick={() => document.getElementById("term-input")?.focus()}
          >
            {lines.map((l, i) => (
              <div key={i} className="mb-2 whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: l.html }} />
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#03060f] px-5 py-4">
            <span className="font-mono text-xs text-accent">hassan@portfolio:~$</span>
            <input
              id="term-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runCommand(value);
                  setValue("");
                }
              }}
              placeholder="type a command…"
              className="flex-1 bg-transparent font-mono text-sm text-white/90 outline-none placeholder:text-muted/40"
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

