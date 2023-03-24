import { RoleClaimEntity } from './role-claim.entity';
import { RoleEntity } from './role.entity';
import { UserClaimEntity } from './user-claim.entity';
import { UserRoleEntity } from './user-role.entity';
import { UserTokensEntity } from './user-tokens.entity';
import { UserEntity } from './user.entity';
import { ClaimEntity } from './claim.entity';

export const AUTH_DOMAIN_ENTITIES = [
  UserEntity,
  UserClaimEntity,
  UserRoleEntity,
  RoleEntity,
  RoleClaimEntity,
  UserTokensEntity,
  ClaimEntity
];

export * from './user.entity';
export * from './user-claim.entity';
export * from './user-role.entity';
export * from './role.entity';
export * from './role-claim.entity';
export * from './user-tokens.entity';
export * from './claim.entity';
