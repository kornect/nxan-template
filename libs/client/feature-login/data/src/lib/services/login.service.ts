import { Injectable } from '@angular/core';
import { AuthService } from '@nxan/client/core/auth';

@Injectable()
export class LoginService {
  constructor(private auth: AuthService) {}

  login({ username, password }: { username: string; password: string }) {
    return this.auth.login({ username, password });
  }
}
