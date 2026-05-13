"use client";

import { Component } from "react";

/**
 * Isolates optional UI (e.g. help bubble) so a render error cannot break the page.
 */
export class UiErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="pointer-events-none fixed bottom-0 right-0 z-30 max-w-[calc(100vw-2rem)] p-4 sm:bottom-2 sm:right-2"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
            paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto rounded-lg border border-zinc-200 bg-white/95 px-3 py-2 text-center text-xs text-zinc-600 shadow-lg ring-1 ring-zinc-100 dark:border-zinc-600 dark:bg-zinc-900/95 dark:text-zinc-300">
            Help menu is temporarily unavailable.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
