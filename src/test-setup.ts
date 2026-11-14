/**
 * Polyfills para o ambiente jsdom dos testes.
 * jsdom não implementa matchMedia nem IntersectionObserver, que o app usa em vários lugares.
 */

type IOCallback = (entries: Partial<IntersectionObserverEntry>[], observer: unknown) => void;

/** IntersectionObserver falso: os testes disparam a interseção com `MockIntersectionObserver.trigger()`. */
export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly targets = new Set<Element>();
  disconnected = false;

  constructor(private readonly callback: IOCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  observe(el: Element): void {
    this.targets.add(el);
  }
  unobserve(el: Element): void {
    this.targets.delete(el);
  }
  disconnect(): void {
    this.disconnected = true;
    this.targets.clear();
  }
  takeRecords(): [] {
    return [];
  }

  /** Simula todos os elementos observados entrando (ou saindo) da viewport. */
  static trigger(isIntersecting = true): void {
    for (const io of [...MockIntersectionObserver.instances]) {
      if (io.disconnected) continue;
      for (const target of [...io.targets]) io.callback([{ isIntersecting, target }], io);
    }
  }

  static reset(): void {
    MockIntersectionObserver.instances = [];
  }
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  configurable: true,
  writable: true,
  value: MockIntersectionObserver,
});

/** Permite que cada teste escolha se o usuário prefere movimento reduzido. */
export const mediaState = { reducedMotion: false };

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? mediaState.reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

if (!('ResizeObserver' in globalThis)) {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}

beforeEach(() => {
  MockIntersectionObserver.reset();
  mediaState.reducedMotion = false;
  sessionStorage.clear();
});
