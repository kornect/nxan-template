import { Injectable } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  mergeMap,
  of,
  tap,
  throwError
} from 'rxjs';
import { take } from 'rxjs/operators';

import { ConnectApi, TokenResponseDto } from '@nxan/client/api';
import { objHasProperty } from '@nxan/shared/utils';

import { AuthOptions } from './auth-options';
import { AuthStorage } from './storage';
import { JwtService } from './jwt';

export enum Event {
  INIT = 'init',
  PROFILE_LOADED = 'profile_loaded',
  LOGGED_OUT = 'logged_out',
  EXPIRED = 'expired',
}

export interface AuthEvent {
  event: Event;
  session: TokenResponseDto | null;
}

@Injectable()
@UntilDestroy()
export class AuthService {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<TokenResponseDto | { failed: boolean } | null>(null);
  private _authState = new BehaviorSubject<AuthEvent>({ event: Event.INIT, session: null });
  constructor(
    private storage: AuthStorage,
    private jwtHelper: JwtService,
    private options: AuthOptions,
    private connectApi: ConnectApi
  ) {

  }

  get authState() {
    return this._authState.asObservable();
  }

  getUser() {
    return this.getSession().pipe(map((session) => session?.user || null));
  }

  // SignIn
  login(payload: { username: string; password: string }) {
    return this.connectApi
      .getToken({
        body: {
          grant_type: 'password',
          username: payload.username,
          password: payload.password,
          scopes: this.options.scope,
          ...({} as any),
        },
      })
      .pipe(
        mergeMap((response) => this.saveSession(response)),
        tap((session) => this.publishState(Event.PROFILE_LOADED, session))
      );
  }

  /**
   * Checks if user session has valid access token and attempts to refresh it if it doesn't
   */
  isAuthenticatedAsync(attemptRefresh = true) {
    return this.hasValidAccessToken().pipe(
      mergeMap((valid) => {
        if (valid) {
          return of(true);
        } else {
          if (!attemptRefresh) {
            return of(false);
          }

          return this.refreshTokens().pipe(
            mergeMap(() => of(true)),
            catchError(() => of(false))
          );
        }
      })
    );
  }

  /**
   * Refresh access token and return new session
   */
  refreshTokens() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.hasValidRefreshToken()
        .pipe(
          mergeMap((valid) => {
            if (!valid) {
              throw new Error('Refresh token expired');
            } else {
              return this.getRefreshToken();
            }
          }),
          mergeMap((refreshToken) =>
            this.connectApi.getToken({
              body: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                scopes: this.options.scope || '',
                ...({} as any)
              },
            })
          ),
          mergeMap((response) => this.saveSession(response)),
          tap((session) => {
            this.publishState(Event.PROFILE_LOADED, session);
            this.isRefreshing = false;
            this.refreshTokenSubject.next(session);
          })
        )
        .pipe(
          catchError((error) => {
            this.publishState(Event.EXPIRED);
            this.isRefreshing = false;
            this.refreshTokenSubject.next({
              failed: true,
            });
            return throwError(error);
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result !== null),
        take(1),
        mergeMap((response) => {
          if (objHasProperty(response, 'failed')) {
            throw new Error('Refresh token expired');
          } else {
            return this.getSession();
          }
        })
      );
    }
  }

  /**
   * Returns current session access token
   */
  getAccessToken() {
    return this.getToken('access');
  }

  /**
   * Returns current session refresh token
   */
  getRefreshToken() {
    return this.getToken('refresh');
  }

  /**
   * Logs user out and clears all session tokens
   */
  logOut() {
    return this.clearSession().pipe(tap(() => this.publishState(Event.LOGGED_OUT)));
  }

  /**
   * Checks if the current access token is valid
   */
  private hasValidAccessToken() {
    return this.isValidToken('access');
  }

  private publishState(event: Event, session: TokenResponseDto | null = null) {
    this._authState.next({ event, session });
  }

  private hasValidRefreshToken() {
    return this.isValidToken('refresh');
  }

  private getToken(token: 'refresh' | 'access'): Observable<string> {
    return this.getSession().pipe(
      map((session) => {
        if (session) {
          const { refreshToken, accessToken } = session;
          if (refreshToken || accessToken) {
            return token === 'refresh' ? refreshToken : accessToken;
          }
        }

        return '';
      })
    );
  }

  private isValidToken(token: 'refresh' | 'access') {
    return this.getToken(token).pipe(
      mergeMap((token) => {
        if (token) {
          return this.jwtHelper.isValidToken(token);
        } else {
          return of(false);
        }
      })
    );
  }

  private getSession() {
    return this.storage.getSession();
  }

  private saveSession(authResponse: TokenResponseDto) {
    return this.storage.saveSession(authResponse);
  }

  private clearSession() {
    return this.storage.clearSession();
  }
}
