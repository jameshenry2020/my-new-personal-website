import React from "react";
import { db } from "@/lib/db";
import { PostForm } from "@/components/shared/PostForm";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  // Fetch existing categories to select from
  let categories = await db.category.findMany().catch(() => []);

  // Seed default categories if none exist to prevent forms from crashing
  if (categories.length === 0) {
    await db.category.createMany({
      data: [
        { name: "Distributed Systems", slug: "distributed-systems" },
        { name: "Database Engineering", slug: "database-engineering" },
        { name: "Fintech Architecture", slug: "fintech-architecture" },
        { name: "System Design", slug: "system-design" },
        { name: "Mobile Development", slug: "mobile-development" },
        { name: "AI Systems", slug: "ai-systems" },
        { name: "Backend Engineering", slug: "backend-engineering" },
        { name: "SaaS", slug: "saas" },
        { name: "E-commerce", slug: "e-commerce" },
        { name: "Logistics", slug: "logistics" },
        { name: "Ai Systems", slug: "ai-system-design" },
        { name: "AI Application", slug: "ai-application" },
        { name: "AI Infrastructure", slug: "ai-infrastructure" },
        { name: "Cloud Architecture", slug: "cloud-architecture" },
        { name: "DevOps", slug: "devops" },

      ],
    });
    categories = await db.category.findMany();
  }

  return (
    <PostForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
  );
}
