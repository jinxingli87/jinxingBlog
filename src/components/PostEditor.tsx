"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  published: boolean;
}

const defaultPost: PostData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "blog",
  tags: "",
  coverImage: "",
  published: true,
};

export default function PostEditor({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const [post, setPost] = useState<PostData>(initial || defaultPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initial?.id;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setPost((p) => ({
      ...p,
      title,
      ...(!isEdit && { slug: slugify(title) }),
    }));
  };

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        exec("insertImage", data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleInsertUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) exec("insertImage", url);
  };

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || "";
    setSaving(true);
    setError("");

    const body = { ...post, content };
    const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to save");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit post" : "New post"}
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
            placeholder="Post title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Slug</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => setPost((p) => ({ ...p, slug: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
            placeholder="url-friendly-slug"
          />
        </div>

        {/* Category + Tags row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={post.category}
              onChange={(e) =>
                setPost((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition bg-white"
            >
              <option value="blog">Blog</option>
              <option value="diary">Diary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tags{" "}
              <span className="text-muted font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={post.tags}
              onChange={(e) => setPost((p) => ({ ...p, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
              placeholder="AI, Technology"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt</label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost((p) => ({ ...p, excerpt: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition resize-none"
            placeholder="Brief summary of the post..."
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Cover image URL{" "}
            <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={post.coverImage}
            onChange={(e) =>
              setPost((p) => ({ ...p, coverImage: e.target.value }))
            }
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
            placeholder="https://... or /uploads/..."
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Content</label>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border border-border border-b-0 rounded-t-lg bg-gray-50/80">
            <ToolbarBtn onClick={() => exec("bold")} title="Bold">
              <strong>B</strong>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => exec("italic")} title="Italic">
              <em>I</em>
            </ToolbarBtn>
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn
              onClick={() => exec("formatBlock", "h2")}
              title="Heading 2"
            >
              H2
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => exec("formatBlock", "h3")}
              title="Heading 3"
            >
              H3
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => exec("formatBlock", "p")}
              title="Paragraph"
            >
              P
            </ToolbarBtn>
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn
              onClick={() => exec("insertUnorderedList")}
              title="Bullet list"
            >
              &bull; List
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => exec("insertOrderedList")}
              title="Numbered list"
            >
              1. List
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => exec("formatBlock", "blockquote")}
              title="Blockquote"
            >
              &ldquo; Quote
            </ToolbarBtn>
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn onClick={handleFileSelect} title="Upload image">
              {uploading ? "Uploading..." : "Upload image"}
            </ToolbarBtn>
            <ToolbarBtn onClick={handleInsertUrl} title="Insert image URL">
              Image URL
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => {
                const url = prompt("Enter link URL:");
                if (url) exec("createLink", url);
              }}
              title="Insert link"
            >
              Link
            </ToolbarBtn>
          </div>

          {/* Editable area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[400px] px-4 py-3 border border-border rounded-b-lg bg-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: initial?.content || "",
            }}
            onDrop={(e) => {
              const files = e.dataTransfer.files;
              if (files.length > 0 && files[0].type.startsWith("image/")) {
                e.preventDefault();
                handleImageUpload(files[0]);
              }
            }}
            onPaste={(e) => {
              const items = e.clipboardData.items;
              for (const item of items) {
                if (item.type.startsWith("image/")) {
                  e.preventDefault();
                  const file = item.getAsFile();
                  if (file) handleImageUpload(file);
                  return;
                }
              }
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={post.published}
            onChange={(e) =>
              setPost((p) => ({ ...p, published: e.target.checked }))
            }
            className="w-4 h-4 rounded border-border accent-accent"
          />
          <span className="text-sm font-medium">Published</span>
        </label>

        {/* Save */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving || !post.title || !post.slug}
            className="px-6 py-2.5 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {saving ? "Saving..." : isEdit ? "Update post" : "Create post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="px-2 py-1 text-xs text-muted hover:text-foreground hover:bg-white rounded transition"
    >
      {children}
    </button>
  );
}
