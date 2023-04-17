import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ServerUsersDomainModule } from '@nxan/server/feature-users/domain';
import { SecurityModule } from '@nxan/server/core/security';

import { AuthController } from './controllers';
import { AccessTokenGuard, PasswordCredentialsGuard, RefreshTokenGuard } from './guards';
import { AuthService } from './services';
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
    ServerUsersDomainModule,
    SecurityModule.forFeature({
      claimsAbilities: [],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    PasswordCredentialsGuard,
    PasswordCredentialsStrategy,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
  ],
})
export class ServerAuthApiModule {}
