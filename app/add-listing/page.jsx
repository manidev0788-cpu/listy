"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Spinner } from "@/components/Spinner";
import { CATEGORIES as SHARED_CATEGORIES } from "@/lib/categories";
import { COUNTRIES, POPULAR_CITIES } from "@/lib/locations";

const CATEGORIES = SHARED_CATEGORIES;

const ACCENT = "#2ed2c3";
const ACCENT_DARK = "#1fa99c";

export default function AddListingPage() {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedOffline, setSubmittedOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result ?? null);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get("businessName") || "").toString().trim(),
      category,
      address: (formData.get("address") || "").toString().trim(),
      pincode: (formData.get("pincode") || "").toString().trim(),
      city: (formData.get("city") || city || "").toString().trim(),
      country: (formData.get("country") || country || "").toString().trim(),
      services: (formData.get("services") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      website: (formData.get("website") || "").toString().trim(),
      description: (formData.get("description") || "").toString().trim(),
      image: imagePreview || "",
    };

    if (!payload.name) {
      setErrorMessage("Please enter a business name.");
      return;
    }
    if (!payload.category) {
      setErrorMessage("Please select a category.");
      return;
    }
    if (!payload.address) {
      setErrorMessage("Please enter an address.");
      return;
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setErrorMessage("Please enter a valid business email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}
      console.log("[add-listing] response:", res.status, data);

      if (res.ok && data?.ok) {
        setSubmittedName(payload.name);
        setSubmittedOffline(Boolean(data.offline) || data.source === "local");
        setCity("");
        setCountry("");
        setCategory("");
        setImagePreview(null);
        setImageName("");
        formRef.current?.reset();
        setSuccessOpen(true);
      } else {
        setErrorMessage(
          data?.message ||
            `Couldn't save your listing (status ${res.status}). Please try again.`
        );
      }
    } catch (err) {
      console.error("[add-listing] network error:", err);
      setErrorMessage(
        "Network error — couldn't reach the server. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-sm ring-1 ring-zinc-200"
            style={{ color: ACCENT }}
          >
            <SparkleIcon />
            Grow Your Business
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
            Add Your Business Listing
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Fill in the details below to get your business in front of thousands
            of potential customers.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 shrink-0 text-rose-500"
              aria-hidden
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Couldn&apos;t submit listing</p>
              <p className="mt-0.5 break-words text-rose-700/90">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-1 text-rose-500 transition-colors hover:bg-rose-100"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-2xl sm:p-8 md:p-10"
          noValidate
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Business Name" required className="md:col-span-2">
              <input
                type="text"
                name="businessName"
                placeholder="Ex: The Coffee Corner"
                className={inputClass}
              />
            </Field>

            <Field label="Category" required className="md:col-span-2">
              <CategorySelect value={category} onChange={setCategory} />
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                className={inputClass}
              />
            </Field>

            <Field label="Business Email">
              <input
                type="email"
                name="email"
                placeholder="contact@yourbusiness.com"
                autoComplete="email"
                className={inputClass}
              />
            </Field>

            <Field label="Address" required className="md:col-span-2">
              <input
                type="text"
                name="address"
                placeholder="Street, Building, Floor"
                className={inputClass}
              />
            </Field>

            <Field label="Pincode / Zip Code">
              <input
                type="text"
                name="pincode"
                placeholder="10001"
                className={inputClass}
              />
            </Field>

            <Field label="City">
              <SearchableSelect
                value={city}
                onChange={setCity}
                options={POPULAR_CITIES}
                placeholder="Select or type a city"
                searchPlaceholder="Search cities..."
                emptyLabel="cities"
                allowCustom
                hiddenName="city"
                ariaLabel="City"
              />
            </Field>

            <Field label="Country">
              <SearchableSelect
                value={country}
                onChange={setCountry}
                options={COUNTRIES}
                placeholder="Select or type a country"
                searchPlaceholder="Search countries..."
                emptyLabel="countries"
                allowCustom
                hiddenName="country"
                ariaLabel="Country"
              />
            </Field>

            <Field label="Website URL">
              <input
                type="url"
                name="website"
                placeholder="https://yourbusiness.com"
                className={inputClass}
              />
            </Field>

            <Field
              label="Services"
              hint="Separate with commas"
              className="md:col-span-2"
            >
              <input
                type="text"
                name="services"
                placeholder="Ex: Dine-in, Takeout, Delivery, Catering"
                className={inputClass}
              />
            </Field>

            <Field
              label="Business Image"
              hint="PNG, JPG up to 5MB"
              className="md:col-span-2"
            >
              <ImageUpload
                preview={imagePreview}
                fileName={imageName}
                onChange={handleImageChange}
                onClear={() => {
                  setImagePreview(null);
                  setImageName("");
                }}
              />
            </Field>

            <Field label="Business Description" className="md:col-span-2">
              <textarea
                name="description"
                rows={5}
                placeholder="Tell customers what makes your business special..."
                className={`${inputClass} h-auto resize-y py-3 leading-relaxed`}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              backgroundColor: ACCENT,
              boxShadow: `0 6px 18px ${ACCENT}40`,
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = ACCENT_DARK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = ACCENT;
            }}
          >
            {submitting ? (
              <>
                <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
                Submitting...
              </>
            ) : (
              <>
                Submit Listing
                <ArrowRightIcon />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-zinc-500">
            By submitting, you agree to our{" "}
            <a href="/terms" style={{ color: ACCENT }} className="hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              style={{ color: ACCENT }}
              className="hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>

      <ThankYouModal
        open={successOpen}
        name={submittedName}
        offline={submittedOffline}
        onClose={() => setSuccessOpen(false)}
      />
    </main>
  );
}

const inputClass =
  "block h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30";

function Field({ label, required, hint, className = "", children }) {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-800">
        <span>
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function CategorySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const allCategories = useMemo(
    () => Array.from(new Set(CATEGORIES)),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCategories;
    return allCategories.filter((c) => c.toLowerCase().includes(q));
  }, [query, allCategories]);

  const visible = query ? filtered : filtered.slice(0, 80);
  const hiddenCount = filtered.length - visible.length;

  useEffect(() => {
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left ${
          value ? "text-zinc-900" : "text-zinc-400"
        }`}
      >
        <span className="truncate">{value || "Select a category"}</span>
        <ChevronDownIcon
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2.5">
            <SearchIcon className="text-zinc-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            )}
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-zinc-400">
                No categories found
              </li>
            ) : (
              visible.map((c) => {
                const selected = c === value;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(c);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        selected
                          ? "bg-[#2ed2c3]/10 text-[#1fa99c]"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {selected && <CheckIcon />}
                    </button>
                  </li>
                );
              })
            )}
            {hiddenCount > 0 && (
              <li className="border-t border-zinc-100 px-4 py-2 text-center text-[11px] text-zinc-400">
                +{hiddenCount} more &mdash; start typing to search
              </li>
            )}
          </ul>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-500">
            <span>
              {query
                ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
                : `${allCategories.length} categories`}
            </span>
            <span>Type to search</span>
          </div>
        </div>
      )}

      <input type="hidden" name="category" value={value} />
    </div>
  );
}

function ImageUpload({ preview, fileName, onChange, onClear }) {
  return (
    <div>
      {preview ? (
        <div className="flex items-center gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 shrink-0 rounded-md object-cover ring-1 ring-zinc-200"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-800">
              {fileName}
            </p>
            <p className="text-xs text-zinc-500">Image ready to upload</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            Change
          </button>
        </div>
      ) : (
        <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition-colors hover:border-[#2ed2c3] hover:bg-[#2ed2c3]/5">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200 transition-colors group-hover:ring-[#2ed2c3]"
            style={{ color: ACCENT }}
          >
            <UploadIcon />
          </span>
          <span className="text-sm font-medium text-zinc-700">
            <span style={{ color: ACCENT }}>Click to upload</span> or drag and
            drop
          </span>
          <span className="text-xs text-zinc-400">PNG, JPG, WebP up to 5MB</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
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
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className = "" }) {
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
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
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
        d="m5 12 5 5L20 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
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
        d="M12 16V4m0 0-4 4m4-4 4 4M5 20h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
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
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThankYouModal({ open, name, offline, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thankyou-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-modal-in">
        <div className="relative bg-linear-to-br from-[#2ed2c3] to-[#1fa99c] px-6 pb-12 pt-10 text-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <CloseIcon />
          </button>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <span className="text-[#1fa99c]">
              <CheckCircleIcon />
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Submission Received
            </p>
            <h2
              id="thankyou-title"
              className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Thank you for listing with us!
            </h2>
          </div>
        </div>

        <div className="px-6 pb-7 pt-5 text-center">
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            {name ? (
              <>
                <span className="font-semibold text-zinc-900">{name}</span> has
                been successfully added to our directory. Our team will review
                it shortly.
              </>
            ) : (
              <>
                Your listing has been successfully added to our directory. Our
                team will review it shortly.
              </>
            )}
          </p>

          {offline && (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Saved locally.</span> MongoDB
              was offline, so your listing was stored on this server&apos;s
              local file. It&apos;s visible on the site right now, and will
              sync to the database once the connection is restored.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/listings"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#2ed2c3] text-sm font-semibold text-white transition-colors hover:bg-[#1fa99c]"
            >
              View All Listings
              <ArrowRightIcon />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
      <path
        d="m8 12.5 2.8 2.8L16.5 9.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
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
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
