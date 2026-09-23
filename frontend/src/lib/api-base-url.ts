/**
 * Base URL every backend request is built from.
 *
 * Two things are folded in here:
 *
 * 1. **Same-origin in production.** The SPA is served by the same FastAPI app
 *    as the API (`app.frontend("/", directory="dist")` in `backend/main.py`),
 *    so a relative URL resolves against the deployed host on its own. This is
 *    hardcoded rather than read from the env var because `VITE_API_BASE_URL`
 *    is baked in at build time, which made the production bundle depend on
 *    whichever machine ran `vite build` -- a developer's local `.env` once
 *    shipped `http://127.0.0.1:8000` to production. In dev, Vite serves on
 *    :3000 and the API on :8000, so there the base is genuinely needed.
 *
 * 2. **The `/api` prefix.** Mirrors `APIRouter(prefix="/api")` in
 *    `backend/routers/__init__.py`. Because the API and the SPA share an
 *    origin, an unprefixed backend router shadowed the page route of the same
 *    name -- `/gallery` hit the gallery endpoint instead of the gallery page.
 *    Namespacing the API under `/api` keeps the two from competing.
 *
 * Keep this in sync with that router's prefix.
 */
export const API_BASE_URL = `${import.meta.env.PROD ? '' : import.meta.env.VITE_API_BASE_URL}/api`
