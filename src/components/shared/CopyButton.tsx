"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

interface CopyButtonProps {
  url: string;
  className?: string;
  title?: string;
}

export function CopyButton({ url, className = "", title = "Copy Link" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (typeof document !== "undefined") {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link to clipboard:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`relative inline-flex items-center justify-center hover:text-copper transition-colors ${className}`}
      title={copied ? "Link Copied!" : title}
      aria-label={copied ? "Link Copied" : title}
    >
      {copied ? (
        <Check size={16} className="text-copper animate-in fade-in zoom-in-75 duration-200" />
      ) : (
        <LinkIcon size={16} />
      )}
      {copied && (
        <span className="text-[10px] font-mono text-copper absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card-paper border border-border-paper px-1.5 py-0.5 shadow-sm pointer-events-none">
          Copied!
        </span>
      )}
    </button>
  );
}

