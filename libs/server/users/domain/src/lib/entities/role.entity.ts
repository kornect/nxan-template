import {Collection, Entity, OneToMany, Property} from '@mikro-orm/core';

import {DomainEntity} from "@nxan/server/domain";

import {RoleClaimEntity} from './role-claim.entity';
import {UserRoleEntity} from './user-role.entity';


@Entity({
  tableName: 'roles',
  schema: 'auth',
})
export class RoleEntity extends DomainEntity<RoleEntity> {
  @Property({type: 'text', unique: true})
  name!: string;

  @Property({type: 'text', nullable: true})
  description!: string;

  @OneToMany(() => UserRoleEntity, (x) => x.role)
  users = new Collection<UserRoleEntity>(this);

  @OneToMany(() => RoleClaimEntity, (x) => x.role)
  claims = new Collection<RoleClaimEntity>(this);
}
