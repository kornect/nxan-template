import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {IS_ANONYMOUS_KEY} from "@nxan/server/security";




@Injectable()
export class AccessTokenGuard extends AuthGuard('default') {
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
