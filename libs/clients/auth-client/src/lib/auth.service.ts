import { Inject, Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, from, map, of, switchMap, tap, throwError, timer } from 'rxjs';

import { ConnectApi, TokenResponseDto } from '@nxan/clients/api-client';

import { AUTH_CLIENT_STORAGE, AuthClientStorage } from './storage';


export interface AuthSessionEvent {
  event: 'init' | 'profile_loaded' | 'logout' | 'expired' | 'refreshed';
  session: TokenResponseDto | null;
}

@Injectable()
@UntilDestroy()
export class AuthService {
  STORAGE_KEY = 'CLIENT_AUTH';
  private jwtHelper: JwtHelperService;

  constructor(@Inject(AUTH_CLIENT_STORAGE) private storage: AuthClientStorage, private connectApi: ConnectApi) {
    this.jwtHelper = new JwtHelperService();

    // convert 1 hour to milliseconds
    const refreshInterval = 1000 * 60 * 60;

    timer(1000, refreshInterval)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.autoRefreshToken();
      });
  }

  private _authStateChanged = new BehaviorSubject<AuthSessionEvent>({ event: 'init', session: null });

  get authStateChanged() {
    return this._authStateChanged.asObservable();
  }

  getUser() {
    return this.getSession().pipe(map((session) => session?.user || null));
  }

  // SignIn
  signIn(payload: { username: string; password: string }) {
    return this.connectApi
      .getToken({
        body: {
          grant_type: 'password',
          username: payload.username,
          password: payload.password,
          scopes: 'openid profile offline_access',
          ...({} as any),
        },
      })
      .pipe(
        switchMap((response) => this.saveTokens(response)),
        tap((session) => {
          this._authStateChanged.next({ event: 'profile_loaded', session });
        })
      );
  }

  /**
   * Checks if user session has valid access token and attempts to refresh it if it doesn't
   */
  isAuthenticatedAsync() {
    return this.hasValidAccessToken().pipe(
      switchMap((valid) => {
        if (valid) {
          return of(true);
        } else {
          return this.hasValidRefreshToken().pipe(
            switchMap((valid) => {
              if (valid) {
                return this.refreshTokens().pipe(
                  switchMap(() => of(true)),
                  catchError(() => of(false))
                );
              } else {
                return of(false);
              }
            })
          );
        }
      })
    );
  }

  /**
   * Checks if the current access token is valid
   */
  hasValidAccessToken() {
    return this.isTokenExpired('refresh').pipe(
      map((expired) => {
        return !expired;
      })
    );
  }

  /**
   * Refresh access token and return new session
   */
  refreshTokens() {
    return this.hasValidRefreshToken().pipe(
      switchMap((valid) => {
        if (!valid) {
          throw new Error('Invalid refresh token');
        } else {
          return this.getRefreshToken();
        }
      }),
      switchMap((refreshToken) =>
        this.connectApi.getToken({
          body: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scopes: 'openid profile offline_access',
            ...({} as any),
          },
        })
      ),
      switchMap((response) => this.saveTokens(response)),
      tap((session) => {
        this._authStateChanged.next({
          event: 'profile_loaded',
          session,
        });
      }),
      catchError((error) => {
        this._authStateChanged.next({
          event: 'expired',
          session: null,
        });

        return throwError(error);
      })
    );
  }

  /**
   * Returns current session access token
   */
  getAccessToken() {
    return this.getSession().pipe(map((session) => session?.accessToken || ''));
  }

  /**
   * Returns current session refresh token
   */
  getRefreshToken() {
    return this.getSession().pipe(map((session) => session?.refreshToken || ''));
  }

  /**
   * Logs user out and clears all session tokens
   */
  signOut() {
    return this.removeTokens().pipe(
      tap(() => {
        this._authStateChanged.next({
          event: 'logout',
          session: null,
        });
      })
    );
  }

  sessionExpired() {
    return this.removeTokens().pipe(
      tap(() => {
        this._authStateChanged.next({
          event: 'expired',
          session: null,
        });
      })
    );
  }

  getSession() {
    return from(this.storage.get(this.STORAGE_KEY)).pipe(
      map((session) => {
        if (session) {
          return session as TokenResponseDto;
        } else {
          return null;
        }
      })
    );
  }

  private autoRefreshToken() {
    this.isAuthenticatedAsync().subscribe((authenticated) => {
      if (!authenticated) {
        this.signOut();
      } else {
        this.getSession().subscribe((session) => {
          if (session) {
            this._authStateChanged.next({
              event: 'refreshed',
              session,
            });
          }
        });
      }
    });
  }

  private hasValidRefreshToken() {
    return this.isTokenExpired('refresh').pipe(
      map((expired) => {
        return !expired;
      })
    );
  }

  private isTokenExpired(token: 'refresh' | 'access') {
    return this.getSession().pipe(
      switchMap((session) => {
        if (session) {
          const { refreshToken, accessToken } = session;
          if (refreshToken || accessToken) {
            const tokenToCheck = token === 'refresh' ? refreshToken : accessToken;
            const isExpired = this.jwtHelper.isTokenExpired(tokenToCheck);
            return of(isExpired);
          }
        }

        return of(true);
      })
    );
  }

  private saveTokens(authResponse: TokenResponseDto) {
    return from(this.storage.set(this.STORAGE_KEY, authResponse)).pipe(switchMap(() => this.getSession()));
  }

  private removeTokens() {
    return from(this.storage.remove(this.STORAGE_KEY));
  }
}
