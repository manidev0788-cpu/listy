"use client";

import { useEffect, useRef, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { Spinner } from "@/components/Spinner";

const TRANSITION_MS = 280;
const ACCENT = "#2ed2c3";

const SOCIAL_META = {
  google: {
    label: "Google",
    brand: "#ffffff",
    text: "#1f2937",
    border: "#e5e7eb",
    icon: <GoogleIcon />,
  },
  facebook: {
    label: "Facebook",
    brand: "#1877f2",
    text: "#ffffff",
    border: "#1877f2",
    icon: <FacebookIcon />,
  },
  github: {
    label: "GitHub",
    brand: "#111827",
    text: "#ffffff",
    border: "#111827",
    icon: <GitHubIcon />,
  },
  twitter: {
    label: "Twitter",
    brand: "#1da1f2",
    text: "#ffffff",
    border: "#1da1f2",
    icon: <TwitterIcon />,
  },
};

export function AuthModal({
  open,
  mode = "signin",
  onClose,
  onSwitchMode,
  onSuccess,
}) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [providers, setProviders] = useState(null);
  const [socialLoading, setSocialLoading] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getProviders()
      .then((p) => {
        if (!cancelled) setProviders(p || {});
      })
      .catch(() => {
        if (!cancelled) setProviders({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setMounted(true);
      setErrorMessage("");
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }

    if (mounted) {
      setShow(false);
      closeTimer.current = setTimeout(() => {
        setMounted(false);
        closeTimer.current = null;
      }, TRANSITION_MS);
    }
    return undefined;
  }, [open, mounted]);

  useEffect(() => {
    setErrorMessage("");
  }, [mode]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const isSignup = mode === "signup";

  const socialProviders = providers
    ? Object.values(providers).filter((p) => p.type === "oauth" || p.type === "oidc")
    : [];

  const switchTo = (next) => {
    if (next === mode) return;
    onSwitchMode?.(next);
  };

  const handleSocial = async (providerId) => {
    setErrorMessage("");
    setSocialLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl: window.location.href });
    } catch (err) {
      console.error("[auth] social signIn error:", err);
      setErrorMessage("Could not start sign-in. Please try again.");
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const password = (form.get("password") || "").toString();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      if (isSignup) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
          setErrorMessage(
            data?.message || `Couldn't create your account (status ${res.status}).`
          );
          return;
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error) {
        setErrorMessage(
          isSignup
            ? "Account created, but sign-in failed. Try signing in."
            : "Invalid email or password."
        );
        return;
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("[auth] submit error:", err);
      setErrorMessage("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          show
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <h2
            id="auth-modal-title"
            className="text-center text-2xl font-bold tracking-tight text-zinc-900"
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-center text-sm text-zinc-500">
            {isSignup
              ? "Join Listfy to post and manage listings."
              : "Sign in to continue to your account."}
          </p>

          <div className="mt-6 flex items-center border-b border-zinc-200">
            <TabButton active={!isSignup} onClick={() => switchTo("signin")}>
              Login
            </TabButton>
            <TabButton active={isSignup} onClick={() => switchTo("signup")}>
              Signup
            </TabButton>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          {providers === null ? (
            <div className="mt-6 flex items-center justify-center py-6">
              <Spinner size="md" />
            </div>
          ) : socialProviders.length > 0 ? (
            <>
              <div className="mt-6 flex flex-col gap-2.5">
                {socialProviders.map((p) => {
                  const meta = SOCIAL_META[p.id] || {
                    label: p.name,
                    brand: "#ffffff",
                    text: "#1f2937",
                    border: "#e5e7eb",
                    icon: null,
                  };
                  const isLoading = socialLoading === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSocial(p.id)}
                      disabled={Boolean(socialLoading)}
                      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        backgroundColor: meta.brand,
                        color: meta.text,
                        borderColor: meta.border,
                      }}
                    >
                      {isLoading ? (
                        <Spinner
                          size="sm"
                          color={meta.text}
                          trackOpacity={0.3}
                        />
                      ) : (
                        <span
                          className="inline-flex h-5 w-5 items-center justify-center"
                          style={{ color: meta.text }}
                        >
                          {meta.icon}
                        </span>
                      )}
                      <span>
                        {isSignup ? "Sign up with " : "Continue with "}
                        {meta.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
                <span className="h-px flex-1 bg-zinc-200" aria-hidden />
                <span>Or continue with email</span>
                <span className="h-px flex-1 bg-zinc-200" aria-hidden />
              </div>
            </>
          ) : (
            <div className="mt-6" />
          )}

          <form
            key={mode}
            onSubmit={handleSubmit}
            className="flex animate-content-in flex-col gap-4"
            noValidate
          >
            {isSignup && (
              <Field label="Name" htmlFor="auth-name">
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </Field>
            )}

            <Field label={isSignup ? "Email" : "Email or username"} htmlFor="auth-email">
              <input
                id="auth-email"
                name="email"
                type={isSignup ? "email" : "text"}
                inputMode={isSignup ? "email" : "text"}
                required
                autoComplete={isSignup ? "email" : "username"}
                placeholder={isSignup ? "you@example.com" : "you@example.com or admin"}
                className={inputClass}
              />
            </Field>

            <Field label="Password" htmlFor="auth-password">
              <input
                id="auth-password"
                name="password"
                type="password"
                required
                minLength={isSignup ? 6 : undefined}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder={
                  isSignup ? "At least 6 characters" : "Your password"
                }
                className={inputClass}
              />
            </Field>

            {!isSignup && (
              <div className="-mt-1 flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-zinc-500 transition-colors hover:text-[#1fa99c]"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: ACCENT }}
            >
              {submitting && (
                <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
              )}
              {submitting
                ? isSignup
                  ? "Creating account…"
                  : "Signing in…"
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {isSignup ? "Already have an account?" : "New to Listfy?"}{" "}
            <button
              type="button"
              onClick={() => switchTo(isSignup ? "signin" : "signup")}
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: ACCENT }}
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30";

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 pb-3 pt-1 text-sm font-semibold transition-colors ${
        active ? "text-[#1fa99c]" : "text-zinc-500 hover:text-zinc-800"
      }`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-all duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: ACCENT }}
      />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.4-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.5-5.3l-6.2-5.2c-2 1.4-4.5 2.3-7.3 2.3-5.3 0-9.7-3.4-11.3-8L6.2 32.6C9.5 39 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2C41 34.4 44 29.6 44 24c0-1.3-.1-2.4-.4-3.5Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.98H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.98A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.9a9.3 9.3 0 0 1 2.51.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.31.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.24 2H21.5l-7.51 8.58L23 22h-6.9l-5.4-7.07L4.5 22H1.24l8.03-9.18L1 2h7.07l4.88 6.45L18.24 2Zm-1.21 18h1.9L7.06 3.9H5.03L17.03 20Z" />
    </svg>
  );
}
