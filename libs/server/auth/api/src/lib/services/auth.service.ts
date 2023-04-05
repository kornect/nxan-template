import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';


import { getExpirationDate } from '@nxan/shared/utils';

import { AuthenticatedUser, TokenRequestDto, TokenResponseDto, UserInfoDto } from '../dtos';
import { UserManager } from '@nxan/server/users/domain';
import { Session, SessionService } from '@nxan/server/security';

export enum AUTH_RESPONSE {
  InvalidCredentials = 'Invalid credentials',
  UnconfirmedEmail = 'Email is not confirmed',
  SuspendedAccount = 'User account is temporarily suspended',
  BannedAccount = 'User account is permanently banned from using the site'
}


@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly session: SessionService
  ) {}

  async verifyPassword(input: TokenRequestDto) {
    const { password, username } = input;

    const user = await this.userManager.findByEmail(username);

    if (!user) {
      throw new BadRequestException(AUTH_RESPONSE.InvalidCredentials);
    }

    if (!(await this.userManager.hasConfirmedEmail(user))) {
      throw new BadRequestException(AUTH_RESPONSE.UnconfirmedEmail);
    }

    if (await this.userManager.isSuspended(user)) {
      throw new BadRequestException(AUTH_RESPONSE.SuspendedAccount);
    }

    if (await this.userManager.isBanned(user)) {
      throw new BadRequestException(AUTH_RESPONSE.BannedAccount);
    }

    // verify password
    const passwordValid = await this.userManager.verifyPassword(user, password);
    if (!passwordValid) {
      throw new BadRequestException(AUTH_RESPONSE.InvalidCredentials);
    }

    return {
      id: user.id,
      email: user.email,
      strategy: 'password',
      timestamp: new Date(),
      scopes: input.scopes ?? [],
    } as AuthenticatedUser;
  }

  async verifyRefreshToken(userId: string, input: TokenRequestDto) {
    if (!userId) {
      throw new BadRequestException(AUTH_RESPONSE.InvalidCredentials);
    }

    const user = await this.userManager.findById(userId);

    if (!user) {
      throw new BadRequestException(AUTH_RESPONSE.InvalidCredentials);
    }

    if (await this.userManager.isSuspended(user)) {
      throw new BadRequestException(AUTH_RESPONSE.SuspendedAccount);
    }

    if (await this.userManager.isBanned(user)) {
      throw new BadRequestException(AUTH_RESPONSE.BannedAccount);
    }

    return {
      id: user.id,
      email: user.email,
      strategy: 'refresh',
      timestamp: new Date(),
      offlineAccess: true,
      scopes: input.scopes ?? '',
    } as AuthenticatedUser;
  }

  async authorize(authUser: AuthenticatedUser) {
    if(!authUser) {
      throw new UnauthorizedException();
    }

    const user = await this.userManager.findById(authUser.id);
    const roles = await this.userManager.getRoles(user);

    const refreshTokenId = v4();

    const userClaims = {
      sub: user.id,
      email: user.email,
      userName: user.username,
      displayName: user.displayName,
      roles: roles,
      defaultRole: 'user',
    } as Session;

    const accessToken = await this.jwtService.signAsync(userClaims, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    await this.userManager.updateLastLogin(user);

    const tokenResponse = new TokenResponseDto();
    tokenResponse.accessToken = accessToken;
    tokenResponse.expiresAt = getExpirationDate(this.configService.get<string>('JWT_EXPIRES_IN')).getTime();
    tokenResponse.tokenType = 'Bearer';
    tokenResponse.user = userClaims;

    if (authUser.scopes?.split(' ').includes('offline_access')) {
      tokenResponse.refreshToken = await this.jwtService.signAsync(Object.assign(userClaims, { jti: refreshTokenId }), {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      });
    }

    return tokenResponse;
  }

  async userinfo() {
    if (!this.session.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    const session = this.session.getSession();

    const user = await this.userManager.findById(session.sub);

    const roles = await this.userManager.getRoles(user);

    return {
      sub: user.id,
      email: user.email,
      userName: user.username,
      displayName: user.displayName,
      emailConfirmed: user.emailConfirmed,
      roles: roles,
      defaultRole: 'user',
    } as UserInfoDto;
  }
}
