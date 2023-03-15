import { ClsService } from "nestjs-cls";
import {ForbiddenException, Inject, Injectable, Logger} from "@nestjs/common";
import { Session } from "./session";
import {PERMISSION_RULE, PermissionRule} from "./permissions";

@Injectable()
export class SessionService {
  constructor(
    @Inject(PERMISSION_RULE) private permissionRules: PermissionRule[],
    private readonly cls: ClsService,
    private logger: Logger,
) {}

  getSession(): Session | null {
    const session = this.cls.get('session') as Session;
    return session ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getSession();
  }

  authorized<T>(action: string, resource: T) {
    // get ability for session based on the type of resource
    const permissionRule = this.permissionRules.find((a) => a.resource === resource);
    if (!permissionRule) {
      this.logger.warn(`No access checker provider found for resource ${resource}. All checks will be forbidden.`);
      return false;
    }

    try {
      const ability = permissionRule.buildRule(this.getSession());

      return ability.can(action, resource);
    } catch (error) {
      this.logger.error('Failed to build access check ability', error);
      return false;
    }
  }

  throwForbidden<T>(action: string, resource: T) {
    return new Promise((resolve, reject) => {
      if (!this.authorized(action, resource)) {
        reject(new ForbiddenException(`Permission for ${action} not granted`));
      }

      resolve(true);
    });
  }

  check<T>(action: string, resource: T) {
    return new Promise((resolve, reject) => {
      if (!this.authorized(action, resource)) {
        reject(new ForbiddenException(`Permission for ${action} not granted`));
      }

      resolve(true);
    });
  }
}
