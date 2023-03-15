import { Inject, Injectable } from "@nestjs/common";
import { OTP_OPTIONS, OtpOptions } from "./otp.options";
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  constructor(@Inject(OTP_OPTIONS) private options: OtpOptions) {

  }

  generateAsync(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const otp = this.generateOtp();
        resolve(otp);
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateOtp(): string {
    return otpGenerator.generate(this.options.length, {
      upperCase: this.options.upperCase,
      specialChars: this.options.specialChars,
      alphabets: this.options.alphabets,
      digits: this.options.digits,
    });
  }
}
