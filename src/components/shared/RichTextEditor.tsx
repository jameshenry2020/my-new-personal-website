"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Code, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Type here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none text-xs font-sans min-h-[250px] max-h-[500px] overflow-y-auto focus:outline-none bg-bg-paper p-4 border border-t-0 border-border-paper",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-border-paper p-4 text-xs font-mono text-muted-paper">
        Loading editor engine...
      </div>
    );
  }

  const toggleHeading = (level: 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="w-full flex flex-col">
      {/* Editorial Menu Bar */}
      <div className="flex flex-wrap items-center gap-1 bg-card-paper p-2 border border-border-paper border-b-0">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 border ${
            editor.isActive("bold") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Bold"
        >
          <Bold size={13} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 border ${
            editor.isActive("italic") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Italic"
        >
          <Italic size={13} />
        </button>

        {/* Inline Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 border ${
            editor.isActive("code") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Code"
        >
          <Code size={13} />
        </button>

        <span className="w-px h-4 bg-border-paper mx-1" />

        {/* H2 */}
        <button
          type="button"
          onClick={() => toggleHeading(2)}
          className={`p-1.5 border ${
            editor.isActive("heading", { level: 2 }) ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Heading 2"
        >
          <Heading2 size={13} />
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => toggleHeading(3)}
          className={`p-1.5 border ${
            editor.isActive("heading", { level: 3 }) ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Heading 3"
        >
          <Heading3 size={13} />
        </button>

        <span className="w-px h-4 bg-border-paper mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 border ${
            editor.isActive("bulletList") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Bullet List"
        >
          <List size={13} />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 border ${
            editor.isActive("orderedList") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={13} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 border ${
            editor.isActive("blockquote") ? "border-copper text-copper bg-bg-paper" : "border-transparent text-muted-paper hover:text-fg-ink"
          }`}
          title="Blockquote"
        >
          <Quote size={13} />
        </button>

        <span className="w-px h-4 bg-border-paper mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 border border-transparent text-muted-paper hover:text-fg-ink"
          title="Undo"
        >
          <Undo size={13} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 border border-transparent text-muted-paper hover:text-fg-ink"
          title="Redo"
        >
          <Redo size={13} />
        </button>
      </div>

      {/* Content Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
