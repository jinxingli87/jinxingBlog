import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  const userIds = [...new Set((comments || []).map((c) => c.user_id))];
  const { data: users } = userIds.length
    ? await supabase.from("users").select("id, name, image").in("id", userIds)
    : { data: [] };

  const userMap = new Map((users || []).map((u) => [u.id, u]));

  const formatted = (comments || []).map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.created_at,
    user: userMap.get(c.user_id) || null,
  }));

  return NextResponse.json(formatted);
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

  // Ensure user exists in DB (for Google OAuth users who haven't been stored yet)
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", session.user.id)
    .single();

  let userId = session.user.id;

  if (!existingUser) {
    const { data: userByEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email!)
      .single();

    if (userByEmail) {
      userId = userByEmail.id;
    } else {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          name: session.user.name,
          email: session.user.email!,
          image: session.user.image,
        })
        .select("id")
        .single();
      if (newUser) userId = newUser.id;
    }
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({ content: content.trim(), post_id: postId, user_id: userId })
    .select("id, content, created_at, user_id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, name, image")
    .eq("id", userId)
    .single();

  return NextResponse.json(
    { ...comment, createdAt: comment.created_at, user },
    { status: 201 }
  );
}
