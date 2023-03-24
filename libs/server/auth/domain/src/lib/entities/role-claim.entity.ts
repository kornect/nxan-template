import { Entity, IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';

import { DomainEntity } from '@nxan/server/domain';

import { ClaimEntity } from './claim.entity';
import { RoleEntity } from './role.entity';

@Entity({
  tableName: 'role_claims',
  schema: 'auth',
})
export class RoleClaimEntity extends DomainEntity<RoleClaimEntity> {
  @ManyToOne(() => RoleEntity, { wrappedReference: true })
  role: IdentifiedReference<RoleEntity>;

  @ManyToOne(() => ClaimEntity, { wrappedReference: true })
  claim: IdentifiedReference<ClaimEntity>;

  @Property({ type: 'text', nullable: true })
  value: string;
}
