/**
 * Base URL every backend request is built from.
 *
 * Always same-origin. In production the SPA is served by the same FastAPI
 * app as the API (`app.frontend("/", directory="dist")` in `backend/main.py`);
 * in dev, Vite proxies `/api` to the local backend (`server.proxy` in
 * `vite.config.ts`). A relative base means nothing environment-specific is
 * baked into the bundle at build time and no CORS configuration is needed.
 *
 * The `/api` prefix mirrors `APIRouter(prefix="/api")` in
 * `backend/routers/__init__.py`. Because the API and the SPA share an origin,
 * an unprefixed backend router shadowed the page route of the same name --
 * `/gallery` hit the gallery endpoint instead of the gallery page. Keep this
 * in sync with that router's prefix.
 */
export const API_BASE_URL = '/api'
