import { prisma } from "@/lib/prisma";
import { getMarkdownPosts } from "@/lib/markdown";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diary - Jinxing Blog",
  description: "Personal reflections, literary explorations, and musings on life.",
};

export default async function DiaryPage() {
  const dbPosts = await prisma.post.findMany({
    where: { category: "diary", published: true },
    orderBy: { createdAt: "desc" },
  });

  const mdPosts = getMarkdownPosts("diary");

  const allPosts = [...dbPosts, ...mdPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-6">
      <section className="py-16 md:py-20">
        <h1 className="text-3xl font-bold mb-2">Diary</h1>
        <p className="text-muted mb-12">
          Personal reflections, literary explorations, and thoughts on life
          beyond the screen.
        </p>

        {allPosts.length === 0 ? (
          <p className="text-muted py-12 text-center">
            Entries coming soon. Stay tuned.
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
                category="diary"
                coverImage={post.coverImage}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
