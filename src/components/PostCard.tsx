import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: "blog" | "diary";
  coverImage?: string | null;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  date,
  tags,
  category,
  coverImage,
}: PostCardProps) {
  return (
    <Link href={`/${category}/${slug}`} className="group block">
      <article className="py-8 border-b border-border last:border-0 transition-colors">
        {coverImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={coverImage.startsWith("http")}
            />
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <time className="text-sm text-muted">{date}</time>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-gray-100 text-muted rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
          {title}
        </h2>
        <p className="text-muted leading-relaxed">{excerpt}</p>
      </article>
    </Link>
  );
}
