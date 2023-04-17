import { AnyAbility, defineAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '@nxan/server/feature-users/domain';
import { ClaimsAbility, Session } from '@nxan/server/core/security';

import { Claims } from './claims';

@Injectable()
export class UserClaimsAbility extends ClaimsAbility {
  isSupported(resource: unknown): resource is UserEntity {
    return resource instanceof UserEntity;
  }
  buildAbility(session: Session): AnyAbility {
    return defineAbility((can) => {
      if (session.roles.includes('admin')) {
        can(Claims.Manage, 'all');
      } else {
        can(Claims.ChangeEmail, 'UserEntity', { id: session.sub });
        can(Claims.ChangePassword, 'UserEntity', { id: session.sub });
        can(Claims.DeleteUser, 'UserEntity', { id: session.sub });
        can(Claims.ChangeDisplayName, 'UserEntity', { id: session.sub });
      }
    });
  }
}
