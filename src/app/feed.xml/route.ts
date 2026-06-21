import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://henry.dev";

  try {
    const posts = await db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const xmlItems = posts
      .map((post) => {
        const cleanContent = post.content.replace(/<[^>]*>/g, ""); // simple HTML strip
        return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
          <pubDate>${post.createdAt.toUTCString()}</pubDate>
          <category><![CDATA[${post.category.name}]]></category>
          <description><![CDATA[${cleanContent.substring(0, 250)}...]]></description>
        </item>`;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Henry A. | Technical Essays</title>
    <link>${baseUrl}/blog</link>
    <description>Technical essays on distributed systems, databases, and microservices.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("<error>Failed to compile feed</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}
