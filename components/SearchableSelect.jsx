"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyLabel = "options",
  leftIcon,
  allowCustom = false,
  buttonClassName = "",
  hiddenName,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const allOptions = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const o of options || []) {
      const s = String(o).trim();
      if (!s || seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
    return out;
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((c) => c.toLowerCase().includes(q));
  }, [query, allOptions]);

  const visible = query ? filtered : filtered.slice(0, 80);
  const hiddenCount = filtered.length - visible.length;

  useEffect(() => {
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function commit(val) {
    onChange(val);
    setOpen(false);
    setQuery("");
  }

  function onSearchKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        commit(filtered[0]);
      } else if (allowCustom && query.trim()) {
        commit(query.trim());
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  const baseButton =
    "flex min-h-12 h-12 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-base text-zinc-900 outline-none transition-colors duration-200 hover:border-zinc-300 focus:border-[#2ed2c3] focus:bg-white focus:ring-2 focus:ring-[#2ed2c3]/25 md:text-sm";

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${baseButton} ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leftIcon && (
            <span className="shrink-0 text-zinc-400">{leftIcon}</span>
          )}
          <span
            className={`truncate ${value ? "text-zinc-900" : "text-zinc-400"}`}
          >
            {value || placeholder}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="Clear selection"
            >
              <CloseIcon />
            </span>
          )}
          <ChevronDownIcon
            className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[min(20rem,65vh)] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2.5">
            <SearchIcon className="text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
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

          <ul className="max-h-[min(16rem,50vh)] overflow-y-auto overscroll-contain py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-zinc-400">
                No {emptyLabel} found
                {allowCustom && query.trim() && (
                  <>
                    <br />
                    <button
                      type="button"
                      onClick={() => commit(query.trim())}
                      className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#2ed2c3]/10 px-3 py-1.5 text-xs font-semibold text-[#1fa99c] hover:bg-[#2ed2c3]/20"
                    >
                      Use &ldquo;{query.trim()}&rdquo;
                    </button>
                  </>
                )}
              </li>
            ) : (
              visible.map((c) => {
                const selected = c === value;
                return (
                  <li key={c} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => commit(c)}
                      className={`flex min-h-11 w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
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
                : `${allOptions.length} ${emptyLabel}`}
            </span>
            <span>
              {allowCustom ? "Type anything or pick one" : "Type to search"}
            </span>
          </div>
        </div>
      )}

      {hiddenName && (
        <input type="hidden" name={hiddenName} value={value || ""} />
      )}
    </div>
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
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
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
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
