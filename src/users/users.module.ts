// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller'; // (Jika Anda punya controller)

@Module({
  // controllers: [UsersController], // (Nyalakan jika ada controller)
  providers: [UsersService],      // <-- Daftarkan UsersService di sini
  exports: [UsersService],        // (Opsional, ekspor jika modul lain butuh)
})
export class UsersModule {}