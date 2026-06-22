"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/validators";
import { createProject, updateProject } from "@/actions/admin";
import { AlertCircle, Loader2 } from "lucide-react";
import { Project } from "@prisma/client";

type ProjectFormValues = {
  title: string;
  description: string;
  content: string;
  technologiesString: string;
  githubUrl: string;
  liveUrl: string;
  coverImage: string;
  featured: boolean;
  projectType: "BACKEND_ONLY" | "FULL_STACK" | "MOBILE";
};

interface ProjectFormProps {
  initialData?: Project | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(
      projectSchema.extend({
        technologies: projectSchema.shape.technologies,
      })
    ),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      technologiesString: "",
      githubUrl: "",
      liveUrl: "",
      coverImage: "",
      featured: false,
      projectType: "FULL_STACK",
    },
  });

  // Re-fill form if initialData updates (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        technologiesString: initialData.technologies?.join(", ") || "",
        githubUrl: initialData.githubUrl || "",
        liveUrl: initialData.liveUrl || "",
        coverImage: initialData.coverImage || "",
        featured: initialData.featured || false,
        projectType: (initialData as any).projectType || "FULL_STACK",
      });
      setScreenshots(initialData.screenshots || []);
    } else {
      reset({
        title: "",
        description: "",
        content: "",
        technologiesString: "",
        githubUrl: "",
        liveUrl: "",
        coverImage: "",
        featured: false,
        projectType: "FULL_STACK",
      });
      setScreenshots([]);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsPending(true);
    setError(null);

    const techArray = data.technologiesString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const payload = {
      title: data.title,
      description: data.description,
      content: data.content,
      technologies: techArray,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      coverImage: data.coverImage,
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
        if (!initialData) {
          reset();
          setScreenshots([]);
        }
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
    <div className="space-y-4 bg-card-paper p-6 border border-border-paper">
      <div className="border-b border-border-paper pb-2">
        <h3 className="font-serif text-sm font-bold text-fg-ink uppercase tracking-wider">
          {initialData ? `Edit: ${initialData.title}` : "Create Project Ledger"}
        </h3>
      </div>

      {error && (
        <div className="p-3 border border-red-500/35 bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-mono flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="meta-mono block">System Name</label>
          <input
            type="text"
            {...register("title")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Aegis Clearing Engine"
          />
          {errors.title && <p className="text-[10px] text-red-500 font-mono">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Brief Abstract</label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="A short summary of system mechanics..."
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
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Go, Kafka, PostgreSQL, Docker"
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="meta-mono block">Repository URL</label>
            <input
              type="text"
              {...register("githubUrl")}
              className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="meta-mono block">Live URL</label>
            <input
              type="text"
              {...register("liveUrl")}
              className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
              placeholder="https://aegis.dev"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Cover Image URL</label>
          <input
            type="text"
            {...register("coverImage")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Project Type */}
        <div className="space-y-1.5">
          <label className="meta-mono block">System Category / Type</label>
          <select
            {...register("projectType")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
          >
            <option value="FULL_STACK">Full Stack</option>
            <option value="BACKEND_ONLY">Backend Only</option>
            <option value="MOBILE">Mobile Application</option>
          </select>
          {errors.projectType && <p className="text-[10px] text-red-500 font-mono">{errors.projectType.message}</p>}
        </div>

        {/* Screenshots / Project Assets */}
        <div className="space-y-2 border border-border-paper bg-bg-paper p-3">
          <label className="meta-mono block text-xs">Project Screenshots / Interface Assets</label>
          
          {screenshots.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto border-b border-border-paper pb-3 mb-2">
              {screenshots.map((url, idx) => (
                <div key={idx} className="flex gap-2 items-center justify-between bg-card-paper p-2 border border-border-paper">
                  <span className="text-[10px] font-mono truncate max-w-[80%]">{url}</span>
                  <button
                    type="button"
                    onClick={() => setScreenshots(screenshots.filter((_, i) => i !== idx))}
                    className="text-[10px] font-mono text-red-500 hover:text-red-700 uppercase"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/... or asset url"
              value={newScreenshotUrl}
              onChange={(e) => setNewScreenshotUrl(e.target.value)}
              className="flex-grow bg-card-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            />
            <button
              type="button"
              onClick={() => {
                if (newScreenshotUrl.trim()) {
                  setScreenshots([...screenshots, newScreenshotUrl.trim()]);
                  setNewScreenshotUrl("");
                }
              }}
              className="border border-fg-ink bg-fg-ink text-bg-paper px-4 py-2 text-xs font-mono hover:bg-copper hover:border-copper transition-colors"
            >
              Add Asset
            </button>
          </div>
        </div>

        {/* Architectural Content Detail */}
        <div className="space-y-1.5">
          <label className="meta-mono block">System Architecture (Markdown / Plaintext)</label>
          <textarea
            {...register("content")}
            rows={3}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Provide deep software/systems architecture overview (challenges, solutions, lessons)..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2 border border-border-paper bg-bg-paper p-3">
          <input
            id="feat"
            type="checkbox"
            {...register("featured")}
            className="w-3.5 h-3.5 accent-copper border-border-paper"
          />
          <label htmlFor="feat" className="meta-mono text-[10px] cursor-pointer select-none">
            Highlight in Selected Artifacts (Featured)
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full border border-fg-ink bg-fg-ink text-bg-paper py-2.5 text-xs font-mono hover:bg-copper hover:border-copper disabled:bg-muted-paper disabled:border-muted-paper transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Committing data...
            </>
          ) : initialData ? (
            "Update System Ledger"
          ) : (
            "Archive System Ledger"
          )}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={() => {
              router.push("/admin/projects");
            }}
            className="w-full border border-border-paper text-muted-paper py-2.5 text-xs font-mono hover:bg-bg-paper hover:text-fg-ink transition-all text-center"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}
