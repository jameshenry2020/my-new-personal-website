import React from "react";
import Link from "next/link";
import { getPosts, getCategories } from "@/services/db.service";
import { BlogFilters } from "@/components/shared/BlogFilters";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60; // Cache blog list page for 1 minute

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const categorySlug = resolvedParams.category || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 5; // Clean editorial pagination spacing

  // Fetch posts and categories
  const { posts, pages, currentPage } = await getPosts({
    categorySlug,
    search,
    page,
    limit,
    onlyPublished: true,
  }).catch(() => ({ posts: [], pages: 1, currentPage: 1 }));

  const categories = await getCategories().catch(() => []);

  // Helper to construct paginated URLs
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    params.set("page", pageNumber.toString());
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="space-y-16">
      {/* 1. Header Section */}
      <section className="border-b border-border-paper pb-8 space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="meta-mono">Technical Literature</span>
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
              The Engineering Essays
            </h1>
          </div>
          <span className="font-mono text-xs text-muted-paper">
            Page {currentPage} of {pages}
          </span>
        </div>
        <p className="text-xs text-muted-paper max-w-xl font-sans leading-relaxed">
          Thoughtful monographs and architectural breakdowns of complex backend infrastructure systems. Written for software engineers.
        </p>
      </section>

      {/* 2. Interactive Search & Filters */}
      <section className="bg-card-paper p-6 border border-border-paper">
        <BlogFilters categories={categories} />
      </section>

      {/* 3. Essays Listing */}
      <section className="space-y-12">
        {posts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-paper">
            <p className="font-serif italic text-muted-paper">No published essays found matching criteria.</p>
            <Link href="/blog" className="meta-mono text-copper hover:underline mt-2 inline-block">
              View All Publications
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-paper border-b border-border-paper">
            {posts.map((post) => {
              // Estimate reading time: 200 words per minute
              const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
              const readTime = Math.max(1, Math.round(wordCount / 200));

              return (
                <article key={post.id} className="py-12 group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                    {/* Date and Reading Time (Left Panel) */}
                    <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-4">
                      <span className="font-mono text-xs text-muted-paper">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="font-mono text-[10px] text-copper uppercase tracking-wider">
                        {readTime} Min Read
                      </span>
                    </div>

                    {/* Essay Core Info (Center/Right Panel) */}
                    <div className="md:col-span-9 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-copper tracking-wider uppercase font-semibold">
                          {post.category.name}
                        </span>
                        <span className="h-px bg-border-paper flex-grow max-w-[80px]" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold tracking-tight text-fg-ink group-hover:text-copper transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {/* Sub-excerpt snippet */}
                      <p className="text-sm text-muted-paper leading-relaxed font-sans line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, "").substring(0, 180)}...
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag.slug}
                            className="font-mono text-[9px] text-muted-paper border border-border-paper px-2 py-0.5 bg-card-paper"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Pagination Navigation */}
      {pages > 1 && (
        <section className="flex justify-between items-center border-t border-border-paper pt-8 text-xs font-mono">
          <Link
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
            className={`flex items-center gap-2 border border-border-paper px-4 py-2 hover:bg-card-paper transition-colors ${
              currentPage <= 1 ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            <ArrowLeft size={14} /> Previous Page
          </Link>
          <span className="text-muted-paper">
            [{currentPage} / {pages}]
          </span>
          <Link
            href={currentPage < pages ? getPageUrl(currentPage + 1) : "#"}
            className={`flex items-center gap-2 border border-border-paper px-4 py-2 hover:bg-card-paper transition-colors ${
              currentPage >= pages ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            Next Page <ArrowRight size={14} />
          </Link>
        </section>
      )}
    </div>
  );
}
