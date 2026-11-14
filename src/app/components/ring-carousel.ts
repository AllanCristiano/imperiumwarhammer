import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Faction } from '../data/factions';
import { MotionService } from '../core/motion.service';
import { Emblem3dComponent } from './emblem-3d';

/**
 * Carrossel em anel 3D (CSS preserve-3d). Raio calculado a partir da largura real
 * (ResizeObserver), arraste por pointer events com inércia de encaixe, teclado,
 * autoplay que pausa na interação e quando sai da tela.
 */
@Component({
  selector: 'app-ring-carousel',
  imports: [Emblem3dComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'region',
    'aria-roledescription': 'carrossel',
    'aria-label': 'Facções do Imperium',
    tabindex: '0',
    '[class.dragging]': 'dragging()',
    '[style.--radius]': 'radius() + "px"',
    '[style.--card]': 'cardW() + "px"',
    '(keydown.arrowleft)': 'go(-1)',
    '(keydown.arrowright)': 'go(1)',
    '(pointerdown)': 'down($event)',
  },
  templateUrl: './ring-carousel.html',
  styleUrl: './ring-carousel.scss',
})
export class RingCarouselComponent {
  readonly factions = input.required<readonly Faction[]>();

  private readonly router = inject(Router);
  private readonly motion = inject(MotionService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly index = signal(0);
  protected readonly dragDeg = signal(0);
  protected readonly dragging = signal(false);
  protected readonly cardW = signal(200);

  protected readonly step = computed(() => 360 / this.factions().length);
  protected readonly radius = computed(() =>
    Math.round((this.cardW() / 2 / Math.tan(Math.PI / this.factions().length)) * 1.12),
  );
  protected readonly rotation = computed(() => -this.index() * this.step() + this.dragDeg());
  protected readonly active = computed(() => {
    const n = this.factions().length;
    return ((this.index() % n) + n) % n;
  });
  protected readonly current = computed(() => this.factions()[this.active()]);

  private moved = false;
  private idleUntil = 0;
  private visible = true;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(([e]) => {
        const w = e?.contentRect.width ?? 360;
        this.cardW.set(Math.round(Math.min(240, Math.max(150, w * 0.46))));
      });
      ro.observe(this.el);

      const io = new IntersectionObserver(([e]) => (this.visible = !!e?.isIntersecting));
      io.observe(this.el);

      const timer = setInterval(() => {
        if (!this.visible || this.dragging() || this.motion.reduced() || Date.now() < this.idleUntil) return;
        this.index.update((i) => i + 1);
      }, 4200);

      destroyRef.onDestroy(() => {
        ro.disconnect();
        io.disconnect();
        clearInterval(timer);
      });
    });
  }

  go(delta: number): void {
    this.idleUntil = Date.now() + 8000;
    this.index.update((i) => i + delta);
  }

  select(i: number, f: Faction, ev: MouseEvent): void {
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button === 1) return; // nova aba nativa
    ev.preventDefault();
    if (this.moved) return;
    if (i === this.active()) {
      this.router.navigate(['/faccao', f.slug]);
      return;
    }
    this.goTo(i);
  }

  /** Gira pelo menor caminho até o índice. */
  goTo(i: number): void {
    const n = this.factions().length;
    let d = i - this.active();
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    this.go(d);
  }

  protected down(e: PointerEvent): void {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const degPerPx = this.step() / (this.cardW() * 0.9);
    this.moved = false;
    this.idleUntil = Date.now() + 8000;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!this.moved && Math.abs(dx) > 6) {
        this.moved = true;
        this.dragging.set(true);
      }
      if (this.moved) this.dragDeg.set(dx * degPerPx);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (this.moved) {
        const steps = Math.round(this.dragDeg() / this.step());
        this.index.update((i) => i - steps);
        this.dragDeg.set(0);
        this.dragging.set(false);
        // mantém "moved" até o click sintético passar
        setTimeout(() => (this.moved = false), 50);
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
}
