import Link from "next/link";

export function JoinCommunity() {
  return (
    <section
      className="relative h-[600px] min-h-[600px] w-full overflow-hidden bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join Our Community
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
            Earn extra income and unlock new opportunities by advertising your
            business.
          </p>

          <Link
            href="/add-listing"
            className="mt-7 inline-flex items-center justify-center rounded-sm bg-[#2ed2c3] px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-900 shadow-sm transition-colors duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm"
          >
            Add Your Business
          </Link>
        </div>
      </div>
    </section>
  );
}
