import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { mediaState } from '../test-setup';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  async function create() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture;
  }

  it('mostra a abertura na primeira visita e deixa o conteúdo inerte', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-intro')).not.toBeNull();
    expect(el.querySelector('main')?.hasAttribute('inert')).toBe(true);
  });

  it('ao terminar a abertura, remove-a e lembra na sessão', async () => {
    mediaState.reducedMotion = true; // a abertura termina sozinha
    const fixture = await create();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-intro')).toBeNull();
    expect(el.querySelector('main')?.hasAttribute('inert')).toBe(false);
    expect(sessionStorage.getItem('imperium:intro-seen')).toBe('1');
  });

  it('não repete a abertura na mesma sessão', async () => {
    sessionStorage.setItem('imperium:intro-seen', '1');
    const fixture = await create();
    expect(fixture.nativeElement.querySelector('app-intro')).toBeNull();
  });

  it('exibe o aviso de projeto de fã no rodapé', async () => {
    const fixture = await create();
    expect(fixture.nativeElement.querySelector('footer')?.textContent).toContain('Projeto de fã');
  });
});
