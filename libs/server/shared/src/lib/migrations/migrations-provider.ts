import { Migration } from '@mikro-orm/migrations';
import { Injectable, Provider, Type } from '@nestjs/common';

export const Migrations = 'Migrations';

export function addMigrationProvider<T extends MigrationsProvider>(type: Type<T>) {
  return {
    provide: Migrations,
    useClass: type,
    multi: true,
  } as Provider;
}

@Injectable()
export abstract class MigrationsProvider {
  // return an array of classes
  abstract getMigrations(): Array<Migration>;
}
