import { DestroyRef, Directive, ElementRef, Renderer2, inject, input, numberAttribute } from '@angular/core';
import { MotionService } from '../core/motion.service';

/**
 * Inclinação 3D com reflexo de luz. Escreve variáveis CSS direto no elemento
 * (via Renderer2.listen), sem passar por detecção de mudanças.
 * Expõe --rx, --ry (graus) e --gx, --gy (posição do brilho em %).
 */
@Directive({ selector: '[appTilt]', host: { class: 'tilt' } })
export class TiltDirective {
  readonly max = input(12, { alias: 'appTilt', transform: (v: unknown) => numberAttribute(v, 12) });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const r = inject(Renderer2);
    const motion = inject(MotionService);
    let frame = 0;

    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const m = this.max();
        el.style.setProperty('--rx', `${(-y * m).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * m).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };

    const offMove = r.listen(el, 'pointermove', (e: PointerEvent) => {
      if (motion.reduced()) return;
      const b = el.getBoundingClientRect();
      set((e.clientX - b.left) / b.width - 0.5, (e.clientY - b.top) / b.height - 0.5);
    });
    const offLeave = r.listen(el, 'pointerleave', () => set(0, 0));

    inject(DestroyRef).onDestroy(() => {
      offMove();
      offLeave();
      cancelAnimationFrame(frame);
    });
  }
}
