import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ApiModule } from '@nxan/client/api';

import { AuthService } from './auth.service';
import { HttpAuthInterceptor } from './interceptors';
import { AuthOptions, AuthOptionsParams } from './auth-options';
import { AuthStorage, LocalAuthStorage } from './storage';
import { JwtService } from './jwt';

@NgModule({
  imports: [CommonModule]
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

  static forRoot(params: AuthOptionsParams): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        JwtService,
        AuthService,
        HttpAuthInterceptor,
        {
          provide: AuthOptions,
          useValue: params,
        },
        {
          provide: AuthStorage,
          useClass: params.storage ?? LocalAuthStorage,
        },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
      ],
    };
  }
}
