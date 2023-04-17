import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TokenResponseDto } from '@nxan/client/core/api';

@Injectable()
export class AuthStorage {
  getSession(): Observable<TokenResponseDto | null> {
    throw new Error('Not implemented, use LocalAuthStorage or SessionAuthStorage or custom implementation');
  }
  saveSession(token: TokenResponseDto): Observable<TokenResponseDto | null> {
    throw new Error('Not implemented, use LocalAuthStorage or SessionAuthStorage or custom implementation');
  }
  clearSession(): Observable<void> {
    throw new Error('Not implemented, use LocalAuthStorage or SessionAuthStorage or custom implementation');
  }
}


