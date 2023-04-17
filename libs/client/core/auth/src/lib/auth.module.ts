import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, Type } from '@angular/core';

import { ApiModule } from '@nxan/client/core/api';

import { AuthOptions, AuthOptionsParams } from './auth-options';
import { AuthService } from './auth.service';
import { HttpAuthInterceptor } from './interceptors';
import { JwtService } from './jwt';
import { AuthStorage, LocalAuthStorage, SessionAuthStorage } from './storage';

@NgModule({
  imports: [CommonModule],
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

    function getStorage(): Type<AuthStorage> {
      if (!params.useStorage) return LocalAuthStorage;

      switch (params.useStorage) {
        case 'session':
          return SessionAuthStorage;
        case 'local':
          return LocalAuthStorage;
        case 'custom':
          if(!params.storage) throw new Error('Invalid auth storage');
          return params.storage;
        default:
          throw new Error('Invalid auth storage');
      }
    }

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
          useClass: getStorage(),
        },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
      ],
    };
  }
}
