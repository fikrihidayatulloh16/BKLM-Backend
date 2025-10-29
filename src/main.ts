// src/main.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // Aktifkan Validasi Global
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Mengaktifkan CORS agar frontend bisa bicara
  app.enableCors({
    origin: (origin, callback) => {
      const whitelist = [
        'http://localhost:3001', // Alamat frontend kita nanti
      ];
      
      // Izinkan jika origin ada di whitelist
      // ATAU jika origin-nya 'undefined' (seperti Postman atau tes server-ke-server)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();