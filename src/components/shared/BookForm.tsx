"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema } from "@/validators";
import { createBook, updateBook } from "@/actions/admin";
import { AlertCircle, Loader2 } from "lucide-react";
import { Book } from "@prisma/client";

type BookFormValues = {
  title: string;
  description: string;
  purchaseUrl: string;
  coverImage: string;
};

interface BookFormProps {
  initialData?: Book | null;
}

export function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: { title: "", description: "", purchaseUrl: "", coverImage: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        purchaseUrl: initialData.purchaseUrl || "",
        coverImage: initialData.coverImage || "",
      });
    } else {
      reset({ title: "", description: "", purchaseUrl: "", coverImage: "" });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: BookFormValues) => {
    setIsPending(true);
    setError(null);

    try {
      let res;
      if (initialData?.id) {
        res = await updateBook(initialData.id, data);
      } else {
        res = await createBook(data);
      }

      if (res.success) {
        router.push("/admin/books");
        router.refresh();
        if (!initialData) {
          reset();
        }
      } else {
        setError(res.message || "Failed to commit book changes.");
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
          {initialData ? `Edit: ${initialData.title}` : "Record Publication Registry"}
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
          <label className="meta-mono block">Book Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Designing Distributed Ledger Applications"
          />
          {errors.title && <p className="text-[10px] text-red-500 font-mono">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Publication Synopsis</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="Detailed overview of literature themes..."
          />
          {errors.description && (
            <p className="text-[10px] text-red-500 font-mono">{errors.description.message}</p>
          )}
        </div>

        {/* Purchase URL */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Acquisition URL (Purchase)</label>
          <input
            type="text"
            {...register("purchaseUrl")}
            className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="https://amazon.com/..."
          />
          {errors.purchaseUrl && (
            <p className="text-[10px] text-red-500 font-mono">{errors.purchaseUrl.message}</p>
          )}
        </div>

        {/* Cover Image URL */}
        <div className="space-y-1.5">
          <label className="meta-mono block">Cover Image URL</label>
          <input
            type="text"
            {...register("coverImage")}
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
            "Update Publication Registry"
          ) : (
            "Create Publication Registry"
          )}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={() => {
              router.push("/admin/books");
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
