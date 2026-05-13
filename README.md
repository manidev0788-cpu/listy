# Listfy

AI-enabled Business Listing Platform built with Next.js (App Router), Tailwind CSS v4, MongoDB, and Lexend.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required:

- `MONGODB_URI` — MongoDB connection string
- `MONGODB_DB` — database name (defaults to `listfy`)

Optional:

- `OPENAI_API_KEY` — enables live AI content generation on listing detail pages. Without it, a deterministic mock is used.

3. Run the dev server:

```bash
npm run dev
```

## Project structure

```
app/          Next.js App Router routes
  api/        Route handlers
  listing/    Dynamic listing detail pages
  listings/   All listings grid
components/   Reusable React components
lib/          Server helpers (MongoDB, AI, slug, config)
```
