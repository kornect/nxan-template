import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthDomainModule } from '@nxan/server/auth/domain';
import { AuthPublicModule } from '@nxan/server/auth/public';

import { AccessTokenGuard, PasswordCredentialsGuard, RefreshTokenGuard } from './guards';
import { UserClaimsAbility } from './security';
import { AuthService, UsersService } from './services';
import { AccessTokenStrategy, PasswordCredentialsStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'access-token',
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: config.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule,
    AuthDomainModule,
    AuthPublicModule.register({
      claimsAbilities: [UserClaimsAbility],
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    Logger,
    PasswordCredentialsGuard,
    PasswordCredentialsStrategy,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
  ],
  exports: [UsersService, AuthService, PassportModule, JwtModule, AccessTokenGuard],
})
export class ServerAuthAppModule {}
