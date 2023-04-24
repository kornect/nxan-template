import { SpectatorService, createServiceFactory, SpyObject } from '@ngneat/spectator/jest';
import { combineLatest, delay, first, firstValueFrom, of, switchMap } from 'rxjs';

import { ConnectApi, TokenResponseDto } from '@nxan/client/core/api';

import { AuthOptions } from './auth-options';
import { AuthService } from './auth.service';
import { JwtService } from './jwt';
import { AuthStorage } from './storage';

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  let authService: AuthService;
  let connectApi: SpyObject<ConnectApi>;
  let jwtService: SpyObject<JwtService>;
  let authStorage: SpyObject<AuthStorage>;

  const createService = createServiceFactory({
    service: AuthService,
    providers: [],
    entryComponents: [],
    mocks: [ConnectApi, JwtService, AuthStorage, AuthOptions],
  });

  beforeEach(() => {
    spectator = createService();
    authService = spectator.service;
    spectator.inject(AuthOptions).scope = 'test';
    connectApi = spectator.inject(ConnectApi);
    jwtService = spectator.inject(JwtService);
    authStorage = spectator.inject(AuthStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should login successfully', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    connectApi.getToken.mockReturnValueOnce(of(expected));
    authStorage.saveSession.mockReturnValueOnce(of(expected));

    const results = await firstValueFrom(authService.login({ username: 'user', password: 'pass' }));
    const event = await firstValueFrom(authService.authState.pipe(first()));

    expect(event).toEqual({ event: 'profile_loaded', session: expected });
    expect(results).toEqual(expected);
    expect(connectApi.getToken).toBeCalledWith({
      body: { username: 'user', password: 'pass', grant_type: 'password', scopes: 'test' },
    });
    expect(connectApi.getToken).toBeCalledTimes(1);
    expect(authStorage.saveSession).toBeCalledWith(expected);
    expect(authStorage.saveSession).toBeCalledTimes(1);
  });

  it('should logout successfully', async () => {
    authStorage.clearSession.mockReturnValueOnce(of(undefined));

    await firstValueFrom(authService.logOut());

    const event = await firstValueFrom(authService.authState.pipe(first()));
    expect(event).toEqual({ event: 'logged_out', session: null });
    expect(authStorage.clearSession).toBeCalledTimes(1);
  });

  it('it should return true if the user is authenticated', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    authStorage.getSession.mockReturnValueOnce(of(expected));
    jwtService.isValidToken.mockReturnValueOnce(of(true));

    const result = await firstValueFrom(authService.isAuthenticatedAsync());
    expect(result).toBeTruthy();
    expect(authStorage.getSession).toBeCalledTimes(1);
    expect(jwtService.isValidToken).toBeCalledWith(expected.accessToken);
    expect(jwtService.isValidToken).toBeCalledTimes(1);
  });

  it('it should return false if the user is not authenticated, expired tokens', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    authStorage.getSession.mockImplementation(() => of(expected));
    authStorage.clearSession.mockImplementation(() => of(undefined));
    jwtService.isValidToken.mockImplementation(() => of(false));

    const result = await firstValueFrom(authService.isAuthenticatedAsync());
    const event = await firstValueFrom(authService.authState.pipe(first()));
    expect(result).toBeFalsy();
    expect(authStorage.getSession).toBeCalledTimes(2);
    expect(jwtService.isValidToken).toBeCalledWith(expected.accessToken);
    expect(jwtService.isValidToken).toBeCalledWith(expected.refreshToken);
    expect(jwtService.isValidToken).toBeCalledTimes(2);
    expect(authStorage.clearSession).toBeCalledTimes(1);
    expect(connectApi.getToken).not.toBeCalled();
    expect(event).toEqual({ event: 'unauthorized', session: null });
  });

  it('it should return false if the user is not authenticated, no session', async () => {
    authStorage.getSession.mockImplementation(() => of(null));

    const result = await firstValueFrom(authService.isAuthenticatedAsync());
    const event = await firstValueFrom(authService.authState.pipe(first()));
    expect(result).toBeFalsy();
    expect(authStorage.clearSession).toBeCalled();
    expect(authStorage.getSession).toBeCalledTimes(2);
    expect(jwtService.isValidToken).not.toBeCalled();
    expect(connectApi.getToken).not.toBeCalled();
    expect(event).toEqual({ event: 'unauthorized', session: null });
  });

  it('it should refresh token if access token is expired', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    connectApi.getToken.mockReturnValueOnce(of(expected));
    authStorage.saveSession.mockReturnValueOnce(of(expected));
    authStorage.getSession.mockImplementation(() => of(expected));
    jwtService.isValidToken.mockReturnValueOnce(of(false)).mockReturnValueOnce(of(true));

    const result = await firstValueFrom(authService.isAuthenticatedAsync());
    const event = await firstValueFrom(authService.authState.pipe(first()));

    expect(result).toBeTruthy();
    expect(authStorage.getSession).toBeCalledTimes(3);
    expect(jwtService.isValidToken).toBeCalledWith(expected.accessToken);
    expect(jwtService.isValidToken).toBeCalledWith(expected.refreshToken);
    expect(jwtService.isValidToken).toBeCalledTimes(2);
    expect(connectApi.getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' },
    });
    expect(event).toEqual({ event: 'profile_loaded', session: expected });
  });

  it('it should not run a single token refresh request at a time', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    connectApi.getToken.mockImplementation(() =>
      of('').pipe(
        delay(300),
        switchMap(() => of(expected))
      )
    );

    authStorage.getSession.mockImplementation(() => of(expected));
    authStorage.saveSession.mockReturnValueOnce(of(expected));

    jwtService.isValidToken.mockImplementation((value) => {
      switch (value) {
        case expected.accessToken:
          return of(false);
        case expected.refreshToken:
          return of(true);
        default:
          return of(false);
      }
    });

    const results = await firstValueFrom(
      combineLatest([
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
      ])
    );
    const event = await firstValueFrom(authService.authState.pipe(first()));

    expect(results).toEqual([true, true, true]);
    expect(authStorage.getSession).toBeCalledTimes(7);
    expect(jwtService.isValidToken).toBeCalledTimes(4);
    expect(connectApi.getToken).toBeCalledTimes(1);
    expect(connectApi.getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' },
    });
    expect(event).toEqual({ event: 'profile_loaded', session: expected });
  });

  it('it should fail all pending requests if refresh fails', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    connectApi.getToken.mockImplementation(() =>
      of('').pipe(
        delay(300),
        switchMap(() => {
          throw new Error('test');
        })
      )
    );

    authStorage.getSession.mockImplementation(() => of(expected));
    authStorage.saveSession.mockReturnValueOnce(of(expected));
    authStorage.clearSession.mockReturnValueOnce(of(undefined));

    jwtService.isValidToken.mockImplementation((value) => {
      if (value === expected.accessToken) {
        return of(false);
      } else if (value === expected.refreshToken) {
        return of(true);
      } else return of(false);
    });

    const results = await firstValueFrom(
      combineLatest([
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
      ])
    );
    const event = await firstValueFrom(authService.authState.pipe(first()));

    expect(results).toEqual([false, false, false]);
    expect(authStorage.getSession).toBeCalledTimes(5);
    expect(jwtService.isValidToken).toBeCalledTimes(4);
    expect(authStorage.clearSession).toBeCalledTimes(1);
    expect(connectApi.getToken).toBeCalledTimes(1);
    expect(connectApi.getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' },
    });
    expect(event).toEqual({ event: 'unauthorized', session: null });
  });
});
