import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

const clamp = (v: number, min = -1, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Estado global de movimento: preferências de acessibilidade, ponteiro / giroscópio
 * normalizado (-1..1) e o "salto de dobra" disparado em cada transição de rota.
 * Os listeners são nativos (fora do template) para não disparar detecção de mudanças.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly doc = inject(DOCUMENT);

  readonly reduced = signal(false);
  readonly pointer = signal({ x: 0, y: 0 });
  readonly warp = signal(0);

  constructor() {
    const win = this.doc.defaultView;
    if (!win) return;

    const mq = win.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced.set(mq.matches);
    mq.addEventListener('change', (e) => this.reduced.set(e.matches));

    win.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        this.pointer.set({
          x: clamp((e.clientX / win.innerWidth) * 2 - 1),
          y: clamp((e.clientY / win.innerHeight) * 2 - 1),
        });
      },
      { passive: true },
    );

    // Mobile-first: o giroscópio substitui o mouse quando disponível.
    win.addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma == null || e.beta == null) return;
        this.pointer.set({ x: clamp(e.gamma / 30), y: clamp((e.beta - 45) / 30) });
      },
      { passive: true },
    );
  }

  jump(): void {
    this.warp.update((v) => v + 1);
  }
}
