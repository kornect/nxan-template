import { inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { of, switchMap } from 'rxjs';

import { AuthService } from '../auth.service';
import { AuthConfiguration } from '../models';

/**
 * Guard to allow only anonymous access to a route.
 */
export const anonymousOnly = () => {
  const options = inject(AuthConfiguration);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const authService = inject(AuthService);

  return authService.isAuthenticatedAsync().pipe(
    switchMap((isLoggedIn) => {
      if (isLoggedIn) {
        router
          .navigate([options.homeUrl ?? '/'], {
            replaceUrl: true,
            relativeTo: route.root,
          })
          .then();

        return of(false);
      } else {
        return of(true);
      }
    })
  );
};
