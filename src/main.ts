// src/main.ts
import * as dotenv from 'dotenv';
dotenv.config(); // <-- Muat .env di paling atas
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // Aktifkan Validasi Global
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();