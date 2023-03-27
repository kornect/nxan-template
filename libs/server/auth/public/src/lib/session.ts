import { UnauthorizedException } from '@nestjs/common';

export class Session {
  email: string;
  userName: string;
  displayName: string;
  roles: string[];
  sub: string;
  defaultRole: string;

  get userId(): string {
    return this.sub;
  }
}

/**
 * Get the session from the request
 * @param request - The request
 * @param throwUnauthorized - Whether to throw an error if the session is not found
 */
export function getRequestSession(request: Request, throwUnauthorized = true): Session {
  if (!request['user']) {
    if (throwUnauthorized) {
      throw new UnauthorizedException();
    }
    return null;
  }

  const session = request['user'] as Session;
  if (!session || !session.sub) {
    if (throwUnauthorized) {
      throw new UnauthorizedException();
    }
    return null;
  }

  return session;
}
