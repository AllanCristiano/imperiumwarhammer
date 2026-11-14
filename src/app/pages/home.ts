import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FACTIONS } from '../data/factions';
import { ThemeService } from '../core/theme.service';
import { Emblem3dComponent } from '../components/emblem-3d';
import { GlyphComponent } from '../components/glyph';
import { RingCarouselComponent } from '../components/ring-carousel';
import { TypewriterComponent } from '../components/typewriter';
import { RevealDirective } from '../directives/reveal.directive';
import { TiltDirective } from '../directives/tilt.directive';
import { CounterDirective } from '../directives/counter.directive';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Emblem3dComponent,
    GlyphComponent,
    RingCarouselComponent,
    TypewriterComponent,
    RevealDirective,
    TiltDirective,
    CounterDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly factions = FACTIONS;
  protected readonly title = [...'IMPERIUM'];
  protected readonly numbers = [
    { value: 1000000, suffix: '+', label: 'mundos sob o Trono' },
    { value: 10000, suffix: '', label: 'anos de vigília' },
    { value: FACTIONS.length, suffix: '', label: 'forças catalogadas' },
    { value: 1, suffix: '', label: 'Imperador' },
  ];

  constructor() {
    inject(ThemeService).reset();
  }
}
