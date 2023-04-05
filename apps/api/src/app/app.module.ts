import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';

import { AccessTokenGuard, ServerAuthApiModule } from '@nxan/server/auth/api';
import { isProduction } from '@nxan/shared/utils';

import { AppController } from './app.controller';
import { migrationsList } from './app.migrations';
import { ServerUsersApiModule } from '@nxan/server/users/api';
import { SecurityModule } from '@nxan/server/security';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgresql',
        autoLoadEntities: true,
        ...defineConfig({
          clientUrl: config.get('DATABASE_URL'),
          driverOptions: {
            connection: {
              ssl: isProduction(),
            },
          },
          allowGlobalContext: true,
          autoJoinOneToOneOwner: true,
          forceUtcTimezone: true,
          highlighter: new SqlHighlighter(),
          debug: !isProduction(),
          migrations: {
            migrationsList: migrationsList,
          },
        }),
      }),
    }),
    TerminusModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL') ?? 60,
        limit: config.get('THROTTLE_LIMIT') ?? 10,
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: config.get('MAIL_TRANSPORT'),
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: config.get('MAIL_TEMPLATES_DIR'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    AutomapperModule.forRoot([{ name: 'classes', strategyInitializer: classes() }]),
    ServerAuthApiModule,
    ServerUsersApiModule,
    SecurityModule.forRoot({
      claimsAbilities: []
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    Logger,
  ],
})
export class AppModule {}
