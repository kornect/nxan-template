import * as angularCore from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { firstValueFrom, of } from 'rxjs';

import { AuthOptions, AuthService, anonymousOnly } from '@nxan/client/core/auth';

describe('AnonymousOnly', () => {
  class MockAuthGuard {}

  let spectator: SpectatorService<MockAuthGuard>;

  const createService = createServiceFactory({
    service: MockAuthGuard,
    mocks: [AuthOptions, Router, ActivatedRoute, AuthService],
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

  it('should return true if user is not logged in', async () => {
    spectator.inject(AuthService).isAuthenticatedAsync.mockReturnValue(of(false));

    const guard = await firstValueFrom(anonymousOnly());
    expect(guard).toBeTruthy();
  });

  it('should return false and redirect to home page if user is logged in', async () => {
    spectator.inject(AuthService).isAuthenticatedAsync.mockReturnValue(of(true));
    spectator.inject(Router).navigate.mockReturnValue(Promise.resolve(true));

    const guard = await firstValueFrom(anonymousOnly());
    expect(guard).toBeFalsy();
    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['/'], {
      replaceUrl: true,
      relativeTo: spectator.inject(ActivatedRoute).root,
    });
  });
});
