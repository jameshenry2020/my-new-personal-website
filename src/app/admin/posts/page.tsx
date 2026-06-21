import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { deletePost } from "@/actions/admin";
import { Edit, Trash2, Plus, ArrowUpRight } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4 flex justify-between items-end">
        <div>
          <span className="meta-mono">Technical Publications Library</span>
          <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Manage Blog Posts</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="border border-copper px-4 py-2 hover:bg-copper hover:text-bg-paper text-copper transition-all font-mono text-xs flex items-center gap-1.5"
        >
          <Plus size={14} /> Formulate Essay
        </Link>
      </section>

      {/* Catalog Table */}
      {posts.length === 0 ? (
        <div className="p-12 border border-dashed border-border-paper text-center">
          <p className="font-serif italic text-sm text-muted-paper">Catalog is currently empty.</p>
          <Link href="/admin/posts/new" className="meta-mono text-copper hover:underline mt-2 inline-block">
            Compose First Essay
          </Link>
        </div>
      ) : (
        <div className="border border-border-paper overflow-x-auto bg-card-paper">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border-paper bg-bg-paper text-[10px] font-mono uppercase tracking-wider text-muted-paper">
                <th className="p-4 font-semibold">Release Date</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Discipline</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-paper">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-bg-paper/40 transition-colors">
                  <td className="p-4 font-mono text-muted-paper whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-serif font-bold text-sm text-fg-ink">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="hover:text-copper flex items-center gap-1"
                    >
                      {post.title} <ArrowUpRight size={11} className="text-muted-paper shrink-0" />
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-muted-paper">{post.category.name}</td>
                  <td className="p-4">
                    {/* Inline Quick-Toggle Form */}
                    <form
                      action={async () => {
                        "use server";
                        await db.post.update({
                          where: { id: post.id },
                          data: { published: !post.published },
                        });
                        revalidatePath("/blog");
                        revalidatePath("/admin");
                        revalidatePath("/admin/posts");
                      }}
                    >
                      <button
                        type="submit"
                        className={`font-mono text-[10px] px-2 py-0.5 border ${
                          post.published
                            ? "border-emerald-500/35 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                            : "border-amber-500/35 text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                        }`}
                      >
                        {post.published ? "Released" : "Draft"}
                      </button>
                    </form>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/40 transition-colors"
                        title="Edit Essay"
                      >
                        <Edit size={12} />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title="Purge Essay"
                        >
                          <Trash2 size={12} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
