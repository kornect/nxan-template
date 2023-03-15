import {Entity, IdentifiedReference, ManyToOne, Property} from '@mikro-orm/core';

import {DomainEntity} from "@nxan/server/domain";

import {ClaimEntity} from './claim.entity';
import {UserEntity} from './user.entity';


@Entity({
  tableName: 'user_claims',
  schema: 'auth',
})
export class UserClaimEntity extends DomainEntity<UserClaimEntity> {
  @ManyToOne(() => UserEntity, {wrappedReference: true})
  user: IdentifiedReference<UserEntity>;

  @ManyToOne(() => ClaimEntity, {wrappedReference: true})
  claim: IdentifiedReference<ClaimEntity>;

  @Property({type: 'text', nullable: true})
  value: string;
}
