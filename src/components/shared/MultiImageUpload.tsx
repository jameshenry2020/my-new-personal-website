"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertCircle,
  Plus,
  ExternalLink,
  X,
} from "lucide-react";

interface MultiImageUploadProps {
  values?: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
}

export function MultiImageUpload({
  values = [],
  onChange,
  disabled = false,
  folder = "portfolio/projects/screenshots",
  label = "Project Screenshots / Interface Assets",
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload file ${file.name}`);
        }

        uploadedUrls.push(data.url);
      }

      onChange([...values, ...uploadedUrls]);
    } catch (err: unknown) {
      console.error("Multi upload error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during batch image upload."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUploadFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    if (e.dataTransfer.files) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  const addManualUrl = () => {
    if (!manualUrl.trim()) return;
    onChange([...values, manualUrl.trim()]);
    setManualUrl("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="meta-mono block">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-mono text-muted-paper hover:text-copper transition-colors inline-flex items-center gap-1"
        >
          <LinkIcon size={10} />
          {showUrlInput ? "Hide Direct URL" : "Add URL Manually"}
        </button>
      </div>

      {/* Hidden Multi-file Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={onFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Manual URL Input toggle */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            disabled={disabled || isUploading}
            placeholder="https://images.unsplash.com/... or asset URL"
            className="flex-grow bg-card-paper border border-border-paper px-3 py-2 text-xs font-mono text-fg-ink rounded-none focus:outline-none focus:border-copper"
          />
          <button
            type="button"
            onClick={addManualUrl}
            disabled={!manualUrl.trim() || disabled || isUploading}
            className="px-3 py-2 border border-fg-ink bg-fg-ink text-bg-paper text-xs font-mono hover:bg-copper hover:border-copper disabled:opacity-50 transition-colors inline-flex items-center gap-1"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 border border-red-500/35 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[10px] underline hover:text-fg-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? "border-copper bg-copper/10"
            : "border-border-paper bg-card-paper hover:border-copper/60 hover:bg-card-paper/80"
        } ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <Loader2 size={24} className="animate-spin text-copper" />
            <p className="text-xs font-mono text-fg-ink">
              Uploading selected assets to Cloudinary...
            </p>
          </div>
        ) : (
          <>
            <div className="p-2.5 rounded-full bg-border-paper/40 text-fg-ink">
              <Upload size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-mono font-medium text-fg-ink">
                {isDragging ? "Drop images here" : "Click to select or drag & drop multiple screenshots"}
              </p>
              <p className="text-[10px] font-mono text-muted-paper">
                Batch upload multiple JPG, PNG, WEBP, GIF files (Max 5MB each)
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              className="mt-1 px-3 py-1.5 bg-fg-ink text-bg-paper text-xs font-mono hover:bg-copper transition-colors inline-flex items-center gap-1.5"
            >
              <Plus size={12} /> Select Images
            </button>
          </>
        )}
      </div>

      {/* Uploaded Screenshots Grid Preview */}
      {values.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-paper">
            <span>Uploaded Assets ({values.length})</span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-red-500 hover:underline text-[10px]"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {values.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-video border border-border-paper bg-card-paper overflow-hidden group"
              >
                {/* eslint-disable-next-next/image-element */}
                <img
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-bg-paper text-fg-ink hover:bg-copper hover:text-white transition-colors"
                    title="View Full Size"
                  >
                    <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                    title="Remove Asset"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
