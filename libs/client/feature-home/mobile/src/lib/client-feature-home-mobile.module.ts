import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { featureHomeMobileRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(featureHomeMobileRoutes)],
})
export class ClientFeatureHomeMobileModule {}
