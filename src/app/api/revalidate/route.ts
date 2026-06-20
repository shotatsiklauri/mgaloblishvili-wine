import { revalidatePath } from "next/cache";
import { getStaticContent } from "@/data/content";
import { routes } from "@/data/routes";

function buildRevalidationPaths(): string[] {
  const content = getStaticContent();
  const paths = new Set<string>([
    routes.history,
    routes.vineyards,
    routes.wines,
    routes.experiences,
  ]);

  for (const region of content.vineyards.regions) {
    paths.add(routes.vineyardRegion(region.id));
  }
  for (const category of content.wines.categories) {
    paths.add(routes.wineCategory(category.id));
  }
  for (const wine of content.wines.items) {
    paths.add(routes.wineItem(wine.categoryId ?? "wines", wine.id));
  }
  for (const experience of content.experiences.items) {
    paths.add(routes.experience(experience.id));
  }

  return Array.from(paths);
}

function getProvidedSecret(request: Request): string | null {
  const headerSecret = request.headers.get("x-sanity-revalidate-secret");
  if (headerSecret) return headerSecret;
  const url = new URL(request.url);
  return url.searchParams.get("secret");
}

async function handleRevalidate(request: Request): Promise<Response> {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not configured.");
    return Response.json(
      { success: false, error: "Revalidation secret is not configured on the server." },
      { status: 500 },
    );
  }

  const providedSecret = getProvidedSecret(request);
  if (!providedSecret || providedSecret !== expectedSecret) {
    return Response.json(
      { success: false, error: "Invalid or missing revalidation secret." },
      { status: 401 },
    );
  }

  try {
    const paths = buildRevalidationPaths();
    for (const path of paths) {
      revalidatePath(path);
    }
    return Response.json({ success: true, revalidated: paths });
  } catch (error) {
    console.error("[revalidate] Failed:", error);
    return Response.json(
      { success: false, error: "Revalidation failed. See server logs for details." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleRevalidate(request);
}

export async function GET(request: Request): Promise<Response> {
  return handleRevalidate(request);
}
