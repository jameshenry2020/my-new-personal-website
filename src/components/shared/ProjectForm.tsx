"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProject, updateProject } from "@/actions/admin";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { MultiImageUpload } from "@/components/shared/MultiImageUpload";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Project } from "@prisma/client";

const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional().or(z.literal("")),
  technologiesString: z.string().min(1, "Please enter at least one technology (comma separated)"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  projectType: z.enum(["BACKEND_ONLY", "FULL_STACK", "MOBILE"]).default("FULL_STACK"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: Project | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      technologiesString: initialData?.technologies?.join(", ") || "",
      githubUrl: initialData?.githubUrl || "",
      liveUrl: initialData?.liveUrl || "",
      coverImage: initialData?.coverImage || "",
      featured: initialData?.featured || false,
      projectType: (initialData as any)?.projectType || "FULL_STACK",
    },
  });

  useEffect(() => {
    if (initialData) {
      setScreenshots(initialData.screenshots || []);
    }
  }, [initialData]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsPending(true);
    setError(null);

    const techArray = data.technologiesString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    if (techArray.length === 0) {
      setError("Please provide at least one technology (comma separated).");
      setIsPending(false);
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      content: data.content || "",
      technologies: techArray,
      githubUrl: data.githubUrl || "",
      liveUrl: data.liveUrl || "",
      coverImage: data.coverImage || "",
      featured: data.featured,
      projectType: data.projectType,
      screenshots: screenshots,
    };

    try {
      let res;
      if (initialData?.id) {
        res = await updateProject(initialData.id, payload);
      } else {
        res = await createProject(payload);
      }

      if (res.success) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(res.message || "Failed to commit project changes.");
      }
    } catch (err) {
      console.error(err);
      setError("An operational error occurred during project database transmission.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Return button */}
      <div>
        <Link
          href="/admin/projects"
          className="meta-mono inline-flex items-center gap-2 hover:text-copper transition-colors"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      <div className="border-b border-border-paper pb-4">
        <h2 className="font-serif text-2xl font-bold text-fg-ink">
          {initialData ? `Modify Project: ${initialData.title}` : "Catalog New System Project"}
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
            <label className="meta-mono block">System Name</label>
            <input
              type="text"
              {...register("title")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="Aegis Clearing Engine"
            />
            {errors.title && <p className="text-[10px] text-red-500 font-mono">{errors.title.message}</p>}
          </div>

          {/* Project Type */}
          <div className="space-y-1.5">
            <label className="meta-mono block">System Category / Type</label>
            <select
              {...register("projectType")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            >
              <option value="FULL_STACK">Full Stack</option>
              <option value="BACKEND_ONLY">Backend Only</option>
              <option value="MOBILE">Mobile Application</option>
            </select>
            {errors.projectType && (
              <p className="text-[10px] text-red-500 font-mono">{errors.projectType.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Brief Abstract</label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="A concise summary of system mechanics, goals, and technical highlights..."
          />
          {errors.description && (
            <p className="text-[10px] text-red-500 font-mono">{errors.description.message}</p>
          )}
        </div>

        {/* Technologies */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Technologies Stack (Comma separated)</label>
          <input
            type="text"
            {...register("technologiesString")}
            className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Go, Kafka, PostgreSQL, Docker, Redis"
          />
          {errors.technologiesString && (
            <p className="text-[10px] text-red-500 font-mono">{errors.technologiesString.message}</p>
          )}
        </div>

        {/* Repositories & URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="meta-mono block">Repository URL</label>
            <input
              type="text"
              {...register("githubUrl")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="https://github.com/..."
            />
            {errors.githubUrl && (
              <p className="text-[10px] text-red-500 font-mono">{errors.githubUrl.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="meta-mono block">Live URL / Demo</label>
            <input
              type="text"
              {...register("liveUrl")}
              className="w-full bg-card-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="https://aegis.dev"
            />
            {errors.liveUrl && (
              <p className="text-[10px] text-red-500 font-mono">{errors.liveUrl.message}</p>
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-1.5">
          <ImageUpload
            value={watch("coverImage")}
            onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
            disabled={isPending}
            folder="portfolio/projects"
            label="Project Banner / Primary Image"
          />
          {errors.coverImage && (
            <p className="text-[10px] text-red-500 font-mono">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Screenshots Multi-Image Upload */}
        <MultiImageUpload
          values={screenshots}
          onChange={(urls) => setScreenshots(urls)}
          disabled={isPending}
          folder="portfolio/projects/screenshots"
          label="Project Screenshots / Architecture Assets"
        />

        {/* Architectural Content Detail */}
        <div className="space-y-1.5">
          <label className="meta-mono block">System Architecture & Technical Case Study (Rich Text)</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor content={field.value || ""} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <p className="text-[10px] text-red-500 font-mono">{errors.content.message}</p>
          )}
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3 border border-border-paper bg-card-paper p-4">
          <input
            id="feat"
            type="checkbox"
            {...register("featured")}
            className="w-4 h-4 accent-copper border-border-paper"
          />
          <label htmlFor="feat" className="meta-mono cursor-pointer select-none">
            Highlight in Selected Showcase (Featured Project)
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
              <Loader2 size={12} className="animate-spin" /> Committing Ledger...
            </>
          ) : initialData ? (
            "Update System Project"
          ) : (
            "Archive System Project"
          )}
        </button>
      </form>
    </div>
  );
}
