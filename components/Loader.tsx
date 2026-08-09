"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Loader() {
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const tLoad = setTimeout(() => {
      setFadeOut(true);
      const tDone = setTimeout(() => setDone(true), 250);
      return () => clearTimeout(tDone);
    }, 450);

    return () => clearTimeout(tLoad);
  }, []);

  if (done) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-4 bg-bg transition-opacity duration-250 ease-out",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      aria-hidden="true"
    >
      <div className="h-16 w-16 animate-[spin_2.4s_linear_infinite]">
        <svg viewBox="0 0 100 100" fill="none">
          <path
            d="M50 10c-18 0-20 8-20 18v10h20v4H20c-8 0-14 6-14 18s6 18 14 18h6v-14c0-8 6-14 14-14h16c8 0 14-6 14-14V28c0-10-8-18-20-18z"
            stroke="url(#g1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M50 90c18 0 20-8 20-18V62H50v-4h30c8 0 14-6 14-18s-6-18-14-18h-6v14c0 8-6 14-14 14H44c-8 0-14 6-14 14v10c0 10 8 18 20 18z"
            stroke="url(#g2)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="font-mono text-xs uppercase tracking-[.3em] text-muted">
        compiling experience.py
      </p>
      <div className="h-0.5 w-44 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-accent to-purple animate-[loadProgress_0.4s_ease-in-out_forwards]"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}
