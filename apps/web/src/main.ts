import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { ApiModule } from '@nxan/client/core/api';
import { AuthModule } from '@nxan/client/core/auth';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ApiModule.forRoot({ rootUrl: 'http://localhost:3333' }),
      AuthModule.forRoot({
        postLogoutRedirectUri: '/login',
        postLoginRedirectUri: '/home',
        loginUri: '/login',
        scope: 'offline_access',
        useStorage: 'local'
      })
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
}).catch((err) => console.error(err));
