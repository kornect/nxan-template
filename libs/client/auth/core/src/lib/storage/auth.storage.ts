import { Injectable, InjectionToken } from '@angular/core';

import { Observable, of } from 'rxjs';
import { TokenResponseDto } from '@nxan/client/api';



@Injectable()
export class AuthStorage {
  getSession(): Observable<TokenResponseDto | null> {
    return of(null);
  }
  saveSession(token: TokenResponseDto): Observable<TokenResponseDto | null>{
    return of(token);
  }
  clearSession(): Observable<void>{
    return of(undefined);
  }
}

export const AUTH_STORAGE = new InjectionToken<AuthStorage>('AUTH_STORAGE');

@Injectable()
export class LocalAuthStorage extends AuthStorage {
  private readonly storageKey = 'CLIENT_AUTH';

  override clearSession(): Observable<void> {
    localStorage.removeItem(this.storageKey);
    return of(undefined);
  }

  override getSession(): Observable<TokenResponseDto | null> {
    const value = localStorage.getItem(this.storageKey) || '';
    if (!value) return of(null);
    return of(JSON.parse(value) as TokenResponseDto);
  }

  override saveSession(token: TokenResponseDto): Observable<TokenResponseDto | null> {
    localStorage.setItem(this.storageKey, JSON.stringify(token));
    return of(token);
  }
}
