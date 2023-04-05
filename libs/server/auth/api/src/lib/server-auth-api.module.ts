import { Logger, Module } from '@nestjs/common';

import { AuthController } from './controllers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServerUsersDomainModule } from '@nxan/server/users/domain';
import { SecurityModule } from '@nxan/server/security';
import {
  AccessTokenStrategy,
  PasswordCredentialsStrategy,
  RefreshTokenStrategy
} from './strategies';
import { AuthService } from './services';
import { AccessTokenGuard, PasswordCredentialsGuard, RefreshTokenGuard } from './guards';

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
    })
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
  ]
})
export class ServerAuthApiModule {}
