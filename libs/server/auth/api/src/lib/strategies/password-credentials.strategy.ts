import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { TokenRequestDto } from '../dto';


@Injectable()
export class PasswordCredentialsStrategy extends PassportStrategy(Strategy, 'password-credentials') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string) {
    const input = {
      username,
      password,
      grant_type: req.body['grant_type'],
      scopes: req.body['scopes'],
    } as TokenRequestDto;

    if (input.grant_type !== 'password') {
      throw new UnauthorizedException('Invalid grant type');
    }

    if (!username || !password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const user = await this.authService.verifyPassword(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
