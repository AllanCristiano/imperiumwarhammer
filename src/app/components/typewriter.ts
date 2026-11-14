import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MotionService } from '../core/motion.service';

/** Digita o texto quando visível; reinicia sozinho se o texto mudar (signals + effect). */
@Component({
  selector: 'app-typewriter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-label]': 'text()' },
  template: `<span aria-hidden="true">{{ shown() }}</span><span class="caret" aria-hidden="true" [class.idle]="done()">▍</span>`,
  styles: `
    :host { display: inline; }
    .caret { color: var(--fa); margin-left: 2px; animation: b .7s steps(1) infinite; }
    .caret.idle { opacity: .5; }
    @keyframes b { 50% { opacity: 0; } }
  `,
})
export class TypewriterComponent {
  readonly text = input.required<string>();
  readonly speed = input(32);

  private readonly count = signal(0);
  private readonly inView = signal(false);
  protected readonly shown = computed(() => this.text().slice(0, this.count()));
  protected readonly done = computed(() => this.count() >= this.text().length);

  constructor() {
    const motion = inject(MotionService);
    const el = inject(ElementRef).nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const io = new IntersectionObserver(([e]) => e?.isIntersecting && this.inView.set(true));
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });

    effect((onCleanup) => {
      const full = this.text();
      if (!this.inView()) return;
      if (motion.reduced()) {
        this.count.set(full.length);
        return;
      }
      this.count.set(0);
      const id = setInterval(() => {
        this.count.update((c) => c + 1);
        if (this.count() >= full.length) clearInterval(id);
      }, this.speed());
      onCleanup(() => clearInterval(id));
    });
  }
}
