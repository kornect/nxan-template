import { DynamicModule, Logger, Module, Type } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { CLAIMS_ABILITY, ClaimsAbility } from './claims';
import { SessionService } from './session.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SessionInterceptor } from './session.interceptor';

export class SecurityOptions {
  claimsAbilities: Type<ClaimsAbility>[];
}

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthPublicModule {
  static register(options?: SecurityOptions): DynamicModule {
    return {
      module: AuthPublicModule,
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
}


