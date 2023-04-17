import { Cascade, Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { DomainEntity, IDomainEntity } from '@nxan/server/core/domain';

import { UserClaimEntity } from './user-claim.entity';
import { UserRoleEntity } from './user-role.entity';
import { UserTokensEntity } from './user-tokens.entity';

@Entity({
  tableName: 'users',
  schema: 'auth',
})
export class UserEntity extends DomainEntity<UserEntity> implements IDomainEntity {
  @Property({ type: 'text' })
  displayName: string;
  @Property({ type: 'text', unique: true })
  username!: string;
  @Property({ type: 'text', unique: true })
  email!: string;
  @Property({ type: 'text', unique: true, nullable: true })
  newEmail!: string;
  @Property({ type: 'boolean', default: false })
  emailConfirmed = false;
  @Property({ type: 'text' })
  passwordHash!: string;
  @Property({ type: 'text' })
  securityStamp!: string;
  @Property({ type: 'text', nullable: true })
  phoneNumber!: string;
  @Property({ type: 'boolean', default: false })
  phoneNumberConfirmed = false;
  @Property({ type: 'boolean', default: false })
  twoFactorEnabled = false;
  @Property({ type: 'boolean', default: false })
  suspended = false;
  @Property({ type: 'datetime', nullable: true })
  suspensionEnd!: Date;
  @Property({ type: 'boolean', default: false })
  banned = false;
  @Property({ type: 'datetime', nullable: true })
  lastLoginAt!: Date;
  @OneToMany(() => UserRoleEntity, (x) => x.user, { cascade: [Cascade.ALL] })
  roles = new Collection<UserRoleEntity>(this);
  @OneToMany(() => UserClaimEntity, (x) => x.user, { cascade: [Cascade.ALL] })
  claims = new Collection<UserClaimEntity>(this);
  @OneToMany(() => UserTokensEntity, (x) => x.user, { cascade: [Cascade.ALL] })
  tokens = new Collection<UserTokensEntity>(this);

  constructor(email?: string) {
    super();

    this.email = email.toLowerCase();
    this.displayName = email.toLowerCase();
    this.username = email.toLowerCase();
    this.securityStamp = v4();
    this.emailConfirmed = false;
    this.phoneNumberConfirmed = false;
    this.twoFactorEnabled = false;
    this.suspended = false;
    this.suspensionEnd = null;
    this.lastLoginAt = null;
  }
}
