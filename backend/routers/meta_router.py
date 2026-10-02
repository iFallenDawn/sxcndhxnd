from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from core.exceptions import NotFoundError
from data import projects_util

router = APIRouter(tags=["meta"])

# `main.py` mounts the built SPA from `dist/` next to this file's package.
INDEX_HTML = Path(__file__).resolve().parent.parent / "dist" / "index.html"

SITE_NAME = "sxcndhxnd"
FALLBACK_TITLE = f"<title>{SITE_NAME}</title>"


def _escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace('"', "&quot;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _inject_meta(html: str, *, title: str, description: str, url: str, image: str | None) -> str:
    tags = [
        f"<title>{_escape(title)}</title>",
        f'<meta name="description" content="{_escape(description)}" />',
        '<meta property="og:type" content="website" />',
        f'<meta property="og:title" content="{_escape(title)}" />',
        f'<meta property="og:description" content="{_escape(description)}" />',
        f'<meta property="og:url" content="{_escape(url)}" />',
    ]
    if image:
        tags.append(f'<meta property="og:image" content="{_escape(image)}" />')
    tags.append(
        f'<meta name="twitter:card" content="{"summary_large_image" if image else "summary"}" />'
    )
    tags.append(f'<meta name="twitter:title" content="{_escape(title)}" />')
    tags.append(f'<meta name="twitter:description" content="{_escape(description)}" />')
    if image:
        tags.append(f'<meta name="twitter:image" content="{_escape(image)}" />')

    return html.replace(FALLBACK_TITLE, "\n    ".join(tags))


@router.get("/projects/{project_id}", include_in_schema=False)
async def project_link_preview(project_id: str, request: Request) -> HTMLResponse:
    """
    Serves the built SPA shell for a project's detail page with per-project
    Open Graph/Twitter meta tags injected server-side (issue #12).

    Link unfurlers (Instagram, iMessage, Discord) never execute the client's
    JS, so a pure client-side `<Helmet>` tag (see `PageMeta`) is invisible to
    them — this is the "small meta-serving layer" the ticket called for.
    Real visitors get the exact same shell; React mounts over it normally and
    `ProjectDetail` renders as usual.

    FastAPI checks ordinary path operations like this one before the
    low-priority `app.frontend(...)` static mount in `main.py` ("FastAPI
    path operations are checked first"), so this always wins for this exact
    path without needing to be registered in any particular order.
    """
    if not INDEX_HTML.exists():
        # No build to inject into, e.g. local `fastapi dev` without a
        # frontend build — nothing useful to serve from this route.
        return HTMLResponse("Frontend build not found.", status_code=404)

    html = INDEX_HTML.read_text()

    try:
        project_uuid = UUID(project_id)
    except ValueError:
        # Not a real id — hand back the unmodified shell so the SPA's own
        # "not found" page renders it.
        return HTMLResponse(html, status_code=404)

    try:
        project = await projects_util.get_project_by_id(project_uuid)
        products = await projects_util.get_products_by_project_id(project_uuid)
    except NotFoundError:
        return HTMLResponse(html, status_code=404)

    image = next(
        (image_url for product in products for image_url in product.image_urls),
        None,
    )

    html = _inject_meta(
        html,
        title=f"{project.title} — {SITE_NAME}",
        description=project.description or f"A promo from {SITE_NAME}.",
        url=str(request.url),
        image=image,
    )
    return HTMLResponse(html)
