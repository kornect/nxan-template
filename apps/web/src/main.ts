import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { ApiModule } from '@nxan/clients/api-client';
import { AuthModule } from '@nxan/clients/auth-client';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ApiModule.forRoot({ rootUrl: 'http://localhost:3333' }),
      AuthModule.forRoot({
        homeUrl: '/',
        loginUrl: '/login',
      })
    ),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
  ],
}).catch((err) => console.error(err));
