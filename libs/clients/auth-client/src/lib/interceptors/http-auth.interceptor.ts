import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { AuthConfiguration } from '../models';


@Injectable({
  providedIn: 'root',
})
export class HttpAuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(private options: AuthConfiguration, private authService: AuthService) {}

  ignoredUrl(url: string): boolean {
    if (!this.options.ignoredUrls) return false;

    return this.options.ignoredUrls.some((ignoredUrl: string) => url.endsWith(ignoredUrl));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
                    if (error instanceof HttpErrorResponse && error.status === 401) {
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

  private addAccessToken(req: HttpRequest<any>, token: string | undefined): HttpRequest<any> {
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }

    return req;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokens().pipe(
        switchMap((session) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(session?.accessToken);
          return next.handle(this.addAccessToken(req, session?.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.sessionExpired();
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
