"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { aiAnswers as fallbackAnswers } from "@/lib/data";
import MagneticButton from "./MagneticButton";

type Msg = { role: "bot" | "user"; text: string };

export default function AIAssistant({ answers }: { answers?: Record<string, { label: string; answer: string }> }) {
  const activeAnswers = answers || fallbackAnswers;
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !greeted) {
      setMessages([
        { role: "bot", text: "Hi! I'm Hassan's portfolio assistant. Tap a question below to get started." },
      ]);
      setGreeted(true);
    }
  };

  const ask = (key: string) => {
    const q = activeAnswers[key];
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q.label }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: q.answer }]);
    }, 350);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      {open && (
        <div className="glass mb-4 w-[min(360px,88vw)] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(99,102,241,.6)] transition-opacity duration-200">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple text-sm font-semibold">
                AI
              </div>
              <div>
                <p className="text-sm font-medium">Ask about Hassan</p>
                <p className="text-xs text-muted">Instant answers, no waiting</p>
              </div>
            </div>
            <div className="flex h-72 flex-col gap-3 overflow-y-auto px-5 py-4 text-sm">
              {messages.map((m, i) =>
                m.role === "bot" ? (
                  <div key={i} className="rounded-tl-[4px] rounded-2xl border border-accent/25 bg-accent/10 px-3.5 py-2.5">
                    {m.text}
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="rounded-tr-[4px] rounded-2xl bg-white/5 px-3.5 py-2.5">{m.text}</div>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
              {Object.entries(activeAnswers).map(([key, v]) => (
                <button
                  key={key}
                  data-hover
                  onClick={() => ask(key)}
                  className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1.5 text-[11px] text-[#c7cbf5] transition-colors hover:bg-accent/25"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      <MagneticButton>
        <button
          onClick={toggle}
          data-hover
          aria-label="Open AI assistant"
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple text-xl shadow-[0_0_40px_-4px_rgba(139,92,246,.8)]"
        >
          <HiSparkles />
        </button>
      </MagneticButton>
    </div>
  );
}

