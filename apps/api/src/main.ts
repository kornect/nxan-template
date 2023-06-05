import { MikroORM } from '@mikro-orm/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  const port = config.get('API_PORT') || 3333;
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);

  logger.log(`Global prefix: ${globalPrefix}`);

  logger.log(`Swagger enabled: ${config.get('SWAGGER_ENABLED')}`);
  if (config.get('SWAGGER_ENABLED')) {
    const options = new DocumentBuilder()
      .setTitle(config.get('API_NAME') ?? 'NXAN API')
      .setDescription(config.get('API_DESCRIPTION') ?? 'NXAN API')
      .setVersion(config.get('API_DESCRIPTION') ?? '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  logger.log(`Setup helmet`);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
        }
      }
    })
  );

  logger.log(`Setup CORS: ${config.get('CORS_ORIGIN') || '*'} `);
  app.enableCors({
    origin: config.get('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  logger.log(`Setup validation pipe`);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
      always: true
    })
  );

  // let background jobs know of shutdown events
  app.enableShutdownHooks();

  logger.log(`Migration enabled: ${config.get('RUN_MIGRATIONS')} `);
  if (config.get('RUN_MIGRATIONS') === 'true') {
    logger.log(`Creating database if not exist...`);
    const orm = await app.get(MikroORM);
    await orm.getSchemaGenerator().ensureDatabase();

    logger.log(`Running migrations...`);
    const migrator = orm.getMigrator();
    await migrator.up();
  }

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
