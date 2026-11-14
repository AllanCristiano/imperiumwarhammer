import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockIntersectionObserver, mediaState } from '../../test-setup';
import { TypewriterComponent } from './typewriter';

describe('TypewriterComponent', () => {
  let fixture: ComponentFixture<TypewriterComponent>;

  const shown = () =>
    fixture.nativeElement.querySelector('span[aria-hidden]:not(.caret)').textContent;
  const caret = () => fixture.nativeElement.querySelector('.caret') as HTMLElement;

  function create(text: string) {
    fixture = TestBed.createComponent(TypewriterComponent);
    fixture.componentRef.setInput('text', text);
    fixture.componentRef.setInput('speed', 10);
    fixture.detectChanges(); // whenStable() trava com timers falsos
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('expõe o texto completo para leitores de tela', async () => {
    create('Ave Imperator');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Ave Imperator');
  });

  it('não digita nada antes de entrar na viewport', async () => {
    create('Ave');
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(shown()).toBe('');
  });

  it('digita letra a letra quando fica visível', async () => {
    create('Ave');
    MockIntersectionObserver.trigger();
    fixture.detectChanges();

    vi.advanceTimersByTime(10);
    fixture.detectChanges();
    expect(shown()).toBe('A');
    expect(caret().classList).not.toContain('idle');

    vi.advanceTimersByTime(20);
    fixture.detectChanges();
    expect(shown()).toBe('Ave');
    expect(caret().classList).toContain('idle');
  });

  it('com movimento reduzido mostra tudo de uma vez', async () => {
    mediaState.reducedMotion = true;
    create('Ave Imperator');
    MockIntersectionObserver.trigger();
    fixture.detectChanges();
    expect(shown()).toBe('Ave Imperator');
  });

  it('recomeça quando o texto muda', async () => {
    create('Ave');
    MockIntersectionObserver.trigger();
    fixture.detectChanges();
    vi.advanceTimersByTime(30);
    fixture.componentRef.setInput('text', 'Morte');
    fixture.detectChanges();
    expect(shown()).toBe('');
    vi.advanceTimersByTime(50);
    fixture.detectChanges();
    expect(shown()).toBe('Morte');
  });
});
