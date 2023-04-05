import { DynamicModule, Logger, Module, Type } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { SessionService } from './session.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SessionInterceptor } from './session.interceptor';
import { CLAIMS_ABILITY, ClaimsAbility } from './claims.ability';

export class SecurityOptions {
  claimsAbilities: Type<ClaimsAbility>[];
}

@Module({})
export class SecurityModule {
  static forRoot(options?: SecurityOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [ClsModule],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: SessionInterceptor
        },
        {
          provide: CLAIMS_ABILITY,
          useFactory: (...providers: ClaimsAbility[]) => {
            return providers;
          },
          inject: options?.claimsAbilities ?? [],
        },
        ...(options?.claimsAbilities ?? []),
        SessionService,
        Logger,
      ],
      exports: [SessionService],
    };
  }

  static forFeature(options?: SecurityOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [ClsModule],
      providers: [
        {
          provide: CLAIMS_ABILITY,
          useFactory: (...providers: ClaimsAbility[]) => {
            return providers;
          },
          inject: options?.claimsAbilities ?? [],
        },
        ...(options?.claimsAbilities ?? []),
        SessionService,
        Logger,
      ],
      exports: [SessionService],
    };
  }
}


