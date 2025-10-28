// src/domains/domains.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { AuthGuard } from '@nestjs/passport'; // <-- Import AuthGuard

// Semua endpoint di controller ini akan punya prefix /domains
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Get() // <-- Endpoint GET /domains
  @UseGuards(AuthGuard('jwt')) // <-- KUNCI AJAIB! Ini memproteksi endpoint
  async findAll(@Request() req) {
    // Ingat `request.user`? Ini adalah hasil dari `validate` di JwtStrategy
    const user = req.user;

    // Sekarang kita bisa mengambil domain HANYA untuk sekolah milik user
    return this.domainsService.findAllForSchool(user.school_id);
  }
}