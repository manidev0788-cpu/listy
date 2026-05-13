import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";

export const metadata = {
  title: "Privacy Policy | Listfy",
  description:
    "How Listfy collects, uses, and protects personal data. GDPR-oriented transparency for visitors, business owners, and account holders.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
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
              <li className="font-medium text-zinc-800">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Last updated: April 21, 2026. This policy describes how Listfy
            (&quot;we&quot;, &quot;us&quot;) processes personal data when you use
            our website and related services.
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="prose prose-zinc max-w-none space-y-8 text-[0.95rem] leading-relaxed text-zinc-700 sm:text-base">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">1. Who we are</h2>
            <p>
              Listfy operates a public business directory and related tools that
              help visitors discover local listings and help owners manage their
              presence. For data protection purposes, the controller of your
              personal data is Listfy (contact:{" "}
              <a
                href="mailto:privacy@listfy.com"
                className="font-medium text-[#1fa99c] hover:underline"
              >
                privacy@listfy.com
              </a>
              ). If you are in the European Economic Area (EEA), UK, or
              Switzerland, you may also contact us to exercise rights described
              below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              2. Data we collect
            </h2>
            <p>Depending on how you use Listfy, we may process:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-zinc-800">Account data:</strong> name,
                email address, and authentication identifiers when you register
                or sign in.
              </li>
              <li>
                <strong className="text-zinc-800">Listing and business data:</strong>{" "}
                information you submit about a business (e.g. name, category,
                address, phone, description, images).
              </li>
              <li>
                <strong className="text-zinc-800">Usage and device data:</strong>{" "}
                IP address, browser type, approximate location derived from IP,
                pages viewed, and timestamps—typically collected through logs and
                cookies or similar technologies.
              </li>
              <li>
                <strong className="text-zinc-800">Communications:</strong> content
                of messages you send via contact forms or support channels.
              </li>
            </ul>
            <p>
              We do not intentionally collect special categories of data (such as
              health data) unless you voluntarily include them in a free-text
              field; please avoid submitting sensitive information unless
              necessary.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              3. Purposes and legal bases (GDPR)
            </h2>
            <p>We process personal data on the following bases where applicable:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-zinc-800">Contract / steps prior to contract:</strong>{" "}
                to provide accounts, listings, and requested features.
              </li>
              <li>
                <strong className="text-zinc-800">Legitimate interests:</strong>{" "}
                to secure the service, prevent abuse, analyze aggregated usage,
                and improve the product—balanced against your rights.
              </li>
              <li>
                <strong className="text-zinc-800">Consent:</strong> where
                required for non-essential cookies or marketing communications;
                you may withdraw consent at any time.
              </li>
              <li>
                <strong className="text-zinc-800">Legal obligation:</strong> where
                we must retain or disclose information to comply with law.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">4. Sharing</h2>
            <p>
              We may share data with infrastructure and email providers that
              process it on our instructions (processors), with professional
              advisers where required, or with authorities when legally compelled.
              Public listing fields you submit may be visible to anyone browsing
              the directory. We do not sell your personal data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">
              5. International transfers
            </h2>
            <p>
              If we transfer personal data outside the EEA/UK, we use
              appropriate safeguards such as Standard Contractual Clauses or
              equivalent mechanisms, unless an adequacy decision applies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">6. Retention</h2>
            <p>
              We retain data only as long as needed for the purposes above,
              unless a longer period is required by law. Account data is kept
              while your account is active and for a reasonable period
              afterward. Server logs may be rotated on a shorter schedule.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">7. Your rights</h2>
            <p>
              Depending on your location, you may have rights to access,
              rectify, erase, restrict, or object to certain processing, and to
              data portability. You may lodge a complaint with a supervisory
              authority. To exercise rights, contact{" "}
              <a
                href="mailto:privacy@listfy.com"
                className="font-medium text-[#1fa99c] hover:underline"
              >
                privacy@listfy.com
              </a>
              . We will respond within the timeframes required by applicable
              law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">8. Security</h2>
            <p>
              We implement technical and organizational measures appropriate to
              the risk, including access controls and encryption in transit
              where supported. No method of transmission over the Internet is
              completely secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">9. Children</h2>
            <p>
              Listfy is not directed at children under 16. We do not knowingly
              collect personal data from children.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">10. Changes</h2>
            <p>
              We may update this policy and will revise the &quot;Last
              updated&quot; date. Material changes may be announced on the site
              or by email where appropriate.
            </p>
          </section>

          <p className="border-t border-zinc-200 pt-8 text-sm text-zinc-500">
            Related:{" "}
            <Link href="/cookie-policy" className="text-[#1fa99c] hover:underline">
              Cookie Policy
            </Link>
            {" · "}
            <Link href="/terms" className="text-[#1fa99c] hover:underline">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
