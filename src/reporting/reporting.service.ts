// src/reporting/reporting.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/decorators/get-user.decorators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService) {}

  async getAssessmentResults(assessmentId: string, user: AuthenticatedUser) {
    // 1. Validasi kepemilikan (Wajib! Sama seperti di QuestionsService)
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Asesmen tidak ditemukan');
    }
    if (assessment.creator_id !== user.id) {
      throw new UnauthorizedException('Anda tidak punya akses ke hasil ini');
    }

    // 2. Ambil SEMUA data terkait (Submissions -> Answers -> Question -> Domain)
    // Ini adalah query NestJS/Prisma yang sangat powerful
    const submissions = await this.prisma.submission.findMany({
      where: { assessment_id: assessmentId },
      include: {
        answers: { // Untuk setiap jawaban...
          include: {
            question: { // ...ambil datanya...
              include: {
                domain: true, // ...dan data domainnya!
              },
            },
          },
        },
      },
    });

    // 3. Transformasi Data (Logika Bisnis Inti)
    // Kita ubah data mentah DB menjadi laporan yang berguna
    const results = submissions.map((submission) => {
      // Peta untuk menghitung skor per domain
      const domainScores = new Map<string, { name: string; score: number }>();

      for (const answer of submission.answers) {
        // (Asumsi answer_value adalah "1" atau "0")
        const score = parseInt(answer.answer_value, 10) || 0;
        const domain = answer.question.domain;

        if (!domain) continue; // Jika ada soal tanpa domain

        // Ambil data domain, atau buat baru jika ini yang pertama
        const currentDomain = domainScores.get(domain.id) || {
          name: domain.name,
          score: 0,
        };

        // Tambahkan skor
        currentDomain.score += score;
        domainScores.set(domain.id, currentDomain);
      }

      // 4. (Logika "2% Rule" Anda) - Kita sederhanakan dulu jadi skor mentah
      // Di sini Anda bisa tambahkan logika interpretasi (Tinggi, Sedang, Rendah)
      
      return {
        student_name: submission.student_name,
        student_class: submission.student_class,
        submitted_at: submission.submitted_at,
        // Ubah Map menjadi array yang rapi
        scores: Array.from(domainScores.values()), 
      };
    });

    return results;
  }
}