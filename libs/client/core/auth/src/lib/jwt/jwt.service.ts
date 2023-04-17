import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

@Injectable()
export class JwtService extends JwtHelperService {
  constructor() {
    super();
  }

  isValidToken(token: string): Observable<boolean> {
    if (!token) return of(false);
    return of(!this.isTokenExpired(token));
  }
}
