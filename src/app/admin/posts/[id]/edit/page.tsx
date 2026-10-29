import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { syncAndGetCategories } from "@/services/db.service";
import { PostForm } from "@/components/shared/PostForm";

export const dynamic = "force-dynamic";

interface AdminEditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditPostPage({ params }: AdminEditPostPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [post, categories] = await Promise.all([
    db.post.findUnique({
      where: { id },
      include: { tags: true },
    }),
    syncAndGetCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      initialData={post}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
