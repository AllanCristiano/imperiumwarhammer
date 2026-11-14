import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { FACTIONS } from './data/factions';
import { FactionPage } from './pages/faction';
import { Home } from './pages/home';
import { NotFound } from './pages/not-found';

describe('rotas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('/ abre a home', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/', Home);
    expect(page).toBeInstanceOf(Home);
    expect(TestBed.inject(Title).getTitle()).toBe('Imperium da Humanidade · Facções');
  });

  it.each(FACTIONS.map((f) => [f.slug, f.name]))('/faccao/%s abre o dossiê', async (slug, name) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/faccao/${slug}`, FactionPage);
    expect(TestBed.inject(Title).getTitle()).toBe(`${name} · Imperium`);
    expect(harness.routeNativeElement?.querySelector('h1')?.getAttribute('aria-label')).toBe(name);
  });

  it('facção inexistente cai no 404', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/faccao/orks', NotFound);
    expect(TestBed.inject(Title).getTitle()).toBe('Sinal perdido · Imperium');
  });

  it('qualquer outra URL cai no 404', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/nada/aqui', NotFound);
    expect(harness.routeNativeElement?.textContent).toContain('Sinal perdido na Disformidade');
  });
});
