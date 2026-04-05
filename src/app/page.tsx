import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <p className="text-sm text-accent font-medium mb-4 tracking-wide uppercase">
          Welcome
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Hi, I&apos;m Jinxing.
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl mb-8">
          I&apos;m a curious mind passionate about the intersection of
          artificial intelligence and human creativity. This is my personal
          space where I share what I&apos;ve learned, my thoughts, and insights
          &mdash; especially those related to the rapid advancement of AI.
        </p>
        <div className="flex gap-4">
          <Link
            href="/blog"
            className="px-6 py-2.5 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-foreground/80 transition"
          >
            Read the blog
          </Link>
          <Link
            href="/diary"
            className="px-6 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-card-hover transition"
          >
            Browse diary
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-16 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">About me</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              I believe we&apos;re living through one of the most transformative
              periods in human history. AI is reshaping how we think, work, and
              create. Through this blog, I document my journey of understanding
              these changes.
            </p>
            <p>
              My writing spans technical deep-dives into machine learning and
              AI systems, reflections on technology&apos;s impact on society,
              and personal musings on life, literature, and the human condition.
            </p>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              When I&apos;m not exploring the latest developments in AI, you
              can find me reading, writing, or contemplating the bigger
              questions in life.
            </p>
            <p>
              Feel free to explore, leave a comment, and join the conversation.
              I&apos;d love to connect with fellow thinkers and learners.
            </p>
          </div>
        </div>
      </section>

      {/* What you'll find */}
      <section className="py-16 border-t border-border">
        <h2 className="text-2xl font-semibold mb-8">What you&apos;ll find here</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/blog"
            className="group p-6 border border-border rounded-xl hover:border-foreground/20 transition"
          >
            <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
              Blog
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Technical articles on AI, machine learning, software engineering,
              and emerging technologies. Deep dives and practical insights.
            </p>
          </Link>
          <Link
            href="/diary"
            className="group p-6 border border-border rounded-xl hover:border-foreground/20 transition"
          >
            <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
              Diary
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Personal reflections, literary explorations, book reviews, and
              thoughts on life beyond the screen.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
