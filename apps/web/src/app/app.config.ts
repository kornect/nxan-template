import { HttpClientModule } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { ApiModule } from '@nxan/client/core/api';
import { AuthModule } from '@nxan/client/core/auth';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ApiModule.forRoot({ rootUrl: 'http://localhost:3333' }),
      AuthModule.forRoot({
        postLogoutRedirectUri: '/login',
        postLoginRedirectUri: '/home',
        loginUri: '/login',
        scope: 'offline_access',
        useStorage: 'local',
      })
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
};
