import { AnyAbility } from '@casl/ability';

import { Session } from './session';

export abstract class ClaimsAbility {
  abstract isSupported(resource: unknown): boolean;

  abstract buildAbility(session: Session): AnyAbility;
}

export const CLAIMS_ABILITY = 'CLAIMS_ABILITY';
