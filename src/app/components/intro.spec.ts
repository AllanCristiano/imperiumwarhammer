import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mediaState } from '../../test-setup';
import { MotionService } from '../core/motion.service';
import { IntroComponent } from './intro';

describe('IntroComponent', () => {
  let fixture: ComponentFixture<IntroComponent>;
  let done: ReturnType<typeof vi.fn<() => void>>;

  async function create() {
    fixture = TestBed.createComponent(IntroComponent);
    done = vi.fn<() => void>();
    fixture.componentInstance.done.subscribe(done);
    await fixture.whenStable();
  }

  const phase = () => fixture.nativeElement.getAttribute('data-phase');

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('é um diálogo acessível', async () => {
    await create();
    expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Abertura');
  });

  it('roda a sequência completa boot → title → out → done', async () => {
    await create();
    const warp = TestBed.inject(MotionService).warp;
    expect(phase()).toBe('boot');

    vi.advanceTimersByTime(3000);
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
    await create();
    fixture.nativeElement.click();
    fixture.detectChanges();
    expect(phase()).toBe('out');

    fixture.nativeElement.click(); // segundo clique não reinicia nada
    vi.advanceTimersByTime(20000);
    expect(done).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(MotionService).warp()).toBe(1);
  });

  it('Esc também pula a cena', async () => {
    await create();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(phase()).toBe('out');
  });

  it('com movimento reduzido termina imediatamente', async () => {
    mediaState.reducedMotion = true;
    await create();
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('cancela os timers ao ser destruído', async () => {
    await create();
    fixture.destroy();
    vi.advanceTimersByTime(20000);
    expect(done).not.toHaveBeenCalled();
  });
});
