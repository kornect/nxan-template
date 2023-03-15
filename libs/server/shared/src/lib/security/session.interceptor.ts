import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { getRequestSession } from "./session";
import { Observable } from "rxjs";

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const session = getRequestSession(request);
    this.cls.set('session', session);
    return next.handle();
  }
}
