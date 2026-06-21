"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface BlogFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

export function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(currentSearch);

  const updateFilters = (searchVal: string, catVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Reset page on filter change
    
    if (searchVal) {
      params.set("search", searchVal);
    } else {
      params.delete("search");
    }

    if (catVal) {
      params.set("category", catVal);
    } else {
      params.delete("category");
    }

    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(query, currentCategory);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search essays by keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card-paper border border-border-paper px-4 py-2.5 pl-10 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink placeholder:text-muted-paper"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-paper" />
        </div>
        <button
          type="submit"
          className="border border-fg-ink bg-fg-ink text-bg-paper px-6 text-xs font-mono hover:bg-copper hover:border-copper transition-colors"
        >
          {isPending ? "Filtering..." : "Search"}
        </button>
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="meta-mono mr-2">Discipline:</span>
        <button
          onClick={() => {
            setQuery("");
            updateFilters("", "");
          }}
          className={`font-mono text-[10px] px-3 py-1 border transition-colors ${
            !currentCategory && !currentSearch
              ? "border-copper text-copper bg-card-paper"
              : "border-border-paper text-muted-paper hover:text-fg-ink"
          }`}
        >
          All Topics
        </button>
        {categories.map((category) => {
          const isActive = currentCategory === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => updateFilters(currentSearch, isActive ? "" : category.slug)}
              className={`font-mono text-[10px] px-3 py-1 border transition-colors ${
                isActive
                  ? "border-copper text-copper bg-card-paper"
                  : "border-border-paper text-muted-paper hover:text-fg-ink"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
