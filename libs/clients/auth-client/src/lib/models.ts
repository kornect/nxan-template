import { Injectable, Type } from '@angular/core';

import { AuthClientStorage } from './storage';

export interface AuthConfigurationParams {
  loginUrl?: string;
  homeUrl?: string;
  ignoredUrls?: string[];
  storage?: Type<AuthClientStorage> | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthConfiguration implements AuthConfigurationParams {
  loginUrl?: string;
  homeUrl?: string;
  ignoredUrls?: string[];
  storage?: Type<AuthClientStorage> | null;
}
