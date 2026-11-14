import { TestBed } from '@angular/core/testing';
import { IMPERIAL, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let meta: HTMLMetaElement;
  const root = document.documentElement;

  beforeEach(() => {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    meta.remove();
    root.style.removeProperty('--fc');
    root.style.removeProperty('--fa');
  });

  it('começa com a paleta imperial', () => {
    TestBed.tick();
    expect(service.palette()).toEqual(IMPERIAL);
    expect(root.style.getPropertyValue('--fc')).toBe(IMPERIAL.color);
    expect(root.style.getPropertyValue('--fa')).toBe(IMPERIAL.accent);
  });

  it('aplica a nova paleta nas variáveis CSS e na meta theme-color', () => {
    service.palette.set({ color: '#123456', accent: '#abcdef' });
    TestBed.tick();
    expect(root.style.getPropertyValue('--fc')).toBe('#123456');
    expect(root.style.getPropertyValue('--fa')).toBe('#abcdef');
    expect(meta.getAttribute('content')).toBe('#123456');
  });

  it('reset() volta para a paleta imperial', () => {
    service.palette.set({ color: '#000000', accent: '#ffffff' });
    service.reset();
    TestBed.tick();
    expect(service.palette()).toEqual(IMPERIAL);
    expect(root.style.getPropertyValue('--fc')).toBe(IMPERIAL.color);
  });
});
