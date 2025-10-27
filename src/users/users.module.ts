// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- 1. IMPORT MODULNYA

@Module({
  imports: [PrismaModule], // <-- 2. TAMBAHKAN DI SINI
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}