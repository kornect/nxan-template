import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export interface IDomainEntity {
  id: string;
}

@Entity({ abstract: true })
export abstract class DomainEntity<T extends IDomainEntity> extends BaseEntity<T, 'id'> implements IDomainEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'datetime', onCreate: () => new Date() })
  createdAt: Date;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  updatedAt: Date;
}
