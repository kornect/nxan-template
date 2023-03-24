import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';


export enum GrantType {
  Password = 'password',
  RefreshToken = 'refresh_token',
}

export class TokenRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @ValidateIf((o) => o.grantType === 'password')
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf((o) => o.grantType === 'password')
  password?: string;

  @ApiProperty({ enum: GrantType })
  @IsNotEmpty()
  grant_type: GrantType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf((o) => o.grantType === 'refresh_token')
  refresh_token?: string;

  @ApiProperty()
  scopes?: string;
}

export class TokenResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken?: string;

  @ApiProperty()
  expiresAt: number;

  @ApiProperty()
  tokenType: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [{ type: 'string' }],
    },
  })
  user: Map<string, any> | Record<string, any>;
}

export class AuthenticatedUser {
  id: string;
  email: string;
  strategy: 'password' | 'refresh';
  timestamp: Date;
  scopes?: string;
}

export class UserInfoDto {
  @ApiProperty()
  sub: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  emailConfirmed: boolean;
  @ApiProperty()
  roles: string[];
  @ApiProperty()
  defaultRole: string;
}


export class DeleteAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangeDisplayName {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class RegisterResendConfirmDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ConfirmEmailChangeDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterCancelDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterConfirmDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
