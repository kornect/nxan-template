import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { ResponseResult } from '@nxan/server/core/dtos';
import { UserEntity, UserManager } from '@nxan/server/feature-users/domain';
import { SessionService } from '@nxan/server/core/security';
import { getExpirationDate } from '@nxan/shared/utils';

import {
  ChangeDisplayName,
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmEmailChangeDto,
  DeleteAccountDto,
  ForgotPasswordDto,
  RegisterCancelDto,
  RegisterConfirmDto,
  RegisterResendConfirmDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '../dtos';
import { Claims } from '../security';

@Injectable()
export class UsersService {
  constructor(
    private session: SessionService,
    private userManager: UserManager,
    private logger: Logger,
    private mailer: MailerService
  ) {}

  async register(input: RegisterUserDto) {
    if (await this.userExists(input.email)) {
      throw new BadRequestException('User already exists');
    }

    const user = new UserEntity(input.email);
    user.displayName = input.displayName;

    await this.userManager.createUser(user, input.password);

    const code = await this.userManager.generateEmailConfirmationCode(user);

    try {
      await this.mailer.sendMail({
        to: user.email,
        subject: 'Confirm your Account',
        html: `<b>Confirm your Account with the following code: ${code}</b>`,
      });
    } catch (error) {
      // TODO: retry sending email without blocking the request
      this.logger.error(error);
    }

    return ResponseResult.success('User created, check your email for confirmation');
  }

  async registerConfirm(model: RegisterConfirmDto) {
    const user = await this.userManager.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    const success = await this.userManager.confirmEmail(user, model.code);
    if (!success) {
      throw new BadRequestException('Invalid confirmation code');
    }

    return ResponseResult.success('User confirmed');
  }

  async registerResendConfirm(model: RegisterResendConfirmDto) {
    const user = await this.userManager.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    const code = await this.userManager.generateEmailConfirmationCode(user);

    try {
      await this.mailer.sendMail({
        to: user.email,
        subject: 'Confirm your Account',
        template: 'confirm-account',
        context: {
          code,
          expiration: getExpirationDate('1h'),
        },
      });
    } catch (error) {
      this.logger.error(error);
    }

    return ResponseResult.success('Confirmation email resent');
  }

  async registerCancel(model: RegisterCancelDto) {
    const user = await this.userManager.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    if (user.emailConfirmed) {
      throw new BadRequestException('User is already confirmed');
    }

    await this.userManager.deleteUser(user);

    return ResponseResult.success('User deleted');
  }

  async changeEmail(userId: string, input: ChangeEmailDto) {
    const user = await this.userManager.findById(userId);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    await this.session.throwForbidden(Claims.ChangeEmail, user);

    if (await this.userExists(input.email)) {
      throw new BadRequestException('User already exists');
    }

    await this.userManager.changeEmail(user, input.email);

    const code = await this.userManager.generateEmailChangeConfirmationCode(user);

    try {
      await this.mailer.sendMail({
        to: input.email,
        subject: 'Confirm your Account',
        template: 'confirm-account',
        context: {
          code,
          expiration: getExpirationDate('1h'),
        },
      });
    } catch (error) {
      this.logger.error(error);
    }

    return ResponseResult.success('Email changed');
  }

  async confirmEmailChange(id: string, model: ConfirmEmailChangeDto) {
    const user = await this.userManager.findById(id);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    // check if session user has permission to change email
    await this.session.throwForbidden(Claims.ChangeEmail, user);

    const results = await this.userManager.changeEmailConfirm(user, model.code);

    if (!results.success) {
      throw new BadRequestException(results.message);
    }

    return ResponseResult.success('Email changed');
  }

  async changePassword(id: string, model: ChangePasswordDto) {
    const user = await this.userManager.findById(id);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    // check if session user has permission to change password
    await this.session.throwForbidden(Claims.ChangePassword, user);

    const results = await this.userManager.changePassword(user, model.currentPassword, model.newPassword);
    if (!results.success) {
      throw new BadRequestException(results.message);
    }

    return ResponseResult.success('Password changed');
  }

  async changeDisplayName(id: string, model: ChangeDisplayName) {
    const user = await this.userManager.findById(id);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    // check if session user has permission to change display name
    await this.session.throwForbidden(Claims.ChangeDisplayName, user);

    user.displayName = model.displayName;
    await this.userManager.update(user);

    return ResponseResult.success('Display name changed');
  }

  async deleteUser(id: string, model: DeleteAccountDto) {
    const user = await this.userManager.findById(id);
    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    // check if session user has permission to delete account
    await this.session.throwForbidden(Claims.DeleteUser, user);

    const valid = await this.userManager.verifyPassword(user, model.password);
    if (!valid) {
      throw new BadRequestException('Invalid password');
    }

    await this.userManager.deleteUser(user);

    return ResponseResult.success('User deleted');
  }

  async forgotPassword(model: ForgotPasswordDto) {
    const user = await this.userManager.findByEmail(model.email);
    if (user != null) {
      if (await this.userManager.isSuspended(user)) {
        throw new BadRequestException('User account is temporarily suspended');
      }

      if (await this.userManager.isBanned(user)) {
        throw new BadRequestException('User account is permanently banned from using the site');
      }

      const code = await this.userManager.generatePasswordResetCode(user);

      try {
        await this.mailer.sendMail({
          to: user.email,
          subject: 'Reset your Password',
          template: 'reset-password',
          context: {
            code,
            expiration: getExpirationDate('1h'),
          },
        });
      } catch (error) {
        this.logger.error(error);
      }
    }

    return ResponseResult.success('Password reset email sent');
  }

  async resetPassword(model: ResetPasswordDto) {
    const user = await this.userManager.findByEmail(model.email);
    if (user === null) {
      throw new BadRequestException('Invalid reset code');
    }

    const results = await this.userManager.resetPassword(user, model.code, model.password);
    if (!results.success) {
      throw new BadRequestException(results.message);
    }

    return ResponseResult.success('Password reset');
  }

  private async userExists(email: string) {
    const user = await this.userManager.findByEmail(email);
    return user !== null;
  }
}
