import { Logger, Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { UserClaimsAbility } from './security';
import { SecurityModule } from '@nxan/server/security';
import { UsersService } from './services';
import { ServerUsersDomainModule } from '@nxan/server/users/domain';
import { UsersController } from './controllers';

@Module({
  imports: [
    MailerModule,
    SecurityModule.forFeature({
      claimsAbilities: [UserClaimsAbility],
    }),
    ServerUsersDomainModule
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class ServerUsersApiModule {}
