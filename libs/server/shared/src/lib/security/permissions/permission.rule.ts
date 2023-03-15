import { Session } from "../session";
import { AnyAbility } from "@casl/ability";

export abstract class PermissionRule<T = unknown> {
  resource: T;

  abstract buildRule(session: Session): AnyAbility;
}

export const PERMISSION_RULE = 'PERMISSION_RULE';
