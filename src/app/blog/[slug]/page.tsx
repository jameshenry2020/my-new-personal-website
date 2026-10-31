import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/services/db.service";
import { CopyButton } from "@/components/shared/CopyButton";
import { ArrowLeft, Twitter, Linkedin } from "lucide-react";

export const revalidate = 60; // Cache blog detail pages for 1 minute

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const slug = decodeURIComponent(rawSlug);
  const post = (await getPostBySlug(slug)) || (await getPostBySlug(rawSlug));
  if (!post) {
    return {
      title: "Monograph Not Found | Henry A.",
      description: "The requested essay or monograph could not be found.",
    };
  }

  const excerpt = (post.content || "").replace(/<[^>]*>/g, "").substring(0, 160).trim() + "...";

  return {
    title: `${post.title} | Henry A.`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://henrydev.online/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const slug = decodeURIComponent(rawSlug);
  const post = (await getPostBySlug(slug)) || (await getPostBySlug(rawSlug));

  if (!post) {
    notFound();
  }

  // Related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categoryId, 3).catch(() => []);

  // Compute reading time
  const textContent = (post.content || "").replace(/<[^>]*>/g, "").trim();
  const wordCount = textContent ? textContent.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  // Extract headings for Table of Contents (TOC) and inject unique IDs
  const headingRegex = /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi;
  const headings: { text: string; id: string; level: string }[] = [];
  let index = 0;

  const contentWithIds = (post.content || "").replace(
    headingRegex,
    (fullMatch, tag, attrs, innerText) => {
      const level = tag.toLowerCase();
      const text = innerText.replace(/<[^>]*>/g, "").trim();
      const id = `heading-${index++}`;
      headings.push({ text, id, level });

      const cleanedAttrs = attrs.replace(/\s*id=["'][^"']*["']/i, "");
      return `<${level} id="${id}"${cleanedAttrs}>${innerText}</${level}>`;
    }
  );

  const shareUrl = `https://henrydev.online/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="meta-mono inline-flex items-center gap-2 hover:text-copper transition-colors"
        >
          <ArrowLeft size={14} /> Return to Essays
        </Link>
      </div>

      {/* Main Header Block */}
      <header className="border-b border-border-paper pb-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-copper tracking-wider uppercase font-semibold">
            {post.category?.name || "General"}
          </span>
          <span className="h-px bg-border-paper w-12" />
          <span className="font-mono text-xs text-muted-paper">{readTime} Min Read</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-fg-ink leading-tight">
          {post.title}
        </h1>
        <div className="flex justify-between items-center text-xs font-mono text-muted-paper">
          <span>
            Published{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>By Henry A.</span>
        </div>
      </header>

      {/* Editorial Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        {/* Left column: Sticky TOC & Share Tools */}
        <aside className="md:col-span-4 space-y-8 sticky top-24 hidden md:block">
          {headings.length > 0 && (
            <div className="space-y-4 border-l border-border-paper pl-4">
              <span className="meta-mono block">Table of Contents</span>
              <nav className="space-y-2">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-xs text-muted-paper hover:text-copper transition-colors ${
                      heading.level === "h3" ? "pl-3 text-[11px]" : "font-medium"
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          <div className="space-y-4">
            <span className="meta-mono block">Share Coordinate</span>
            <div className="flex items-center gap-4 text-muted-paper">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
                title="Share on X"
              >
                <Twitter size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <CopyButton url={shareUrl} />
            </div>
          </div>
        </aside>

        {/* Right column: Main article body */}
        <article className="md:col-span-8">
          <div
            className="prose max-w-none text-fg-ink font-sans leading-relaxed text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Related Articles Footer */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border-paper space-y-6">
              <h3 className="font-serif text-lg font-bold italic text-fg-ink">Related Monographs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <div key={rPost.id} className="space-y-2">
                    <span className="font-mono text-[9px] text-copper uppercase">
                      {rPost.category?.name || "General"}
                    </span>
                    <h4 className="font-serif text-sm font-semibold hover:text-copper transition-colors">
                      <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
