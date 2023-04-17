import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenResponseDto } from '@nxan/client/core/api';
import { AuthStorage } from './auth.storage';

@Injectable()
export abstract class BrowserStorage extends AuthStorage {
  private readonly storageKey = 'CLIENT_AUTH';

  abstract getStorage(): Storage;

  override clearSession(): Observable<void> {
    this.getStorage().removeItem(this.storageKey);
    return of(undefined);
  }

  override getSession(): Observable<TokenResponseDto | null> {
    const value = this.getStorage().getItem(this.storageKey) || '';
    if (!value) return of(null);
    return of(JSON.parse(value) as TokenResponseDto);
  }

  override saveSession(token: TokenResponseDto): Observable<TokenResponseDto | null> {
    this.getStorage().setItem(this.storageKey, JSON.stringify(token));
    return of(token);
  }
}
