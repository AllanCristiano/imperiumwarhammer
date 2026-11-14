import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { GlyphComponent, GlyphName } from './glyph';

/**
 * Emblema 3D feito só com CSS: o mesmo SVG é empilhado em N camadas com translateZ,
 * gerando uma extrusão metálica real. Anéis orbitais e halo completam a cena.
 * A rotação vem das variáveis --px / --py herdadas (ponteiro / giroscópio).
 */
@Component({
  selector: 'app-emblem-3d',
  imports: [GlyphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.spin]': 'spin()',
    '[style.--depth]': 'depth()',
    '[style.--size]': 'size()',
  },
  template: `
    <div class="stage">
      <div class="halo"></div>
      @if (rings()) {
        <div class="orbit o1"></div>
        <div class="orbit o2"></div>
        <div class="orbit o3"><i></i></div>
      }
      <div class="body">
        @for (l of layers(); track l) {
          <app-glyph class="layer" [name]="glyph()" [style.--l]="l" />
        }
        <app-glyph class="layer face" [name]="glyph()" />
      </div>
    </div>
  `,
  styleUrl: './emblem-3d.scss',
})
export class Emblem3dComponent {
  readonly glyph = input.required<GlyphName>();
  readonly depth = input(14, { transform: (v: unknown) => numberAttribute(v, 14) });
  readonly size = input('min(64vw, 320px)');
  readonly rings = input(true);
  readonly spin = input(true);

  protected readonly layers = computed(() => Array.from({ length: this.depth() }, (_, i) => i + 1));
}
