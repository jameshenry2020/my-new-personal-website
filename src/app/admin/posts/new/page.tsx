import React from "react";
import { syncAndGetCategories } from "@/services/db.service";
import { PostForm } from "@/components/shared/PostForm";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  // Sync and fetch all categories (auto-inserts any missing categories into DB)
  const categories = await syncAndGetCategories().catch(() => []);

  return (
    <PostForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
  );
}
