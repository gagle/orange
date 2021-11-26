import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Configuration } from './app/config/configuration';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Configuration>>(ConfigService);

  const globalPrefix = configService.get('globalPrefix', { infer: true })!;
  app.setGlobalPrefix(globalPrefix);

  const port = configService.get('port', { infer: true })!;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
};

bootstrap();
