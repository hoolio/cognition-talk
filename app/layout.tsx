import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'The Industrialization of Cognition',
  description: 'Memo, outlines, and talk materials.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/" className="brand">Cognition Talk</Link>
            <div className="links">
              <Link href="/memo/">Memo</Link>
              <Link href="/critical-memo/">Critical</Link>
              <Link href="/outlines/">Outlines</Link>
              <Link href="/slides/">Slides</Link>
              <Link href="/speaker-notes/">Notes</Link>
              <Link href="/playground/">Playground</Link>
            </div>
          </nav>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <p>Source: <a href="https://github.com/hoolio/cognition-talk">github.com/hoolio/cognition-talk</a></p>
        </footer>
      </body>
    </html>
  );
}
