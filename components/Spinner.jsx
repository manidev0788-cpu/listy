const ACCENT = "#2ed2c3";

const SIZE_CLASS = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16",
};

const STROKE_WIDTH = {
  xs: 3,
  sm: 3,
  md: 2.6,
  lg: 2.4,
  xl: 2.2,
  "2xl": 2,
};

export function Spinner({
  size = "md",
  color = ACCENT,
  className = "",
  trackOpacity = 0.18,
  ariaLabel = "Loading",
}) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;
  const sw = STROKE_WIDTH[size] || STROKE_WIDTH.md;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        className={`${sizeClass} animate-spin`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeOpacity={trackOpacity}
          strokeWidth={sw}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

export function FullPageSpinner({
  label = "Loading…",
  size = "xl",
  className = "",
}) {
  return (
    <div
      className={`flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-[#f8f9fa] ${className}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} />
      {label && (
        <p className="text-sm font-medium tracking-wide text-zinc-500">
          {label}
        </p>
      )}
    </div>
  );
}

export function InlineSpinner({ size = "sm", color, className = "" }) {
  return <Spinner size={size} color={color} className={className} />;
}

export default Spinner;
