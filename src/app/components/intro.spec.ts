import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mediaState } from '../../test-setup';
import { MotionService } from '../core/motion.service';
import { IntroComponent } from './intro';

describe('IntroComponent', () => {
  let fixture: ComponentFixture<IntroComponent>;
  let done: ReturnType<typeof vi.fn<() => void>>;

  function create() {
    fixture = TestBed.createComponent(IntroComponent);
    done = vi.fn<() => void>();
    fixture.componentInstance.done.subscribe(done);
    fixture.detectChanges(); // whenStable() trava com timers falsos
  }

  const phase = () => fixture.nativeElement.getAttribute('data-phase');

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('é um diálogo acessível', async () => {
    create();
    expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Abertura');
  });

  it('roda a sequência completa boot → title → out → done', async () => {
    create();
    const warp = TestBed.inject(MotionService).warp;
    expect(phase()).toBe('boot');

    // 4 linhas: 500 + 520 + 580 + 640 + 700 = 2940ms; título 400ms depois, saída 3600ms depois.
    vi.advanceTimersByTime(3340);
    fixture.detectChanges();
    expect(phase()).toBe('title');
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3200);
    fixture.detectChanges();
    expect(phase()).toBe('out');
    expect(warp()).toBe(1);

    vi.advanceTimersByTime(1100);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('clique pula a cena e emite done uma única vez', async () => {
    create();
    fixture.nativeElement.click();
    fixture.detectChanges();
    expect(phase()).toBe('out');

    fixture.nativeElement.click(); // segundo clique não reinicia nada
    vi.advanceTimersByTime(20000);
    expect(done).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(MotionService).warp()).toBe(1);
  });

  it('Esc também pula a cena', async () => {
    create();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(phase()).toBe('out');
  });

  it('com movimento reduzido termina imediatamente', async () => {
    mediaState.reducedMotion = true;
    create();
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('cancela os timers ao ser destruído', async () => {
    create();
    fixture.destroy();
    vi.advanceTimersByTime(20000);
    expect(done).not.toHaveBeenCalled();
  });
});
