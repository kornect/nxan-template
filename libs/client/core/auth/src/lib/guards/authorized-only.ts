import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { mergeMap, of } from 'rxjs';

import { AuthOptions } from '../auth-options';
import { AuthService } from '../auth.service';

/**
 * Guard to allow only authorized access to a route.
 * If the user is not logged in, they will be redirected to the login page.
 * @returns true if the user is logged in, false otherwise
 * @example use with private routes like dashboard, profile, etc.
 * @param next
 * @param state
 */
export const authorizedOnly = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const options = inject(AuthOptions);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const authService = inject(AuthService);

  return authService.isAuthenticatedAsync().pipe(
    mergeMap((isLoggedIn) => {
      if (!isLoggedIn && !options.skipRedirectOnUnauthorized) {
        router
          .navigate([options.loginUri ?? '/login'], {
            queryParams: {
              r: state.url,
            },
            replaceUrl: true,
            relativeTo: route.root,
          })
          .then();
      }

      return of(isLoggedIn);
    })
  );
};
