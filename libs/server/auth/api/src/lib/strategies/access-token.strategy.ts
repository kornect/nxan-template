import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Session} from "@nxan/server/security";
import {ConfigService} from "@nestjs/config";




@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'default') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: Session) {
    return payload;
  }
}
