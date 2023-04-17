import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { mergeMap, of } from 'rxjs';

import { AuthOptions } from '../auth-options';
import { AuthService } from '../auth.service';

/**
 * Guard to allow only anonymous access to a route.
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
          .navigate([options.postLoginRedirectUri ?? '/'], {
            replaceUrl: true,
            relativeTo: route.root,
          })
          .then();
      }

      return of(!isLoggedIn);
    })
  );
};
