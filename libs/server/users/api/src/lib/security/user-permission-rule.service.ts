import {UserEntity} from "@nxan/server/users/domain";
import {PermissionRule, Session} from "@nxan/server/security";
import {AnyAbility, defineAbility} from "@casl/ability";
import {Claims} from "./claims";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserPermissionRule extends PermissionRule<UserEntity> {
  buildRule(session: Session): AnyAbility {
    return defineAbility((can) => {
      if (session.roles.includes('admin')) {
        can(Claims.Manage, 'all');
      } else {
        can(Claims.Register, 'all');
        can(Claims.ChangeEmail, UserEntity, { id: session.sub });
        can(Claims.ChangePassword, UserEntity, { id: session.sub });
        can(Claims.DeleteUser, UserEntity, { id: session.sub });
        can(Claims.ChangeDisplayName, UserEntity, { id: session.sub });
      }
    });
  }
}
