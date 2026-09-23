# sxcndhxnd frontend

Vite + React + TypeScript frontend for the sxcndhxnd website. This is v2 of the
frontend, scaffolded from scratch — no v1 components have been ported yet.

## Stack

- Vite + React + TypeScript
- React Router (`react-router-dom`)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- shadcn/ui (Radix base) — `components.json`, `cn` helper in `src/lib/utils.ts`, primitives in `src/components/ui/`
- lucide-react for icons
- framer-motion for animation
- ESLint + Prettier, with a `typecheck` script backed by `tsc -b`

## Install

```bash
cd frontend/
npm install
```

## Dev server

```bash
npm run dev
```

Serves the app at http://localhost:3000.

### Pointing at a local backend

Requests go to `/api` on the dev server, which proxies them to the FastAPI
backend on `http://localhost:8000` (see `server.proxy` in `vite.config.ts`).
Start the backend with `fastapi dev main.py` from `../backend` (see
`../backend/README.md`). No `.env` is needed.

## Build

```bash
npm run build
```

Type-checks (`tsc -b`) then produces a production build in `dist/`.

## Typecheck

```bash
npm run typecheck
```

## Lint / format

```bash
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

## Routes

Every entry in the site map currently renders a placeholder page (just its
own name) so navigation can be exercised before real UI lands:

- `/` home
- `/store`
- `/store/:productId`
- `/gallery`
- `/projects`
- `/commissions/request`
- `/contact`
- `/sign-in`
- `/register`
- `/dashboard`
- any other path renders a 404 page
