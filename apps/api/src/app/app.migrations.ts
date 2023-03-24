import { Migration20230211195408 } from './migrations/Migration20230211195408';

export const MIGRATIONS = [Migration20230211195408];

export const migrationsList = MIGRATIONS.map((migration) => ({
  name: `${migration.name}.ts`,
  class: migration
}));
