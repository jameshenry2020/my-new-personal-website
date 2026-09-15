"use client";

import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Code2,
  Table as TableIcon,
  Minus,
  Upload,
  Loader2,
  X,
  Type,
  AlignLeft,
  Plus,
  Trash2,
} from "lucide-react";

const lowlight = createLowlight(all);

const CODE_LANGUAGES = [
  { label: "Auto / Plain", value: "" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "SQL", value: "sql" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Bash / Shell", value: "bash" },
  { label: "YAML", value: "yaml" },
  { label: "C++", value: "cpp" },
];

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  // Modal states for Link & Image inserts
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Replaced by CodeBlockLowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "typescript",
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-sm border border-border-paper my-4 max-w-full h-auto shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-copper underline hover:opacity-80 transition-opacity cursor-pointer",
        },
      }),
      TextStyle,
      FontFamily,
      Color,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse border border-border-paper my-4 text-xs font-mono",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border-paper bg-card-paper p-2 font-bold text-left text-fg-ink",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border-paper p-2 text-fg-ink",
        },
      }),
    ],
    content: content || "<p>Start writing your technical essay...</p>",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none text-sm font-sans min-h-[350px] max-h-[700px] overflow-y-auto focus:outline-none bg-bg-paper p-6 border border-t-0 border-border-paper leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-border-paper p-6 text-xs font-mono text-muted-paper bg-card-paper flex items-center gap-2">
        <Loader2 size={16} className="animate-spin text-copper" /> Loading technical editor suite...
      </div>
    );
  }

  // --- LINK HANDLERS ---
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl, target: "_blank" })
        .run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  // --- IMAGE HANDLERS ---
  const handleCloudinaryUpload = async (file: File) => {
    setIsUploadingImage(true);
    setImageUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/blog/content");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setImageUrl(data.url);
    } catch (err: unknown) {
      console.error(err);
      setImageUploadError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt || "Article Image", title: imageAlt })
      .run();
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
    setImageUploadError(null);
  };

  // --- FONT FAMILY & HEADING HANDLERS ---
  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "p") {
      editor.chain().focus().setParagraph().run();
    } else if (val.startsWith("h")) {
      const level = parseInt(val.replace("h", ""), 10) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const getCurrentHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    return "p";
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(val).run();
    }
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Editor Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-card-paper p-2.5 border border-border-paper border-b-0 sticky top-0 z-10 shadow-xs">
        {/* Typography & Heading Selector */}
        <select
          value={getCurrentHeadingValue()}
          onChange={handleHeadingChange}
          className="bg-bg-paper border border-border-paper px-2 py-1 text-xs font-mono text-fg-ink rounded-none focus:outline-none focus:border-copper"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1 (H1)</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
        </select>

        {/* Font Family Selector */}
        <select
          onChange={handleFontFamilyChange}
          className="bg-bg-paper border border-border-paper px-2 py-1 text-xs font-mono text-fg-ink rounded-none focus:outline-none focus:border-copper"
        >
          <option value="">Font: Default (Sans)</option>
          <option value="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
            Font: Technical Mono
          </option>
          <option value="Georgia, Cambria, Times New Roman, serif">Font: Editorial Serif</option>
          <option value="Inter, system-ui, sans-serif">Font: Clean Modern</option>
        </select>

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Formatting Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("bold")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("italic")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("underline")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("strike")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("highlight")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Highlight Text"
        >
          <Highlighter size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("code")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Inline Code"
        >
          <Code size={14} />
        </button>

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Code Snippet Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 border transition-all flex items-center gap-1 ${
            editor.isActive("codeBlock")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Syntax-Highlighted Code Block"
        >
          <Code2 size={14} />
          <span className="text-[10px] font-mono font-bold uppercase">Code Block</span>
        </button>

        {/* Language selector when inside code block */}
        {editor.isActive("codeBlock") && (
          <select
            value={editor.getAttributes("codeBlock").language || ""}
            onChange={(e) =>
              editor.chain().focus().updateAttributes("codeBlock", { language: e.target.value }).run()
            }
            className="bg-bg-paper border border-copper px-2 py-0.5 text-xs font-mono text-copper rounded-none focus:outline-none"
          >
            {CODE_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        )}

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Image / Diagram Embed */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-1.5 border border-transparent text-muted-paper hover:text-copper transition-all flex items-center gap-1"
          title="Insert Cloudinary Image / Diagram"
        >
          <ImageIcon size={14} />
          <span className="text-[10px] font-mono font-bold uppercase">Image</span>
        </button>

        {/* Link Attachment */}
        <button
          type="button"
          onClick={openLinkModal}
          className={`p-1.5 border transition-all ${
            editor.isActive("link")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Insert Link"
        >
          <LinkIcon size={14} />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 border border-transparent text-red-500 hover:text-red-600 transition-all"
            title="Remove Link"
          >
            <Unlink size={14} />
          </button>
        )}

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("bulletList")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("orderedList")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("taskList")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Checklist / Task List"
        >
          <CheckSquare size={14} />
        </button>

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Tables */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={`p-1.5 border transition-all ${
            editor.isActive("table")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Insert Table"
        >
          <TableIcon size={14} />
        </button>

        {/* Table actions when inside a table */}
        {editor.isActive("table") && (
          <div className="flex items-center gap-1 bg-card-paper px-2 py-0.5 border border-copper text-[10px] font-mono">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="hover:text-copper"
              title="Add Row"
            >
              +Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="hover:text-copper ml-1"
              title="Add Column"
            >
              +Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="text-red-500 hover:text-red-700 ml-1"
              title="Delete Row"
            >
              -Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="text-red-500 hover:text-red-700 ml-1 font-bold"
              title="Delete Table"
            >
              Del Table
            </button>
          </div>
        )}

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Quote & HR */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 border transition-all ${
            editor.isActive("blockquote")
              ? "border-copper text-copper bg-bg-paper"
              : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 border border-transparent text-muted-paper hover:text-fg-ink transition-all"
          title="Horizontal Rule"
        >
          <Minus size={14} />
        </button>

        <span className="w-px h-5 bg-border-paper mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 border border-transparent text-muted-paper hover:text-fg-ink disabled:opacity-40"
          title="Undo"
        >
          <Undo size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 border border-transparent text-muted-paper hover:text-fg-ink disabled:opacity-40"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* --- LINK MODAL --- */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card-paper border border-border-paper p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border-paper pb-2">
              <h4 className="font-mono text-xs font-bold text-fg-ink uppercase tracking-wider">
                Insert Hyperlink
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-muted-paper hover:text-fg-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="meta-mono block">Destination URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono text-fg-ink focus:outline-none focus:border-copper"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border border-border-paper text-xs font-mono hover:bg-bg-paper text-fg-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-4 py-2 bg-fg-ink text-bg-paper text-xs font-mono hover:bg-copper transition-colors"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE / DIAGRAM UPLOAD MODAL --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card-paper border border-border-paper p-6 max-w-lg w-full space-y-5 shadow-xl">
            <div className="flex justify-between items-center border-b border-border-paper pb-2">
              <h4 className="font-mono text-xs font-bold text-fg-ink uppercase tracking-wider">
                Embed Image or Architecture Diagram
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-muted-paper hover:text-fg-ink"
              >
                <X size={16} />
              </button>
            </div>

            {/* Upload directly to Cloudinary option */}
            <div className="space-y-2">
              <label className="meta-mono block">Option 1: Upload File to Cloudinary</label>
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCloudinaryUpload(file);
                }}
                className="hidden"
              />

              <div
                onClick={() => !isUploadingImage && imageFileInputRef.current?.click()}
                className="border-2 border-dashed border-border-paper hover:border-copper bg-bg-paper p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
              >
                {isUploadingImage ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-copper py-2">
                    <Loader2 size={18} className="animate-spin" /> Uploading to Cloudinary...
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-muted-paper" />
                    <p className="text-xs font-mono text-fg-ink">
                      Click to select diagram/image file
                    </p>
                    <p className="text-[10px] font-mono text-muted-paper">
                      JPG, PNG, SVG, WEBP (Max 5MB)
                    </p>
                  </>
                )}
              </div>

              {imageUploadError && (
                <p className="text-[10px] font-mono text-red-500">{imageUploadError}</p>
              )}
            </div>

            <div className="relative flex items-center justify-center">
              <span className="h-px bg-border-paper w-full" />
              <span className="bg-card-paper px-3 font-mono text-[10px] text-muted-paper uppercase">
                OR
              </span>
              <span className="h-px bg-border-paper w-full" />
            </div>

            {/* Direct URL input option */}
            <div className="space-y-1.5">
              <label className="meta-mono block">Option 2: Direct Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or image link"
                className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono text-fg-ink focus:outline-none focus:border-copper"
              />
            </div>

            {/* Alt text / Caption */}
            <div className="space-y-1.5">
              <label className="meta-mono block">Image Alt / Caption</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="e.g. Distributed Consensus Flowchart"
                className="w-full bg-bg-paper border border-border-paper px-3 py-2 text-xs font-mono text-fg-ink focus:outline-none focus:border-copper"
              />
            </div>

            {/* Image Preview if URL is set */}
            {imageUrl && (
              <div className="border border-border-paper p-2 bg-bg-paper max-h-32 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-next/image-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-28 object-contain"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 border border-border-paper text-xs font-mono hover:bg-bg-paper text-fg-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl.trim() || isUploadingImage}
                className="px-4 py-2 bg-fg-ink text-bg-paper text-xs font-mono hover:bg-copper disabled:opacity-50 transition-colors"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
