import { Entity, IdentifiedReference, ManyToOne } from '@mikro-orm/core';

import { DomainEntity } from '@nxan/server/domain';

import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity({
  tableName: 'user_roles',
  schema: 'auth',
})
export class UserRoleEntity extends DomainEntity<UserRoleEntity> {
  @ManyToOne(() => UserEntity, { wrappedReference: true })
  user: IdentifiedReference<UserEntity>;

  @ManyToOne(() => RoleEntity, { wrappedReference: true })
  role: IdentifiedReference<RoleEntity>;
}
