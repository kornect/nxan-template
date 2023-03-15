export const OTP_OPTIONS = 'OTP_OPTIONS';

export class OtpOptions {
  length?: number = 6;
  upperCase?: boolean = true;
  specialChars?: boolean = true;
  alphabets?: boolean = true;
  digits?: boolean = true;
}
