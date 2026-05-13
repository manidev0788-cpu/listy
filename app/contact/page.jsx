import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Listfy Business Directory",
  description:
    "Reach the Listfy team for partnerships, support, or press. Send a message through our contact form—we respond as soon as we can.",
  openGraph: {
    title: "Contact | Listfy",
    description: "Get in touch with Listfy.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="border-b border-zinc-200 bg-gradient-to-br from-[#0b0b0d] via-zinc-900 to-zinc-950">
        <div
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
          suppressHydrationWarning
        >
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li className="font-medium text-white">Contact</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Questions about listings, partnerships, or support? Fill out the
            form and our team will follow up by email.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-8 lg:py-16">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-zinc-900">Direct details</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Prefer email or phone? You can also reach us during business hours
            (Mon–Fri, 9:00–18:00 local time).
          </p>
          <ul className="mt-6 space-y-4 text-sm text-zinc-700">
            <li>
              <span className="font-semibold text-zinc-900">Email</span>
              <br />
              <a
                href="mailto:hello@listfy.com"
                className="text-[#1fa99c] hover:underline"
              >
                hello@listfy.com
              </a>
            </li>
            <li>
              <span className="font-semibold text-zinc-900">Phone</span>
              <br />
              <a
                href="tel:+11234567890"
                className="text-[#1fa99c] hover:underline"
              >
                +1 (123) 456-7890
              </a>
            </li>
            <li>
              <span className="font-semibold text-zinc-900">Office</span>
              <br />
              221B Baker Street, Suite 4A
              <br />
              New York, NY 10001
            </li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
