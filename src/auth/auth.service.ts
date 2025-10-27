// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  // Inject UsersService dan JwtService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Logika untuk Registrasi
   */
  async register(dto: RegisterAuthDto) {
    // 1. Cek apakah user sudah ada
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    try {
      // 2. Buat user baru (ini memanggil fungsi transaksi kita)
      const user = await this.usersService.createTeacher(dto);

      // 3. Buat token untuk user baru
      const token = await this._createToken(user);
      return {
        message: 'Registrasi berhasil',
        token,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Terjadi kesalahan saat registrasi');
    }
  }

  /**
   * Logika untuk Login
   */
  async login(dto: LoginAuthDto) {
    // 1. Cari user berdasarkan email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // 2. Bandingkan password
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // 3. Buat token
    const token = await this._createToken(user);
    return {
      message: 'Login berhasil',
      token,
    };
  }

  /**
   * Helper private untuk membuat token
   */
  private async _createToken(user: Pick<User, 'id' | 'email' | 'school_id'>) {
    const payload = {
      sub: user.id, // 'sub' adalah standar JWT untuk ID
      email: user.email,
      school_id: user.school_id, // Ini SANGAT PENTING untuk multi-tenancy kita
    };

    return this.jwtService.sign(payload);
  }
}