import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';

import { HashModule } from '@nxan/server/hash';
import { OtpModule } from '@nxan/server/otp';

import { AUTH_DOMAIN_ENTITIES } from './entities';
import { UserManager } from './services';

@Module({
  imports: [
    MikroOrmModule.forFeature(AUTH_DOMAIN_ENTITIES),
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
export class AuthDomainModule {}
