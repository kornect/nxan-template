import { Entity, Enum, IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';

import { DomainEntity } from '@nxan/server/domain';

import { UserEntity } from './user.entity';

export enum UserTokenType {
  EmailConfirmation = 'email_confirmation',
  EmailChangeConfirmation = 'email_change_confirmation',
  PasswordReset = 'password_reset',
  PhoneNumberConfirmation = 'phone_number_confirmation',
}

@Entity({
  tableName: 'user_tokens',
  schema: 'auth',
})
export class UserTokensEntity extends DomainEntity<UserTokensEntity> {
  @Property({ type: 'text' })
  token!: string;

  @Enum(() => UserTokenType)
  type!: UserTokenType;

  @Property({ type: 'datetime' })
  expiresAt!: Date;

  @ManyToOne(() => UserEntity, { wrappedReference: true })
  user: IdentifiedReference<UserEntity>;
}
