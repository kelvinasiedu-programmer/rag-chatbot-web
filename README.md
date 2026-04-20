# RAG Chatbot — Web

Next.js 14 frontend for the
[rag-chatbot FastAPI backend](https://github.com/kelvinasiedu-programmer/rag-chatbot).
A single-screen chat UI: upload PDFs, ask questions, get answers back with the
source document each answer came from.

## Run it

```bash
npm install
cp .env.local.example .env.local   # edit if pointing at a different backend
npm run dev                        # http://localhost:3000
```

`NEXT_PUBLIC_RAG_API` defaults to `https://kelvin-programmer-rag-chatbot.hf.space`.

## Layout

```
src/
├── app/
│   ├── layout.tsx              # HTML shell, fonts, metadata
│   ├── page.tsx                # renders <BoltStyleChat />
│   └── globals.css             # Tailwind + theme base
├── components/ui/
│   └── bolt-style-chat.tsx     # the chat UI
└── lib/
    └── utils.ts                # cn() helper (clsx + tailwind-merge)
```

## Theme tokens

Declared in `tailwind.config.ts` and used as utility classes (`bg-bg`, `text-accent`, etc.):

| Role       | Value       |
| ---------- | ----------- |
| Background | `#0F0F12`   |
| Surface    | `#16161B`   |
| Accent     | `#7C5CFC`   |
| Ink        | `#ECECF1`   |
| Border     | `#262630`   |

The UI deliberately avoids gradients, glassmorphism, and backdrop-filter — it
is a single background, single accent, flat look.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind, shadcn component layout,
`lucide-react` icons, `tailwindcss-animate`.

## Deploy

Vercel picks up pushes to `master` automatically. Set `NEXT_PUBLIC_RAG_API` in
the project's env vars.

For a static export, `output: "export"` is already set in `next.config.mjs`, so
`npm run build` produces an `out/` directory that can be served from any
static host.

## License

MIT
