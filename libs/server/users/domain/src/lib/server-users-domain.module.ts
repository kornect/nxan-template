import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserManager } from './managers';
import { HashModule } from '@nxan/server/hash';
import { OtpModule } from '@nxan/server/otp';
import { USERS_DOMAIN_ENTITIES } from './entities';

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
