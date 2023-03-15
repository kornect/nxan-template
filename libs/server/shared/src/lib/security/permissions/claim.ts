export class Claim {
  type: string;
  value?: string;
}

export class ClaimDefinition extends Claim  {
  type: string;
  group: string;
  description: string;
}
