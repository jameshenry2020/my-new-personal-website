"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/validators";
import { createCourse, updateCourse } from "@/actions/admin";
import { AlertCircle, Loader2 } from "lucide-react";
import { Course } from "@prisma/client";

type CourseFormValues = {
  title: string;
  description: string;
  playlistUrl: string;
  thumbnail: string;
};

interface CourseFormProps {
  initialData?: Course | null;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: "", description: "", playlistUrl: "", thumbnail: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        playlistUrl: initialData.playlistUrl || "",
        thumbnail: initialData.thumbnail || "",
      });
    } else {
      reset({ title: "", description: "", playlistUrl: "", thumbnail: "" });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CourseFormValues) => {
    setIsPending(true);
    setError(null);

    try {
      let res;
      if (initialData?.id) {
        res = await updateCourse(initialData.id, data);
      } else {
        res = await createCourse(data);
      }

      if (res.success) {
        router.push("/admin/courses");
        router.refresh();
        if (!initialData) {
          reset();
        }
      } else {
        setError(res.message || "Failed to commit course changes.");
      }
    } catch (err) {
      console.error(err);
      setError("An operational error occurred during database modification.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4 bg-card-paper p-6 border border-border-paper">
      <div className="border-b border-border-paper pb-2">
        <h3 className="font-serif text-sm font-bold text-fg-ink uppercase tracking-wider">
          {initialData ? `Edit: ${initialData.title}` : "Record Course Registry"}
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
          <label className="meta-mono block">Lecture Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Distributed Systems Fundamentals"
          />
          {errors.title && <p className="text-[10px] text-red-500 font-mono">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Lecture syllabus overview and concepts studied..."
          />
          {errors.description && (
            <p className="text-[10px] text-red-500 font-mono">{errors.description.message}</p>
          )}
        </div>

        {/* Playlist URL */}
        <div className="space-y-1.5">
          <label className="meta-mono block">YouTube Playlist URL</label>
          <input
            type="text"
            {...register("playlistUrl")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="https://www.youtube.com/playlist?list=..."
          />
          {errors.playlistUrl && (
            <p className="text-[10px] text-red-500 font-mono">{errors.playlistUrl.message}</p>
          )}
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Thumbnail URL</label>
          <input
            type="text"
            {...register("thumbnail")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="https://images.unsplash.com/..."
          />
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
            "Update Course Archive"
          ) : (
            "Create Course Archive"
          )}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={() => {
              router.push("/admin/courses");
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
