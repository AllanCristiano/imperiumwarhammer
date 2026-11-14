import { TestBed } from '@angular/core/testing';
import { mediaState } from '../../test-setup';
import { MotionService } from './motion.service';

function pointer(type: string, clientX: number, clientY: number): Event {
  const e = new MouseEvent('pointermove', { clientX, clientY });
  Object.defineProperty(e, 'pointerType', { value: type });
  return e;
}

function orientation(gamma: number | null, beta: number | null): Event {
  const e = new Event('deviceorientation');
  Object.assign(e, { gamma, beta });
  return e;
}

describe('MotionService', () => {
  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(500);
  });

  afterEach(() => vi.restoreAllMocks());

  it('lê prefers-reduced-motion', () => {
    mediaState.reducedMotion = true;
    expect(TestBed.inject(MotionService).reduced()).toBe(true);
  });

  it('não reduz movimento por padrão', () => {
    expect(TestBed.inject(MotionService).reduced()).toBe(false);
  });

  it('normaliza a posição do mouse para -1..1', () => {
    const motion = TestBed.inject(MotionService);
    window.dispatchEvent(pointer('mouse', 750, 125));
    expect(motion.pointer()).toEqual({ x: 0.5, y: -0.5 });
    window.dispatchEvent(pointer('mouse', 0, 500));
    expect(motion.pointer()).toEqual({ x: -1, y: 1 });
  });

  it('ignora toque (pointerType diferente de mouse)', () => {
    const motion = TestBed.inject(MotionService);
    window.dispatchEvent(pointer('touch', 1000, 500));
    expect(motion.pointer()).toEqual({ x: 0, y: 0 });
  });

  it('usa o giroscópio e limita os valores a -1..1', () => {
    const motion = TestBed.inject(MotionService);
    window.dispatchEvent(orientation(15, 60));
    expect(motion.pointer()).toEqual({ x: 0.5, y: 0.5 });
    window.dispatchEvent(orientation(-90, 200));
    expect(motion.pointer()).toEqual({ x: -1, y: 1 });
  });

  it('ignora leituras incompletas do giroscópio', () => {
    const motion = TestBed.inject(MotionService);
    window.dispatchEvent(orientation(null, 10));
    expect(motion.pointer()).toEqual({ x: 0, y: 0 });
  });

  it('jump() incrementa o contador de dobra', () => {
    const motion = TestBed.inject(MotionService);
    motion.jump();
    motion.jump();
    expect(motion.warp()).toBe(2);
  });
});
