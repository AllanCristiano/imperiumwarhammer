import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute } from '@angular/core';
import { MotionService } from '../core/motion.service';

/** Conta de 0 até o valor quando entra na viewport (ease-out expo, formatação pt-BR). */
@Directive({ selector: '[appCounter]' })
export class CounterDirective {
  readonly target = input.required({ alias: 'appCounter', transform: numberAttribute });
  readonly duration = input(2200);
  readonly suffix = input('');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);
    const destroyRef = inject(DestroyRef);
    const fmt = new Intl.NumberFormat('pt-BR');
    let raf = 0;

    const render = (v: number) => (el.textContent = fmt.format(Math.round(v)) + this.suffix());

    afterNextRender(() => {
      render(0);
      const io = new IntersectionObserver(([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        if (motion.reduced()) {
          render(this.target());
          return;
        }
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / this.duration());
          render(this.target() * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, { threshold: 0.6 });
      io.observe(el);
      destroyRef.onDestroy(() => {
        io.disconnect();
        cancelAnimationFrame(raf);
      });
    });
  }
}
