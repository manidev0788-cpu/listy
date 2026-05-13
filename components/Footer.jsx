import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { Logo } from "@/components/Logo";
import { getFooterCategoryLinks } from "@/lib/featuredCategories";

const ACCENT = "#2ed2c3";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Add Listing", href: "/add-listing" },
  { name: "Contact", href: "/contact" },
];

const categoryLinks = [
  { name: "All categories", href: "/categories" },
  ...getFooterCategoryLinks(),
];

const socials = [
  { name: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { name: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { name: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#0b0b0d] text-zinc-300">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="min-w-0">
            <Logo className="h-9 w-auto" variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">
              Listfy is your all-in-one business directory &mdash; discover
              trusted local businesses, share reviews and reach more customers
              with a free listing for your business.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: ACCENT }}
            >
              Read More
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-10 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">Categories</h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-10 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <ul className="mt-5 space-y-3">
              {categoryLinks.map((cat) => (
                <li key={`${cat.href}-${cat.name}`}>
                  <FooterLink href={cat.href}>{cat.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">Information</h3>
            <span
              aria-hidden
              className="mt-3 block h-[2px] w-10 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5"
                  style={{ color: ACCENT }}
                >
                  <PhoneIcon />
                </span>
                <a
                  href="tel:+11234567890"
                  className="text-zinc-300 transition-colors hover:text-white"
                >
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5"
                  style={{ color: ACCENT }}
                >
                  <MailIcon />
                </span>
                <a
                  href="mailto:hello@listfy.com"
                  className="text-zinc-300 transition-colors hover:text-white"
                >
                  hello@listfy.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5"
                  style={{ color: ACCENT }}
                >
                  <MapPinIcon />
                </span>
                <span className="text-zinc-300">
                  221B Baker Street, Suite 4A
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.name}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-300 ring-1 ring-white/10 transition-colors duration-200 hover:bg-[#2ed2c3] hover:text-white hover:ring-[#2ed2c3]"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#141418]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-4 py-5 text-center text-sm text-white sm:px-6 sm:py-6 md:flex-row md:text-left lg:px-8">
          <p className="text-zinc-200">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: ACCENT }}
            >
              Listfy
            </Link>
            . All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="transition-opacity hover:opacity-80"
                style={{ color: ACCENT }}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="transition-opacity hover:opacity-80"
                style={{ color: ACCENT }}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/cookie-policy"
                className="transition-opacity hover:opacity-80"
                style={{ color: ACCENT }}
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ color: ACCENT }}
      >
        <ArrowRightIcon />
      </span>
      <span>{children}</span>
    </Link>
  );
}

function ArrowRightIcon() {
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
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-5a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M13.5 22v-8h2.7l.4-3.1H13.5V9c0-.9.3-1.5 1.5-1.5h1.6V4.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.4H7.8V14h2.7v8h3Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M18.9 3H22l-7.4 8.4L23 21h-6.8l-5.3-6.9L4.7 21H1.6l7.9-9L1 3h6.9l4.8 6.3L18.9 3Zm-1.1 16h1.9L7.3 5H5.2l12.6 14Z" />
    </svg>
  );
}

function InstagramIcon() {
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
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5a2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-.95 1.82-1.95 3.75-1.95 4 0 4.75 2.5 4.75 5.8v5.65H18.4v-5c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.95 1.3-1.95 2.65V20.5H10v-11Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.5 3.5 12 3.5 12 3.5s-4.5 0-7.8.4c-.5.1-1.4.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.8v1.6C.8 14.2 1 16 1 16s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.5 0 7.8-.4c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.6v-1.6C23.2 9 23 7.2 23 7.2ZM9.8 14.4V8l6.1 3.2-6.1 3.2Z" />
    </svg>
  );
}
