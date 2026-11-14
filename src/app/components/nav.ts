import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FACTIONS } from '../data/factions';
import { GlyphComponent } from './glyph';

/** Barra superior + gaveta em tela cheia (mobile-first) com barra de progresso scroll-driven. */
@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, GlyphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.open]': 'open()', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    <header class="bar">
      <a routerLink="/" class="brand" aria-label="Início">
        <app-glyph name="aquila" class="logo" />
        <span>Imperium</span>
      </a>
      <button
        type="button"
        class="burger"
        [attr.aria-expanded]="open()"
        aria-controls="drawer"
        [attr.aria-label]="open() ? 'Fechar menu' : 'Abrir menu'"
        (click)="open.update((o) => !o)"
      >
        <i></i><i></i><i></i>
      </button>
      <div class="progress" aria-hidden="true"></div>
    </header>

    <nav id="drawer" class="drawer" [attr.inert]="open() ? null : ''" aria-label="Facções">
      <ol>
        @for (f of factions; track f.slug; let i = $index) {
          <li [style.--i]="i">
            <a
              [routerLink]="['/faccao', f.slug]"
              routerLinkActive="current"
              [style.--fa]="f.accent"
              (click)="open.set(false)"
            >
              <app-glyph [name]="f.glyph" class="g" />
              <span class="n">{{ f.name }}</span>
              <span class="e">{{ f.epithet }}</span>
            </a>
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './nav.scss',
})
export class NavComponent {
  protected readonly factions = FACTIONS;
  protected readonly open = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }
}
