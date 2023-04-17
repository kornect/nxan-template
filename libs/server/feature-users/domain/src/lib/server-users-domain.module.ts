import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';

import { HashModule } from '@nxan/server/core/hash';
import { OtpModule } from '@nxan/server/core/otp';

import { USERS_DOMAIN_ENTITIES } from './entities';
import { UserManager } from './managers';

@Module({
  imports: [
    MikroOrmModule.forFeature(USERS_DOMAIN_ENTITIES),
    HashModule,
    OtpModule.register({
      length: 6,
      upperCase: true,
      specialChars: false,
      alphabets: true,
      digits: true,
    }),
  ],
  providers: [UserManager, Logger],
  exports: [UserManager],
})
export class ServerUsersDomainModule {}
