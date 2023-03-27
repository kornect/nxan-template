import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { of, switchMap } from 'rxjs';

import { AuthService } from '../auth.service';
import { AuthConfiguration } from '../models';

export const authorizedOnly = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const options = inject(AuthConfiguration);
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const authService = inject(AuthService);

  return authService.isAuthenticatedAsync().pipe(
    switchMap((isLoggedIn) => {
      if (!isLoggedIn) {
        authService.signOut().subscribe();
        router
          .navigate([options.loginUrl ?? '/login'], {
            queryParams: {
              r: state.url,
            },
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
}
