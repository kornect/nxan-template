/* tslint:disable */

/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';
import { ConnectApi } from './services/connect-api';
import { UsersApi } from './services/users-api';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [ConnectApi, UsersApi, ApiConfiguration],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params,
        },
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
