import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';
import { FACTIONS } from '../data/factions';
import { NavComponent } from './nav';

@Component({ template: '' })
class Blank {}

describe('NavComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: Blank }])],
    });
  });

  async function setup() {
    const fixture = TestBed.createComponent(NavComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const burger = el.querySelector<HTMLButtonElement>('.burger')!;
    const drawer = el.querySelector<HTMLElement>('#drawer')!;
    return { fixture, el, burger, drawer };
  }

  it('lista todas as facções com link', async () => {
    const { el } = await setup();
    const links = [...el.querySelectorAll<HTMLAnchorElement>('#drawer a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      FACTIONS.map((f) => `/faccao/${f.slug}`),
    );
  });

  it('começa fechada, com a gaveta inerte', async () => {
    const { el, burger, drawer } = await setup();
    expect(el.classList).not.toContain('open');
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(burger.getAttribute('aria-label')).toBe('Abrir menu');
    expect(drawer.hasAttribute('inert')).toBe(true);
  });

  it('o botão abre e fecha a gaveta', async () => {
    const { fixture, el, burger, drawer } = await setup();
    burger.click();
    await fixture.whenStable();
    expect(el.classList).toContain('open');
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(burger.getAttribute('aria-label')).toBe('Fechar menu');
    expect(drawer.hasAttribute('inert')).toBe(false);

    burger.click();
    await fixture.whenStable();
    expect(el.classList).not.toContain('open');
  });

  it('Esc fecha a gaveta', async () => {
    const { fixture, el, burger } = await setup();
    burger.click();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(el.classList).not.toContain('open');
  });

  it('fecha ao terminar uma navegação', async () => {
    const harness = await RouterTestingHarness.create('/');
    const { fixture, el, burger } = await setup();
    burger.click();
    await fixture.whenStable();
    await harness.navigateByUrl('/faccao/' + FACTIONS[0].slug);
    await fixture.whenStable();
    expect(el.classList).not.toContain('open');
  });
});
