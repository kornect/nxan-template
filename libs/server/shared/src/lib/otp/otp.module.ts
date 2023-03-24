import { DynamicModule, Module } from '@nestjs/common';

import { OTP_OPTIONS, OtpOptions } from './otp.options';
import { OtpService } from './otp.service';

@Module({
  providers: [OtpService],
})
export class OtpModule {
  static register(options?: OtpOptions): DynamicModule {
    return {
      module: OtpModule,
      providers: [
        {
          provide: OTP_OPTIONS,
          useValue: Object.assign(new OtpOptions(), options ?? {}),
        },
        OtpService,
      ],
      exports: [OtpService],
    };
  }
}
