import { Injectable, Type } from '@angular/core';

import { AuthStorage } from './storage';

export interface AuthOptionsParams {
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  loginUri?: string;
  homeUri?: string;
  postLogoutRedirectUri?: string;
  postLoginRedirectUri?: string;
  ignoredUrls?: string[];
  useStorage: 'local' | 'session' | 'custom';
  storage?: Type<AuthStorage> | null;
  skipRedirectOnUnauthorized?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthOptions implements AuthOptionsParams {
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  loginUri?: string = '/login';
  homeUri?: string = '/home';
  postLoginRedirectUri?: string = '/';
  postLogoutRedirectUri?: string = '/';
  ignoredUrls?: string[];
  storage?: Type<AuthStorage> | null;
  useStorage: "local" | "session" | "custom" = "local";
  skipRedirectOnUnauthorized?: boolean = false;
}
