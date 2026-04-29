'use client';

import { useEffect, useRef, useState } from 'react';
import type { Runtime as RuntimeType } from '@observablehq/runtime';

type DefineFn = (runtime: unknown, observer: (name: string) => unknown) => unknown;

export type ObservableEmbedProps = {
  /**
   * Notebook identifier as used by api.observablehq.com — for published notebooks
   * use the slug like "@d3/disjoint-force-directed-graph"; for unlisted notebooks
   * use the form "d/<id>".
   */
  notebook: string;
  /** Cell names to render, in order. */
  cells: string[];
  /** Notebook version pin. Default 4 — bump when the upstream notebook changes. */
  version?: number;
  /** Optional caption rendered below the embed. */
  caption?: string;
  className?: string;
};

export function ObservableEmbed({
  notebook,
  cells,
  version = 4,
  caption,
  className,
}: ObservableEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let runtime: RuntimeType | null = null;
    let cancelled = false;

    (async () => {
      try {
        const url = `https://api.observablehq.com/${notebook}.js?v=${version}`;
        const [{ Runtime, Inspector }, mod] = await Promise.all([
          import('@observablehq/runtime'),
          import(/* webpackIgnore: true */ /* @vite-ignore */ url) as Promise<{
            default: DefineFn;
          }>,
        ]);

        if (cancelled) return;

        container.innerHTML = '';
        const targets = new Map<string, HTMLDivElement>();
        for (const name of cells) {
          const div = document.createElement('div');
          div.dataset.cell = name;
          container.appendChild(div);
          targets.set(name, div);
        }

        runtime = new Runtime();
        runtime.module(mod.default, (name: string) => {
          const target = targets.get(name);
          if (target) return new Inspector(target);
          return undefined;
        });

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      runtime?.dispose();
      if (container) container.innerHTML = '';
    };
  }, [notebook, cells.join(','), version]);

  return (
    <figure className={className ? `observable-embed ${className}` : 'observable-embed'}>
      {loading && !error && <div className="observable-embed__loading">Loading…</div>}
      {error && (
        <div className="observable-embed__error">
          Failed to load <code>{notebook}</code>: {error}
        </div>
      )}
      <div ref={containerRef} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
