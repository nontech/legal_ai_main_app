"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

export type ScrollRevealVariant = "fade-up" | "fade" | "fade-left" | "fade-right";

export default function ScrollReveal({
  as = "div",
  children,
  className = "",
  variant = "fade-up",
  delayMs = 0,
  rootMargin = "0px 0px -6% 0px",
  threshold = 0.06,
  style,
}: {
  as?: "div" | "li";
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  delayMs?: number;
  rootMargin?: string;
  threshold?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: number | undefined;
    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        observer = null;
        if (delayMs > 0) {
          timeoutId = window.setTimeout(() => setVisible(true), delayMs) as number;
        } else {
          setVisible(true);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => {
      observer?.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delayMs, rootMargin, threshold]);

  const variantClass = `scroll-reveal scroll-reveal--${variant}`;
  const stateClass = visible ? "scroll-reveal-visible" : "";
  const combined = [variantClass, stateClass, className].filter(Boolean).join(" ");

  if (as === "li") {
    return (
      <li ref={ref as RefObject<HTMLLIElement>} className={combined} style={style}>
        {children}
      </li>
    );
  }
  return (
    <div ref={ref as RefObject<HTMLDivElement>} className={combined} style={style}>
      {children}
    </div>
  );
}
