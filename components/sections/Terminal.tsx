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
    <section id="terminal" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll className="mb-10">
          <div className="section-eyebrow mb-3">04 — TERMINAL</div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Try the CLI version of me
          </h2>
          <p className="mt-3 text-muted">
            Type <span className="font-mono text-white">help</span> to see available commands.
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          delay={0.1}
          className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_-40px_rgba(99,102,241,.5)]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#0b0f1f] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
            <span className="ml-3 font-mono text-xs text-muted">hassan@portfolio: ~</span>
          </div>
          <div
            ref={bodyRef}
            role="log"
            aria-live="polite"
            className="h-[340px] overflow-y-auto bg-[#080b17] p-5 font-mono text-sm"
            onClick={() => document.getElementById("term-input")?.focus()}
          >
            {lines.map((l, i) => (
              <div key={i} className="mb-2 whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: l.html }} />
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 bg-[#080b17] px-5 py-4">
            <span className="font-mono text-accent-2">hassan@portfolio:~$</span>
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
              className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-muted"
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

