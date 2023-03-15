import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';



import { AuthenticatedUser, TokenRequestDto, TokenResponseDto, UserInfoDto } from './dto';
import { Session, SessionService } from "@nxan/server/security";
import { UserManager } from "@nxan/server/users/domain";
import { getExpirationDate } from '@nxan/shared/utils';


@Injectable()
export class AuthService {
  constructor(
    private readonly userManager: UserManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private session: SessionService
  ) {}

  async verifyPassword(input: TokenRequestDto) {
    const { password, username } = input;

    const user = await this.userManager.findByEmail(username);

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    if (!(await this.userManager.hasConfirmedEmail(user))) {
      // TODO: send email confirmation email

      throw new BadRequestException('Email is not confirmed');
    }

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email is not confirmed, please check your inbox');
    }

    if (await this.userManager.isSuspended(user)) {
      throw new BadRequestException('User account is temporarily suspended');
    }

    if (await this.userManager.isBanned(user)) {
      throw new BadRequestException('User account is permanently banned from using the site');
    }

    // verify password
    const passwordValid = await this.userManager.verifyPassword(user, password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid email or password');
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
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.userManager.findById(userId);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    if (await this.userManager.isSuspended(user)) {
      throw new BadRequestException('User account is temporarily suspended');
    }

    if (await this.userManager.isBanned(user)) {
      throw new BadRequestException('User account is permanently banned from using the site');
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
      throw new UnauthorizedException('Unauthorized');
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
