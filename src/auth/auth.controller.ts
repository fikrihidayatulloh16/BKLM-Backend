// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from 'src/auth/decorators/get-user.decorators';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth') // Ini berarti endpoint kita adalah /auth
export class AuthController {
  constructor(private authService: AuthService,
              private userService: UsersService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response, // <-- Inject Response
  ) {
    const token = await this.authService.register(dto);

    // Atur cookie di response
    res.cookie('access_token', token, {
      httpOnly: true, // JavaScript frontend tidak bisa mengakses
      secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di produksi
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari (sesuai JWT_EXPIRATION)
    });

    // Kirim balasan JSON
    return { message: 'Registrasi berhasil' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response, // <-- Inject Response
  ) {
    const token = await this.authService.login(dto);

    // Atur cookie di response
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // Kirim balasan JSON
    return { message: 'Login berhasil' };
  }

  // (BONUS) Kita tambahkan endpoint logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Hapus cookie-nya
    res.clearCookie('access_token');
    return { message: 'Logout berhasil' };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: AuthenticatedUser) {
    return this.userService.findProfileById(user.id);
  }
}