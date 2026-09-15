"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, Loader2, Image as ImageIcon, Link as LinkIcon, AlertCircle, RefreshCw } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  disabled = false,
  folder = "portfolio/blog",
  label = "Cover Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset file input value so re-selecting the same file triggers change
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="meta-mono block">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-mono text-muted-paper hover:text-copper transition-colors inline-flex items-center gap-1"
        >
          <LinkIcon size={10} />
          {showUrlInput ? "Hide Raw URL" : "Enter URL Manually"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={onFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Manual URL Input view toggle */}
      {showUrlInput && (
        <div className="mb-2 space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isUploading}
            placeholder="https://res.cloudinary.com/... or image URL"
            className="w-full bg-card-paper border border-border-paper px-3 py-2 text-xs font-mono text-fg-ink rounded-none focus:outline-none focus:border-copper"
          />
          <p className="text-[10px] font-mono text-muted-paper">
            You can paste an external image URL or edit the uploaded URL directly.
          </p>
        </div>
      )}

      {/* Error message banner */}
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

      {/* Main Upload Box */}
      {value ? (
        /* Image Uploaded State & Preview */
        <div className="border border-border-paper bg-card-paper p-4 space-y-3">
          <div className="relative aspect-video w-full max-h-64 overflow-hidden border border-border-paper bg-black/5 dark:bg-white/5 group">
            {/* eslint-disable-next-next/image-element */}
            <img
              src={value}
              alt="Uploaded cover preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-3 py-1.5 bg-bg-paper text-fg-ink border border-border-paper text-xs font-mono flex items-center gap-1.5 hover:bg-copper hover:text-white transition-colors"
              >
                <RefreshCw size={12} /> Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-mono flex items-center gap-1.5 hover:bg-red-700 transition-colors"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted-paper">
            <span className="truncate max-w-xs">{value}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="hover:text-copper transition-colors inline-flex items-center gap-1"
              >
                <RefreshCw size={12} /> Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="text-red-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Prompt */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-copper bg-copper/10"
              : "border-border-paper bg-card-paper hover:border-copper/60 hover:bg-card-paper/80"
          } ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 size={28} className="animate-spin text-copper" />
              <p className="text-xs font-mono text-fg-ink">Uploading image to Cloudinary...</p>
              <p className="text-[10px] font-mono text-muted-paper">Please wait while the image is being processed</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-border-paper/40 text-fg-ink">
                {isDragging ? <Upload size={24} className="text-copper animate-bounce" /> : <ImageIcon size={24} />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-medium text-fg-ink">
                  {isDragging ? "Drop image file here" : "Click to select or drag & drop image"}
                </p>
                <p className="text-[10px] font-mono text-muted-paper">
                  Supports JPG, PNG, WEBP, GIF, SVG (Max 5MB)
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                className="mt-2 px-4 py-2 bg-fg-ink text-bg-paper text-xs font-mono hover:bg-copper transition-colors flex items-center gap-2"
              >
                <Upload size={12} /> Choose Image File
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
