import { Injectable, Type } from '@angular/core';

import { AuthStorage } from './storage';

export interface AuthOptionsParams {
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  loginUri?: string;
  postLogoutRedirectUri?: string;
  postLoginRedirectUri?: string;
  ignoredUrls?: string[];
  storage?: Type<AuthStorage> | null;
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
  postLoginRedirectUri?: string = '/';
  postLogoutRedirectUri?: string = '/';
  ignoredUrls?: string[];
  storage?: Type<AuthStorage> | null;
}
