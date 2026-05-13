import { Spinner } from "@/components/Spinner";

export default function ListingDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="h-4 w-2/3 max-w-md animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div className="relative min-h-[min(52vh,480px)] w-full animate-pulse bg-zinc-300" />
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-8 lg:py-20">
        <div className="min-w-0 space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="mt-10 h-64 animate-pulse rounded-xl bg-zinc-200 lg:mt-0" />
      </div>
      <div className="fixed bottom-6 left-1/2 z-30 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm text-zinc-600 shadow-lg ring-1 ring-zinc-200 backdrop-blur-sm">
        <Spinner size="sm" ariaLabel="Loading listing" />
        Loading listing…
      </div>
    </main>
  );
}
