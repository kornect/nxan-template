import { Options } from '@mikro-orm/postgresql';
import 'reflect-metadata';

import { AUTH_DOMAIN_ENTITIES } from '@nxan/server/auth/domain';
import { isProduction } from '@nxan/shared/utils';

const config: Options = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: {
      ssl: isProduction(),
    },
  },
  entities: [...AUTH_DOMAIN_ENTITIES],
  migrations: {
    tableName: '__migrations',
    pathTs: './src/app/migrations',
    snapshot: true,
  },
};

export default config;
