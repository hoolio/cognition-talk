import { ObservableEmbed } from '@/components/ObservableEmbed';

export const metadata = {
  title: 'Playground — Observable embeds',
};

export default function PlaygroundPage() {
  return (
    <article className="prose">
      <h1>Playground</h1>
      <p className="lede">
        A working proof-of-concept for embedding Observable notebook cells inside
        this site. The embed below loads a public d3 notebook at runtime via
        <code> @observablehq/runtime</code>; replace it with your own notebook id
        once you author one.
      </p>

      <h2>Disjoint force-directed graph</h2>
      <p>
        Source: <a href="https://observablehq.com/@d3/disjoint-force-directed-graph">
          @d3/disjoint-force-directed-graph
        </a>. Showing the <code>chart</code> cell.
      </p>
      <ObservableEmbed
        notebook="@d3/disjoint-force-directed-graph"
        cells={['chart']}
        version={4}
        caption="Live cell from the d3 notebook, hydrated client-side."
      />

      <h2>How to embed your own</h2>
      <ol>
        <li>Author a notebook on <a href="https://observablehq.com">observablehq.com</a> and publish it (Public).</li>
        <li>Copy its slug from the URL — e.g., <code>@hoolio/seven-factor-matrix</code>.</li>
        <li>Note the cell names you want to render (e.g., <code>chart</code>, <code>table</code>).</li>
        <li>
          Drop the component into any page:
          <pre><code>{`<ObservableEmbed notebook="@hoolio/seven-factor-matrix" cells={['chart']} />`}</code></pre>
        </li>
      </ol>
      <p>
        See <code>CLAUDE.md</code> for the full embed workflow and gotchas.
      </p>
    </article>
  );
}
