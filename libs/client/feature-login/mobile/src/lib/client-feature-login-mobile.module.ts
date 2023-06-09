import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { clientFeatureLoginMobileRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(clientFeatureLoginMobileRoutes)],
})
export class ClientFeatureLoginMobileModule {}
