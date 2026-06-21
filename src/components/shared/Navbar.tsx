"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/projects", label: "Projects", num: "01" },
  { href: "/blog", label: "Blog", num: "02" },
  { href: "/courses", label: "Courses", num: "03" },
  { href: "/books", label: "Books", num: "04" },
  { href: "/about", label: "About", num: "05" },
  { href: "/contact", label: "Contact", num: "06" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering theme toggle only after mount
  const themeToggle = mounted ? (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border border-border-paper hover:bg-card-paper text-fg-ink rounded-none transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  ) : (
    <div className="w-8 h-8 border border-border-paper" />
  );

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b border-border-paper bg-bg-paper sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex flex-col justify-center">
          <Link href="/" className="group">
            <span className="font-serif text-lg font-bold tracking-tight text-fg-ink group-hover:text-copper transition-colors">
              Henry A.
            </span>
            <div className="meta-mono text-[9px] -mt-1 tracking-widest text-muted-paper">
              Software Engineer & Product Architect
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-baseline space-x-1.5 py-2 text-sm transition-colors relative",
                isLinkActive(item.href)
                  ? "text-copper font-medium"
                  : "text-fg-ink/80 hover:text-fg-ink"
              )}
            >
              <span className="font-mono text-[9px] text-muted-paper group-hover:text-copper/70 transition-colors">
                {item.num}
              </span>
              <span className="font-sans text-sm tracking-tight">{item.label}</span>
              {isLinkActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-copper" />
              )}
            </Link>
          ))}
          <div className="pl-4 border-l border-border-paper flex items-center gap-4">
            {themeToggle}
            <Link
              href="/admin"
              className="meta-mono text-[10px] border border-copper px-3 py-1.5 text-copper hover:bg-copper hover:text-bg-paper transition-colors"
            >
              Console
            </Link>
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {themeToggle}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-fg-ink border border-border-paper"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-paper bg-bg-paper py-4 px-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-baseline space-x-2 py-1.5 text-base",
                  isLinkActive(item.href) ? "text-copper font-medium" : "text-fg-ink"
                )}
              >
                <span className="font-mono text-[10px] text-muted-paper">{item.num}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-border-paper flex justify-between items-center">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="meta-mono text-xs border border-copper px-4 py-2 text-copper w-full text-center hover:bg-copper hover:text-bg-paper"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
