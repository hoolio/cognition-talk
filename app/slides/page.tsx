export default function SlidesPage() {
  return (
    <article className="prose">
      <h1>Slides</h1>
      <p>
        Slide deck is in flight. Drafts will land in <code>content/slides/</code>. The
        plan is a Reveal.js or Marp deck rendered from markdown so it can be exported
        to <code>.odp</code> via Pandoc + LibreOffice for offline editing.
      </p>
    </article>
  );
}
