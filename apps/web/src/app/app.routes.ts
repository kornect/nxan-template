import { Route } from '@angular/router';
import { anonymousOnly, authorizedOnly } from '@nxan/client/core/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    //canActivate: [authorizedOnly],
    loadChildren: () => import('@nxan/client/feature-home/web').then((m) => m.ClientFeatureHomeWebModule),
  },
  {
    path: 'login',
    //canActivate: [anonymousOnly],
    loadChildren: () => import('@nxan/client/feature-login/web').then((m) => m.ClientFeatureLoginWebModule),
  }
];
