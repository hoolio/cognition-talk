import { loadDoc } from '@/lib/content';

export default async function HomePage() {
  const doc = await loadDoc('memo', 'industrialization-of-cognition');
  return (
    <article className="prose">
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
