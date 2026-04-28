# Ask 10-K — Web (Next.js + shadcn)

A Next.js 14 / TypeScript / Tailwind / shadcn frontend for the
[rag-chatbot FastAPI backend](https://github.com/kelvinasiedu-programmer/rag-chatbot).

Upload SEC 10-K filings, ask questions across them, get answers with inline source
citations (filename · page · similarity score). Built as a study in production-shaped
RAG over dense financial documents.

**Live demo:** [rag-chatbot-web.vercel.app](https://rag-chatbot-web.vercel.app/)

Single-screen chat experience: announcement pill → centered title → chat input with
attach & model selectors → import buttons → conversation view with source citations.

Designed under a strict **flat visual rule**: one background color, one accent
color, no gradients, no glassmorphism, no backdrop-filter.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + `tailwindcss-animate`
- shadcn project layout (`components.json`, `@/components/ui`, `@/lib/utils`)
- `lucide-react` icons

## Setup

```bash
# 1. Install
npm install

# 2. Configure the API endpoint
cp .env.local.example .env.local
# edit .env.local if pointing at a different backend

# 3. Run
npm run dev    # http://localhost:3000
```

`NEXT_PUBLIC_RAG_API` defaults to `https://kelvin-programmer-rag-chatbot.hf.space`.

## Component layout

```
src/
├── app/
│   ├── layout.tsx         # HTML shell, fonts, metadata
│   ├── page.tsx           # renders <BoltStyleChat />
│   └── globals.css        # Tailwind + flat theme base
├── components/ui/
│   └── bolt-style-chat.tsx  # full chat UI (this is the shadcn component)
└── lib/
    └── utils.ts           # cn() helper (clsx + tailwind-merge)
```

## Design system

| Role       | Value       |
| ---------- | ----------- |
| Background | `#0F0F12`   |
| Surface    | `#16161B`   |
| Accent     | `#7C5CFC`   |
| Ink        | `#ECECF1`   |
| Border     | `#262630`   |

These tokens are declared in `tailwind.config.ts` and used directly
as Tailwind class names (`bg-bg`, `text-accent`, `border-border-hi`).

## Deploy

### Vercel (recommended)

```bash
npx vercel
```

Set `NEXT_PUBLIC_RAG_API` in the Vercel project's env vars.

### Static export

```bash
npm run build
```

With `output: "export"` set in `next.config.mjs`, the `out/` directory
can be served from GitHub Pages or any static host.

## License

MIT
