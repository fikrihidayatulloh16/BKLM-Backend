// src/prisma/prisma.module.ts

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // <-- 1. Impor PrismaService

@Global()
@Module({
  providers: [PrismaService], // <-- 2. Daftarkan PrismaService
  exports: [PrismaService],   // <-- 3. Ekspor PrismaService
})
export class PrismaModule {}