import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sf_sid";

/**
 * Server-side auth gate for routes that should never render to anonymous
 * users. Checks the presence of the session cookie issued by the API
 * (`sf_sid`). Cookie presence does NOT prove the session is still valid,
 * but redirecting on absence eliminates the common case (no cookie at all)
 * without a DB round-trip. Pages still call `useRequireAuth()` for the
 * stronger client-side check against `auth.me`.
 *
 * Redirects to `/login?next=<original-pathname>` so the login page can
 * round-trip the user back after authenticating.
 */
export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (hasSession) return NextResponse.next();

  const url = req.nextUrl.clone();
  const next = url.pathname + (url.search || "");
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

// Apply only to surfaces that require an authenticated user. Public routes
// (landing, /form/<slug> respondent view, /login, static assets) are left
// alone — Next's matcher handles excluding the static / image asset paths.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/builder/:path*",
    "/responses/:path*",
    "/explore/:path*",
  ],
};
