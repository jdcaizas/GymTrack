import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Orígenes permitidos: tu Vue local + el publicado (CORS_ORIGIN en Render)
  const origins = ['http://localhost:5173'];
  if (process.env.CORS_ORIGIN) {
    origins.push(...process.env.CORS_ORIGIN.split(',').map((o) => o.trim()));
  }
  app.enableCors({ origin: origins });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Render asigna el puerto en la variable PORT
  await app.listen(process.env.PORT || 3000);
}
bootstrap();