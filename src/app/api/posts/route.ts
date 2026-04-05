import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });
  return NextResponse.json(posts);
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

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || "",
      content,
      category,
      tags: tags || "",
      coverImage: coverImage || null,
      published: published ?? true,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
