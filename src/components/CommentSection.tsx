"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    if (res.ok) {
      setComments(await res.json());
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId }),
    });

    if (res.ok) {
      setContent("");
      fetchComments();
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h3 className="text-lg font-semibold mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none transition"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-5 py-2 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-muted">
            <Link
              href="/auth/signin"
              className="text-accent hover:text-accent-hover font-medium"
            >
              Sign in
            </Link>{" "}
            to join the conversation.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-muted shrink-0">
                {comment.user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.user.name || "Anonymous"}
                  </span>
                  <time className="text-xs text-muted">
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
