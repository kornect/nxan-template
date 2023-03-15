import { Logger, Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DOMAIN_USERS_ENTITIES } from "./entities";
import { HashModule } from "@nxan/server/hash";
import { OtpModule } from "@nxan/server/otp";
import { UserManager } from "./services";

@Module({
  imports: [
    MikroOrmModule.forFeature(DOMAIN_USERS_ENTITIES),
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
export class UsersDomainModule {}
