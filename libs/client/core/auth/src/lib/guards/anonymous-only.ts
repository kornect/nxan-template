import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { mergeMap, of } from 'rxjs';

import { AuthOptions } from '../auth-options';
import { AuthService } from '../auth.service';

/**
 * Guard to allow only anonymous access to a route.
 * If the user is logged in, they will be redirected to the post-login redirect URI.
 * @returns true if the user is not logged in, false otherwise
 * @example use with public routes like login, register, forgot password, etc.
 */
export const anonymousOnly = () => {
  const options = inject(AuthOptions);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const authService = inject(AuthService);

  return authService.isAuthenticatedAsync().pipe(
    mergeMap((isLoggedIn) => {
      if (isLoggedIn) {
        // prevent logged-in users from accessing the route
        router
          .navigate([options.homeUri ?? '/'], {
            replaceUrl: true,
            relativeTo: route.root,
          })
          .then();
      }

      return of(!isLoggedIn);
    })
  );
};
