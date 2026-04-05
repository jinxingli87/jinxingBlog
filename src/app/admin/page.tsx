"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
  _count: { comments: number };
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="text-sm text-muted mt-1">Manage your posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-foreground/80 transition"
        >
          New post
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted text-center py-12">
          No posts yet. Create your first one.
        </p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {post.title}
                    </Link>
                    <span className="text-xs text-muted ml-2">
                      {post._count.comments > 0 &&
                        `${post._count.comments} comment${post._count.comments > 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted hidden md:table-cell">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.published
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-accent hover:text-accent-hover text-sm mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
