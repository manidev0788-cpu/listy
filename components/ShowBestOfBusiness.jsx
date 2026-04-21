const steps = [
  {
    number: "1",
    title: "Claim",
    description:
      "Best way to start managing your business listing is by claiming it so you can update.",
  },
  {
    number: "2",
    title: "Promote",
    description:
      "Promote your business to target customers who need your services or products.",
  },
  {
    number: "3",
    title: "Convert",
    description:
      "Turn your visitors into paying customers with exciting offers and services on your page.",
  },
];

export function ShowBestOfBusiness() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Show the best of your business
          </h2>
          <p className="mt-3 text-sm text-zinc-500 sm:text-base">
            Reach more customers in three simple steps, with your free Business Profile.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="relative pl-6 sm:pl-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-6 left-0 select-none text-[96px] font-extrabold leading-none text-zinc-200 sm:-top-8 sm:text-[120px]"
              >
                {step.number}
              </span>
              <div className="relative">
                <h3 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
