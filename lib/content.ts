import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

export type Category = 'memo' | 'outlines' | 'slides' | 'speaker-notes';

export type DocSummary = {
  slug: string;
  category: Category;
  title: string;
  data: Record<string, unknown>;
};

export type Doc = DocSummary & {
  html: string;
  raw: string;
};

const root = path.join(process.cwd(), 'content');

function deriveTitle(data: Record<string, unknown>, content: string, fallback: string): string {
  if (typeof data.title === 'string' && data.title.length > 0) return data.title;
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1].trim() ?? fallback;
}

export async function loadDoc(category: Category, slug: string): Promise<Doc> {
  const file = path.join(root, category, `${slug}.md`);
  const raw = await fs.readFile(file, 'utf8');
  const { data, content } = matter(raw);
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  return {
    slug,
    category,
    title: deriveTitle(data, content, slug),
    data,
    html: String(processed),
    raw,
  };
}

export async function listDocs(category: Category): Promise<DocSummary[]> {
  const dir = path.join(root, category);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const docs = await Promise.all(
    entries
      .filter((f) => f.endsWith('.md'))
      .map(async (f) => {
        const slug = f.replace(/\.md$/, '');
        const raw = await fs.readFile(path.join(dir, f), 'utf8');
        const { data, content } = matter(raw);
        return {
          slug,
          category,
          title: deriveTitle(data, content, slug),
          data,
        } satisfies DocSummary;
      })
  );
  return docs.sort((a, b) => a.slug.localeCompare(b.slug));
}
