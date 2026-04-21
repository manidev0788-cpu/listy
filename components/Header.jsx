"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { AuthModal } from "@/components/AuthModal";

const navItems = [
  { label: "Home", href: "/" },
  { label: "View All Listings", href: "/listings" },
  { label: "Job Pages", href: "/job-pages" },
  { label: "Pages", href: "/pages" },
  { label: "Blog", href: "/blog" },
];

function UserIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserPlusIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h12v-1c0-3.33-4.67-5-8-5Z"
        fill="currentColor"
      />
      <path
        d="M19 8v6M16 11h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="12"
        width="7"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="3"
        y="16"
        width="7"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15 17l5-5-5-5M20 12H9M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderShell />}>
      <HeaderInner />
    </Suspense>
  );
}

function HeaderShell() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-[#0b0b0d]" />
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [pendingNav, setPendingNav] = useState(null);
  const handledAuthParam = useRef(false);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  useEffect(() => {
    if (handledAuthParam.current) return;

    const authParam = searchParams.get("auth");
    if (authParam !== "signin" && authParam !== "signup") return;

    handledAuthParam.current = true;

    const next = searchParams.get("next");

    if (status === "loading") return;

    if (status === "authenticated") {
      if (next) router.replace(next);
      else {
        const url = new URL(window.location.href);
        url.searchParams.delete("auth");
        url.searchParams.delete("next");
        router.replace(url.pathname + url.search);
      }
      return;
    }

    if (next) setPendingNav(next);
    openAuth(authParam);

    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    url.searchParams.delete("next");
    const clean = url.pathname + (url.search ? url.search : "");
    window.history.replaceState(null, "", clean);
  }, [searchParams, status, router]);

  const isHome = pathname === "/";
  const isAuthed = status === "authenticated" && session?.user;

  const handleAddListingClick = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      setPendingNav("/add-listing");
      openAuth("signin");
    }
  };

  const handleAuthSuccess = () => {
    if (pendingNav) {
      const target = pendingNav;
      setPendingNav(null);
      router.push(target);
    }
  };

  const userLabel =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Account";

  return (
    <>
      <header
        className={
          isHome
            ? "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-md"
            : "fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0b0b0d] shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
        }
      >
        <div className="mx-auto grid h-[72px] max-w-[1320px] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[auto_1fr_auto] lg:px-8">
          <Link
            href="/"
            className="justify-self-start"
            aria-label="Listfy home"
          >
            <Logo className="h-8 w-auto sm:h-9" variant="light" />
          </Link>

          <nav
            className="hidden items-center justify-center gap-1 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white lg:px-4"
                      : "rounded-full px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white lg:px-4"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <details className="relative md:hidden">
              <summary className="list-none [&::-webkit-details-marker]:hidden">
                <span className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10">
                  <span className="sr-only">Menu</span>
                  <span className="flex flex-col gap-1.5">
                    <span className="block h-0.5 w-5 rounded-full bg-white" />
                    <span className="block h-0.5 w-5 rounded-full bg-white" />
                    <span className="block h-0.5 w-5 rounded-full bg-white" />
                  </span>
                </span>
              </summary>
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900/95 py-2 shadow-xl backdrop-blur-md">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            {isAuthed ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/dashboard"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  title="My dashboard"
                >
                  <DashboardIcon />
                  Dashboard
                </Link>
                {session?.user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/25"
                    title="Admin dashboard"
                  >
                    <ShieldIcon />
                    Admin
                  </Link>
                )}
                <span
                  className="inline-flex items-center gap-2 text-sm font-medium text-white"
                  title={session?.user?.email || ""}
                >
                  <UserIcon className="opacity-90" />
                  <span className="max-w-[140px] truncate">{userLabel}</span>
                </span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  <LogoutIcon />
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuth("signin")}
                  className="hidden items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white/80 sm:inline-flex"
                >
                  <UserIcon className="opacity-90" />
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="hidden items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white/80 sm:inline-flex"
                >
                  <UserPlusIcon className="opacity-90" />
                  Sign up
                </button>
              </>
            )}

            <span
              className="hidden h-5 w-px bg-white/20 sm:block"
              aria-hidden
            />

            <Link
              href="/add-listing"
              onClick={handleAddListingClick}
              className="inline-flex items-center justify-center rounded-md bg-[#2ed2c3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#26b9ac] sm:px-5"
            >
              + Add Listing
            </Link>
          </div>
        </div>
      </header>

      {!isHome && <div aria-hidden className="h-[72px]" />}

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => {
          setAuthOpen(false);
          setPendingNav(null);
        }}
        onSwitchMode={(next) => setAuthMode(next)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
