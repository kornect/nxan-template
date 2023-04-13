import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { mergeMap, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { AuthOptions } from '../auth-options';

export const authorizedOnly = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const options = inject(AuthOptions);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const authService = inject(AuthService);

  return authService.isAuthenticatedAsync().pipe(
    mergeMap((isLoggedIn) => {
      if (!isLoggedIn) {
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

      return of(isLoggedIn)
    })
  );
};
