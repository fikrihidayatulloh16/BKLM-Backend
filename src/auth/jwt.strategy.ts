// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        // 1. Ambil secret dari process.env
        const secret = process.env.JWT_SECRET;

        // 2. Lakukan validasi. Jika tidak ada, gagalkan startup.
        if (!secret) {
            throw new Error('JWT_SECRET tidak ditemukan di environment variables');
        }

        // 3. Panggil super() dengan variabel 'secret' yang sudah pasti string
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret, // <-- Gunakan variabel 'secret' di sini
        });
    }

  // Fungsi ini akan otomatis dipanggil oleh Passport
  // setelah token divalidasi
  async validate(payload: any) {
    // payload di sini adalah isi token yang kita buat di AuthService
    // { sub: user.id, email: user.email, school_id: user.school_id }

    // Kita bisa tambahkan pengecekan ke DB jika perlu, tapi untuk sekarang
    // kita percaya isi tokennya.
    if (!payload.sub || !payload.school_id) {
      throw new UnauthorizedException('Token tidak valid');
    }

    // Objek yang di-return di sini akan di-inject
    // ke dalam `request.user` di semua controller yang terproteksi
    return {
      id: payload.sub,
      email: payload.email,
      school_id: payload.school_id,
    };
  }
}