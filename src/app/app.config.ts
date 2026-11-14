import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
  PreloadAllModules,
} from '@angular/router';
import { routes } from './app.routes';
import { MotionService } from './core/motion.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // View Transitions API nativa + "salto de dobra" no campo estelar a cada navegação.
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition }) => {
          const motion = inject(MotionService);
          if (motion.reduced()) {
            transition.skipTransition();
            return;
          }
          motion.jump();
        },
      }),
    ),
  ],
};
