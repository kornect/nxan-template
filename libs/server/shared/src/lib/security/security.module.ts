import { DynamicModule, Logger, Module, Type } from "@nestjs/common";
import { PERMISSION_RULE, PermissionRule } from "./permissions/permission.rule";
import { ClsModule } from "nestjs-cls";
import { SessionService } from "./session.service";

export class SecurityOptions {
  rules: Type<PermissionRule>[];
}

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class SecurityModule {
  static register(options?: SecurityOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [ClsModule],
      providers: [
        {
          provide: PERMISSION_RULE,
          useFactory: (providers: PermissionRule[]) => providers,
          inject: options?.rules ?? [],
        },
        ...(options?.rules ?? []),
        SessionService,
        Logger,
      ],
      exports: [SessionService],
    };
  }
}
