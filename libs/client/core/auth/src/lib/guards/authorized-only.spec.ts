import * as angularCore from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { firstValueFrom, of } from 'rxjs';

import { AuthOptions, AuthService, authorizedOnly } from '@nxan/client/core/auth';

describe('AuthorizedOnly', () => {
  class MockAuthGuard {}

  let spectator: SpectatorService<MockAuthGuard>;

  const createService = createServiceFactory({
    service: MockAuthGuard,
    mocks: [AuthOptions, Router, ActivatedRoute, AuthService, ActivatedRouteSnapshot, RouterStateSnapshot],
  });

  beforeEach(() => {
    spectator = createService();

    jest.spyOn(angularCore, 'inject').mockImplementation((providerToken) => {
      return spectator.inject(providerToken);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if user is logged in', async () => {
    const next = spectator.inject(ActivatedRouteSnapshot);
    const state = spectator.inject(RouterStateSnapshot);
    spectator.inject(AuthService).isAuthenticatedAsync.mockReturnValue(of(true));

    const guard = await firstValueFrom(authorizedOnly(next, state));
    expect(guard).toBeTruthy();
  });

  it('should return false if user is not logged in', async () => {
    const next = spectator.inject(ActivatedRouteSnapshot);
    const state = spectator.inject(RouterStateSnapshot);

    spectator.inject(AuthOptions).skipRedirectOnUnauthorized = true;
    spectator.inject(AuthService).isAuthenticatedAsync.mockReturnValue(of(false));

    const guard = await firstValueFrom(authorizedOnly(next, state));
    expect(guard).toBeFalsy();
  });

  it('should redirect to login page if user is not logged in', async () => {
    const next = spectator.inject(ActivatedRouteSnapshot);
    const state = spectator.inject(RouterStateSnapshot);

    spectator.inject(AuthOptions).skipRedirectOnUnauthorized = false;
    spectator.inject(AuthService).isAuthenticatedAsync.mockReturnValue(of(false));
    spectator.inject(Router).navigate.mockReturnValue(Promise.resolve(true));

    const guard = await firstValueFrom(authorizedOnly(next, state));
    expect(guard).toBeFalsy();
    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: {
        r: state.url,
      },
      replaceUrl: true,
      relativeTo: spectator.inject(ActivatedRoute).root,
    });
  });
});
