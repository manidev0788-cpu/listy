"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children, session }) {
  useEffect(() => {
    const t = setTimeout(() => {
      fetch("/api/auth/providers", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      }).catch(() => {});
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
