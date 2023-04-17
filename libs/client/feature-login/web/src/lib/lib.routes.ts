import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const clientFeatureLoginWebRoutes: Route[] = [
  {path: '', pathMatch: 'full', component: LoginComponent }
];
