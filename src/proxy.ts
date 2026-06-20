import { NextResponse, type NextRequest } from "next/server";

const REALM = "Sanity Studio";

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

function isValidBasicAuth(
  authHeader: string | null,
  user: string,
  password: string,
): boolean {
  if (!authHeader?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(authHeader.slice("Basic ".length));
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return false;

  const providedUser = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);
  return providedUser === user && providedPassword === password;
}

export function proxy(request: NextRequest): NextResponse {
  const user = process.env.STUDIO_AUTH_USER;
  const password = process.env.STUDIO_AUTH_PASSWORD;

  if (!user || !password) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(
        "Studio authentication is not configured. Set STUDIO_AUTH_USER and STUDIO_AUTH_PASSWORD.",
        { status: 500 },
      );
    }
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!isValidBasicAuth(authHeader, user, password)) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
