"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema } from "@/validators";
import { submitContactMessage } from "@/actions/contact";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    setStatus({ type: null, message: null });

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    try {
      const response = await submitContactMessage(null, formData);
      if (response.success) {
        setStatus({ type: "success", message: response.message });
        reset();
      } else {
        setStatus({
          type: "error",
          message: response.message || "Failed to transmit message.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "A transmission error occurred. Please verify connection and retry.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Submission Alert */}
      {status.type && (
        <div
          className={`p-4 border text-xs font-mono flex items-start gap-3 ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/35 text-red-600 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="meta-mono block">
            Sender Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full bg-card-paper border px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink ${
              errors.name ? "border-red-500" : "border-border-paper"
            }`}
            placeholder="John Doe"
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-[10px] font-mono text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="meta-mono block">
            Return Coordinate (Email)
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full bg-card-paper border px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink ${
              errors.email ? "border-red-500" : "border-border-paper"
            }`}
            placeholder="john@example.com"
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-[10px] font-mono text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label htmlFor="subject" className="meta-mono block">
            Subject Heading
          </label>
          <input
            id="subject"
            type="text"
            {...register("subject")}
            className={`w-full bg-card-paper border px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink ${
              errors.subject ? "border-red-500" : "border-border-paper"
            }`}
            placeholder="Software Architecture Consultation Inquiry"
            disabled={isPending}
          />
          {errors.subject && (
            <p className="text-[10px] font-mono text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="meta-mono block">
            Transmission Content
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={`w-full bg-card-paper border px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink ${
              errors.message ? "border-red-500" : "border-border-paper"
            }`}
            placeholder="Type your message details here..."
            disabled={isPending}
          />
          {errors.message && (
            <p className="text-[10px] font-mono text-red-500">{errors.message.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full border border-fg-ink bg-fg-ink text-bg-paper py-3 text-xs font-mono hover:bg-copper hover:border-copper disabled:bg-muted-paper disabled:border-muted-paper transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Transmitting Signal...
            </>
          ) : (
            "Transmit Message"
          )}
        </button>
      </form>
    </div>
  );
}
