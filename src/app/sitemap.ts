import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://henry.dev";

  // Static routes
  const routes = [
    "",
    "/about",
    "/projects",
    "/blog",
    "/courses",
    "/books",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic blog posts
    const posts = await db.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    const postRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...routes, ...postRoutes];
  } catch (error) {
    console.error("Error generating sitemap routes:", error);
    return routes;
  }
}
