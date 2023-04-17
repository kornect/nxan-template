import { Injectable, Provider, Type } from '@nestjs/common';

import { IDomainEntity } from './domain.entity';

export const Entities = 'Entities';

export function addEntitiesProvider<T extends EntitiesProvider>(type: Type<T>) {
  return {
    provide: Entities,
    useClass: type,
    multi: true,
  } as Provider;
}

@Injectable()
export abstract class EntitiesProvider {
  abstract getEntities(): Array<IDomainEntity>;
}
