// src/domains/domains.module.ts
import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- 1. IMPORT
import { DomainsController } from './domains.controller';

@Module({
  imports: [PrismaModule], // <-- 2. TAMBAHKAN
  providers: [DomainsService], 
  controllers: [DomainsController],
  // Kita akan buat controllernya di langkah berikutnya
})
export class DomainsModule {}