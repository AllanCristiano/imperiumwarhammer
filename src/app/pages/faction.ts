import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FACTIONS, findFaction } from '../data/factions';
import { ThemeService } from '../core/theme.service';
import { Emblem3dComponent } from '../components/emblem-3d';
import { TypewriterComponent } from '../components/typewriter';
import { RevealDirective } from '../directives/reveal.directive';
import { TiltDirective } from '../directives/tilt.directive';
import { CounterDirective } from '../directives/counter.directive';

/** Dossiê de uma facção. O :slug chega como input() via withComponentInputBinding. */
@Component({
  selector: 'app-faction',
  imports: [RouterLink, Emblem3dComponent, TypewriterComponent, RevealDirective, TiltDirective, CounterDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--fc]': 'faction().color',
    '[style.--fa]': 'faction().accent',
  },
  templateUrl: './faction.html',
  styleUrl: './faction.scss',
})
export class FactionPage {
  readonly slug = input.required<string>();

  protected readonly total = FACTIONS.length;
  protected readonly faction = computed(() => findFaction(this.slug()) ?? FACTIONS[0]);
  protected readonly index = computed(() => FACTIONS.indexOf(this.faction()));
  protected readonly prev = computed(() => FACTIONS[(this.index() - 1 + FACTIONS.length) % FACTIONS.length]);
  protected readonly next = computed(() => FACTIONS[(this.index() + 1) % FACTIONS.length]);
  /** Palavras -> letras com índice global, para animar letra a letra sem quebrar palavras. */
  protected readonly words = computed(() => {
    let i = 0;
    return this.faction()
      .name.split(' ')
      .map((w) => [...w].map((c) => ({ c, i: i++ })));
  });
  protected readonly power = computed(() =>
    Math.round(this.faction().stats.reduce((s, x) => s + x.value, 0) / this.faction().stats.length),
  );

  /** Radar (pentágono) dos atributos, calculado a partir dos dados. */
  protected readonly radar = computed(() => {
    const stats = this.faction().stats;
    const pt = (i: number, r: number) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / stats.length;
      return { x: +(50 + Math.cos(a) * r).toFixed(2), y: +(50 + Math.sin(a) * r).toFixed(2) };
    };
    const grid = [0.25, 0.5, 0.75, 1].map((k) => stats.map((_, i) => pt(i, 40 * k)).map((p) => `${p.x},${p.y}`).join(' '));
    const axes = stats.map((s, i) => ({ ...pt(i, 40), label: s.label, lp: pt(i, 49) }));
    const shape = stats.map((s, i) => pt(i, (40 * s.value) / 100)).map((p) => `${p.x},${p.y}`).join(' ');
    return { grid, axes, shape };
  });

  constructor() {
    const theme = inject(ThemeService);
    effect(() => {
      const { color, accent } = this.faction();
      theme.palette.set({ color, accent });
    });
  }
}
