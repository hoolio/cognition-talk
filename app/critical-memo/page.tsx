import { loadDoc } from '@/lib/content';

export const metadata = {
  title: 'Critical memo — The Industrialization of Cognition',
};

export default async function CriticalMemoPage() {
  const doc = await loadDoc('critical-memo', 'critical-memo');
  return (
    <article className="prose">
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
