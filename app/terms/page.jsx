import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Listfy",
  description:
    "Terms governing use of the Listfy website, directory listings, accounts, and acceptable use. Read before submitting content or creating an account.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
              <li className="font-medium text-zinc-800">Terms</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Last updated: April 21, 2026. By accessing or using Listfy, you
            agree to these terms. If you do not agree, do not use the service.
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-none space-y-10 text-[0.95rem] leading-relaxed text-zinc-700 sm:text-base">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              1. Definitions and acceptance
            </h2>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong className="text-zinc-800">&quot;Listfy&quot;</strong> means
                the website, APIs, and related services operated by us.
              </li>
              <li>
                <strong className="text-zinc-800">&quot;User&quot;</strong> means
                any visitor; <strong className="text-zinc-800">&quot;Owner&quot;</strong>{" "}
                means a user who submits or manages a business listing.
              </li>
              <li>
                <strong className="text-zinc-800">&quot;Content&quot;</strong> means
                text, images, and other materials submitted to or displayed
                through Listfy.
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              2. Eligibility and accounts
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                You must be legally able to enter a binding agreement in your
                jurisdiction to create an account or submit listings on behalf
                of a business you are authorized to represent.
              </li>
              <li>
                You are responsible for safeguarding credentials and for all
                activity under your account.
              </li>
              <li>
                We may suspend or terminate accounts that violate these terms or
                pose risk to the platform or other users.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              3. Listings and user content
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                You grant Listfy a non-exclusive, worldwide, royalty-free license
                to host, display, reproduce, and distribute your Content as
                needed to operate and promote the directory.
              </li>
              <li>
                You represent that you have rights to submit the Content and
                that it does not infringe third-party rights.
              </li>
              <li>
                Listings must be accurate, lawful, and not misleading. Prohibited
                content includes illegal goods or services, hate speech,
                harassment, malware, spam, and fraudulent schemes.
              </li>
              <li>
                We may moderate, edit metadata for clarity, or remove Content
                that violates these terms or applicable law.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              4. Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Scrape, crawl, or harvest data at a rate or volume that impairs
                the service, except as permitted by robots.txt or written
                permission.
              </li>
              <li>
                Attempt unauthorized access, probe vulnerabilities, or interfere
                with security features.
              </li>
              <li>
                Impersonate others, manipulate rankings through fake engagement,
                or submit duplicate listings to game discovery.
              </li>
              <li>
                Use the service to send unsolicited bulk communications without
                consent.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              5. Intellectual property
            </h2>
            <p>
              The Listfy name, logo, and site design elements are protected.
              Except for your Content, we and our licensors retain all rights.
              Feedback you provide may be used without obligation to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              6. Third-party links
            </h2>
            <p>
              The directory may link to third-party sites. We are not responsible
              for their content, policies, or practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              7. Disclaimers
            </h2>
            <p>
              The service is provided <strong className="text-zinc-800">&quot;as is&quot;</strong>{" "}
              and <strong className="text-zinc-800">&quot;as available&quot;</strong>. We
              disclaim warranties of merchantability, fitness for a particular
              purpose, and non-infringement to the fullest extent permitted by
              law. We do not endorse businesses listed in the directory; users
              should verify information independently.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              8. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Listfy and its affiliates
              will not be liable for indirect, incidental, special,
              consequential, or punitive damages, or for loss of profits, data,
              or goodwill. Our aggregate liability for claims arising from these
              terms or the service will not exceed the greater of (a) amounts
              you paid us in the twelve months before the claim or (b) one
              hundred U.S. dollars, except where limitation is prohibited by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              9. Indemnity
            </h2>
            <p>
              You will defend and indemnify Listfy against claims arising from
              your Content, your use of the service, or your breach of these
              terms, subject to applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              10. Governing law and disputes
            </h2>
            <p>
              These terms are governed by the laws of the State of New York,
              USA, excluding conflict-of-law rules, unless mandatory consumer
              protections in your country require otherwise. Courts in New York
              County have exclusive jurisdiction for disputes, subject to
              mandatory arbitration or venue rules that apply to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              11. Changes and contact
            </h2>
            <p>
              We may modify these terms; continued use after notice constitutes
              acceptance where permitted. For questions, contact{" "}
              <a
                href="mailto:legal@listfy.com"
                className="font-medium text-[#1fa99c] hover:underline"
              >
                legal@listfy.com
              </a>
              .
            </p>
          </section>

          <p className="border-t border-zinc-200 pt-8 text-sm text-zinc-500">
            <Link href="/privacy-policy" className="text-[#1fa99c] hover:underline">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/cookie-policy" className="text-[#1fa99c] hover:underline">
              Cookie Policy
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
