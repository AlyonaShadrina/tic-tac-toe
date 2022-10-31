import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.HEADER_CORS_ALLOWED || false,
    },
  });
  // TODO: unify error responses
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
