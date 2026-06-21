import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { markContactMessageRead, deleteContactMessage } from "@/actions/admin";
import { MessageSquare, FileText, FolderGit2, BookOpen, Check, Trash2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Fetch stats & lists
  const [
    postCount,
    projectCount,
    courseCount,
    bookCount,
    messageCount,
    recentMessages,
    recentPosts,
  ] = await Promise.all([
    db.post.count(),
    db.project.count(),
    db.course.count(),
    db.book.count(),
    db.contactMessage.count(),
    db.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    db.post.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { category: true } }),
  ]);

  return (
    <div className="space-y-12">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-6">
        <span className="meta-mono">Telemetry Control</span>
        <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Overview</h1>
      </section>

      {/* 2. Ledger Statistics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Essays", val: postCount, icon: FileText, href: "/admin/posts" },
          { label: "Portfolio Items", val: projectCount, icon: FolderGit2, href: "/admin/projects" },
          { label: "Active Courses", val: courseCount, icon: BookOpen, href: "/admin/courses" },
          { label: "Published Books", val: bookCount, icon: BookOpen, href: "/admin/books" },
          { label: "Signals Received", val: messageCount, icon: MessageSquare, href: "/admin/messages" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card-paper border border-border-paper p-5 block hover:border-copper transition-colors"
          >
            <div className="flex justify-between items-start text-muted-paper">
              <span className="font-mono text-[9px] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={12} className="text-copper" />
            </div>
            <div className="font-serif text-2xl font-bold text-fg-ink mt-3">
              {stat.val < 10 ? `0${stat.val}` : stat.val}
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Operational Feed Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Recent Messages (Contact Inbox) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-border-paper pb-3 flex justify-between items-center">
            <h2 className="font-serif text-lg font-semibold italic text-fg-ink">Inbox Transmissions</h2>
            <Link href="/admin/messages" className="meta-mono hover:text-copper">
              View Inbox
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 border border-dashed border-border-paper text-center">
              <p className="font-serif italic text-xs text-muted-paper">Communications terminal is quiet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`border p-4 space-y-3 transition-colors ${
                    msg.read ? "bg-bg-paper border-border-paper/60" : "bg-card-paper border-copper/35"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-serif font-bold text-xs text-fg-ink block">
                        {msg.subject}
                      </span>
                      <span className="font-mono text-[9px] text-muted-paper">
                        Sender: {msg.name} ({msg.email}) • {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Quick Action Forms (Server Actions) */}
                    <div className="flex items-center gap-2">
                      {!msg.read ? (
                        <form
                          action={async () => {
                            "use server";
                            await markContactMessageRead(msg.id, true);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 border border-border-paper text-muted-paper hover:text-emerald-500 hover:border-emerald-500/30 transition-colors"
                            title="Mark Read"
                          >
                            <Check size={11} />
                          </button>
                        </form>
                      ) : (
                        <form
                          action={async () => {
                            "use server";
                            await markContactMessageRead(msg.id, false);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/30 transition-colors"
                            title="Mark Unread"
                          >
                            <Mail size={11} />
                          </button>
                        </form>
                      )}
                      <form
                        action={async () => {
                          "use server";
                          await deleteContactMessage(msg.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/30 transition-colors"
                          title="Purge Message"
                        >
                          <Trash2 size={11} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="text-xs text-muted-paper font-sans leading-relaxed line-clamp-3">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: Recent Essays (Latest publications) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-border-paper pb-3 flex justify-between items-center">
            <h2 className="font-serif text-lg font-semibold italic text-fg-ink">Technical Literature Feed</h2>
            <Link href="/admin/posts" className="meta-mono hover:text-copper">
              View Catalog
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="p-8 border border-dashed border-border-paper text-center">
              <p className="font-serif italic text-xs text-muted-paper">No literature compiled yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-paper border-b border-border-paper">
              {recentPosts.map((post) => (
                <div key={post.id} className="py-4 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-copper uppercase">
                      {post.category.name}
                    </span>
                    <h3 className="font-serif text-xs font-bold text-fg-ink hover:text-copper transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 border ${
                      post.published
                        ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                        : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                    }`}
                  >
                    {post.published ? "Released" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
