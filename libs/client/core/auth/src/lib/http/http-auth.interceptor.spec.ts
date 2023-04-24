import { createHttpFactory, HttpMethod, SpectatorHttp, SpyObject } from '@ngneat/spectator/jest';

import { AuthService } from '../auth.service';
import { AuthOptions } from '../auth-options';
import { HttpContext, HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { IS_AUTH_REQUIRED } from './types';
import { HttpAuthInterceptor } from './http-auth.interceptor';


describe('HttpAuthInterceptor', () => {
  class MockHttpHandler extends HttpHandler {
    handle(_: HttpRequest<unknown>) {
      return of(new HttpResponse({status: 200}));
    }
  }


  let spectator: SpectatorHttp<HttpAuthInterceptor>;
  let authService: SpyObject<AuthService>;

  const createHttp = createHttpFactory({
    service: HttpAuthInterceptor,
    mocks: [AuthService, AuthOptions, MockHttpHandler],
  });

  beforeEach(() => {
    spectator = createHttp();

    authService = spectator.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('ignore anonymous requests', () => {

    it('should ignore request url if its in the ignore list', async () => {
      const url = '/api/auth/login';
      const handler = spectator.inject(MockHttpHandler);

      handler.handle.mockReturnValueOnce(of(new HttpResponse({status: 200})));

      spectator.inject(AuthOptions).ignoredUrls = [url];

      const response = await firstValueFrom(spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url),
        handler));

      expect(response).toBeTruthy();
      expect(handler.handle).toHaveBeenCalled();
      expect(authService.isAuthenticatedAsync).not.toHaveBeenCalled();
    });

    it('should ignore request url if context has IS_AUTH_REQUIRED set to false', async () => {
      const url = '/api/auth/login';
      const handler = spectator.inject(MockHttpHandler);

      handler.handle.mockReturnValueOnce(of(new HttpResponse({status: 200})));

      const context = new HttpContext();
      context.set(IS_AUTH_REQUIRED, false);

      const response = await firstValueFrom(spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url, { context }),
        handler));

      expect(response).toBeTruthy();
      expect(handler.handle).toHaveBeenCalled();
      expect(authService.isAuthenticatedAsync).not.toHaveBeenCalled();
    });

  });

  describe('handle authenticated requests', () => {

    it('should add authorization header if user is authenticated', async () => {
      const url = '/api/auth/login';
      const handler = spectator.inject(MockHttpHandler);

      handler.handle.mockReturnValueOnce(of(new HttpResponse({status: 200})));

      authService.isAuthenticatedAsync.mockReturnValueOnce(of(true));
      authService.getAccessToken.mockReturnValueOnce(of('token'));

      const response = await firstValueFrom(spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url),
        handler));

      expect(response).toBeTruthy();
      expect(handler.handle).toHaveBeenCalled();
      expect(authService.isAuthenticatedAsync).toHaveBeenCalled();
      expect(authService.getAccessToken).toHaveBeenCalled();
    });

    it('should refresh token if request fails with 401', async () => {
      const url = '/api/auth/login';

      const handler = spectator.inject(MockHttpHandler);

      handler.handle
        .mockReturnValueOnce(throwError(
          new HttpErrorResponse({status: 401, error: {message: 'Failed unauthorized'}})))
        .mockReturnValueOnce(of(new HttpResponse({status: 200})));

      authService.isAuthenticatedAsync.mockReturnValue(of(true));
      authService.getAccessToken.mockReturnValue(of('token'));
      authService.refreshTokens.mockReturnValue(of({
        refreshToken: 'refreshToken',
        accessToken: 'accessToken',
        user: ({} as any),
        expiresAt: new Date().getDate(),
        tokenType: 'Bearer',
      }));

      const response = await firstValueFrom(spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url),
        handler));

      expect(response).toBeTruthy();
      expect(handler.handle).toHaveBeenCalledTimes(2);
      expect(handler.handle).toHaveBeenCalled();
      expect(authService.isAuthenticatedAsync).toHaveBeenCalled();
      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(authService.refreshTokens).toHaveBeenCalled();
    });

    it('should not refresh token if failed request status code is not 401',  () => {
      const url = '/api/auth/login';

      const handler = spectator.inject(MockHttpHandler);

      handler.handle.mockReturnValueOnce(throwError(
        new HttpErrorResponse({status: 500, error: {message: 'Failed 500 request'}})));

      authService.isAuthenticatedAsync.mockReturnValue(of(false));
      authService.getAccessToken.mockReturnValue(of('token'));

      spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url),
        handler).subscribe(() => fail('Should not have succeeded'), () => {
        expect(handler.handle).toHaveBeenCalled();
        expect(handler.handle).toHaveBeenCalledTimes(1);
        expect(authService.isAuthenticatedAsync).toHaveBeenCalled();
        expect(authService.getAccessToken).toHaveBeenCalled();
        expect(authService.refreshTokens).not.toHaveBeenCalled();
        });
    });

    it('should fail request if refresh token fails', async () => {
      const url = '/api/auth/login';

      const handler = spectator.inject(MockHttpHandler);

      handler.handle.mockReturnValueOnce(throwError(
        new HttpErrorResponse({status: 401, error: {message: 'This is an error'}})));

      authService.isAuthenticatedAsync.mockReturnValue(of(true));
      authService.getAccessToken.mockReturnValue(of('token'));
      authService.refreshTokens.mockReturnValue(throwError(new Error('This is an error')));

      await expect(firstValueFrom(spectator.service.intercept(
        new HttpRequest<never>(HttpMethod.GET, url),
        handler))).rejects.toThrow();

      expect(handler.handle).toHaveBeenCalled();
      expect(handler.handle).toHaveBeenCalledTimes(1);
      expect(authService.isAuthenticatedAsync).toHaveBeenCalled();
      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(authService.refreshTokens).toHaveBeenCalled();
    });
  });
});
