import { safeDbQuery, prisma } from "@/lib/db";
import { getMarkdownPosts } from "@/lib/markdown";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog - Jinxing Blog",
  description: "Articles on AI, machine learning, and technology.",
};

export default async function BlogPage() {
  const dbPosts = await safeDbQuery(
    () =>
      prisma.post.findMany({
        where: { category: "blog", published: true },
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  const mdPosts = getMarkdownPosts("blog");

  const allPosts = [...dbPosts, ...mdPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-6">
      <section className="py-16 md:py-20">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted mb-12">
          Technical articles on AI, software engineering, and emerging
          technologies.
        </p>

        {allPosts.length === 0 ? (
          <p className="text-muted py-12 text-center">
            Posts coming soon. Stay tuned.
          </p>
        ) : (
          <div>
            {allPosts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                tags={post.tags.split(",").filter(Boolean)}
                category="blog"
                coverImage={post.coverImage}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
