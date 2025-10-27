import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport'; // <-- Import PassportModule
import { JwtModule } from '@nestjs/jwt'; // <-- Import JwtModule

@Module({
  imports: [
    UsersModule,
    PassportModule, // <-- Tambahkan PassportModule di sini
    JwtModule.register({
      // Beri nilai default jika .env tidak terbaca
      secret: process.env.JWT_SECRET || 'RAHASIA_DEFAULT_SANGAT_AMAN', 
      signOptions: { 
        // Beri nilai default jika .env tidak terbaca
        expiresIn: (() => {
          const val = process.env.JWT_EXPIRATION;
          if (!val) return 7 * 24 * 60 * 60; // 7 days in seconds
          const n = Number(val);
          return Number.isFinite(n) ? n : 7 * 24 * 60 * 60;
        })()
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
