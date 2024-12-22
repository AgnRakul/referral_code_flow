import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.APP_CLIENT_URL,
    credentials: true,
  });
  await app.listen(port);
  logger.debug(`Application listening on port ${port}`);
}
bootstrap();
