import Link from 'next/link';
import { listDocs } from '@/lib/content';

export default async function HomePage() {
  const outlines = await listDocs('outlines');
  return (
    <article className="prose">
      <h1>The Industrialization of Cognition</h1>
      <p className="lede">
        A theoretical reconstruction of the AI transition, with implications for capital
        allocation. Memo, talk outlines, slides, and speaker notes.
      </p>
      <section>
        <h2>Memo</h2>
        <ul>
          <li><Link href="/memo/">The Industrialization of Cognition (full memo)</Link></li>
        </ul>
      </section>
      <section>
        <h2>Outlines</h2>
        <ul>
          {outlines.map((d) => (
            <li key={d.slug}>
              <Link href={`/outlines/${d.slug}/`}>{d.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Coming soon</h2>
        <ul>
          <li><Link href="/slides/">Slides</Link></li>
          <li><Link href="/speaker-notes/">Speaker notes</Link></li>
        </ul>
      </section>
    </article>
  );
}
