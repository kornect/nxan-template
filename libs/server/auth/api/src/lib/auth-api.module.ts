import { Module } from '@nestjs/common';

import { ServerAuthAppModule } from '@nxan/server/auth/app';

import { AuthController, UsersController } from './controllers';

@Module({
  imports: [ServerAuthAppModule],
  controllers: [AuthController, UsersController],
})
export class AuthApiModule {}
