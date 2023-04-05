import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenRequestDto } from '../dtos';
import { AuthService } from '../services';
import { Session } from '@nxan/server/security';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Session) {
    const input = {
      grant_type: req.body['grant_type'],
      scopes: req.body['scopes'],
      refresh_token: req.body['refresh_token'],
    } as TokenRequestDto;

    if (input.grant_type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid grant type');
    }

    if (!input.refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authService.verifyRefreshToken(payload.sub, input);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
