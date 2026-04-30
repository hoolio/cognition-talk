import { loadDoc, listDocs } from '@/lib/content';

export async function generateStaticParams() {
  const docs = await listDocs('outlines');
  return docs.map((d) => ({ slug: d.slug }));
}

export default async function OutlinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await loadDoc('outlines', slug);
  return (
    <article className="prose">
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
