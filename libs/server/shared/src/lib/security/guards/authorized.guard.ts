import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { IS_ANONYMOUS_KEY } from "../decorators";

@Injectable()
export class AuthorizedGuard extends AuthGuard('default') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(IS_ANONYMOUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isAnonymous) {
      return true;
    }
    return super.canActivate(context);
  }
}
