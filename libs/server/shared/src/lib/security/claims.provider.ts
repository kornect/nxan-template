import { ClaimDefinition } from './claim';

export abstract class ClaimsProvider {
  abstract getClaims(): ClaimDefinition[];
}
