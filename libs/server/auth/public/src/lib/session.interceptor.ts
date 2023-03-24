import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

import { getRequestSession } from './session';
import { Reflector } from '@nestjs/core';
import { IS_ANONYMOUS_KEY } from './decorators';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService, private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(IS_ANONYMOUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const session = getRequestSession(request, !isAnonymous);
    this.cls.set('session', session);
    return next.handle();
  }
}
