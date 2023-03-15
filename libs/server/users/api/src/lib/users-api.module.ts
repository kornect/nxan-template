import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';



import { UsersController } from './users.controller';
import {UsersDomainModule} from "@nxan/server/users/domain";
import {SecurityModule} from "@nxan/server/security";
import {UserPermissionRule} from "./security";
import {UsersService} from "./users.service";


@Module({
  imports: [
    MailerModule,
    UsersDomainModule,
    SecurityModule.register({
      rules: [UserPermissionRule]
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
  exports: []
})
export class UsersApiModule {
}
