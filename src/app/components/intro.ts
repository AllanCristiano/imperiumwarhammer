import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  output,
  signal,
} from '@angular/core';
import { MotionService } from '../core/motion.service';
import { GlyphComponent } from './glyph';

type Phase = 'boot' | 'title' | 'out';

/**
 * Abertura cinematográfica: barras de letterbox, transmissão astropática digitada,
 * revelação do título com varredura de luz e saída com zoom + salto de dobra.
 * Toque/clique/Esc pula a cena.
 */
@Component({
  selector: 'app-intro',
  imports: [GlyphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'dialog',
    'aria-label': 'Abertura',
    '[attr.data-phase]': 'phase()',
    '(click)': 'skip()',
    '(document:keydown.escape)': 'skip()',
  },
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class IntroComponent {
  readonly done = output<void>();

  protected readonly phase = signal<Phase>('boot');
  protected readonly lines = signal<string[]>([]);
  protected readonly title = [...'IMPERIUM'];

  private readonly motion = inject(MotionService);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private finished = false;

  private readonly script = [
    '+++ TRANSMISSÃO ASTROPÁTICA RECEBIDA +++',
    'ORIGEM: SANTA TERRA · SEGMENTUM SOLAR',
    'DATA: 0 999 M41 · NÍVEL DE AMEAÇA: EXTREMIS',
    'DECODIFICANDO REGISTROS DAS FORÇAS IMPERIAIS…',
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
    afterNextRender(() => (this.motion.reduced() ? this.finish() : this.play()));
  }

  private at(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms));
  }

  private play(): void {
    let t = 500;
    this.script.forEach((line, i) => {
      this.at(t, () => this.lines.update((l) => [...l, line]));
      t += 520 + i * 60;
    });
    this.at(t + 400, () => this.phase.set('title'));
    this.at(t + 3600, () => this.leave());
  }

  private leave(): void {
    if (this.phase() === 'out') return;
    this.phase.set('out');
    this.motion.jump();
    this.at(1100, () => this.finish());
  }

  protected skip(): void {
    this.timers.forEach(clearTimeout);
    this.leave();
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.done.emit();
  }
}
