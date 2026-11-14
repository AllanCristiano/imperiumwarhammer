import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThemeService } from '../core/theme.service';
import { FACTIONS } from '../data/factions';
import { FactionPage } from './faction';

describe('FactionPage', () => {
  let fixture: ComponentFixture<FactionPage>;
  let el: HTMLElement;

  async function render(slug: string) {
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(FactionPage);
    el = fixture.nativeElement;
    await render(FACTIONS[1].slug);
  });

  it('mostra nome, epíteto e lema da facção', () => {
    const f = FACTIONS[1];
    expect(el.querySelector('h1')?.getAttribute('aria-label')).toBe(f.name);
    expect(el.querySelector('.epithet')?.textContent).toBe(f.epithet);
    expect(el.querySelector('.motto')?.textContent).toContain(f.motto);
  });

  it('mostra a posição no dossiê com dois dígitos', () => {
    expect(el.querySelector('.hero-text .eyebrow')?.textContent?.trim()).toBe(
      `Dossiê 02 / ${String(FACTIONS.length).padStart(2, '0')}`,
    );
  });

  it('renderiza um parágrafo por trecho de lore e um card por fato', () => {
    const f = FACTIONS[1];
    expect(el.querySelectorAll('.lore p')).toHaveLength(f.lore.length);
    expect(el.querySelectorAll('.fact')).toHaveLength(f.facts.length);
  });

  it('desenha o radar com um eixo por atributo e 4 anéis', () => {
    const f = FACTIONS[1];
    expect(el.querySelectorAll('.radar .axis')).toHaveLength(f.stats.length);
    expect(el.querySelectorAll('.radar .ring')).toHaveLength(4);
    expect(el.querySelector('.radar .shape')?.getAttribute('points')?.split(' ')).toHaveLength(f.stats.length);
  });

  it('o primeiro vértice do radar aponta para cima, proporcional ao valor', () => {
    const [first] = FACTIONS[1].stats;
    const [x, y] = el.querySelector('.radar .shape')!.getAttribute('points')!.split(' ')[0].split(',').map(Number);
    expect(x).toBeCloseTo(50, 1);
    expect(y).toBeCloseTo(50 - (40 * first.value) / 100, 1);
  });

  it('liga para a facção anterior e a próxima', () => {
    const prev = el.querySelector<HTMLAnchorElement>('.pager .prev')!;
    const next = el.querySelector<HTMLAnchorElement>('.pager .next')!;
    expect(prev.getAttribute('href')).toBe(`/faccao/${FACTIONS[0].slug}`);
    expect(next.getAttribute('href')).toBe(`/faccao/${FACTIONS[2].slug}`);
  });

  it('dá a volta nas pontas da lista (anterior da primeira = última)', async () => {
    await render(FACTIONS[0].slug);
    expect(el.querySelector('.pager .prev')?.getAttribute('href')).toBe(`/faccao/${FACTIONS.at(-1)!.slug}`);
    await render(FACTIONS.at(-1)!.slug);
    expect(el.querySelector('.pager .next')?.getAttribute('href')).toBe(`/faccao/${FACTIONS[0].slug}`);
  });

  it('retinge o tema global com as cores da facção', async () => {
    const theme = TestBed.inject(ThemeService);
    const f = FACTIONS[3];
    await render(f.slug);
    expect(theme.palette()).toEqual({ color: f.color, accent: f.accent });
  });

  it('cai na primeira facção se o slug for desconhecido', async () => {
    await render('inexistente');
    expect(el.querySelector('h1')?.getAttribute('aria-label')).toBe(FACTIONS[0].name);
  });
});
