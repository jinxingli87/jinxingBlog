import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface MarkdownPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "blog" | "diary";
  tags: string;
  coverImage: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  source: "md";
}

const contentDir = path.join(process.cwd(), "content");

function getMarkdownDir(category: "blog" | "diary") {
  return path.join(contentDir, category);
}

export function getMarkdownPosts(category: "blog" | "diary"): MarkdownPost[] {
  const dir = getMarkdownDir(category);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      const createdAt = data.date ? new Date(data.date) : new Date();

      return {
        id: `md-${category}-${slug}`,
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        content: "",
        category,
        tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
        coverImage: data.coverImage || null,
        published: data.published !== false,
        createdAt,
        updatedAt: createdAt,
        source: "md" as const,
      };
    })
    .filter((p) => p.published);
}

export async function getMarkdownPostBySlug(
  category: "blog" | "diary",
  slug: string
): Promise<MarkdownPost | null> {
  const filePath = path.join(getMarkdownDir(category), `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(fileContent);

  const result = await remark().use(html, { sanitize: false }).process(rawContent);
  const htmlContent = result.toString();

  const createdAt = data.date ? new Date(data.date) : new Date();

  return {
    id: `md-${category}-${slug}`,
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    content: htmlContent,
    category,
    tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
    coverImage: data.coverImage || null,
    published: data.published !== false,
    createdAt,
    updatedAt: createdAt,
    source: "md",
  };
}
