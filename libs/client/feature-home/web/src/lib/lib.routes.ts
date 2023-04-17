import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const featureHomeWebRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ]
  }
];
