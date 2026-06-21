"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, FolderGit2, Video, BookOpen, MessageSquare, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/courses", label: "Courses", icon: Video },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border-paper py-4 md:py-8 space-y-6">
      <div className="px-6 flex justify-between items-center md:block">
        <div>
          <span className="font-serif text-lg font-bold text-fg-ink">Admin Console</span>
          <div className="meta-mono text-[9px] text-copper">Henry&apos;s Digital Studio</div>
        </div>
        <Link
          href="/"
          className="md:mt-4 md:flex items-center gap-1.5 text-xs text-muted-paper hover:text-fg-ink font-sans transition-colors"
        >
          <ArrowLeft size={12} /> <span className="hidden md:inline">Public Site</span>
        </Link>
      </div>

      <nav className="px-4 space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible shrink-0 gap-1 md:gap-0">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-xs font-mono border transition-all whitespace-nowrap",
                isActive
                  ? "border-copper text-copper bg-card-paper font-semibold"
                  : "border-transparent text-muted-paper hover:text-fg-ink hover:bg-card-paper/40"
              )}
            >
              <Icon size={14} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pt-6 border-t border-border-paper hidden md:block">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 text-xs font-mono w-full text-left text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut size={14} />
          <span>Exit Console</span>
        </button>
      </div>
    </aside>
  );
}
