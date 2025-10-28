import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {} // <-- 1. INJECT PRISMA

  // Fungsi untuk mengambil semua domain milik satu sekolah
  async findAllForSchool(schoolId: string) {
    return this.prisma.domain.findMany({
      where: {
        school_id: schoolId,
      },
      orderBy: {
        name: 'asc', // Urutkan berdasarkan nama
      },
    });
  }
}
