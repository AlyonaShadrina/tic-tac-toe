import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.enableCors(config.get('webserver'));
  app.useWebSocketAdapter(new SocketIoAdapter(app, config));

  // TODO: unify error responses
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
