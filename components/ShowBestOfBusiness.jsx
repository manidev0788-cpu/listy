import Link from "next/link";

const ACCENT = "#2ed2c3";

const steps = [
  {
    number: "01",
    title: "Claim",
    description:
      "Take ownership of your listing so you can refresh hours, photos, and contact details anytime—no middlemen.",
    icon: ClaimIcon,
    accentClass: "from-[#2ed2c3]/20 to-transparent",
  },
  {
    number: "02",
    title: "Promote",
    description:
      "Show up in category and city search where buyers already look for your services, products, or venue.",
    icon: PromoteIcon,
    accentClass: "from-[#1fa99c]/18 to-transparent",
  },
  {
    number: "03",
    title: "Convert",
    description:
      "Turn profile visits into calls and bookings with clear CTAs, offers, and a polished first impression.",
    icon: ConvertIcon,
    accentClass: "from-emerald-400/15 to-transparent",
  },
];

export function ShowBestOfBusiness() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24 lg:py-28"
      aria-labelledby="show-best-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#eef8f6] via-white to-[#f4f9f8]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[#2ed2c3]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#1fa99c]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2ed2c3]/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: "#1fa99c" }}
          >
            Your free business profile
          </p>
          <h2
            id="show-best-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
          >
            Show the best of your business
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Reach more customers in three focused steps—built for owners who want
            a clean, credible presence without a complicated setup.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 md:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="flex">
                <article
                  className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-[0_22px_50px_-18px_rgba(15,23,42,0.18)] ring-1 ring-zinc-900/[0.04] transition duration-300 ease-out hover:-translate-y-1.5 hover:border-[#2ed2c3]/35 hover:shadow-[0_32px_64px_-16px_rgba(46,210,195,0.28)] hover:ring-[#2ed2c3]/15"
                >
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${step.accentClass}`}
                    aria-hidden
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-zinc-900/10 ring-2 ring-white/50 transition duration-300 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(145deg, ${ACCENT}, #1fa99c)`,
                      }}
                    >
                      <Icon />
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-3xl font-bold tabular-nums text-zinc-200 transition-colors duration-300 group-hover:text-[#2ed2c3]/40"
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-xl font-bold text-zinc-900 sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
                    {step.description}
                  </p>
                  <div
                    className="relative mt-6 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
                    aria-hidden
                  />
                  <p className="relative mt-4 text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Step {step.number.replace(/^0/, "")}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-14 sm:flex-row">
          <Link
            href="/add-listing"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-8px_rgba(0,0,0,0.35)] transition hover:bg-zinc-800 hover:shadow-lg"
          >
            Add your listing
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 bg-white/90 px-8 py-3.5 text-sm font-bold text-zinc-800 shadow-sm transition hover:border-[#2ed2c3] hover:text-[#1fa99c]"
          >
            Browse categories
          </Link>
        </div>
      </div>
    </section>
  );
}

function ClaimIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3 4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PromoteIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 11v4l16 4V7L4 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8 12 8-2M12 9v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ConvertIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3v4M12 17v4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M3 12h4M17 12h4M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
