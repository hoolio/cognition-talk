import { loadDoc } from '@/lib/content';

export default async function MemoPage() {
  const doc = await loadDoc('memo', 'industrialization-of-cognition');
  return (
    <article className="prose">
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
