import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Glyph } from '../data/factions';

export type GlyphName = Glyph | 'aquila';

/** Gera um polígono de engrenagem (centro 50,50) para o Mechanicus. */
function cog(teeth: number, rOut: number, rIn: number): string {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners: [number, number][] = [
      [a - step * 0.22, rIn],
      [a - step * 0.14, rOut],
      [a + step * 0.14, rOut],
      [a + step * 0.22, rIn],
      [a + step * 0.5, rIn],
    ];
    for (const [ang, rad] of corners) {
      pts.push(`${(50 + Math.cos(ang) * rad).toFixed(2)} ${(50 + Math.sin(ang) * rad).toFixed(2)}`);
    }
  }
  return `M${pts.join(' L')} Z`;
}

/** Penas da asa esquerda da águia, geradas proceduralmente. */
const FEATHERS = Array.from({ length: 6 }, (_, k) => {
  const rootY = 38 + k * 4;
  const tipX = 3 + k * 5.5;
  const tipY = 20 + k * 9;
  return `M47 ${rootY} L${tipX} ${tipY} L${tipX + 9} ${tipY + 5} L47 ${rootY + 5} Z`;
}).join(' ');

const ring = (r: number, cy = 50) =>
  `M${50 - r} ${cy} A${r} ${r} 0 1 0 ${50 + r} ${cy} A${r} ${r} 0 1 0 ${50 - r} ${cy} Z`;

/** Símbolos originais e estilizados (geometria própria, não são logotipos oficiais). */
@Component({
  selector: 'app-glyph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host { display: block; width: 100%; height: 100%; }
    svg { width: 100%; height: 100%; display: block; overflow: visible; }
  `,
  template: `
    <svg viewBox="0 0 100 100" fill="currentColor" fill-rule="evenodd">
      @switch (name()) {
        @case ('aquila') {
          <path [attr.d]="feathers" />
          <path [attr.d]="feathers" transform="matrix(-1 0 0 1 100 0)" />
          <path d="M47 37 C44 28 40 21 32 21 L25 24 L33 27 C37 29 40 33 42 41 Z" />
          <path d="M53 37 C56 28 60 21 68 21 L75 24 L67 27 C63 29 60 33 58 41 Z" />
          <path d="M45 32 L55 32 L57 50 L50 80 L43 50 Z" />
          <path d="M43 70 L50 94 L57 70 L50 76 Z" />
        }
        @case ('astartes') {
          <path
            d="M50 6 L84 17 L80 56 C76 76 62 88 50 95 C38 88 24 76 20 56 L16 17 Z
               M47 20 L53 20 L53 61 L63 61 L63 67 L53 67 L53 79 L50 86 L47 79 L47 67 L37 67 L37 61 L47 61 Z" />
        }
        @case ('custodes') {
          <path [attr.d]="halo" />
          <path d="M48 4 L52 4 L57 24 L52 30 L52 96 L48 96 L48 30 L43 24 Z" />
          <path d="M30 60 L48 66 L48 72 L26 64 Z M70 60 L52 66 L52 72 L74 64 Z" />
        }
        @case ('militarum') {
          <path d="M50 4 L53.5 13 L63 13 L55.5 19 L58.5 28 L50 22.5 L41.5 28 L44.5 19 L37 13 L46.5 13 Z" />
          <path d="M12 36 L50 56 L88 36 L88 48 L50 68 L12 48 Z" />
          <path d="M12 58 L50 78 L88 58 L88 70 L50 90 L12 70 Z" />
        }
        @case ('mechanicus') {
          <path [attr.d]="cogPath" />
          <path d="M44 40 L56 40 L56 47 L62 47 L62 53 L56 53 L56 64 L44 64 L44 53 L38 53 L38 47 L44 47 Z" />
        }
        @case ('sororitas') {
          <path d="M50 6 C61 21 63 38 50 56 C37 38 39 21 50 6 Z" />
          <path d="M47 53 C34 60 13 52 15 31 C23 41 34 45 45 44 Z" />
          <path d="M53 53 C66 60 87 52 85 31 C77 41 66 45 55 44 Z" />
          <path d="M28 57 L72 57 L72 64 L28 64 Z" />
          <path d="M45 64 L55 64 L59 84 L50 94 L41 84 Z" />
        }
        @case ('inquisicao') {
          <path d="M30 6 L70 6 L70 17 L57 17 L57 83 L70 83 L70 94 L30 94 L30 83 L43 83 L43 17 L30 17 Z" />
          <path d="M10 44 L38 44 L38 54 L10 54 Z M62 44 L90 44 L90 54 L62 54 Z" />
          <path d="M50 38 L58 49 L50 60 L42 49 Z" fill="var(--glyph-inner, #000)" />
        }
        @case ('cavaleiros') {
          <path
            d="M50 4 L79 21 L83 60 L66 94 L34 94 L17 60 L21 21 Z
               M29 43 L46 43 L46 50 L29 50 Z M54 43 L71 43 L71 50 L54 50 Z M47 56 L53 56 L53 85 L47 85 Z" />
        }
        @case ('assassinorum') {
          <path [attr.d]="scope" />
          <path d="M48 0 h4 v24 h-4 Z M48 76 h4 v24 h-4 Z M0 48 h24 v4 h-24 Z M76 48 h24 v4 h-24 Z" />
          <path d="M50 32 L56 50 L50 68 L44 50 Z" />
        }
      }
    </svg>
  `,
})
export class GlyphComponent {
  readonly name = input.required<GlyphName>();

  protected readonly feathers = FEATHERS;
  protected readonly cogPath = `${cog(12, 46, 37)} ${ring(18)}`;
  protected readonly halo = `${ring(26, 36)} ${ring(21, 36)}`;
  protected readonly scope = `${ring(40)} ${ring(34)}`;
}
