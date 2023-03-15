import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class PasswordCredentialsGuard extends AuthGuard('password-credentials') {}
