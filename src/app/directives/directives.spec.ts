import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockIntersectionObserver, mediaState } from '../../test-setup';
import { CounterDirective } from './counter.directive';
import { RevealDirective } from './reveal.directive';
import { TiltDirective } from './tilt.directive';

@Component({
  imports: [RevealDirective, CounterDirective, TiltDirective],
  template: `
    <p id="reveal" appReveal="150" (revealed)="revealed.set(true)">texto</p>
    <strong id="counter" [appCounter]="1500" suffix="+"></strong>
    <div id="tilt" appTilt="10"></div>
  `,
})
class Host {
  readonly revealed = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const q = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  return { fixture, q };
}

describe('RevealDirective', () => {
  it('aplica a classe base e o atraso como variável CSS', async () => {
    const { q } = await setup();
    expect(q('reveal').classList).toContain('reveal');
    expect(q('reveal').classList).not.toContain('is-visible');
    expect(q('reveal').style.getPropertyValue('--delay')).toBe('150ms');
  });

  it('revela e emite ao entrar na viewport, depois para de observar', async () => {
    const { fixture, q } = await setup();
    MockIntersectionObserver.trigger();
    await fixture.whenStable();
    expect(q('reveal').classList).toContain('is-visible');
    expect(fixture.componentInstance.revealed()).toBe(true);
    const io = MockIntersectionObserver.instances.find((i) => i.disconnected);
    expect(io).toBeDefined();
  });

  it('não revela enquanto o elemento não está visível', async () => {
    const { fixture, q } = await setup();
    MockIntersectionObserver.trigger(false);
    await fixture.whenStable();
    expect(q('reveal').classList).not.toContain('is-visible');
  });
});

describe('CounterDirective', () => {
  it('começa em zero', async () => {
    const { q } = await setup();
    expect(q('counter').textContent).toBe('0+');
  });

  it('com movimento reduzido vai direto ao valor final formatado em pt-BR', async () => {
    mediaState.reducedMotion = true;
    const { q } = await setup();
    MockIntersectionObserver.trigger();
    expect(q('counter').textContent).toBe('1.500+');
  });

  it('anima até o valor final', async () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb));
    const now = vi.spyOn(performance, 'now').mockReturnValue(0);

    const { q } = await setup();
    MockIntersectionObserver.trigger();

    frames.shift()!(1100); // metade do tempo: ease-out já passou bem da metade
    const mid = Number(q('counter').textContent!.replace(/\D/g, ''));
    expect(mid).toBeGreaterThan(750);
    expect(mid).toBeLessThan(1500);

    frames.shift()!(2200);
    expect(q('counter').textContent).toBe('1.500+');
    expect(frames).toHaveLength(0);

    now.mockRestore();
    vi.restoreAllMocks();
  });
});

describe('TiltDirective', () => {
  afterEach(() => vi.restoreAllMocks());

  function pointer(el: HTMLElement, type: string, clientX = 0, clientY = 0) {
    el.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
  }

  async function setupTilt() {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    const ctx = await setup();
    const el = ctx.q('tilt');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 200, height: 100 } as DOMRect);
    return el;
  }

  it('inclina conforme a posição do ponteiro', async () => {
    const el = await setupTilt();
    expect(el.classList).toContain('tilt');
    pointer(el, 'pointermove', 200, 0); // canto superior direito
    expect(el.style.getPropertyValue('--rx')).toBe('5.00deg');
    expect(el.style.getPropertyValue('--ry')).toBe('5.00deg');
    expect(el.style.getPropertyValue('--gx')).toBe('100.0%');
    expect(el.style.getPropertyValue('--gy')).toBe('0.0%');
  });

  it('volta ao centro quando o ponteiro sai', async () => {
    const el = await setupTilt();
    pointer(el, 'pointermove', 200, 0);
    pointer(el, 'pointerleave');
    expect(el.style.getPropertyValue('--rx')).toMatch(/^-?0\.00deg$/);
    expect(el.style.getPropertyValue('--ry')).toBe('0.00deg');
  });

  it('não inclina com movimento reduzido', async () => {
    mediaState.reducedMotion = true;
    const el = await setupTilt();
    pointer(el, 'pointermove', 200, 0);
    expect(el.style.getPropertyValue('--rx')).toBe('');
  });
});
