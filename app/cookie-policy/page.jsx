import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Listfy",
  description:
    "How Listfy uses cookies and similar technologies, what choices you have, and how consent works for non-essential cookies.",
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-[#1fa99c]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-zinc-800">Cookie Policy</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Last updated: April 21, 2026. This policy explains how Listfy uses
            cookies and similar technologies on our website.
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-none space-y-8 text-[0.95rem] leading-relaxed text-zinc-700 sm:text-base">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              site. They help the site remember preferences, keep you signed in,
              measure traffic, and—where you consent—support analytics or
              marketing features. Similar technologies include local storage,
              session storage, and pixels.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              2. How we use cookies
            </h2>
            <p>Listfy may use the following categories:</p>
            <ul className="list-disc space-y-3 pl-6">
              <li>
                <strong className="text-zinc-800">Strictly necessary:</strong>{" "}
                required for core functionality such as security, load balancing,
                session management, and remembering cookie consent choices.
                These do not require consent under the ePrivacy framework where
                they are strictly necessary to provide the service you request.
              </li>
              <li>
                <strong className="text-zinc-800">Functional:</strong> remember
                settings like language or UI preferences to improve your
                experience.
              </li>
              <li>
                <strong className="text-zinc-800">Analytics:</strong> help us
                understand aggregate usage (e.g. popular pages, errors) so we
                can improve performance and content.
              </li>
              <li>
                <strong className="text-zinc-800">Marketing:</strong> only if
                enabled and where legally required after you opt in—may be used
                to measure campaigns or personalize ads on partner networks.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              3. Consent requirement
            </h2>
            <p>
              Where EU/UK/EEA law applies, we request your consent before
              storing or accessing non-essential cookies on your device, except
              where an exemption applies (for example, strictly necessary
              cookies). You can withdraw consent at any time by clearing cookies,
              using browser controls, or adjusting choices in our cookie banner
              or settings page when available.
            </p>
            <p>
              Blocking some cookies may limit features (for example, staying
              signed in or personalized recommendations).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">4. Third parties</h2>
            <p>
              Some cookies are set by service providers who assist with hosting,
              analytics, authentication, or content delivery. Their use is
              governed by their privacy notices. We aim to minimize data sharing
              and configure vendors for privacy-friendly defaults where
              possible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">5. Retention</h2>
            <p>
              Session cookies expire when you close your browser. Persistent
              cookies remain for a defined period (often between a few months and
              two years) depending on their purpose. We review retention
              regularly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">6. Your choices</h2>
            <p>
              You can control cookies through your browser settings (block,
              delete, or alert). Industry opt-out tools may apply to
              interest-based advertising. For more on how we process personal
              data, see our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-[#1fa99c] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">7. Updates</h2>
            <p>
              We may update this Cookie Policy when our practices change. The
              &quot;Last updated&quot; date at the top will reflect revisions.
            </p>
          </section>

          <p className="border-t border-zinc-200 pt-8 text-sm text-zinc-500">
            Questions:{" "}
            <a
              href="mailto:privacy@listfy.com"
              className="text-[#1fa99c] hover:underline"
            >
              privacy@listfy.com
            </a>
          </p>
        </div>
      </article>
    </main>
  );
}
