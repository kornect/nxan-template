import { Module } from '@nestjs/common';

import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AccessTokenStrategy, PasswordCredentialsStrategy, RefreshTokenStrategy} from "./strategies";
import {AccessTokenGuard, PasswordCredentialsGuard, RefreshTokenGuard} from "./guards";
import {AuthService} from "./auth.service";
import {UsersDomainModule} from "@nxan/server/users/domain";
import {SecurityModule} from "@nxan/server/security";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'default',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    UsersDomainModule,
    SecurityModule.register(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordCredentialsGuard,
    PasswordCredentialsStrategy,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
  ],
})
export class AuthApiModule {}
