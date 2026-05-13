"use client";

import { Suspense, startTransition, useEffect, useRef, useState } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { AuthModal } from "@/components/AuthModal";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Categories", href: "/categories" },
  { label: "View All Listings", href: "/listings" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
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

function MobileCloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

    queueMicrotask(() => {
      if (next) setPendingNav(next);
      openAuth(authParam);
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("next");
      const clean = url.pathname + (url.search ? url.search : "");
      window.history.replaceState(null, "", clean);
    });
  }, [searchParams, status, router]);

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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
        suppressHydrationWarning
        className={
          isHome
            ? "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-md"
            : "fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0b0b0d] shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
        }
      >
        <div
          suppressHydrationWarning
          className="mx-auto grid h-[72px] min-w-0 max-w-[1320px] grid-cols-[1fr_auto] items-center gap-2 px-3 sm:gap-3 sm:px-6 md:grid-cols-[auto_1fr_auto] lg:px-8"
        >
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
                      ? "rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 lg:px-4"
                      : "rounded-full px-3 py-2 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white lg:px-4"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            suppressHydrationWarning
            className="flex items-center justify-end gap-2 sm:gap-4"
          >
            <button
              type="button"
              className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 active:scale-95 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
                <span className="block h-0.5 w-5 rounded-full bg-white" />
              </span>
            </button>

            {mobileOpen ? (
              <div className="fixed inset-0 z-[60] md:hidden">
                <button
                  type="button"
                  aria-label="Close menu"
                  className="absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
                  onClick={() => setMobileOpen(false)}
                />
                <nav
                  id="site-mobile-nav"
                  className="absolute right-0 top-[72px] flex h-[calc(100dvh-72px)] w-[min(100vw,20rem)] flex-col border-l border-white/10 bg-[#141418] shadow-[-12px_0_40px_rgba(0,0,0,0.35)] motion-safe:animate-[fade-in_200ms_ease-out_both]"
                  aria-label="Mobile"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Menu
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                      aria-label="Close menu"
                    >
                      <MobileCloseIcon />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
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
                          onClick={() => setMobileOpen(false)}
                          className={
                            active
                              ? "block rounded-lg bg-white/12 px-3 py-3 text-sm font-medium text-white"
                              : "block rounded-lg px-3 py-3 text-sm font-medium text-white/90 transition hover:bg-white/8 hover:text-white"
                          }
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/10 p-3">
                    {isAuthed ? (
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white/95 transition hover:bg-white/10"
                        >
                          <DashboardIcon />
                          Dashboard
                        </Link>
                        {session?.user?.isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileOpen(false)}
                            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white/95 transition hover:bg-white/10"
                          >
                            <ShieldIcon />
                            Admin
                          </Link>
                        )}
                        <div className="flex min-h-11 items-center gap-2 px-3 text-sm text-white/70">
                          <UserIcon className="opacity-90" />
                          <span className="min-w-0 flex-1 truncate">{userLabel}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                          <LogoutIcon />
                          Sign out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            openAuth("signin");
                          }}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          <UserIcon className="opacity-90" />
                          Sign in
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            openAuth("signup");
                          }}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2ed2c3] text-sm font-semibold text-white shadow-sm transition hover:bg-[#26b9ac]"
                        >
                          <UserPlusIcon className="opacity-90" />
                          Sign up
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            ) : null}

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
              className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#2ed2c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#26b9ac] active:scale-[0.98] sm:px-5 sm:text-sm"
            >
              <span className="sm:hidden">+ Add</span>
              <span className="hidden sm:inline">+ Add Listing</span>
            </Link>
          </div>
        </div>
      </header>

      {!isHome && (
        <div
          aria-hidden
          className="h-[72px]"
          suppressHydrationWarning
        />
      )}

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
