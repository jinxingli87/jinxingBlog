import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
  }

  const { content, postId } = await request.json();

  if (!content?.trim() || !postId) {
    return NextResponse.json(
      { error: "Content and postId are required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
