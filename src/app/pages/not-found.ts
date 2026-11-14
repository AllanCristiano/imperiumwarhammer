import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlyphComponent } from '../components/glyph';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, GlyphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <app-glyph name="aquila" class="g" />
      <h1>Sinal perdido na Disformidade</h1>
      <p>Este registro não existe — ou foi expurgado pela Inquisição.</p>
      <a routerLink="/">Retornar a Terra</a>
    </section>
  `,
  styles: `
    section { min-height: 100svh; display: grid; place-content: center; justify-items: center; gap: 1rem; padding: 16px; text-align: center; }
    .g { width: 120px; height: 120px; color: var(--fa); opacity: .5; animation: drift 6s ease-in-out infinite; }
    h1 { margin: 0; font: 700 clamp(1.5rem, 7vw, 2.6rem) var(--font-display); }
    p { margin: 0; color: var(--muted); }
    a { margin-top: 1rem; color: var(--fa); font: 700 .8rem var(--font-ui); letter-spacing: .24em; text-transform: uppercase; }
    @keyframes drift { 50% { transform: translateY(-12px) rotate(-4deg); opacity: .9; } }
  `,
})
export class NotFound {}
