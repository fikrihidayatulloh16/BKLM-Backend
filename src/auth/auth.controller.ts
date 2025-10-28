// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth') // Ini berarti endpoint kita adalah /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // POST /auth/register
  async register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login') // POST /auth/login
  async login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }
}