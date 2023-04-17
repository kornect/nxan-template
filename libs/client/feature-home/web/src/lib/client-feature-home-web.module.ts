import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { featureHomeWebRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(featureHomeWebRoutes)],
  declarations: [DashboardComponent],
})
export class ClientFeatureHomeWebModule {}
