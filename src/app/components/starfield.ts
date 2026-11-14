import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { MotionService } from '../core/motion.service';
import { ThemeService } from '../core/theme.service';

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

/**
 * Campo estelar em perspectiva no <canvas> (Imaterium / dobra).
 * - Em cada troca de rota dispara um "salto de dobra" (estrelas viram riscos).
 * - Suaviza ponteiro/giroscópio e publica --px/--py no :root para o parallax CSS.
 * - Pausa quando a aba está oculta e respeita prefers-reduced-motion.
 */
@Component({
  selector: 'app-starfield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #cv></canvas>`,
  styles: `
    :host { position: fixed; inset: 0; z-index: -1; pointer-events: none;
      background:
        radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--fc) 40%, transparent), transparent 60%),
        radial-gradient(80% 60% at 80% -10%, color-mix(in oklab, var(--fa) 14%, transparent), transparent 60%),
        #050507;
      transition: background 1.2s ease;
    }
    canvas { width: 100%; height: 100%; display: block; }
  `,
})
export class StarfieldComponent {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private readonly motion = inject(MotionService);
  private readonly theme = inject(ThemeService);
  private readonly root = inject(DOCUMENT).documentElement;

  private boost = 0;
  private tint = '#e9c46a';

  constructor() {
    effect(() => {
      this.motion.warp();
      untracked(() => (this.boost = this.motion.reduced() ? 0 : 1));
    });
    effect(() => (this.tint = this.theme.palette().accent));

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.start(destroyRef));
  }

  private start(destroyRef: DestroyRef): void {
    const cv = this.canvas().nativeElement;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let px = 0;
    let py = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile-first: densidade proporcional à área, com teto.
      const count = Math.min(520, Math.round((w * h) / 2600));
      stars = Array.from({ length: count }, () => this.spawn(w, h, Math.random()));
    };

    const frame = () => {
      const reduced = this.motion.reduced();
      const p = this.motion.pointer();
      px += (p.x - px) * 0.06;
      py += (p.y - py) * 0.06;
      this.root.style.setProperty('--px', px.toFixed(3));
      this.root.style.setProperty('--py', py.toFixed(3));

      this.boost *= 0.965;
      const speed = reduced ? 0 : 0.0016 + this.boost * 0.045;
      const cx = w / 2 - px * 40;
      const cy = h / 2 - py * 40;
      const f = Math.max(w, h) * 0.5;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0.02) Object.assign(s, this.spawn(w, h, 1));

        const sx = cx + (s.x / s.z) * f;
        const sy = cy + (s.y / s.z) * f;
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          Object.assign(s, this.spawn(w, h, 1));
          continue;
        }
        const ox = cx + (s.x / s.pz) * f;
        const oy = cy + (s.y / s.pz) * f;
        const a = Math.min(1, (1 - s.z) * 1.4);
        const size = Math.max(0.4, (1 - s.z) * 2.2);

        ctx.strokeStyle = this.boost > 0.08 && s.z < 0.6 ? this.tint : `rgba(240,232,214,${a.toFixed(3)})`;
        ctx.globalAlpha = a;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(sx + 0.1, sy + 0.1);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', onVisibility);

    destroyRef.onDestroy(() => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  private spawn(w: number, h: number, z: number): Star {
    const ratio = w / Math.max(h, 1);
    return {
      x: (Math.random() * 2 - 1) * Math.max(1, ratio),
      y: (Math.random() * 2 - 1) * Math.max(1, 1 / ratio),
      z: z * 0.98 + 0.02,
      pz: z,
    };
  }
}
