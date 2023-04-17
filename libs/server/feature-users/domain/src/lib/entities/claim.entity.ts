import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';



import { RoleClaimEntity, UserClaimEntity } from './index';
import { DomainEntity } from '@nxan/server/core/domain';

@Entity({
  tableName: 'claims',
  schema: 'auth',
})
export class ClaimEntity extends DomainEntity<ClaimEntity> {
  @Property({ type: 'text', unique: true })
  type: string;

  @Property({ type: 'text', nullable: true })
  group: string;

  @OneToMany(() => RoleClaimEntity, (roleClaim) => roleClaim.claim)
  roles = new Collection<RoleClaimEntity>(this);

  @OneToMany(() => UserClaimEntity, (userClaim) => userClaim.claim)
  users = new Collection<UserClaimEntity>(this);
}
