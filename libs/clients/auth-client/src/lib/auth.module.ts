import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ApiModule } from '@nxan/clients/api-client';

import { AuthService } from './auth.service';
import { HttpAuthInterceptor } from './interceptors';
import { AuthConfiguration, AuthConfigurationParams } from './models';
import { AUTH_CLIENT_STORAGE, AuthClientStorageService } from './storage';


@NgModule({
  imports: [CommonModule],
  providers: [AuthConfiguration, AuthService, HttpAuthInterceptor]
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule: AuthModule, @Optional() api: ApiModule) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. Import in your base AppModule only.');
    }
    if (!api) {
      throw new Error(
        'You need to import the ApiModule in your AppModule! \n' +
        'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }

  static forRoot(params: AuthConfigurationParams): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: AuthConfiguration,
          useValue: params
        },
        {
          provide: AUTH_CLIENT_STORAGE,
          useClass: params.storage ?? AuthClientStorageService
        },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true }
      ]
    };
  }
}
