import { Injectable, InjectionToken } from '@angular/core';

import { Observable, of } from 'rxjs';

export interface AuthClientStorage {
  get(key: string): Observable<any | null>;

  set(key: string, value: any): Observable<void>;

  remove(key: string): Observable<void>;
}

export const AUTH_CLIENT_STORAGE = new InjectionToken<AuthClientStorage>('AUTH_CLIENT_STORAGE');

@Injectable()
export class AuthClientStorageService implements AuthClientStorage {
  get(key: string): Observable<any | null> {
    const value = localStorage.getItem(key) || '';
    if (!value) return of(null);
    return of(JSON.parse(value));
  }

  set(key: string, value: any): Observable<void> {
    localStorage.setItem(key, JSON.stringify(value));
    return of(value);
  }

  remove(key: string): Observable<void> {
    localStorage.removeItem(key);
    return of(undefined);
  }
}
