import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';

import { ServerUsersDomainModule } from '@nxan/server/feature-users/domain';
import { SecurityModule } from '@nxan/server/core/security';

import { UsersController } from './controllers';
import { UserClaimsAbility } from './security';
import { UsersService } from './services';

@Module({
  imports: [
    MailerModule,
    SecurityModule.forFeature({
      claimsAbilities: [UserClaimsAbility],
    }),
    ServerUsersDomainModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: [UsersService],
})
export class ServerUsersApiModule {}
