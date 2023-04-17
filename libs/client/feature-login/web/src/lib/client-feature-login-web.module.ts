import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { clientFeatureLoginWebRoutes } from './lib.routes';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(clientFeatureLoginWebRoutes)],
  declarations: [
    LoginComponent
  ],
})
export class ClientFeatureLoginWebModule {}
