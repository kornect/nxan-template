import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { HashService } from '@nxan/server/hash';
import { OtpService } from '@nxan/server/otp';


import { RoleEntity, UserClaimEntity, UserEntity, UserRoleEntity, UserTokenType, UserTokensEntity } from '../entities';
import { ClaimEntity } from '../entities/claim.entity';
import { Result } from "@nxan/server/dtos";
import { getExpirationDate } from '@nxan/shared/utils';


@Injectable()
export class UserManager {
  constructor(
    private entityManager: EntityManager,
    private hashService: HashService,
    private otpService: OtpService
  ) {}

  findById(id: string): Promise<UserEntity> {
    return this.entityManager.findOne(UserEntity, id);
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.entityManager.findOne(UserEntity, { email });
  }

  async addClaim(user: UserEntity, claimType: string, value?: string) {
    if (await this.hasClaim(user, claimType, value)) {
      return Result.success();
    }

    const claim = await this.entityManager.findOne(ClaimEntity, { type: claimType });
    if (claim === null) {
      return Result.failure('Claim not found');
    }

    const userClaim = new UserClaimEntity();
    this.entityManager.assign(userClaim, {
      claim: claim.id,
      user: user.id,
      value,
    });

    await this.entityManager.persistAndFlush(userClaim);

    return Result.success();
  }

  async removeClaim(user: UserEntity, claim: string) {
    if (!(await this.hasClaim(user, claim))) {
      return Result.success();
    }

    const userClaim = await this.entityManager.findOne(UserClaimEntity, {
      user: user,
      claim: {
        type: claim,
      },
    });

    await this.entityManager.removeAndFlush(userClaim);

    return Result.success();
  }

  async hasClaim(user: UserEntity, claim: string, value?: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id, {
      populate: ['claims.claim'],
    });

    if (value) {
      return (
        userToUpdate.claims.getItems().find((x) => x.claim.unwrap().type === claim && x.value === value) !== undefined
      );
    }

    return userToUpdate.claims.getItems().find((x) => x.claim.unwrap().type === claim) !== undefined;
  }

  async createUser(user: UserEntity, password: string) {
    user.passwordHash = await this.hashService.hashAsync(password);

    await this.entityManager.persistAndFlush(user);

    return Result.success('User created');
  }

  async addRole(user: UserEntity, roleName: string) {
    if (await this.hasRole(user, roleName)) {
      return Result.success();
    }

    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    const role = await this.entityManager.findOne(RoleEntity, { name: roleName });
    if (role === null) {
      return Result.failure('Role not found');
    }

    const userRole = new UserRoleEntity();
    this.entityManager.assign(userRole, {
      role: role.id,
      user: user.id,
    });

    userToUpdate.roles.add(userRole);

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async removeRole(user: UserEntity, roleName: string) {
    if (!(await this.hasRole(user, roleName))) {
      return Result.success();
    }

    const userRole = await this.entityManager.findOne(UserRoleEntity, {
      user: user.id,
      role: { name: roleName },
    });

    await this.entityManager.removeAndFlush(userRole);

    return Result.success();
  }

  async hasRole(user: UserEntity, roleName: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id, {
      populate: ['roles.role'],
    });

    return userToUpdate.roles.getItems().find((x) => x.role.unwrap().name === roleName) !== undefined;
  }

  async banUser(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.banned = true;

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async unbanUser(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.banned = false;

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async suspendUser(user: UserEntity, expiresIn = '1d') {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.suspended = true;
    userToUpdate.suspensionEnd = getExpirationDate(expiresIn);

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async unsuspendUser(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.suspended = false;
    userToUpdate.suspensionEnd = null;

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async verifyPassword(user: UserEntity, password: string) {
    return await this.hashService.compareAsync(password, user.passwordHash);
  }

  async changePassword(user: UserEntity, currentPassword: string, newPassword: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);
    if (userToUpdate === null) {
      return Result.failure('User not found');
    }

    const passwordVerified = await this.verifyPassword(userToUpdate, currentPassword);
    if (!passwordVerified) {
      return Result.failure('Invalid current password');
    }

    userToUpdate.passwordHash = await this.hashService.hashAsync(newPassword);
    userToUpdate.securityStamp = v4();

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  async confirmEmail(user: UserEntity, confirmationCode: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    const emailConfirmed = this.verifyEmailConfirmationCode(userToUpdate, confirmationCode);
    if (!emailConfirmed) {
      return Result.failure('Invalid confirmation code');
    }

    userToUpdate.emailConfirmed = true;
    userToUpdate.newEmail = null;

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  public async generatePasswordResetCode(user: UserEntity) {
    return this.generateConfirmationCode({
      user,
      type: UserTokenType.PasswordReset,
    });
  }

  public async verifyPasswordResetCode(user: UserEntity, code: string) {
    return this.verifyConfirmationCode({
      user,
      code,
      type: UserTokenType.PasswordReset,
    });
  }

  public async generateEmailConfirmationCode(user: UserEntity) {
    return this.generateConfirmationCode({
      user,
      type: UserTokenType.EmailConfirmation,
      appendToCode: user.email,
    });
  }

  public async generateEmailChangeConfirmationCode(user: UserEntity) {
    if (!user.newEmail) {
      throw new Error('No new email to confirm');
    }

    return this.generateConfirmationCode({
      user,
      type: UserTokenType.EmailChangeConfirmation,
      appendToCode: user.newEmail,
    });
  }

  public async verifyEmailChangeConfirmationCode(user: UserEntity, code: string) {
    if (!user.newEmail) {
      throw new Error('No new email to confirm');
    }

    return this.verifyConfirmationCode({
      user,
      code,
      type: UserTokenType.EmailChangeConfirmation,
      appendToCode: user.newEmail,
    });
  }

  public async verifyEmailConfirmationCode(user: UserEntity, code: string) {
    return this.verifyConfirmationCode({
      user,
      code,
      type: UserTokenType.EmailConfirmation,
      appendToCode: user.email,
    });
  }

  public async generatePhoneNumberConfirmationCode(user: UserEntity) {
    return this.generateConfirmationCode({
      user,
      type: UserTokenType.PhoneNumberConfirmation,
      appendToCode: user.phoneNumber,
    });
  }

  public async verifyPhoneNumberConfirmationCode(user: UserEntity, code: string) {
    return this.verifyConfirmationCode({
      user,
      code,
      type: UserTokenType.PhoneNumberConfirmation,
      appendToCode: user.phoneNumber,
    });
  }

  async hasConfirmedEmail(user: UserEntity) {
    return user.emailConfirmed;
  }

  async isSuspended(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    if (userToUpdate.suspended) {
      if (userToUpdate.suspensionEnd) {
        const now = new Date();
        const lockoutEnd = userToUpdate.suspensionEnd;
        if (lockoutEnd && now < lockoutEnd) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  async isBanned(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    return userToUpdate.banned;
  }

  async getRoles(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id, {
      populate: ['roles.role'],
    });

    return userToUpdate.roles.getItems().map((x) => x.role.unwrap().name);
  }

  async updateLastLogin(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.lastLoginAt = new Date();

    return this.entityManager.persistAndFlush(userToUpdate);
  }

  async deleteUser(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    await this.entityManager.removeAndFlush(userToUpdate);
  }

  async changeEmail(user: UserEntity, email: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.newEmail = email;

    await this.entityManager.persistAndFlush(userToUpdate);
  }

  async changeEmailConfirm(user: UserEntity, code: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    const emailConfirmed = await this.verifyEmailChangeConfirmationCode(userToUpdate, code);
    if (!emailConfirmed) {
      return Result.failure('Invalid confirmation code');
    }

    userToUpdate.email = userToUpdate.newEmail;
    userToUpdate.emailConfirmed = true;
    userToUpdate.newEmail = null;

    await this.entityManager.persistAndFlush(userToUpdate);
    return Result.success();
  }

  async update(user: UserEntity) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    userToUpdate.displayName = user.displayName;

    await this.entityManager.persistAndFlush(userToUpdate);
  }

  async resetPassword(user: UserEntity, code: string, password: string) {
    const userToUpdate = await this.entityManager.findOne(UserEntity, user.id);

    const passwordResetConfirmed = await this.verifyPasswordResetCode(userToUpdate, code);
    if (!passwordResetConfirmed) {
      return Result.failure('Invalid password reset code');
    }

    userToUpdate.passwordHash = await this.hashService.hashAsync(password);
    userToUpdate.securityStamp = v4();

    await this.entityManager.persistAndFlush(userToUpdate);

    return Result.success();
  }

  private async generateConfirmationCode(params: {
    user: UserEntity;
    type: UserTokenType;
    appendToCode?: string;
    expiresIn?: string;
  }) {
    const { user, type, appendToCode, expiresIn } = params;

    const code = await this.otpService.generateAsync();

    // check if there is already a token for this user
    const existingToken = await this.entityManager.findOne(UserTokensEntity, {
      user: { id: user.id },
      type: type,
    });

    if (existingToken) {
      await this.entityManager.removeAndFlush(existingToken);
    }

    const userToken = new UserTokensEntity();

    this.entityManager.assign(userToken, {
      user: user.id,
      type: type,
      token: await this.hashService.hashAsync(code + appendToCode),
      expiresAt: new Date(getExpirationDate(expiresIn ?? '1h')),
    });

    await this.entityManager.persistAndFlush(userToken);

    return code;
  }

  private async verifyConfirmationCode(params: {
    user: UserEntity;
    type: UserTokenType;
    code: string;
    appendToCode?: string;
    deleteToken?: boolean;
  }) {
    const { user, type, code, appendToCode, deleteToken } = params;

    const userToken = await this.entityManager.findOne(UserTokensEntity, {
      user: {
        id: user.id,
      },
      type: type,
    });

    if (!userToken) {
      return false;
    }

    const isCodeValid = await this.hashService.compareAsync(code + appendToCode, userToken.token);

    if (deleteToken ?? true) {
      await this.entityManager.removeAndFlush(userToken);
    }

    return isCodeValid;
  }
}
