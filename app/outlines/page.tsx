import Link from 'next/link';
import { listDocs } from '@/lib/content';

export default async function OutlinesIndexPage() {
  const docs = await listDocs('outlines');
  return (
    <article className="prose">
      <h1>Outlines</h1>
      <ul>
        {docs.map((d) => (
          <li key={d.slug}>
            <Link href={`/outlines/${d.slug}/`}>{d.title}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
