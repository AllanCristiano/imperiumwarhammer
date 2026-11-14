import { CanMatchFn, ResolveFn, Routes } from '@angular/router';
import { findFaction } from './data/factions';

/** Só casa a rota se a facção existir; senão cai no 404. */
const factionExists: CanMatchFn = (_route, segments) => !!findFaction(segments[1]?.path);

const factionTitle: ResolveFn<string> = (route) =>
  `${findFaction(route.paramMap.get('slug'))?.name ?? 'Facção'} · Imperium`;

export const routes: Routes = [
  {
    path: '',
    title: 'Imperium da Humanidade · Facções',
    loadComponent: () => import('./pages/home').then((m) => m.Home),
  },
  {
    path: 'faccao/:slug',
    canMatch: [factionExists],
    title: factionTitle,
    loadComponent: () => import('./pages/faction').then((m) => m.FactionPage),
  },
  {
    path: '**',
    title: 'Sinal perdido · Imperium',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
  },
];
