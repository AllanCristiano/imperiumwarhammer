import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export interface Palette {
  color: string;
  accent: string;
}

export const IMPERIAL: Palette = { color: '#8a6a24', accent: '#e9c46a' };

/** Paleta ativa do site inteiro. Cada facção retinge o fundo, o campo estelar e a UI. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  readonly palette = signal<Palette>(IMPERIAL);

  constructor() {
    effect(() => {
      const { color, accent } = this.palette();
      this.root.style.setProperty('--fc', color);
      this.root.style.setProperty('--fa', accent);
      this.root.ownerDocument
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', color);
    });
  }

  reset(): void {
    this.palette.set(IMPERIAL);
  }
}
