import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthOptions } from '../auth-options';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private options: AuthOptions, private authService: AuthService) {}

  ignoredUrl(url: string): boolean {
    if (!this.options.ignoredUrls) return false;

    return this.options.ignoredUrls.some((ignoredUrl: string) => url.endsWith(ignoredUrl));
  }

  intercept(req: HttpRequest<never>, next: HttpHandler) {
    if (this.ignoredUrl(req.url)) {
      return next.handle(req);
    }

    return this.authService.isAuthenticatedAsync().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated || this.ignoredUrl(req.url)) {
          return next.handle(req);
        } else {
          return this.authService.getAccessToken().pipe(
            switchMap((accessToken) => {
              if (!accessToken) {
                return next.handle(req);
              } else {
                return next.handle(this.addAccessToken(req, accessToken)).pipe(
                  catchError((error) => {
                    if (error.status === 401 && error instanceof HttpErrorResponse) {
                      return this.handle401Error(req, next);
                    } else {
                      return throwError(error);
                    }
                  })
                );
              }
            })
          );
        }
      })
    );
  }

  private addAccessToken(req: HttpRequest<never>, token: string | null): HttpRequest<never> {
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }

    return req;
  }

  private handle401Error(req: HttpRequest<never>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokens().pipe(
        switchMap((session) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(session?.accessToken ?? '');
          return next.handle(this.addAccessToken(req, session?.accessToken ?? ''));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addAccessToken(req, token));
        })
      );
    }
  }
}
