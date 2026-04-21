export function Logo({ className = "h-8 w-auto sm:h-9", variant = "light" }) {
  const wordColor = variant === "dark" ? "#0f172a" : "#ffffff";
  const markBg = "#2ed2c3";
  const markFg = "#ffffff";

  return (
    <svg
      className={className}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Listfy"
    >
      <rect x="0" y="4" width="32" height="32" rx="8" fill={markBg} />
      <path
        d="M10 13h12M10 19h12M10 25h8"
        stroke={markFg}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="42"
        y="27"
        fontFamily="var(--font-lexend), ui-sans-serif, system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="-0.5"
        fill={wordColor}
      >
        Listfy
      </text>
    </svg>
  );
}
