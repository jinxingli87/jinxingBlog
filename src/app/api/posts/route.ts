import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*, comments(count)")
    .order("created_at", { ascending: false });

  const formatted = (posts || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    published: p.published,
    createdAt: p.created_at,
    coverImage: p.cover_image,
    _count: {
      comments: Array.isArray(p.comments) ? p.comments[0]?.count || 0 : 0,
    },
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, slug, excerpt, content, category, tags, coverImage, published } =
    await request.json();

  if (!title || !slug || !content || !category) {
    return NextResponse.json(
      { error: "Title, slug, content, and category are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 400 }
    );
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || "",
      content,
      category,
      tags: tags || "",
      cover_image: coverImage || null,
      published: published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json(post, { status: 201 });
}
