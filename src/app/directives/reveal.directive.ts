import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';

/** Revela o elemento quando entra na viewport. `appReveal="200"` define o atraso em ms. */
@Directive({
  selector: '[appReveal]',
  exportAs: 'reveal',
  host: {
    class: 'reveal',
    '[class.is-visible]': 'visible()',
    '[style.--delay]': 'delay() + "ms"',
  },
})
export class RevealDirective {
  readonly delay = input(0, { alias: 'appReveal', transform: (v: unknown) => numberAttribute(v, 0) });
  readonly threshold = input(0.2);
  readonly revealed = output<void>();
  readonly visible = signal(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          this.visible.set(true);
          this.revealed.emit();
          io.disconnect();
        },
        { threshold: this.threshold(), rootMargin: '0px 0px -8% 0px' },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
