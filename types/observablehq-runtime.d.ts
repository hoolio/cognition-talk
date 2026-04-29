declare module '@observablehq/runtime' {
  type DefineFn = (runtime: unknown, observer: (name: string) => unknown) => unknown;

  export class Runtime {
    constructor(builtins?: unknown);
    module(define: DefineFn, observer?: (name: string) => unknown): unknown;
    dispose(): void;
  }

  export class Inspector {
    constructor(target: HTMLElement);
    static into(target: string | HTMLElement): (name: string) => Inspector;
    pending(): void;
    fulfilled(value: unknown, name: string): void;
    rejected(error: unknown, name: string): void;
  }
}
