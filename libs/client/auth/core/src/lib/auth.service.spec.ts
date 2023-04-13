
import { ConnectApi, TokenResponseDto } from '@nxan/client/api';

import { AuthService } from './auth.service';
import { combineLatest, delay, first, firstValueFrom, of, switchMap } from 'rxjs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { JwtService } from './jwt';
import { AuthStorage } from './storage';
import { AuthOptions } from './auth-options';


describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>;
  const createService = createServiceFactory({
    service: AuthService,
    providers: [],
    entryComponents: [],
    mocks: [ConnectApi, JwtService, AuthStorage, AuthOptions]
  });

  beforeEach(() => {
    spectator = createService();
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
      }
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    spectator.inject(ConnectApi).getToken.mockReturnValueOnce(of(expected));
    spectator.inject(AuthStorage).saveSession.mockReturnValueOnce(of(expected));


    const results = await firstValueFrom(spectator.inject(AuthService).login({ username: 'user', password: 'pass' }));
    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));

    expect(event).toEqual({ event: 'profile_loaded', session: expected });
    expect(results).toEqual(expected);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledWith({
      body: { username: 'user', password: 'pass', grant_type: 'password', scopes: 'test' }
    });
    expect(spectator.inject(ConnectApi).getToken).toBeCalledTimes(1);
    expect(spectator.inject(AuthStorage).saveSession).toBeCalledWith(expected);
    expect(spectator.inject(AuthStorage).saveSession).toBeCalledTimes(1);
  });

  it('should logout successfully', async () => {
    spectator.inject(AuthStorage).clearSession.mockReturnValueOnce(of(undefined));

    await firstValueFrom(spectator.inject(AuthService).logOut());

    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));
    expect(event).toEqual({ event: 'logged_out', session: null });
    expect(spectator.inject(AuthStorage).clearSession).toBeCalledTimes(1);
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
      }
    } as TokenResponseDto;

    spectator.inject(AuthStorage).getSession.mockReturnValueOnce(of(expected));
    spectator.inject(JwtService).isValidToken.mockReturnValueOnce(of(true));

    const result = await firstValueFrom(spectator.inject(AuthService).isAuthenticatedAsync());
    expect(result).toBeTruthy();
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(1);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.accessToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(1);
  });

  it('it should return false if the user is not authenticated, expired token', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      }
    } as TokenResponseDto;

    spectator.inject(AuthStorage).getSession.mockReturnValueOnce(of(expected));
    spectator.inject(JwtService).isValidToken.mockReturnValueOnce(of(false));

    const result = await firstValueFrom(spectator.inject(AuthService).isAuthenticatedAsync(false));
    expect(result).toBeFalsy();
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(1);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.accessToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(1);
  });

  it('it should return false if the user is not authenticated, no session', async () => {
    spectator.inject(AuthStorage).getSession.mockReturnValueOnce(of(null));
    spectator.inject(JwtService).isValidToken.mockReturnValueOnce(of(false));

    const result = await firstValueFrom(spectator.inject(AuthService).isAuthenticatedAsync(false));
    expect(result).toBeFalsy();
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(1);
    expect(spectator.inject(JwtService).isValidToken).not.toBeCalled();
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
      }
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    spectator.inject(ConnectApi).getToken.mockReturnValueOnce(of(expected));
    spectator.inject(AuthStorage).saveSession.mockReturnValueOnce(of(expected));
    spectator.inject(AuthStorage).getSession
      .mockReturnValueOnce(of(expected))
      .mockReturnValueOnce(of(expected))
      .mockReturnValueOnce(of(expected));
    spectator.inject(JwtService).isValidToken
      .mockReturnValueOnce(of(false))
      .mockReturnValueOnce(of(true));

    const result = await firstValueFrom(spectator.inject(AuthService).isAuthenticatedAsync());
    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));

    expect(result).toBeTruthy();
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(3);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.accessToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.refreshToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(2);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' }
    });
    expect(event).toEqual({ event: 'profile_loaded', session: expected });
  });

  it('it should not refresh token if access token is expired and refresh token is expired', async () => {
    const expected = {
      accessToken: 'token',
      expiresAt: new Date().getDate(),
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: {
        id: '1',
        email: 'test@test.com',
      }
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    spectator.inject(ConnectApi).getToken.mockReturnValueOnce(of(expected));
    spectator.inject(AuthStorage).saveSession.mockReturnValueOnce(of(expected));
    spectator.inject(AuthStorage).getSession
      .mockReturnValueOnce(of(expected))
      .mockReturnValueOnce(of(expected));
    spectator.inject(JwtService).isValidToken
      .mockReturnValueOnce(of(false))
      .mockReturnValueOnce(of(false));

    const result = await firstValueFrom(spectator.inject(AuthService).isAuthenticatedAsync());
    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));

    expect(result).toBeFalsy();
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(2);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.accessToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledWith(expected.refreshToken);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(2);
    expect(spectator.inject(ConnectApi).getToken).not.toBeCalled();
    expect(event).toEqual({ event: 'expired', session: null });
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
      }
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    spectator.inject(ConnectApi).getToken.mockImplementation(() => of('').pipe(delay(300),switchMap(() => of(expected))));
    spectator.inject(AuthStorage).getSession.mockImplementation(() => of(expected));
    spectator.inject(AuthStorage).saveSession.mockReturnValueOnce(of(expected));

    spectator.inject(JwtService).isValidToken.mockImplementation((value) => {
      if(value === expected.accessToken) {
        return of(false);
      } else if(value === expected.refreshToken) {
        return of(true);
      } else
        return of(false);
    });

    const authService = spectator.inject(AuthService);

    const results = await firstValueFrom(
      combineLatest([
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
      ])
    );
    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));

    expect(results).toEqual([true, true, true]);
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(7);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(4);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledTimes(1);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' }
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
      }
    } as TokenResponseDto;

    spectator.inject(AuthOptions).scope = 'test';
    spectator.inject(ConnectApi).getToken
      .mockImplementation(() => of('').pipe(
        delay(300),
        switchMap(() => {
          throw new Error('test');
        })));

    spectator.inject(AuthStorage).getSession.mockImplementation(() => of(expected));
    spectator.inject(AuthStorage).saveSession.mockReturnValueOnce(of(expected));

    spectator.inject(JwtService).isValidToken.mockImplementation((value) => {
      if(value === expected.accessToken) {
        return of(false);
      } else if(value === expected.refreshToken) {
        return of(true);
      } else
        return of(false);
    });

    const authService = spectator.inject(AuthService);

    const results = await firstValueFrom(
      combineLatest([
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
        authService.isAuthenticatedAsync(),
      ])
    );
    const event = await firstValueFrom(spectator.inject(AuthService).authState.pipe(first()));

    expect(results).toEqual([false, false, false]);
    expect(spectator.inject(AuthStorage).getSession).toBeCalledTimes(5);
    expect(spectator.inject(JwtService).isValidToken).toBeCalledTimes(4);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledTimes(1);
    expect(spectator.inject(ConnectApi).getToken).toBeCalledWith({
      body: { refresh_token: expected.refreshToken, grant_type: 'refresh_token', scopes: 'test' }
    });
    expect(event).toEqual({ event: 'expired', session: null });
  });
});
