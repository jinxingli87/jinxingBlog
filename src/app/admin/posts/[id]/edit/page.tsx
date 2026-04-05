"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-muted">Post not found.</p>
      </div>
    );
  }

  return <PostEditor initial={post} />;
}
