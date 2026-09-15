"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost, updatePost } from "@/actions/admin";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Post } from "@prisma/client";

const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().optional().or(z.literal("")),
  published: z.boolean().default(false),
  categoryId: z.string().min(1, "Please select a valid category"),
  tagsString: z.string().optional().or(z.literal("")),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  initialData?: (Post & { tags?: { name: string }[] }) | null;
  categories: { id: string; name: string }[];
}

export function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      published: initialData?.published || false,
      categoryId: initialData?.categoryId || (categories[0]?.id ?? ""),
      tagsString: initialData?.tags?.map((t: { name: string }) => t.name).join(", ") || "",
    },
  });

  const onSubmit = async (data: PostFormValues) => {
    setIsPending(true);
    setError(null);

    // Parse tag string to array of strings
    const tagsArray = (data.tagsString || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      coverImage: data.coverImage,
      published: data.published,
      categoryId: data.categoryId,
      tags: tagsArray,
    };

    try {
      let res;
      if (initialData?.id) {
        res = await updatePost(initialData.id, payload);
      } else {
        res = await createPost(payload);
      }

      if (res.success) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(res.message || "An operational error occurred during database modification.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to transmit modification signal. Database check requested.");
    } finally {
      setIsPending(false);
    }
  };

  // Helper to generate slug from title
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove duplicate hyphens
    setValue("slug", slug);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Return button */}
      <div>
        <Link
          href="/admin/posts"
          className="meta-mono inline-flex items-center gap-2 hover:text-copper transition-colors"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      <div className="border-b border-border-paper pb-4">
        <h2 className="font-serif text-2xl font-bold text-fg-ink">
          {initialData ? "Modify Essay Artifact" : "Formulate New Essay"}
        </h2>
      </div>

      {error && (
        <div className="p-4 border border-red-500/35 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="meta-mono block">Essay Title</label>
            <input
              type="text"
              {...register("title")}
              onChange={(e) => {
                register("title").onChange(e);
                if (!initialData) generateSlug(e.target.value);
              }}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="Designing Distributed Consensuses..."
            />
            {errors.title && <p className="text-[10px] text-red-500 font-mono">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="meta-mono block">URL Slug</label>
            <input
              type="text"
              {...register("slug")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="designing-distributed-consensuses"
            />
            {errors.slug && <p className="text-[10px] text-red-500 font-mono">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="meta-mono block">Discipline Category</label>
            <select
              {...register("categoryId")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-[10px] text-red-500 font-mono">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="meta-mono block">System Tags (Comma separated)</label>
            <input
              type="text"
              {...register("tagsString")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="Rust, Go, Kafka, Systems"
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <ImageUpload
          value={watch("coverImage")}
          onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
          disabled={isPending}
          folder="portfolio/blog"
          label="Essay Cover Image"
        />

        {/* Content */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Essay Body (Rich Text)</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor content={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && <p className="text-[10px] text-red-500 font-mono">{errors.content.message}</p>}
        </div>

        {/* Published */}
        <div className="flex items-center gap-3 border border-border-paper bg-card-paper p-4">
          <input
            id="pub"
            type="checkbox"
            {...register("published")}
            className="w-4 h-4 accent-copper border-border-paper"
          />
          <label htmlFor="pub" className="meta-mono cursor-pointer select-none">
            Release to Public Directory (Publish)
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full border border-fg-ink bg-fg-ink text-bg-paper py-3.5 text-xs font-mono hover:bg-copper hover:border-copper disabled:bg-muted-paper disabled:border-muted-paper transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Modifying Ledger...
            </>
          ) : initialData ? (
            "Update Essay Release"
          ) : (
            "Authorize Essay Release"
          )}
        </button>
      </form>
    </div>
  );
}
