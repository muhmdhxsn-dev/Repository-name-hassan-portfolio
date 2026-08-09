"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function RevealOnScroll({
  children,
  className,
  threshold = 0.2,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}s` }}
      className={cn(
        className,
        "opacity-0 translate-y-3",
        visible && "opacity-100 translate-y-0 animate-fade-in"
      )}
    >
      {children}
    </div>
  );
}
