import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Definisikan domain default kita di sini
const DEFAULT_DOMAINS = [
  { name: 'Pribadi' },
  { name: 'Sosial' },
  { name: 'Belajar' },
  { name: 'Karier' },
];

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk membuat guru baru saat registrasi
  async createTeacher(dto: any) { // Nanti kita akan buat DTO yang proper
    const { email, password, name } = dto;

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gunakan Transaksi! Ini sangat penting.
    return this.prisma.$transaction(async (tx) => {
      // 1. Buat Sekolah baru
      const school = await tx.school.create({
        data: {
          name: `${name}'s School`, // Nama sekolah default
        },
      });

      // 2. Buat semua domain default untuk sekolah ini
      await tx.domain.createMany({
        data: DEFAULT_DOMAINS.map((domain) => ({
          ...domain,
          school_id: school.id,
        })),
      });

      // 3. Buat User (Guru) baru
      const user = await tx.user.create({
        data: {
          email,
          name,
          password_hash: hashedPassword,
          school_id: school.id,
        },
      });

      // Hapus password hash dari objek balikan demi keamanan
      const { password_hash, ...result } = user;
      return result;
    });
  }

  // Fungsi untuk mencari user berdasarkan email (untuk login)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
