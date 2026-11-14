import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StarfieldComponent } from './components/starfield';
import { IntroComponent } from './components/intro';
import { NavComponent } from './components/nav';

const INTRO_KEY = 'imperium:intro-seen';

function introSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StarfieldComponent, IntroComponent, NavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly showIntro = signal(!introSeen());

  protected introDone(): void {
    this.showIntro.set(false);
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* armazenamento indisponível: tudo bem */
    }
  }
}
