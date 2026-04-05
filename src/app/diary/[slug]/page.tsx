import { safeDbQuery } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { getMarkdownPostBySlug } from "@/lib/markdown";
import { notFound } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import Image from "next/image";

async function getPost(slug: string) {
  const dbPost = await safeDbQuery(async () => {
    const { data } = await supabase
      .from("posts")
      .select()
      .eq("slug", slug)
      .eq("category", "diary")
      .single();
    if (!data) return null;
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags,
      coverImage: data.cover_image,
      createdAt: data.created_at,
    };
  }, null);

  if (dbPost) return dbPost;
  return await getMarkdownPostBySlug("diary", slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };
  return { title: `${post.title} - Jinxing Blog`, description: post.excerpt };
}

export default async function DiaryEntry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const tags = post.tags.split(",").filter(Boolean);
  const isMarkdown = post.id.startsWith("md-");

  return (
    <div className="max-w-3xl mx-auto px-6">
      <article className="py-16 md:py-20">
        <Link
          href="/diary"
          className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block"
        >
          &larr; Back to diary
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-muted">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {post.title}
          </h1>
        </header>

        {post.coverImage && (
          <div className="relative w-full h-64 md:h-80 mb-10 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              unoptimized={post.coverImage.startsWith("http")}
            />
          </div>
        )}

        <div
          className="prose text-foreground/85"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {!isMarkdown && <CommentSection postId={post.id} />}
      </article>
    </div>
  );
}
