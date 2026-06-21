import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/services/db.service";
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";

export const revalidate = 60; // Cache blog detail pages for 1 minute

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
      url: `https://henry.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categoryId, 3).catch(() => []);

  // Compute reading time
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  // Extract headings for Table of Contents (TOC)
  const headingRegex = /<(h2|h3)[^>]*>(.*?)<\/\1>/g;
  const headings: { text: string; id: string; level: string }[] = [];
  let match;
  const rawContent = post.content;

  // Let's inject ids into the headings dynamically so they can be linked
  let contentWithIds = rawContent;
  let index = 0;
  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1];
    const text = match[2].replace(/<[^>]*>/g, ""); // strip inner tags if any
    const id = `heading-${index}`;
    headings.push({ text, id, level });

    // Replace first occurrence of this tag with one containing the id
    const originalTag = match[0];
    const newTag = `<${level} id="${id}">${match[2]}</${level}>`;
    contentWithIds = contentWithIds.replace(originalTag, newTag);
    index++;
  }

  const shareUrl = `https://henry.dev/blog/${post.slug}`;
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
            {post.category.name}
          </span>
          <span className="h-px bg-border-paper w-12" />
          <span className="font-mono text-xs text-muted-paper">{readTime} Min Read</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-fg-ink leading-tight">
          {post.title}
        </h1>
        <div className="flex justify-between items-center text-xs font-mono text-muted-paper">
          <span>
            Published {new Date(post.createdAt).toLocaleDateString("en-US", {
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
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
                title="Share on X"
              >
                <Twitter size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied to clipboard!");
                }}
                className="hover:text-copper transition-colors"
                title="Copy Link"
              >
                <LinkIcon size={16} />
              </button>
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
                      {rPost.category.name}
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
