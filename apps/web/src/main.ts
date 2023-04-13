import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { ApiModule } from '@nxan/client/api';
import { AuthModule } from '@nxan/client/auth/core';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ApiModule.forRoot({ rootUrl: 'http://localhost:3333' }),
      AuthModule.forRoot({
        postLogoutRedirectUri: '/',
        postLoginRedirectUri: '/',
        loginUri: '/login',
        scope: 'offline_access'
      })
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
}).catch((err) => console.error(err));
