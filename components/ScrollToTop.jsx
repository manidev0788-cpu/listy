"use client";

import { startTransition, useCallback, useEffect, useState } from "react";

const SHOW_AFTER_PX = 320;

/**
 * Fixed scroll-to-top control. Renders nothing until mounted (no hydration mismatch).
 * Respects prefers-reduced-motion for scroll and motion transitions.
 */
export function ScrollToTop() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    let ticking = false;
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > SHOW_AFTER_PX);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  const scrollToTop = useCallback(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed z-[38] flex h-12 w-12 items-center justify-center rounded-full border bg-white/95 shadow-[0_8px_28px_rgba(0,0,0,0.12)] ring-1 backdrop-blur-md transition-[opacity,transform,box-shadow,border-color,background-color,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:duration-150 dark:bg-zinc-900/95 dark:ring-zinc-800 dark:focus-visible:ring-offset-zinc-900 ${
        visible
          ? "pointer-events-auto translate-y-0 border-zinc-200/90 text-[#1fa99c] opacity-100 ring-zinc-100 hover:-translate-y-1 hover:border-[#2ed2c3]/55 hover:bg-[#2ed2c3]/10 hover:text-[#2ed2c3] hover:shadow-[0_14px_40px_rgba(46,210,195,0.28)] active:scale-95 motion-reduce:hover:translate-y-0 dark:border-zinc-700/90 dark:text-[#2ed2c3] dark:hover:border-[#2ed2c3]/50 dark:hover:bg-[#2ed2c3]/12"
          : "pointer-events-none translate-y-3 border-transparent text-zinc-500 opacity-0 ring-transparent motion-reduce:translate-y-0"
      }`}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        left: "max(1rem, env(safe-area-inset-left, 0px))",
      }}
    >
      <svg
        className="h-6 w-6 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 19V6M12 6l-5.5 5.5M12 6l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
